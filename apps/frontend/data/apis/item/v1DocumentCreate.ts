import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1DocumentCreate = {
  accessToken: string;
  title: string;
};

type TResponseV1DocumentCreate = {
  id: string;
  code: number;
  results: {
    document_code: string;
  };
  status: boolean;
};

const v1DocumentCreate = async (
  payload: TPayloadV1DocumentCreate,
): Promise<{
  status: number;
  response: TResponseV1DocumentCreate | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/item/document`,
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
    response: results ? (results as TResponseV1DocumentCreate) : null,
  };
};

export type { TPayloadV1DocumentCreate, TResponseV1DocumentCreate };

export { v1DocumentCreate };
