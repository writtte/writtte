import type { TEditorSchema } from '@writtte-editor/editor';
import { Editor } from '../components/Editor';
import { EditorFixedMenu } from '../components/EditorFixedMenu';
import { ErrorMessage } from '../components/ErrorMessage';
import { DEBOUNCE_TIMEOUT } from '../constants/timeouts';
import { setupEditorFixedMenuOptions } from '../modules/editor/editorFixedMenuOptions';
import { setupEditorExtensionOptions } from '../modules/editor/editorOptions';
import {
  getDocumentContentFromAPI,
  getDocumentContentFromIDB,
} from '../modules/editor/getDocumentContent';
import {
  updateDocumentContent,
  updateDocumentContentOnIDB,
} from '../modules/editor/updateDocumentContent';
import { langKeys } from '../translations/keys';
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

  const editorFixedMenuElement = EditorFixedMenu({
    id: 'editor_fixed_menu__tuaodnwhdq',
    items: setupEditorFixedMenuOptions(),
  });

  const editorElement = Editor({
    id: 'editor__oqvawzczdv',
    options: setupEditorExtensionOptions(),
  });

  containerDiv.append(editorFixedMenuElement.element, editorDiv);
  editorDiv.appendChild(editorElement.element);
  editorPageDiv.appendChild(containerDiv);

  const idbPromise = (async (): Promise<string | undefined> => {
    const { content } = await getDocumentContentFromIDB(documentCode);
    if (content === undefined) {
      editorElement.setLoadingState(true);
      return;
    }

    const contentInJSON = editorElement.api.stringToSchema(content);
    editorElement.api.setContent(contentInJSON);

    return content;
  })();

  // biome-ignore lint/nursery/noFloatingPromises: We need to wait for both operations to complete
  Promise.all([idbPromise]).then(async ([idbResults]): Promise<void> => {
    const contentFromIDB = idbResults;

    const { content: contentFromAPI } =
      await getDocumentContentFromAPI(documentCode);

    if (!contentFromAPI) {
      editorElement.setError(
        langKeys().PageEditorErrorDocumentRetrieveTextTitle,
        langKeys().PageEditorErrorDocumentRetrieveTextDescription,
      );

      return;
    }

    if (contentFromIDB === undefined) {
      await updateDocumentContentOnIDB(documentCode, contentFromAPI);

      const contentInJSON = editorElement.api.stringToSchema(contentFromAPI);
      editorElement.api.setContent(contentInJSON);

      editorElement.setLoadingState(false);
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
      await updateDocumentContentOnIDB(documentCode, contentAfterReplacement);
    }

    editorElement.setLoadingState(false);
  });

  if (editorElement.api.isEditable()) {
    const debouncedLogContent = debounce(
      async (content: TEditorSchema): Promise<void> => {
        await updateDocumentContent(editorElement.api, documentCode, content);
      },
      { delay: DEBOUNCE_TIMEOUT.EDITOR_SAVE },
    );

    editorElement.api.onChange((content: TEditorSchema) => {
      debouncedLogContent(content);
    });
  }

  return editorPageDiv;
};

export { EditorPage };
