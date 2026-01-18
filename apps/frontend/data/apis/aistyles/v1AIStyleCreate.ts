import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1AIStyleCreate = {
  accessToken: string;
  name: string;
  style: string;
};

type TResponseV1AIStyleCreate = {
  id: string;
  code: number;
  results: {
    style_code: string;
  };
  status: boolean;
};

const v1AIStyleCreate = async (
  payload: TPayloadV1AIStyleCreate,
): Promise<{
  status: number;
  response: TResponseV1AIStyleCreate | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/ai-style`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    bearerValue: payload.accessToken,
    bodyParams: {
      name: payload.name,
      style: payload.style,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1AIStyleCreate) : null,
  };
};

export type { TPayloadV1AIStyleCreate, TResponseV1AIStyleCreate };

export { v1AIStyleCreate };
