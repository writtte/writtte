import { BACKEND_CONFIGS } from '../../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../../utils/data/fetch';

const PresignedURLType = {
  DOCUMENT_IMAGE: 'document-image',
};

const PresignedURLAction = {
  GET: 'get',
  PUT: 'put',
  DELETE: 'delete',
};

type TPresignedURLType =
  (typeof PresignedURLType)[keyof typeof PresignedURLType];

type TPresignedURLAction =
  (typeof PresignedURLAction)[keyof typeof PresignedURLAction];

type TPayloadV1S3PresignedURL = {
  accessToken: string;
  type: TPresignedURLType;
  action: TPresignedURLAction;
  documentCode?: string;
  imageCode?: string;
  imageExtension?: string;
};

type TResponseV1S3PresignedURL = {
  id: string;
  code: number;
  results: {
    generated_url: string;
  };
  status: boolean;
};

const v1S3PresignedURL = async (
  payload: TPayloadV1S3PresignedURL,
): Promise<{
  status: number;
  response: TResponseV1S3PresignedURL | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/external/file/presigned-url`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    bearerValue: payload.accessToken,
    bodyParams: {
      type: payload.type,
      action: payload.action,
      document_code: payload.documentCode,
      image_code: payload.imageCode,
      image_extension: payload.imageExtension,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1S3PresignedURL) : null,
  };
};

export type {
  TPresignedURLType,
  TPresignedURLAction,
  TPayloadV1S3PresignedURL,
  TResponseV1S3PresignedURL,
};

export { PresignedURLType, PresignedURLAction, v1S3PresignedURL };
