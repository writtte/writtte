import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1SignIn = {
  email: string;
  password: string;
};

type TResponseV1SignIn = {
  id: string;
  code: number;
  results: {
    name: string;
    email_address: string;
    account_code: string;
    access_token: string;
    refresh_token: string;
  };
  status: boolean;
};

const v1SignIn = async (
  payload: TPayloadV1SignIn,
): Promise<{ status: number; response: TResponseV1SignIn | null }> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/authentication/sign-in`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    bodyParams: {
      email_address: payload.email,
      password: payload.password,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1SignIn) : null,
  };
};

export type { TPayloadV1SignIn, TResponseV1SignIn };

export { v1SignIn };
