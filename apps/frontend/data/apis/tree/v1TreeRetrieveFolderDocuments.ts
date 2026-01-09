import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1TreeRetrieveFolderDocuments = {
  accessToken: string;
  folderCode: string;
  page?: number;
  pageSize?: number;
};

type TResponseV1TreeRetrieveFolderDocumentsDocument = {
  document_code: string;
  account_code: string;
  title: string;
  lifecycle_state: string;
  workflow_state: string;
  created_time: string;
  updated_time: string;
};

type TResponseV1TreeRetrieveFolderDocuments = {
  id: string;
  code: number;
  results: {
    folder_code: string;
    documents: TResponseV1TreeRetrieveFolderDocumentsDocument[];
    pagination: {
      current_page: number;
      page_size: number;
      total_count: number;
      total_pages: number;
    };
  };
  status: boolean;
};

const v1TreeRetrieveFolderDocuments = async (
  payload: TPayloadV1TreeRetrieveFolderDocuments,
): Promise<{
  status: number;
  response: TResponseV1TreeRetrieveFolderDocuments | null;
}> => {
  const queryParams = [
    {
      key: 'folder_code',
      value: payload.folderCode,
    },
  ];

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

  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/tree/folder/documents`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams,
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results
      ? (results as TResponseV1TreeRetrieveFolderDocuments)
      : null,
  };
};

export type {
  TPayloadV1TreeRetrieveFolderDocuments,
  TResponseV1TreeRetrieveFolderDocumentsDocument,
  TResponseV1TreeRetrieveFolderDocuments,
};

export { v1TreeRetrieveFolderDocuments };
