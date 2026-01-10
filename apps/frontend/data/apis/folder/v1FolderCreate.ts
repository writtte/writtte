import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1FolderCreate = {
  accessToken: string;
  title: string;
};

type TResponseV1FolderCreate = {
  id: string;
  code: number;
  results: {
    folder_code: string;
  };
  status: boolean;
};

const v1FolderCreate = async (
  payload: TPayloadV1FolderCreate,
): Promise<{
  status: number;
  response: TResponseV1FolderCreate | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/folder`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    bearerValue: payload.accessToken,
    bodyParams: {
      title: payload.title,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1FolderCreate) : null,
  };
};

export type { TPayloadV1FolderCreate, TResponseV1FolderCreate };

export { v1FolderCreate };
