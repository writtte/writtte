import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1TreeAddDocument = {
  accessToken: string;
  folderCode: string;
  documentCode: string;
};

type TResponseV1TreeAddDocument = {
  id: string;
  code: number;
  results: {
    folder_code: string;
    document_code: string;
  };
  status: boolean;
};

const v1TreeAddDocument = async (
  payload: TPayloadV1TreeAddDocument,
): Promise<{
  status: number;
  response: TResponseV1TreeAddDocument | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/tree/document`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    bearerValue: payload.accessToken,
    bodyParams: {
      folder_code: payload.folderCode,
      document_code: payload.documentCode,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1TreeAddDocument) : null,
  };
};

export type { TPayloadV1TreeAddDocument, TResponseV1TreeAddDocument };

export { v1TreeAddDocument };
