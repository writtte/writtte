import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1FolderRetrieveList = {
  accessToken: string;
  titleFilter?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'created_time' | 'updated_time' | 'title';
  sortOrder?: 'ASC' | 'DESC';
};

type TResponseV1FolderRetrieveListFolder = {
  folder_code: string;
  account_code: string;
  title: string;
  created_time: string;
  updated_time: string;
};

type TResponseV1FolderRetrieveList = {
  id: string;
  code: number;
  results: {
    folders: TResponseV1FolderRetrieveListFolder[];
    pagination: {
      current_page: number;
      page_size: number;
      total_count: number;
      total_pages: number;
    };
  };
  status: boolean;
};

const v1FolderRetrieveList = async (
  payload: TPayloadV1FolderRetrieveList,
): Promise<{
  status: number;
  response: TResponseV1FolderRetrieveList | null;
}> => {
  const queryParams = [];

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
    endPoint: `${BACKEND_CONFIGS.URL}/v1/folder/list`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams: queryParams.length > 0 ? queryParams : undefined,
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1FolderRetrieveList) : null,
  };
};

export type {
  TPayloadV1FolderRetrieveList,
  TResponseV1FolderRetrieveListFolder,
  TResponseV1FolderRetrieveList,
};

export { v1FolderRetrieveList };
