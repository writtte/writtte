import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1DocumentSharingDelete = {
  accessToken: string;
  documentCode: string;
  sharingCode: string;
};

type TResponseV1DocumentSharingDelete = {
  id: string;
  code: number;
  results: {
    account_code: string;
    document_code: string;
    deleted_count: number;
  };
  status: boolean;
};

const v1DocumentSharingDelete = async (
  payload: TPayloadV1DocumentSharingDelete,
): Promise<{
  status: number;
  response: TResponseV1DocumentSharingDelete | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/sharing/document`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.DELETE,
    bearerValue: payload.accessToken,
    bodyParams: {
      document_code: payload.documentCode,
      sharing_code: payload.sharingCode,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1DocumentSharingDelete) : null,
  };
};

export type {
  TPayloadV1DocumentSharingDelete,
  TResponseV1DocumentSharingDelete,
};

export { v1DocumentSharingDelete };
