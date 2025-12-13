import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1SignInLinkP = {
  email: string;
};

type TResponseV1SignIn = {
  id: string;
  code: number;
  results: {
    generated_link: string;
  };
  status: boolean;
};

const v1SignInLink = async (
  payload: TPayloadV1SignInLinkP,
): Promise<{ status: number; response: TResponseV1SignIn | null }> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/authentication/sign-in/link`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    bodyParams: {
      email_address: payload.email,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1SignIn) : null,
  };
};

export type { TPayloadV1SignInLinkP, TResponseV1SignIn };

export { v1SignInLink };
