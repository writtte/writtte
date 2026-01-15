import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1DocumentSharingViewRetrieveList = {
  accessToken: string;
  pageCode: string;
  dateRange: string;
};

type TResponseV1DocumentSharingViewRetrieveListAnalytics = {
  date: string;
  views: number;
  unique_views: number;
};

type TResponseV1DocumentSharingViewRetrieveList = {
  id: string;
  code: number;
  results: {
    page_code: string;
    date_range: string;
    start_date: string;
    end_date: string;
    daily_analytics: string;
    versions: TResponseV1DocumentSharingViewRetrieveListAnalytics[];
  };
  status: boolean;
};

const v1DocumentSharingViewRetrieveList = async (
  payload: TPayloadV1DocumentSharingViewRetrieveList,
): Promise<{
  status: number;
  response: TResponseV1DocumentSharingViewRetrieveList | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/sharing/views`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams: [
      {
        key: 'page_code',
        value: payload.pageCode,
      },
      {
        key: 'date_range',
        value: payload.dateRange,
      },
    ],
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results
      ? (results as TResponseV1DocumentSharingViewRetrieveList)
      : null,
  };
};

export type {
  TPayloadV1DocumentSharingViewRetrieveList,
  TResponseV1DocumentSharingViewRetrieveListAnalytics,
  TResponseV1DocumentSharingViewRetrieveList,
};

export { v1DocumentSharingViewRetrieveList };
