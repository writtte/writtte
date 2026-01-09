import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1TreeRemoveDocument = {
  accessToken: string;
  folderCode: string;
  documentCode: string;
};

type TResponseV1TreeRemoveDocument = {
  id: string;
  code: number;
  results: {
    folder_code: string;
    document_code: string;
  };
  status: boolean;
};

const v1TreeRemoveDocument = async (
  payload: TPayloadV1TreeRemoveDocument,
): Promise<{
  status: number;
  response: TResponseV1TreeRemoveDocument | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/tree/document`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.DELETE,
    bearerValue: payload.accessToken,
    bodyParams: {
      folder_code: payload.folderCode,
      document_code: payload.documentCode,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1TreeRemoveDocument) : null,
  };
};

export type { TPayloadV1TreeRemoveDocument, TResponseV1TreeRemoveDocument };

export { v1TreeRemoveDocument };
