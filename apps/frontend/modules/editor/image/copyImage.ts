import { copyToClipboard } from '@writtte-internal/clipboard';
import { getEditorAPI } from '../../../data/stores/mainEditor';
import { logFatalToSentry } from '../../../helpers/error/sentry';

const copyCurrentImagePublicSrc = async (): Promise<void> => {
  const imagePublicSrc = getEditorAPI().getImageAttribute('publicURL');

  const { error } = await copyToClipboard(imagePublicSrc);
  if (error !== undefined) {
    logFatalToSentry(error);
  }
};

export { copyCurrentImagePublicSrc };
