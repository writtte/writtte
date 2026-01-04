import type { TEditorSchema } from '@writtte-editor/editor';
import { Editor } from '../components/Editor';
import { EditorFixedMenu } from '../components/EditorFixedMenu';
import { ErrorMessage } from '../components/ErrorMessage';
import { DEBOUNCE_TIMEOUT } from '../constants/timeouts';
import { updateMainEditor } from '../data/stores/mainEditor';
import {
  getDocumentContentFromAPI,
  getDocumentContentFromIDB,
} from '../modules/editor/content/getDocumentContent';
import {
  updateDocumentContent,
  updateDocumentContentOnIDB,
} from '../modules/editor/content/updateDocumentContent';
import { checkAndSetImages } from '../modules/editor/image/setImages';
import {
  fixedMenuUpdateEventListener,
  setupEditorFixedMenuOptions,
} from '../modules/editor/menu/editorFixedMenu';
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

  const editorPageDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const editorDiv = document.createElement('div');

  editorPageDiv.classList.add('editor-page');
  containerDiv.classList.add('editor-page__container');
  editorDiv.classList.add('editor-page__editor', 'v-scrollbar');

  const editorElement = Editor({
    id: 'editor__oqvawzczdv',
    options: setupEditorExtensionOptions(),
  });

  if (editorElement) {
    editorElement.api.setReadable();

    updateMainEditor({
      documentCode,
      api: editorElement.api,
    });
  }

  const editorFixedMenuElement = EditorFixedMenu({
    id: 'editor_fixed_menu__tuaodnwhdq',
  });

  editorFixedMenuElement.setItems(
    setupEditorFixedMenuOptions(editorFixedMenuElement),
  );

  fixedMenuUpdateEventListener(editorFixedMenuElement);

  containerDiv.append(editorFixedMenuElement.element, editorDiv);
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

    const { title: titleFromAPI, content: contentFromAPI } =
      await getDocumentContentFromAPI(documentCode);

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

      editorElement.api.setEditable();

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
    editorElement.api.setEditable();
  });

  let isEditorMounted = false;
  const debouncedLogContent = debounce(
    async (content: TEditorSchema): Promise<void> => {
      await updateDocumentContent(editorElement.api, documentCode, content);
    },
    { delay: DEBOUNCE_TIMEOUT.EDITOR_SAVE },
  );

  editorElement.api.onChange((content: TEditorSchema) => {
    if (editorElement.api.isEditable()) {
      if (!isEditorMounted) {
        isEditorMounted = true;
        return;
      }

      debouncedLogContent(content);
    }
  });

  return editorPageDiv;
};

export { EditorPage };
