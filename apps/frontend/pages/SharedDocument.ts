import {
  getLocalStorage,
  setLocalStorage,
} from '@writtte-internal/local-storage';
import { AnimatedIcon, AnimatedIconName } from '../components/AnimatedIcon';
import { Editor } from '../components/Editor';
import { ErrorMessage } from '../components/ErrorMessage';
import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { v1DocumentSharingRetrieve } from '../data/apis/documentSharing/v1DocumentSharingRetrieve';
import { v1DocumentSharingViewCreate } from '../data/apis/documentSharingView/v1SharingViewCreate';
import { checkAndSetImagesInSharedDocument } from '../modules/editor/image/setImagesInSharedDocument';
import { setupEditorExtensionOptions } from '../modules/editor/options/editorOptions';
import { langKeys } from '../translations/keys';
import { HTTP_STATUS } from '../utils/data/fetch';
import { generateUUID } from '../utils/string/uuid';

const SharedDocumentPage = async (
  params: Record<string, string> | undefined,
): Promise<HTMLElement> => {
  if (params === undefined || !params.sharingCode) {
    return ErrorMessage({
      title: langKeys().ErrorMessageNotFoundTitle,
      description: langKeys().ErrorMessageNotFoundDescription,
    });
  }

  const sharingCode = params.sharingCode;

  const loadingIndicatorElement = LoadingIndicator({
    id: 'loading_indicator__tneyichtxc',
    text: undefined,
    animatedIcon: AnimatedIcon(AnimatedIconName._26_WRITTTE_LOGO_SPINNER),
    shouldHideLogoInOverlay: true,
    isOverlay: true,
  }).element;

  await performViewAnalysis(sharingCode);

  document.body.appendChild(loadingIndicatorElement);

  const pageDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const badgeA = document.createElement('a');

  pageDiv.classList.add('shared-document-page');
  headerDiv.classList.add('shared-document-page__header');
  badgeA.classList.add('shared-document-page__badge');

  const editorElement = Editor({
    id: 'editor__iddscbrrkv',
    options: setupEditorExtensionOptions(false),
  });

  editorElement.element.classList.add('shared-document-page__editor');

  if (editorElement) {
    editorElement.api.setReadable();
  } else {
    document.body.removeChild(loadingIndicatorElement);

    return ErrorMessage({
      title: langKeys().ErrorMessageNotFoundTitle,
      description: langKeys().ErrorMessageNotFoundDescription,
    });
  }

  // retrieve document content

  const { status, response } = await v1DocumentSharingRetrieve({
    sharingCode,
  });

  if (status !== HTTP_STATUS.OK || !response?.results) {
    document.body.removeChild(loadingIndicatorElement);

    return ErrorMessage({
      title: langKeys().ErrorMessageNotFoundTitle,
      description: langKeys().ErrorMessageNotFoundDescription,
    });
  }

  document.title = response.results.title;

  try {
    const contentInEditorSchema = editorElement.api.stringToSchema(
      response.results.content,
    );

    editorElement.api.setContent(contentInEditorSchema);
  } catch {
    document.body.removeChild(loadingIndicatorElement);

    return ErrorMessage({
      title: langKeys().ErrorMessageNotFoundTitle,
      description: langKeys().ErrorMessageNotFoundDescription,
    });
  }

  // Fix images src attributes

  checkAndSetImagesInSharedDocument(editorElement.element);

  badgeA.textContent = 'Drafted in Writtte';
  badgeA.href = 'https://writtte.com';
  badgeA.target = '_blank';

  headerDiv.appendChild(FlatIcon(FlatIconName._26_WRITTTE_LOGO));
  pageDiv.append(headerDiv, editorElement.element, badgeA);

  // The loading indicator should be removed after everything is
  // completed. This should be the very last step.

  document.body.removeChild(loadingIndicatorElement);
  return pageDiv;
};

const performViewAnalysis = async (code: string): Promise<void> => {
  const storageKey = 'writtte-visitor-id';

  var idFromLocalStorage = getLocalStorage(storageKey);
  if (idFromLocalStorage === null) {
    idFromLocalStorage = generateUUID();

    setLocalStorage(storageKey, idFromLocalStorage);
  }

  await v1DocumentSharingViewCreate({
    pageCode: code,
    visitorId: idFromLocalStorage,
  });
};

export { SharedDocumentPage };
