import { StatusTextType } from '../../components/StatusText';
import { ALERT_TIMEOUT, STATUS_TEXT_TIMEOUT } from '../../constants/timeouts';
import { AlertController } from '../../controller/alert';
import { FeedbackModalController } from '../../controller/feedbackModal';
import {
  FeedbackType,
  v1FeedbackSend,
} from '../../data/apis/feedback/v1FeedbackSend';
import { AccessToken } from '../../helpers/account/accessToken';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

const openFeedbackModal = async (): Promise<void> => {
  const alertController = AlertController();
  const modalController = FeedbackModalController();

  const modal = modalController.showModal({
    id: 'feedback_modal__razjqqgiby',
    title: langKeys().FeedbackModalTextTitle,
    feedbackMessage: {
      id: 'text_area__rztvtacrvo',
      placeholderText: langKeys().FeedbackModalInputPlaceholderMessage,
    },
    submitButton: {
      id: 'button__rktnbhvujs',
      text: langKeys().FeedbackModalButtonSend,
      loadingText: langKeys().FeedbackModalButtonSending,
      onClick: async (): Promise<void> => await sendFeedback(),
    },
  });

  const sendFeedback = async (): Promise<void> => {
    const { getCurrentAccountData } = AccessToken();

    const button = modal.submitButton;
    const messageTextArea = modal.messageTextArea;

    if (messageTextArea.getValue().trim().length <= 0) {
      messageTextArea.setStatusText({
        id: 'status_text__xexhaabunx',
        text: langKeys().ErrorFeedbackContentRequired,
        type: StatusTextType.ERROR,
        isIconVisible: true,
      });

      return;
    }

    button.setLoading(true);

    const { status } = await v1FeedbackSend({
      accessToken: getCurrentAccountData()?.access_token ?? '',
      emailAddress: getCurrentAccountData()?.email_address ?? '',
      type: FeedbackType.FEEDBACK,
      message: messageTextArea.getValue(),
    });

    if (status !== HTTP_STATUS.OK) {
      messageTextArea.setStatusText({
        id: 'status_text__xexhaabunx',
        text: langKeys().ErrorApiInternalServerError,
        type: StatusTextType.ERROR,
        isIconVisible: true,
      });

      messageTextArea.clearStatusTextAfterDelay(STATUS_TEXT_TIMEOUT.SHORT);

      button.setLoading(false);
      return;
    }

    alertController.showAlert(
      {
        id: 'alert__vrefblihrs',
        title: langKeys().AlertFeedbackSentSuccessfulTitle,
        description: langKeys().AlertFeedbackSentSuccessfulDescription,
      },
      ALERT_TIMEOUT.SHORT,
    );

    modalController.closeModal('feedback_modal__razjqqgiby');

    messageTextArea.setValue('');
    button.setLoading(false);
  };
};

export { openFeedbackModal };
