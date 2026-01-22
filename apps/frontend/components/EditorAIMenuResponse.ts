import { micromark } from 'micromark';
import { setTestId } from '../utils/dom/testId';

type TOptions = {
  id: string;
  response: string;
  cancelButton: {
    id: string;
    text: string;
    onClick: () => void;
  };
  confirmButton: {
    id: string;
    text: string;
    onClick: () => void;
  };
};

type TReturnEditorAIMenuResponse = {
  element: HTMLDivElement;
  setValue: (mdValue: string) => void;
  setVisibility: (isVisible: boolean) => void;
};

const EditorAIMenuResponse = (opts: TOptions): TReturnEditorAIMenuResponse => {
  const responseDiv = document.createElement('div');
  const responseContentDiv = document.createElement('div');
  const buttonsDiv = document.createElement('div');
  const cancelButton = document.createElement('button');
  const confirmButton = document.createElement('button');

  responseDiv.classList.add('editor-ai-menu-response');
  responseContentDiv.classList.add(
    'editor-ai-menu-response__content',
    'editor-ai-menu-response__content-md',
    'v-scrollbar',
  );

  buttonsDiv.classList.add('editor-ai-menu-response__buttons');
  cancelButton.classList.add('editor-ai-menu-response__cancel-button');
  confirmButton.classList.add('editor-ai-menu-response__confirm-button');

  buttonsDiv.append(cancelButton, confirmButton);
  responseDiv.append(responseContentDiv, buttonsDiv);

  responseDiv.id = opts.id;
  setTestId(responseDiv, opts.id);

  cancelButton.id = opts.cancelButton.id;
  confirmButton.id = opts.confirmButton.id;
  setTestId(cancelButton, opts.cancelButton.id);
  setTestId(confirmButton, opts.confirmButton.id);

  cancelButton.textContent = opts.cancelButton.text;
  confirmButton.textContent = opts.confirmButton.text;

  cancelButton.addEventListener('click', (e: MouseEvent): void => {
    e.preventDefault();

    opts.cancelButton.onClick();
  });

  confirmButton.addEventListener('click', (e: MouseEvent): void => {
    e.preventDefault();

    opts.confirmButton.onClick();
  });

  const setValue = (mdValue: string): void => {
    responseContentDiv.innerHTML = micromark(mdValue);
  };

  const setVisibility = (isVisible: boolean): void => {
    if (isVisible === false) {
      responseDiv.style.display = 'none';
      return;
    }

    responseDiv.style.display = 'flex';
    return;
  };

  return {
    element: responseDiv,
    setValue,
    setVisibility,
  };
};

export type {
  TOptions as TEditorAIMenuResponseOptions,
  TReturnEditorAIMenuResponse,
};

export { EditorAIMenuResponse };
