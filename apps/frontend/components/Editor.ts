import {
  type TEditorAPI,
  type TExtensionOptions,
  WrittteEditor,
} from '@writtte-editor/editor';
import { setTestId } from '../utils/dom/testId';

type TOptions = {
  id: string;
  options: TExtensionOptions;
};

type TReturnEditor = {
  element: HTMLDivElement;
  api: TEditorAPI;
  setLoadingState: (isLoading: boolean) => void;
  setError: (title: string, description: string) => void;
};

const Editor = (opts: TOptions): TReturnEditor => {
  const editorDiv = document.createElement('div');
  editorDiv.classList.add(
    'editor',
    'editor--fading-edges',
    'writtte-editor',
    'v-scrollbar',
  );

  editorDiv.id = opts.id;
  setTestId(editorDiv, opts.id);

  var writtteEditor: TEditorAPI = WrittteEditor({
    element: editorDiv,
    options: opts.options,
  });

  const setLoadingState = (isLoading: boolean): void => {
    if (isLoading) {
      const containerDiv = document.createElement('div');
      const loadingIndicatorDiv = document.createElement('div');
      const largeLineDiv = document.createElement('div');
      const smallLineDiv = document.createElement('div');

      containerDiv.classList.add('editor-loading-indicator-container');
      loadingIndicatorDiv.classList.add('editor-loading-indicator');
      largeLineDiv.classList.add('editor-loading-indicator__large');
      smallLineDiv.classList.add('editor-loading-indicator__small');

      loadingIndicatorDiv.append(largeLineDiv, smallLineDiv);
      containerDiv.appendChild(loadingIndicatorDiv);
      editorDiv.appendChild(containerDiv);
    } else {
      const loadingIndicatorElements = editorDiv.getElementsByClassName(
        'editor-loading-indicator-container',
      );

      if (loadingIndicatorElements) {
        for (let i = 0; i < loadingIndicatorElements.length; i++) {
          loadingIndicatorElements[i].remove();
        }
      }
    }
  };

  const setError = (title: string, description: string): void => {
    const containerDiv = document.createElement('div');
    const messageDiv = document.createElement('div');
    const titleDiv = document.createElement('div');
    const descriptionDiv = document.createElement('div');

    containerDiv.classList.add('editor-error-message-container');
    messageDiv.classList.add('editor-error-message');
    titleDiv.classList.add('editor-error-message__title');
    descriptionDiv.classList.add('editor-error-message__description');

    messageDiv.append(titleDiv, descriptionDiv);
    containerDiv.appendChild(messageDiv);

    titleDiv.textContent = title;
    descriptionDiv.textContent = description;

    editorDiv.replaceChildren(containerDiv);
  };

  return {
    element: editorDiv,
    api: writtteEditor,
    setLoadingState,
    setError,
  };
};

export type { TOptions as TEditorOptions, TReturnEditor };

export { Editor };
