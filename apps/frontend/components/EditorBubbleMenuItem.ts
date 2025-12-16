import { buildError } from '../helpers/error/build';
import { setTestId } from '../utils/dom/testId';

const BubbleMenuItemType = {
  TEXT: 'TEXT',
  INPUT: 'INPUT',
  BUTTON: 'BUTTON',
} as const;

type TBubbleMenuItemType =
  (typeof BubbleMenuItemType)[keyof typeof BubbleMenuItemType];

type TOptions = {
  id: string;
  item:
    | {
        type: typeof BubbleMenuItemType.TEXT;
        text: string;
      }
    | {
        type: typeof BubbleMenuItemType.INPUT;
        text: string | undefined;
        placeholderText: string | undefined;
      }
    | {
        type: typeof BubbleMenuItemType.BUTTON;
        icon: HTMLElement;
        isVisible: boolean;
        isSelected: boolean;
        onClick: () => void;
      };
};

type TReturnEditorBubbleMenuItem = {
  element: HTMLDivElement | HTMLInputElement | HTMLButtonElement;
  getText: (() => string) | undefined;
  setText: ((text: string) => void) | undefined;
  getTextPlaceholder: (() => string) | undefined;
  setTextPlaceholder: ((text: string) => void) | undefined;
  setButtonVisibility: ((isVisible: boolean) => void) | undefined;
  setButtonSelectedState: ((isSelected: boolean) => void) | undefined;
};

const EditorBubbleMenuItem = (opts: TOptions): TReturnEditorBubbleMenuItem => {
  if (opts.item.type === BubbleMenuItemType.TEXT) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('editor-bubble-menu-item-text');

    textDiv.textContent = opts.item.text;

    return {
      element: textDiv,
      getText: undefined,
      setText: undefined,
      getTextPlaceholder: undefined,
      setTextPlaceholder: undefined,
      setButtonVisibility: undefined,
      setButtonSelectedState: undefined,
    };
  }

  if (opts.item.type === BubbleMenuItemType.INPUT) {
    const input = document.createElement('input');
    input.classList.add('editor-bubble-menu-item-input');

    setTestId(input, opts.id);

    if (opts.item.text) {
      input.value = opts.item.text;
    }

    if (opts.item.placeholderText) {
      input.placeholder = opts.item.placeholderText;
    }

    const getText = (): string => input.value;

    const setText = (text: string): void => {
      input.value = text;
    };

    const getTextPlaceholder = (): string => input.placeholder;

    const setTextPlaceholder = (text: string): void => {
      input.placeholder = text;
    };

    return {
      element: input,
      getText,
      setText,
      getTextPlaceholder,
      setTextPlaceholder,
      setButtonVisibility: undefined,
      setButtonSelectedState: undefined,
    };
  }

  if (opts.item.type === BubbleMenuItemType.BUTTON) {
    const button = document.createElement('button');
    const iconDiv = document.createElement('div');

    button.classList.add(
      'editor-bubble-menu-item-button',
      opts.item.isVisible ? 'show' : 'hide',
    );

    if (opts.item.isSelected) {
      button.classList.add('editor-bubble-menu-item-button--selected');
    }

    iconDiv.classList.add('editor-bubble-menu-item-button__icon');

    iconDiv.appendChild(opts.item.icon);
    button.appendChild(iconDiv);

    setTestId(button, opts.id);

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      (
        opts.item as {
          onClick: () => void;
        }
      ).onClick();
    });

    const setButtonVisibility = (isVisible: boolean): void => {
      if (isVisible) {
        button.classList.add('show');
        button.classList.remove('hide');
      } else {
        button.classList.add('hide');
        button.classList.remove('show');
      }
    };

    const setButtonSelectedState = (isSelected: boolean): void => {
      if (isSelected) {
        button.classList.add('editor-bubble-menu-item-button--selected');
      } else {
        button.classList.remove('editor-bubble-menu-item-button--selected');
      }
    };

    return {
      element: button,
      getText: undefined,
      setText: undefined,
      getTextPlaceholder: undefined,
      setTextPlaceholder: undefined,
      setButtonVisibility,
      setButtonSelectedState,
    };
  }

  throw new Error(buildError(`invalid menu item type identified`));
};

export type {
  TBubbleMenuItemType,
  TOptions as TEditorBubbleMenuItemOptions,
  TReturnEditorBubbleMenuItem,
};

export { BubbleMenuItemType, EditorBubbleMenuItem };
