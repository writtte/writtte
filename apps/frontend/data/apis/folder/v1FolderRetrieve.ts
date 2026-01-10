import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1FolderRetrieve = {
  accessToken: string;
  folderCode: string;
};

type TResponseV1FolderRetrieve = {
  id: string;
  code: number;
  results: {
    folder_code: string;
    account_code: string;
    title: string;
    created_time: string;
    updated_time: string;
  };
  status: boolean;
};

const v1FolderRetrieve = async (
  payload: TPayloadV1FolderRetrieve,
): Promise<{
  status: number;
  response: TResponseV1FolderRetrieve | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/folder`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams: [
      {
        key: 'folder_code',
        value: payload.folderCode,
      },
    ],
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1FolderRetrieve) : null,
  };
};

export type { TPayloadV1FolderRetrieve, TResponseV1FolderRetrieve };

export { v1FolderRetrieve };
