import { setTestId } from '../utils/dom/testId';
import { AnimatedIcon, AnimatedIconName } from './AnimatedIcon';
import { FlatIcon, FlatIconName } from './FlatIcon';
import { StatusText, type TStatusTextOptions } from './StatusText';

type TEditorAIMenuStyle = {
  id: string;
  code: string;
  name: string;
  isVisible: boolean;
};

type TOptions = {
  id: string;
  placeholderText: string;
  stylesText: string;
  customStyles: TEditorAIMenuStyle[];
  submitButton: {
    id: string;
    icon: HTMLElement;
    onClick: () => void;
  };
};

type TReturnEditorAIMenuManual = {
  element: HTMLDivElement;
  getInstructions: () => string;
  getSelectedStyle: () => string | null;
  setGenerating: (isGenerating: boolean) => void;
  setStatusText: (statusTextOpts: TStatusTextOptions | undefined) => void;
  clearStatusTextAfterDelay: (delay: number) => void;
  focusInput: () => void;
};

const defaultNullStyleCode = '00000000-0000-0000-0000-000000000000';

const EditorAIMenuManual = (opts: TOptions): TReturnEditorAIMenuManual => {
  const editDiv = document.createElement('div');
  const editTextAreaWrapperDiv = document.createElement('div');
  const editTextAreaContainerDiv = document.createElement('div');
  const editTextArea = document.createElement('textarea');
  const editStatusTextDiv = document.createElement('div');
  const editActionsDiv = document.createElement('div');
  const editStyleSelectionDiv = document.createElement('div');
  const editStyleNameDiv = document.createElement('div');
  const editStyleListSelect = document.createElement('select');
  const editSubmitButton = document.createElement('button');

  // biome-ignore format: Following code block should not be formatted
  {
    editDiv.classList.add('editor-ai-menu-manual-edit')
    editTextAreaWrapperDiv.classList.add('editor-ai-menu-manual-edit__text-area-wrapper')
    editTextAreaContainerDiv.classList.add('editor-ai-menu-manual-edit__text-area-container')
    editTextArea.classList.add('editor-ai-menu-manual-edit__text-area', 'v-scrollbar')
    editStatusTextDiv.classList.add('editor-ai-menu-manual-edit__status-text', 'hide')
    editActionsDiv.classList.add('editor-ai-menu-manual-edit__actions')
    editStyleSelectionDiv.classList.add('editor-ai-menu-manual-edit__style-selection')
    editStyleNameDiv.classList.add('editor-ai-menu-manual-edit__style-name')
    editStyleListSelect.classList.add('editor-ai-menu-manual-edit__style-list')
    editSubmitButton.classList.add('editor-ai-menu-manual-edit__submit-button')
  }

  editSubmitButton.replaceChildren(FlatIcon(FlatIconName._18_ARROW_UP));
  editStyleSelectionDiv.append(editStyleNameDiv, editStyleListSelect);
  editActionsDiv.append(editStyleSelectionDiv, editSubmitButton);
  editTextAreaContainerDiv.append(editTextArea, editActionsDiv);
  editTextAreaWrapperDiv.append(editTextAreaContainerDiv, editStatusTextDiv);
  editDiv.append(editTextAreaWrapperDiv);

  editTextArea.id = opts.id;
  setTestId(editTextArea, opts.id);

  editTextArea.placeholder = opts.placeholderText;
  editStyleNameDiv.textContent = opts.stylesText;

  if (opts.customStyles.length === 0) {
    editStyleNameDiv.remove();
    editStyleListSelect.remove();
  }

  for (let i = 0; i < opts.customStyles.length; i++) {
    const style = opts.customStyles[i];
    if (style.isVisible === false) {
      continue;
    }

    const option = document.createElement('option');

    option.value = style.code;
    option.textContent = style.name;

    option.id = style.id;
    setTestId(option, style.id);

    editStyleListSelect.appendChild(option);
  }

  editSubmitButton.addEventListener('click', (e: MouseEvent): void => {
    e.preventDefault();

    opts.submitButton.onClick();
  });

  editTextArea.addEventListener('focus', () => {
    editTextAreaContainerDiv.classList.add('active');
  });

  editTextArea.addEventListener('focusout', () => {
    editTextAreaContainerDiv.classList.remove('active');
  });

  editStyleListSelect.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation();
  });

  editStyleListSelect.addEventListener('change', (e: Event) => {
    e.stopPropagation();
  });

  editTextAreaContainerDiv.addEventListener('click', (e: MouseEvent) => {
    if (!editActionsDiv.contains(e.target as Node)) {
      editTextArea.focus();
    }
  });

  editTextArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      opts.submitButton.onClick();
    }
  });

  let inputValue: string = '';
  editTextArea.addEventListener('input', (e: Event) => {
    inputValue = (e.target as HTMLInputElement).value;
  });

  const getInstructions = (): string => inputValue;

  const getSelectedStyle = (): string | null => {
    if (editStyleListSelect.options.length === 0) {
      return null;
    }

    return editStyleListSelect.value;
  };

  const setGenerating = (isGenerating: boolean): void => {
    if (isGenerating) {
      editSubmitButton.classList.add('generating');
      editSubmitButton.replaceChildren(
        AnimatedIcon(AnimatedIconName._18_CIRCLE_SPINNER),
      );

      editTextArea.readOnly = true;
      return;
    }

    editSubmitButton.classList.remove('generating');
    editSubmitButton.replaceChildren(opts.submitButton.icon);

    editTextArea.readOnly = false;
  };

  const setStatusText = (
    statusTextOpts: TStatusTextOptions | undefined,
  ): void => {
    if (statusTextOpts === undefined) {
      editStatusTextDiv.classList.add('hide');
      editStatusTextDiv.classList.remove('show');
      return;
    }

    editStatusTextDiv.classList.add('show');
    editStatusTextDiv.classList.remove('hide');

    editStatusTextDiv.replaceChildren(StatusText(statusTextOpts).element);
  };

  const clearStatusTextAfterDelay = (delay: number): void => {
    if (delay <= 0) {
      setStatusText(undefined);
      return;
    }

    setTimeout(() => {
      setStatusText(undefined);
    }, delay);
  };

  const focusInput = (): void => {
    editTextArea.focus();
    if (editTextArea.value) {
      const textLength = editTextArea.value.length;
      editTextArea.setSelectionRange(textLength, textLength);
    }

    editTextAreaContainerDiv.classList.add('active');
  };

  return {
    element: editDiv,
    getInstructions,
    getSelectedStyle,
    setGenerating,
    setStatusText,
    clearStatusTextAfterDelay,
    focusInput,
  };
};

export type {
  TEditorAIMenuStyle,
  TOptions as TEditorAIMenuManualOptions,
  TReturnEditorAIMenuManual,
};

export { defaultNullStyleCode, EditorAIMenuManual };
