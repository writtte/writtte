import { ToastType } from '../../../components/Toast';
import { TOAST_TIMEOUT } from '../../../constants/timeouts';
import { ToastController } from '../../../controller/toast';
import { getEditorAPI } from '../../../data/stores/mainEditor';
import { logFatalToSentry } from '../../../helpers/error/sentry';
import { langKeys } from '../../../translations/keys';
import { downloadFileFromUrl } from '../../../utils/file/downloadFileFromUrl';

const downloadCurrentImage = async (): Promise<void> => {
  const toastController = ToastController();

  const editorAPI = getEditorAPI();

  const imagePublicSrc = editorAPI.getImageAttribute('publicURL');
  if (!imagePublicSrc) {
    return;
  }

  const imageCode = editorAPI.getImageAttribute('imageCode');
  const imageExtension = editorAPI.getImageAttribute('extension');

  const fileName = `${imageCode}.${imageExtension}`;

  toastController.showToast(
    {
      id: 'toast__ffrhyecpts',
      text: langKeys().ToastImageDownloading,
      type: ToastType.SUCCESS,
    },
    TOAST_TIMEOUT.SHORT,
  );

  const error = await downloadFileFromUrl(imagePublicSrc, fileName);
  if (error !== undefined) {
    toastController.closeToast('toast__ffrhyecpts');

    toastController.showToast(
      {
        id: 'toast__qncxarlnvv',
        text: langKeys().ToastImageDownloadFailed,
        type: ToastType.ERROR,
      },
      TOAST_TIMEOUT.LONG,
    );

    logFatalToSentry(error);
    return;
  }

  toastController.showToast(
    {
      id: 'toast__xeodupwxnq',
      text: langKeys().ToastImageDownloadSuccess,
      type: ToastType.SUCCESS,
    },
    TOAST_TIMEOUT.LONG,
  );
};

export { downloadCurrentImage };
