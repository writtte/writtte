import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1DocumentSharingCreate = {
  accessToken: string;
  documentCode: string;
};

type TResponseV1DocumentSharingCreate = {
  id: string;
  code: number;
  results: {
    account_code: string;
    document_code: string;
    sharing_code: string;
  };
  status: boolean;
};

const v1DocumentSharingCreate = async (
  payload: TPayloadV1DocumentSharingCreate,
): Promise<{
  status: number;
  response: TResponseV1DocumentSharingCreate | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/sharing/document`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    bearerValue: payload.accessToken,
    bodyParams: {
      document_code: payload.documentCode,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1DocumentSharingCreate) : null,
  };
};

export type {
  TPayloadV1DocumentSharingCreate,
  TResponseV1DocumentSharingCreate,
};

export { v1DocumentSharingCreate };
