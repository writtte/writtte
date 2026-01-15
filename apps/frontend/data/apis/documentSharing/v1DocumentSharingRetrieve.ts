import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1DocumentSharingRetrieve = {
  sharingCode: string;
};

type TResponseV1DocumentSharingRetrieve = {
  id: string;
  code: number;
  results: {
    document_code: string;
    title: string;
    content: string;
  };
  status: boolean;
};

const v1DocumentSharingRetrieve = async (
  payload: TPayloadV1DocumentSharingRetrieve,
): Promise<{
  status: number;
  response: TResponseV1DocumentSharingRetrieve | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/public/sharing/document`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    queryParams: [
      {
        key: 'sharing_code',
        value: payload.sharingCode,
      },
    ],
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1DocumentSharingRetrieve) : null,
  };
};

export type {
  TPayloadV1DocumentSharingRetrieve,
  TResponseV1DocumentSharingRetrieve,
};

export { v1DocumentSharingRetrieve };
