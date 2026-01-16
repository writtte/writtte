import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

type TPayloadV1DocumentSharingRetrieveList = {
  accessToken: string;
  documentCode: string;
};

type TResponseV1DocumentSharingRetrieveListItem = {
  account_code: string;
  document_code: string;
  sharing_code: string;
  created_time: string;
};

type TResponseV1DocumentSharingRetrieveList = {
  id: string;
  code: number;
  results: {
    sharing_list: TResponseV1DocumentSharingRetrieveListItem[];
  };
  status: boolean;
};

const v1DocumentSharingRetrieveList = async (
  payload: TPayloadV1DocumentSharingRetrieveList,
): Promise<{
  status: number;
  response: TResponseV1DocumentSharingRetrieveList | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/sharing/documents`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.GET,
    bearerValue: payload.accessToken,
    queryParams: [
      {
        key: 'document_code',
        value: payload.documentCode,
      },
    ],
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results
      ? (results as TResponseV1DocumentSharingRetrieveList)
      : null,
  };
};

export type {
  TPayloadV1DocumentSharingRetrieveList,
  TResponseV1DocumentSharingRetrieveListItem,
  TResponseV1DocumentSharingRetrieveList,
};

export { v1DocumentSharingRetrieveList };
