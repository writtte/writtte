import { Editor } from '../components/Editor';
import { ErrorMessage } from '../components/ErrorMessage';
import {
  getDocumentContentFromAPI,
  getDocumentContentFromIDB,
} from '../modules/editor/getDocumentContent';
import { updateDocumentContentOnIDB } from '../modules/editor/updateDocumentContent';
import { langKeys } from '../translations/keys';

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
  editorDiv.classList.add('editor-page__editor');

  containerDiv.appendChild(editorDiv);
  editorPageDiv.appendChild(containerDiv);

  const editorElement = Editor({
    id: 'editor__oqvawzczdv',
  });

  containerDiv.appendChild(editorElement.element);

  const idbPromise = (async (): Promise<string | undefined> => {
    const { content } = await getDocumentContentFromIDB(documentCode);
    if (content === undefined) {
      editorElement.setLoadingState(true);
      return;
    }

    editorElement.api.setContent(content);
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

      editorElement.api.setContent(contentFromAPI);
      editorElement.setLoadingState(false);
      return;
    }

    // In this case, the document already has content from IndexedDB
    // however, if the content returned from the API is different, the
    // document content should be updated accordingly.
    //
    // If the content is different, the IndexedDB should be updated
    // again.

    const contentAfterReplacement =
      editorElement.api.replaceContent(contentFromAPI);

    if (contentAfterReplacement !== undefined) {
      await updateDocumentContentOnIDB(documentCode, contentAfterReplacement);
    }

    editorElement.setLoadingState(false);
  });

  return editorPageDiv;
};

export { EditorPage };
