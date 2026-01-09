import type { TEditorSchema } from '@writtte-editor/editor';
import { Editor } from '../components/Editor';
import { EditorFixedMenu } from '../components/EditorFixedMenu';
import { ErrorMessage } from '../components/ErrorMessage';
import { DEBOUNCE_TIMEOUT } from '../constants/timeouts';
import { updateMainEditor } from '../data/stores/mainEditor';
import { isAccountInFreeTrial } from '../data/stores/overview';
import {
  getDocumentContentFromAPI,
  getDocumentContentFromIDB,
} from '../modules/editor/content/getDocumentContent';
import {
  updateDocumentContent,
  updateDocumentContentOnIDB,
} from '../modules/editor/content/updateDocumentContent';
import { checkAndSetImages } from '../modules/editor/image/setImages';
import { bubbleMenuEventListener } from '../modules/editor/menu/editorBubbleMenu';
import { setupEditorFixedMenuOptions } from '../modules/editor/menu/editorFixedMenu';
import { setupEditorExtensionOptions } from '../modules/editor/options/editorOptions';
import { langKeys } from '../translations/keys';
import { setPageTitle } from '../utils/routes/helpers';
import { debounce } from '../utils/time/debounce';

const EditorPage = async (
  params: Record<string, string> | undefined,
): Promise<HTMLElement> => {
  if (params === undefined || !params.documentCode) {
    return ErrorMessage({
      title: langKeys().ErrorMessageNotFoundTitle,
      description: langKeys().ErrorMessageNotFoundDescription,
    });
  }

  const documentCode = params.documentCode;

  const { isFreeTrialExpired } = isAccountInFreeTrial();

  const editorPageDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const editorDiv = document.createElement('div');

  editorPageDiv.classList.add('editor-page');
  containerDiv.classList.add('editor-page__container');
  editorDiv.classList.add('editor-page__editor');

  const editorElement = Editor({
    id: 'editor__oqvawzczdv',
    options: setupEditorExtensionOptions(isFreeTrialExpired ?? true),
  });

  if (editorElement) {
    updateMainEditor({
      documentCode,
      api: editorElement.api,
    });

    if (isFreeTrialExpired) {
      editorElement.api.setReadable();
    }
  }

  if (!isFreeTrialExpired) {
    const editorFixedMenuElement = EditorFixedMenu({
      id: 'editor_fixed_menu__tuaodnwhdq',
    });

    editorFixedMenuElement.setItems(setupEditorFixedMenuOptions());

    containerDiv.append(editorFixedMenuElement.element, editorDiv);

    // Setup bubble menu event listener

    bubbleMenuEventListener();
  } else {
    containerDiv.appendChild(editorDiv);
  }

  editorDiv.appendChild(editorElement.element);
  editorPageDiv.appendChild(containerDiv);

  const idbPromise = (async (): Promise<string | undefined> => {
    const { title, content } = await getDocumentContentFromIDB(documentCode);
    if (content === undefined) {
      editorElement.setLoadingState(true);
      return;
    }

    const contentInJSON = editorElement.api.stringToSchema(content);
    editorElement.api.setContent(contentInJSON);

    if (title) {
      setPageTitle(title);
    }

    // After retrieving the document content from IndexedDB, all images
    // should be checked and updated accordingly, even when rechecking
    // after calling the API.

    await checkAndSetImages();

    return content;
  })();

  // biome-ignore lint/nursery/noFloatingPromises: We need to wait for both operations to complete
  Promise.all([idbPromise]).then(async ([idbResults]): Promise<void> => {
    const contentFromIDB = idbResults;

    const checkAPIResults = await getDocumentContentFromAPI(documentCode);

    if (checkAPIResults === undefined) {
      editorElement.setLoadingState(false);

      await checkAndSetImages();
      return;
    }

    const { title: titleFromAPI, content: contentFromAPI } = checkAPIResults;

    if (contentFromAPI === undefined) {
      editorElement.setError(
        langKeys().PageEditorErrorDocumentRetrieveTextTitle,
        langKeys().PageEditorErrorDocumentRetrieveTextDescription,
      );

      return;
    }

    if (titleFromAPI) {
      setPageTitle(titleFromAPI);
    }

    if (contentFromIDB === undefined) {
      await updateDocumentContentOnIDB(documentCode, contentFromAPI);
      const contentInJSON = editorElement.api.stringToSchema(contentFromAPI);

      editorElement.api.setContent(contentInJSON);
      editorElement.setLoadingState(false);

      await checkAndSetImages();
      return;
    }

    // In this case, the document already has content from IndexedDB
    // however, if the content returned from the API is different, the
    // document content should be updated accordingly.
    //
    // If the content is different, the IndexedDB should be updated
    // again.

    const contentInJSON = editorElement.api.stringToSchema(contentFromAPI);

    const contentAfterReplacement =
      editorElement.api.replaceContent(contentInJSON);

    if (contentAfterReplacement !== undefined) {
      await updateDocumentContentOnIDB(
        documentCode,
        editorElement.api.schemaToString(contentAfterReplacement),
      );
    }

    // After replacing the document content, all images should be
    // re-checked and updated accordingly.

    await checkAndSetImages();

    editorElement.setLoadingState(false);
  });

  var editorMountTime = Date.now();

  {
    const debouncedLogContent = debounce(
      async (content: TEditorSchema): Promise<void> => {
        await updateDocumentContent(editorElement.api, documentCode, content);
      },
      { delay: DEBOUNCE_TIMEOUT.EDITOR_SAVE },
    );

    editorElement.api.onChange((content: TEditorSchema) => {
      if (isFreeTrialExpired) {
        return;
      }

      if (editorElement.api.isEditable()) {
        const now = Date.now();
        if (now - editorMountTime < 5000) {
          // Don't save the editor until 5 seconds after the initial
          // content has loaded

          return;
        }

        debouncedLogContent(content);
      }
    });
  }

  return editorPageDiv;
};

export { EditorPage };
