import { BACKEND_CONFIGS } from '../../../configs/be';
import { buildError } from '../../../helpers/error/build';

type TPayloadV1AIGenerateStreaming = {
  accessToken: string;
  message: string;
  styleCode?: string;
  quick?: string;
};

type TAIGenerateSStreamChunk = {
  type: 'text';
  content: string;
};

type TAIGenerateSStreamFinal = {
  type: 'final';
  inputTokens: number;
  outputTokens: number;
};

type TAIGenerateSStreamError = {
  type: 'error';
  error: string;
};

type TAIGenerateSStreamEvent =
  | TAIGenerateSStreamChunk
  | TAIGenerateSStreamFinal
  | TAIGenerateSStreamError;

type TAIGenerateSStreamCallbacks = {
  onChunk: (chunk: string) => void;
  onFinal: (data: { inputTokens: number; outputTokens: number }) => void;
  onError: (error: string) => void;
  onComplete: () => void;
};

const streamMessageRegex = /^data:\s*(.+)$/m;

const v1AIGenerateStreaming = async (
  payload: TPayloadV1AIGenerateStreaming,
  callbacks: TAIGenerateSStreamCallbacks,
): Promise<{ abort: () => void }> => {
  const controller = new AbortController();
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  try {
    const response = await fetch(
      `${BACKEND_CONFIGS.URL}/v1/ai-generate/streaming`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.accessToken}`,
        },
        body: JSON.stringify({
          message: payload.message,
          style_code: payload.styleCode,
          quick: payload.quick,
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(
        buildError(
          `http error in ai streaming api with status ${response.status}`,
        ),
      );
    }

    if (!response.body) {
      throw new Error(buildError("ai streaming api's response body is null"));
    }

    let buffer = '';

    reader = response.body.getReader();
    const decoder = new TextDecoder();

    for (;;) {
      // biome-ignore lint/performance/noAwaitInLoops: Await inside loop is required
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const messages = buffer.split('\n\n');
      buffer = messages.pop() || '';

      for (const message of messages) {
        if (message.trim() === '') {
          continue;
        }

        const dataMatch = message.match(streamMessageRegex);
        if (!dataMatch) {
          continue;
        }

        const dataContent = dataMatch[1].trim();

        try {
          const parsed = JSON.parse(dataContent);

          if (parsed.error) {
            callbacks.onError(parsed.error);
            reader.releaseLock();
            return { abort: () => controller.abort() };
          } else if (
            parsed.inputTokens !== undefined &&
            parsed.outputTokens !== undefined
          ) {
            callbacks.onFinal({
              inputTokens: parsed.inputTokens,
              outputTokens: parsed.outputTokens,
            });

            callbacks.onComplete();
            reader.releaseLock();

            return {
              abort: () => controller.abort(),
            };
          } else if (parsed.text !== undefined) {
            callbacks.onChunk(parsed.text);
          }
        } catch {
          callbacks.onChunk(dataContent);
        }
      }
    }

    reader.releaseLock();
    callbacks.onComplete();
  } catch (error) {
    reader?.releaseLock();
    if (error instanceof Error) {
      callbacks.onError(error.message);
    } else {
      callbacks.onError(buildError('unknown error occurred'));
    }
  }

  return {
    abort: () => controller.abort(),
  };
};

export type {
  TPayloadV1AIGenerateStreaming,
  TAIGenerateSStreamChunk,
  TAIGenerateSStreamFinal,
  TAIGenerateSStreamError,
  TAIGenerateSStreamEvent,
  TAIGenerateSStreamCallbacks,
};

export { v1AIGenerateStreaming };
