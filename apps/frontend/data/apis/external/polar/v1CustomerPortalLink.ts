import { BACKEND_CONFIGS } from '../../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../../utils/data/fetch';

type TPayloadV1CustomerPortalLink = {
  accessToken: string;
  returnURL: string;
};

type TResponseV1CustomerPortalLink = {
  id: string;
  code: number;
  results: {
    portal_link: string;
  };
  status: boolean;
};

const v1CustomerPortalLink = async (
  payload: TPayloadV1CustomerPortalLink,
): Promise<{
  status: number;
  response: TResponseV1CustomerPortalLink | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/external/payment-link/portal`,
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
    response: results ? (results as TResponseV1CustomerPortalLink) : null,
  };
};

export type { TPayloadV1CustomerPortalLink, TResponseV1CustomerPortalLink };

export { v1CustomerPortalLink };
