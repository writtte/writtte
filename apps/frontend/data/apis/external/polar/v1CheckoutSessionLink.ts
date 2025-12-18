import { BACKEND_CONFIGS } from '../../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../../utils/data/fetch';

type TPayloadV1CheckoutSessionLink = {
  accessToken: string;
  returnURL: string;
};

type TResponseV1CheckoutSessionLink = {
  id: string;
  code: number;
  results: {
    checkout_link: string;
  };
  status: boolean;
};

const v1CheckoutSessionLink = async (
  payload: TPayloadV1CheckoutSessionLink,
): Promise<{
  status: number;
  response: TResponseV1CheckoutSessionLink | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/external/payment-link/checkout`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams: [
      {
        key: 'return_url',
        value: payload.returnURL,
      },
    ],
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1CheckoutSessionLink) : null,
  };
};

export type { TPayloadV1CheckoutSessionLink, TResponseV1CheckoutSessionLink };

export { v1CheckoutSessionLink };
