import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1DocumentRetrieve = {
  accessToken: string;
  documentCode: string;
};

type TResponseV1DocumentRetrieve = {
  id: string;
  code: number;
  results: {
    title: string;
    lifecycle_state: string;
    workflow_state: string;
    content: string;
  };
  status: boolean;
};

const v1DocumentRetrieve = async (
  payload: TPayloadV1DocumentRetrieve,
): Promise<{
  status: number;
  response: TResponseV1DocumentRetrieve | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/item/document`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams: [
      {
        key: 'item_code',
        value: payload.documentCode,
      },
    ],
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1DocumentRetrieve) : null,
  };
};

export type { TPayloadV1DocumentRetrieve, TResponseV1DocumentRetrieve };

export { v1DocumentRetrieve };
