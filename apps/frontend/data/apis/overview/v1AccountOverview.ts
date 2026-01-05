import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1AccountOverview = {
  accessToken: string;
};

type TResponseV1AccountOverview = {
  id: string;
  code: number;
  results: {
    account_code: string;
    email_address: string;
    name: string;
    status: string;
    subscription_status: string;
    available_free_trial_dates: number | undefined;
    is_email_verified: boolean;
    updated_time: string;
  };
  status: boolean;
};

const v1AccountOverview = async (
  payload: TPayloadV1AccountOverview,
): Promise<{ status: number; response: TResponseV1AccountOverview | null }> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/overview/account`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1AccountOverview) : null,
  };
};

export type { TPayloadV1AccountOverview, TResponseV1AccountOverview };

export { v1AccountOverview };
