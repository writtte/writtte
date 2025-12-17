import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1UserUpdate = {
  accessToken: string;
  name?: string;
  password?: string;
  status?: string;
  isEmailVerified?: boolean;
};

type TResponseV1UserUpdate = {
  id: string;
  code: number;
  status: boolean;
};

const v1UserUpdate = async (
  payload: TPayloadV1UserUpdate,
): Promise<{
  status: number;
  response: TResponseV1UserUpdate | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/user`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.PATCH,
    bearerValue: payload.accessToken,
    bodyParams: {
      name: payload.name,
      password: payload.password,
      status: payload.status,
      is_email_verified: payload.isEmailVerified,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1UserUpdate) : null,
  };
};

export type { TPayloadV1UserUpdate, TResponseV1UserUpdate };

export { v1UserUpdate };
