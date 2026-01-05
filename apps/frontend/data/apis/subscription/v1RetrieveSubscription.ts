import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1RetrieveSubscription = {
  accessToken: string;
};

type TResponseV1RetrieveSubscription = {
  id: string;
  code: number;
  results: {
    customer_id: string;
    status: string;
  };
  status: boolean;
};

const v1RetrieveSubscription = async (
  payload: TPayloadV1RetrieveSubscription,
): Promise<{
  status: number;
  response: TResponseV1RetrieveSubscription | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/subscription`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1RetrieveSubscription) : null,
  };
};

export type { TPayloadV1RetrieveSubscription, TResponseV1RetrieveSubscription };

export { v1RetrieveSubscription };
