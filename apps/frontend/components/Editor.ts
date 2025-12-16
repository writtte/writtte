import { type TEditorAPI, VelovraEditor } from '@velovra-editor/editor';
import { setTestId } from '../utils/dom/testId';

type TOptions = {
  id: string;
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

  const velovraEditor: TEditorAPI = VelovraEditor({
    element: editorDiv,
  });

  const setLoadingState = (_isLoading: boolean): void => {
    return;
  };

  const setError = (_title: string, _description: string): void => {
    return;
  };

  return {
    element: editorDiv,
    api: velovraEditor,
    setLoadingState,
    setError,
  };
};

export type { TOptions as TEditorOptions, TReturnEditor };

export { Editor };
