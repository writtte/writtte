import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

const TokenGenerateType = {
  SIGN_UP_VERIFY: 'sign-up-verify',
} as const;

type TTokenGenerateType =
  (typeof TokenGenerateType)[keyof typeof TokenGenerateType];

type TPayloadV1TemporaryTokenGenerate = {
  type: TTokenGenerateType;
  email: string;
  key: string;
};

type TResponseV1TemporaryTokenGenerate = {
  id: string;
  code: number;
  results: {
    generated_link: string;
    generated_code: string;
    expiration_time: string;
  };
  status: boolean;
};

const v1TemporaryTokenGenerate = async (
  payload: TPayloadV1TemporaryTokenGenerate,
): Promise<{
  status: number;
  response: TResponseV1TemporaryTokenGenerate | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/temporary/token/generate`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    queryParams: [
      {
        key: 'type',
        value: payload.type,
      },
      {
        key: 'email_address',
        value: payload.email,
      },
    ],
    bodyParams: {
      key: payload.key,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1TemporaryTokenGenerate) : null,
  };
};

export type {
  TTokenGenerateType,
  TPayloadV1TemporaryTokenGenerate,
  TResponseV1TemporaryTokenGenerate,
};

export { TokenGenerateType, v1TemporaryTokenGenerate };
