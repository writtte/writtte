import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1CreditRetrieve = {
  accessToken: string;
};

type TCreditData = {
  credit_amount: number;
  allocated_amount: number;
  created_time: string;
  updated_time: string;
};

type TResponseV1CreditRetrieve = {
  id: string;
  code: number;
  results: {
    subscription: TCreditData | null;
    manual: TCreditData | null;
    total_credit_amount: string;
  };
  status: boolean;
};

const v1CreditRetrieve = async (
  payload: TPayloadV1CreditRetrieve,
): Promise<{
  status: number;
  response: TResponseV1CreditRetrieve | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/credit`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1CreditRetrieve) : null,
  };
};

export type {
  TPayloadV1CreditRetrieve,
  TResponseV1CreditRetrieve,
  TCreditData,
};

export { v1CreditRetrieve };
