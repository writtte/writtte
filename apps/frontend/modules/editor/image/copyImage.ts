import { copyToClipboard } from '@writtte-internal/clipboard';
import { ToastType } from '../../../components/Toast';
import { TOAST_TIMEOUT } from '../../../constants/timeouts';
import { ToastController } from '../../../controller/toast';
import { getEditorAPI } from '../../../data/stores/mainEditor';
import { logFatalToSentry } from '../../../helpers/error/sentry';
import { langKeys } from '../../../translations/keys';

const copyCurrentImagePublicSrc = async (): Promise<void> => {
  const toastController = ToastController();

  const imagePublicSrc = getEditorAPI().getImageAttribute('publicURL');

  const { error } = await copyToClipboard(imagePublicSrc);
  if (error !== undefined) {
    toastController.showToast(
      {
        id: 'toast__gicsbmrwkd',
        text: langKeys().ToastImagePathCopyFailed,
        type: ToastType.ERROR,
      },
      TOAST_TIMEOUT.LONG,
    );

    logFatalToSentry(error);
    return;
  }

  toastController.showToast(
    {
      id: 'toast__nmhbaxweve',
      text: langKeys().ToastImagePathCopySuccess,
      type: ToastType.SUCCESS,
    },
    TOAST_TIMEOUT.LONG,
  );
};

export { copyCurrentImagePublicSrc };
