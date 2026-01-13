import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1DocumentRetrieveList = {
  accessToken: string;
  lifecycleState?: string;
  workflowState?: string;
  titleFilter?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'created_time' | 'updated_time' | 'title';
  sortOrder?: 'ASC' | 'DESC';
};

type TResponseV1DocumentRetrieveListDocument = {
  document_code: string;
  account_code: string;
  title: string;
  lifecycle_state: string;
  workflow_state: string;
  created_time: string;
  updated_time: string;
};

type TResponseV1DocumentRetrieveList = {
  id: string;
  code: number;
  results: {
    documents: TResponseV1DocumentRetrieveListDocument[];
    pagination: {
      current_page: number;
      page_size: number;
      total_count: number;
      total_pages: number;
    };
  };
  status: boolean;
};

const v1DocumentRetrieveList = async (
  payload: TPayloadV1DocumentRetrieveList,
): Promise<{
  status: number;
  response: TResponseV1DocumentRetrieveList | null;
}> => {
  const queryParams = [];

  if (payload.lifecycleState) {
    queryParams.push({
      key: 'lifecycle_state',
      value: payload.lifecycleState,
    });
  }

  if (payload.workflowState) {
    queryParams.push({
      key: 'workflow_state',
      value: payload.workflowState,
    });
  }

  if (payload.titleFilter) {
    queryParams.push({
      key: 'title_filter',
      value: payload.titleFilter,
    });
  }

  if (payload.page) {
    queryParams.push({
      key: 'page',
      value: payload.page.toString(),
    });
  }

  if (payload.pageSize) {
    queryParams.push({
      key: 'page_size',
      value: payload.pageSize.toString(),
    });
  }

  if (payload.sortBy) {
    queryParams.push({
      key: 'sort_by',
      value: payload.sortBy,
    });
  }

  if (payload.sortOrder) {
    queryParams.push({
      key: 'sort_order',
      value: payload.sortOrder,
    });
  }

  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/documents`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams: queryParams.length > 0 ? queryParams : undefined,
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1DocumentRetrieveList) : null,
  };
};

export type {
  TPayloadV1DocumentRetrieveList,
  TResponseV1DocumentRetrieveListDocument,
  TResponseV1DocumentRetrieveList,
};

export { v1DocumentRetrieveList };
