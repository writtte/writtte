import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1DocumentVersionRetrieveList = {
  accessToken: string;
  documentCode: string;
  storedType?: string;
  page?: number;
  pageSize?: number;
  sortOrder?: string;
};

type TResponseV1DocumentVersionRetrieveListItem = {
  id_main: number;
  version_code: string;
  document_code: string;
  stored_type: string;
  created_time: string;
};

type TResponseV1DocumentVersionPagination = {
  current_page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
};

type TResponseV1DocumentVersionRetrieveList = {
  id: string;
  code: number;
  results: {
    versions: TResponseV1DocumentVersionRetrieveListItem[];
    pagination: TResponseV1DocumentVersionPagination;
  };
  status: boolean;
};

const v1DocumentVersionRetrieveList = async (
  payload: TPayloadV1DocumentVersionRetrieveList,
): Promise<{
  status: number;
  response: TResponseV1DocumentVersionRetrieveList | null;
}> => {
  const queryParams = [
    {
      key: 'document_code',
      value: payload.documentCode,
    },
  ];

  if (payload.storedType) {
    queryParams.push({
      key: 'stored_type',
      value: payload.storedType,
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

  if (payload.sortOrder) {
    queryParams.push({
      key: 'sort_order',
      value: payload.sortOrder,
    });
  }

  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/version/documents`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams,
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results
      ? (results as TResponseV1DocumentVersionRetrieveList)
      : null,
  };
};

export type {
  TPayloadV1DocumentVersionRetrieveList,
  TResponseV1DocumentVersionRetrieveListItem,
  TResponseV1DocumentVersionPagination,
  TResponseV1DocumentVersionRetrieveList,
};

export { v1DocumentVersionRetrieveList };
