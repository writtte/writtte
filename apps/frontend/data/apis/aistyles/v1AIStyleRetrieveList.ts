import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1AIStyleRetrieveList = {
  accessToken: string;
  limit?: number;
  offset?: number;
};

type TResponseV1AIStyleRetrieveListItem = {
  account_code: string;
  style_code: string;
  name: string;
  style: string;
  created_time: string;
  updated_time: string;
};

type TResponseV1AIStyleRetrieveList = {
  id: string;
  code: number;
  results: {
    total: number;
    limit: number;
    offset: number;
    items: TResponseV1AIStyleRetrieveListItem[];
  };
  status: boolean;
};

const v1AIStyleRetrieveList = async (
  payload: TPayloadV1AIStyleRetrieveList,
): Promise<{
  status: number;
  response: TResponseV1AIStyleRetrieveList | null;
}> => {
  const queryParams = [];

  if (payload.limit !== undefined) {
    queryParams.push({
      key: 'limit',
      value: payload.limit.toString(),
    });
  }

  if (payload.offset !== undefined) {
    queryParams.push({
      key: 'offset',
      value: payload.offset.toString(),
    });
  }

  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/ai-style/list`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams: queryParams.length > 0 ? queryParams : undefined,
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1AIStyleRetrieveList) : null,
  };
};

export type {
  TPayloadV1AIStyleRetrieveList,
  TResponseV1AIStyleRetrieveListItem,
  TResponseV1AIStyleRetrieveList,
};

export { v1AIStyleRetrieveList };
