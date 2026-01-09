import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1FolderUpdate = {
  accessToken: string;
  folderCode: string;
  title?: string;
};

type TResponseV1FolderUpdate = {
  id: string;
  code: number;
  results: {
    folder_code: string;
  };
  status: boolean;
};

const v1FolderUpdate = async (
  payload: TPayloadV1FolderUpdate,
): Promise<{
  status: number;
  response: TResponseV1FolderUpdate | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/folder`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.PATCH,
    bearerValue: payload.accessToken,
    queryParams: [
      {
        key: 'folder_code',
        value: payload.folderCode,
      },
    ],
    bodyParams: {
      ...(payload.title && { title: payload.title }),
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1FolderUpdate) : null,
  };
};

export type { TPayloadV1FolderUpdate, TResponseV1FolderUpdate };

export { v1FolderUpdate };
