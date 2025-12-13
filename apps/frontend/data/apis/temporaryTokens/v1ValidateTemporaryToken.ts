import type { TTokenGenerateType } from './v1GenerateTemporaryToken';
import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1TemporaryTokenValidate = {
  type: TTokenGenerateType;
  key: string;
  value: string;
};

const v1TemporaryTokenValidate = async (
  payload: TPayloadV1TemporaryTokenValidate,
): Promise<{
  status: number;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/temporary/token/validate`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    headers: undefined,
    bodyParams: {
      type: payload.type,
      key: payload.key,
      value: payload.value,
    },
  };

  const { status } = await fetchRequest(body);

  return {
    status,
  };
};

export type { TPayloadV1TemporaryTokenValidate };

export { v1TemporaryTokenValidate };
