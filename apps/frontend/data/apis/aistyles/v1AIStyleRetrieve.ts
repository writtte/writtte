import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1AIStyleRetrieve = {
  accessToken: string;
  styleCode: string;
};

type TResponseV1AIStyleRetrieve = {
  id: string;
  code: number;
  results: {
    style_code: string;
    name: string;
    style: Record<string, unknown>;
    created_time: string;
    updated_time: string;
  };
  status: boolean;
};

const v1AIStyleRetrieve = async (
  payload: TPayloadV1AIStyleRetrieve,
): Promise<{
  status: number;
  response: TResponseV1AIStyleRetrieve | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/ai-style`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams: [
      {
        key: 'style_code',
        value: payload.styleCode,
      },
    ],
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1AIStyleRetrieve) : null,
  };
};

export type { TPayloadV1AIStyleRetrieve, TResponseV1AIStyleRetrieve };

export { v1AIStyleRetrieve };
