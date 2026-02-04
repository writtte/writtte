import { getEditorAPI } from '../../../data/stores/mainEditor';
import { logFatalToSentry } from '../../../helpers/error/sentry';
import { downloadFileFromUrl } from '../../../utils/file/downloadFileFromUrl';

const downloadCurrentImage = async (): Promise<void> => {
  const editorAPI = getEditorAPI();

  const imagePublicSrc = editorAPI.getImageAttribute('publicURL');
  if (!imagePublicSrc) {
    return;
  }

  const imageCode = editorAPI.getImageAttribute('imageCode');
  const imageExtension = editorAPI.getImageAttribute('extension');

  const fileName = `${imageCode}.${imageExtension}`;

  const error = await downloadFileFromUrl(imagePublicSrc, fileName);
  if (error !== undefined) {
    logFatalToSentry(error);
  }
};

export { downloadCurrentImage };
