import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1SignUp = {
  email: string;
  name: string;
  password: string;
};

type TResponseV1SignUp = {
  id: string;
  code: number;
  status: boolean;
};

const v1SignUp = async (
  payload: TPayloadV1SignUp,
): Promise<{ status: number; response: TResponseV1SignUp | null }> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/authentication/sign-up`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    bodyParams: {
      email_address: payload.email,
      name: payload.name,
      password: payload.password,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1SignUp) : null,
  };
};

export type { TPayloadV1SignUp, TResponseV1SignUp };

export { v1SignUp };
