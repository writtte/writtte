import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1DocumentSharingViewCreate = {
  pageCode: string;
  visitorId: string;
};

type TResponseV1DocumentSharingViewCreate = {
  id: string;
  code: number;
  results: unknown;
  status: boolean;
};

const v1DocumentSharingViewCreate = async (
  payload: TPayloadV1DocumentSharingViewCreate,
): Promise<{
  status: number;
  response: TResponseV1DocumentSharingViewCreate | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/public/sharing/views`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    bodyParams: {
      page_code: payload.pageCode,
      visitor_id: payload.visitorId,
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results
      ? (results as TResponseV1DocumentSharingViewCreate)
      : null,
  };
};

export type {
  TPayloadV1DocumentSharingViewCreate,
  TResponseV1DocumentSharingViewCreate,
};

export { v1DocumentSharingViewCreate };
