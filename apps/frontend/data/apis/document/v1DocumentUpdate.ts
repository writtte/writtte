import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

const DocumentLifecycleState = {
  ACTIVE: 'active',
  DELETED: 'deleted',
} as const;

const DocumentWorkflowState = {
  PUBLISHED: 'published',
} as const;

type TDocumentLifecycleState =
  (typeof DocumentLifecycleState)[keyof typeof DocumentLifecycleState];

type TDocumentWorkflowState =
  (typeof DocumentWorkflowState)[keyof typeof DocumentWorkflowState];

type TPayloadV1DocumentUpdate = {
  accessToken: string;
  documentCode: string;
  title?: string;
  lifecycleState?: TDocumentLifecycleState;
  workflowState?: TDocumentWorkflowState;
  content?: string;
};

type TResponseV1DocumentUpdate = {
  id: string;
  code: number;
  results: {
    e_tag: string;
  };
  status: boolean;
};

const v1DocumentUpdate = async (
  payload: TPayloadV1DocumentUpdate,
): Promise<{
  status: number;
  response: TResponseV1DocumentUpdate | null;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/document`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.PATCH,
    bearerValue: payload.accessToken,
    queryParams: [
      {
        key: 'document_code',
        value: payload.documentCode,
      },
    ],
    bodyParams: {
      ...(payload.title && { title: payload.title }),
      ...(payload.lifecycleState && {
        lifecycle_state: payload.lifecycleState,
      }),
      ...(payload.workflowState && { workflow_state: payload.workflowState }),
      ...(payload.content && { content: payload.content }),
    },
  };

  const { status, results } = await fetchRequest(body);

  return {
    status,
    response: results ? (results as TResponseV1DocumentUpdate) : null,
  };
};

export type {
  TDocumentLifecycleState,
  TDocumentWorkflowState,
  TPayloadV1DocumentUpdate,
  TResponseV1DocumentUpdate,
};

export { DocumentLifecycleState, DocumentWorkflowState, v1DocumentUpdate };
