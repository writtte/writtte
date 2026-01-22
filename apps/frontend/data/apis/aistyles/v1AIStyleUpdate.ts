import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1AIStyleUpdate = {
  accessToken: string;
  styleCode: string;
  name?: string;
  style?: string;
  isDeleted?: boolean;
};

type TResponseV1AIStyleUpdate = {
  id: string;
  code: number;
  results: {
    style_code: string;
  };
  status: boolean;
};

const v1AIStyleUpdate = async (
  payload: TPayloadV1AIStyleUpdate,
): Promise<{
  status: number;
  response: TResponseV1AIStyleUpdate | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/ai-style`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.PUT,
    bearerValue: payload.accessToken,
    queryParams: [
      {
        key: 'style_code',
        value: payload.styleCode,
      },
    ],
    bodyParams: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.style !== undefined && { style: payload.style }),
      ...(payload.isDeleted !== undefined && { is_deleted: payload.isDeleted }),
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1AIStyleUpdate) : null,
  };
};

export type { TPayloadV1AIStyleUpdate, TResponseV1AIStyleUpdate };

export { v1AIStyleUpdate };
