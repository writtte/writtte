import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1FolderDelete = {
  accessToken: string;
  folderCode: string;
};

type TResponseV1FolderDelete = {
  id: string;
  code: number;
  results: {
    folder_code: string;
  };
  status: boolean;
};

const v1FolderDelete = async (
  payload: TPayloadV1FolderDelete,
): Promise<{
  status: number;
  response: TResponseV1FolderDelete | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/folder`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.DELETE,
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
    response: results ? (results as TResponseV1FolderDelete) : null,
  };
};

export type { TPayloadV1FolderDelete, TResponseV1FolderDelete };

export { v1FolderDelete };
