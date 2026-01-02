import { HTTP_METHODS, REQUEST_MODES } from '../../../utils/data/fetch';

type TPayloadV1AwsS3PutFile = {
  presignedURL: string;
  file: Blob | null;
  contentType: string | undefined;
  additionalHeaders: Record<string, string> | undefined;
};

const v1AwsS3PutFile = async (
  props: TPayloadV1AwsS3PutFile,
): Promise<{ status: number; results: object | null }> => {
  try {
    const headers: HeadersInit = {};
    if (props.contentType) {
      headers['Content-Type'] = props.contentType;
    }

    if (props.additionalHeaders) {
      Object.entries(props.additionalHeaders).forEach(([key, value]) => {
        headers[key] = value;
      });
    }

    const response = await fetch(props.presignedURL, {
      mode: REQUEST_MODES.CORS,
      method: HTTP_METHODS.PUT,
      headers,
      body: props.file,
    });

    return {
      status: response.status,
      results: response.ok ? { success: true } : { success: false },
    };
  } catch (error) {
    return { status: -1, results: error as object };
  }
};

export type { TPayloadV1AwsS3PutFile };

export { v1AwsS3PutFile };
