import { BACKEND_CONFIGS } from '../../../configs/be';
import {
  HTTP_METHODS,
  REQUEST_MODES,
  type TFetchProps,
  fetchRequest,
} from '../../../utils/data/fetch';

const FeedbackType = {
  BUG: 'bug',
  FEATURE: 'feature',
  FEEDBACK: 'feedback',
} as const;

type TFeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType];

type TPayloadV1FeedbackSend = {
  accessToken: string;
  emailAddress: string;
  type: TFeedbackType;
  message: string;
};

const v1FeedbackSend = async (
  payload: TPayloadV1FeedbackSend,
): Promise<{
  status: number;
}> => {
  const body: TFetchProps = {
    endPoint: `${BACKEND_CONFIGS.URL}/v1/feedback`,
    mode: REQUEST_MODES.CORS,
    method: HTTP_METHODS.POST,
    bearerValue: payload.accessToken,
    bodyParams: {
      email_address: payload.emailAddress,
      type: payload.type,
      message: payload.message,
    },
  };

  const { status } = await fetchRequest(body);

  return {
    status,
  };
};

export type { TPayloadV1FeedbackSend, TFeedbackType };

export { FeedbackType, v1FeedbackSend };
