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
  editorDiv.classList.add('editor');

  editorDiv.id = opts.id;
  setTestId(editorDiv, opts.id);

  const writtteEditor: TEditorAPI = WrittteEditor({
    element: editorDiv,
    options: opts.options,
  });

  const setLoadingState = (_isLoading: boolean): void => {
    return;
  };

  const setError = (_title: string, _description: string): void => {
    return;
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
