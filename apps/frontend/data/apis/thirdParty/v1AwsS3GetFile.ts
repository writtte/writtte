import { HTTP_METHODS, REQUEST_MODES } from '../../../utils/data/fetch';

type TPayloadV1AwsS3GetFile = {
  presignedURL: string;
  additionalHeaders: Record<string, string> | undefined;
};

const v1AwsS3GetFile = async (
  props: TPayloadV1AwsS3GetFile,
): Promise<{ status: number; results: Blob | undefined }> => {
  try {
    const headers: HeadersInit = {};

    if (props.additionalHeaders) {
      Object.entries(props.additionalHeaders).forEach(([key, value]) => {
        headers[key] = value;
      });
    }

    const response = await fetch(props.presignedURL, {
      mode: REQUEST_MODES.CORS,
      method: HTTP_METHODS.GET,
      headers,
    });

    if (!response.ok) {
      return {
        status: response.status,
        results: undefined,
      };
    }

    const fileBlob = await response.blob();
    return {
      status: response.status,
      results: fileBlob,
    };
  } catch {
    return {
      status: -1,
      results: undefined,
    };
  }
};

export type { TPayloadV1AwsS3GetFile };

export { v1AwsS3GetFile };
