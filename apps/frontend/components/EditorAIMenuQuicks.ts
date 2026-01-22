import { setTestId } from '../utils/dom/testId';

type TEditorAIMenuQuick = {
  id: string;
  label: string;
  isVisible: boolean;
  onClick: () => void;
};

type TOptions = {
  id: string;
  quicks: TEditorAIMenuQuick[];
};

type TReturnEditorAIMenuQuicks = {
  element: HTMLDivElement;
  setGenerating: (isGenerating: boolean) => void;
};

const EditorAIMenuQuicks = (opts: TOptions): TReturnEditorAIMenuQuicks => {
  const quicksDiv = document.createElement('div');
  quicksDiv.classList.add('editor-ai-menu-quicks');

  quicksDiv.id = opts.id;
  setTestId(quicksDiv, opts.id);

  for (let i = 0; i < opts.quicks.length; i++) {
    const quick = opts.quicks[i];

    const quickButton = document.createElement('button');
    quickButton.classList.add('editor-ai-menu-quicks__quick');

    quickButton.id = quick.id;
    setTestId(quickButton, quick.id);

    quickButton.textContent = quick.label;

    quickButton.addEventListener('click', (e: PointerEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      quick.onClick();
    });

    quicksDiv.appendChild(quickButton);
  }

  const setGenerating = (isGenerating: boolean): void => {
    if (isGenerating === true) {
      quicksDiv.classList.add('hide');
      quicksDiv.classList.remove('show');

      return;
    }

    quicksDiv.classList.remove('hide');
    quicksDiv.classList.add('show');
  };

  return {
    element: quicksDiv,
    setGenerating,
  };
};

export type {
  TEditorAIMenuQuick,
  TOptions as TEditorAIMenuQuicksOptions,
  TReturnEditorAIMenuQuicks,
};

export { EditorAIMenuQuicks };
