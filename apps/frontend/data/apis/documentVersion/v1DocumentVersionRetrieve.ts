import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1DocumentVersionRetrieve = {
  accessToken: string;
  documentCode: string;
  versionCode: string;
};

type TResponseV1DocumentVersionRetrieve = {
  id: string;
  code: number;
  results: {
    content: string;
  };
  status: boolean;
};

const v1DocumentVersionRetrieve = async (
  payload: TPayloadV1DocumentVersionRetrieve,
): Promise<{
  status: number;
  response: TResponseV1DocumentVersionRetrieve | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/version/document`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams: [
      {
        key: 'document_code',
        value: payload.documentCode,
      },
      {
        key: 'version_code',
        value: payload.versionCode,
      },
    ],
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1DocumentVersionRetrieve) : null,
  };
};

export type {
  TPayloadV1DocumentVersionRetrieve,
  TResponseV1DocumentVersionRetrieve,
};

export { v1DocumentVersionRetrieve };
