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
        isVisible: boolean;
      }
    | {
        type: typeof BubbleMenuItemType.INPUT;
        text: string | undefined;
        placeholderText: string | undefined;
        isVisible: boolean;
        onSubmit: () => void;
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
  textReturns:
    | {
        get: () => string;
        set: (value: string) => string;
        setVisibleState: (isVisible: boolean) => void;
      }
    | undefined;
  inputReturns:
    | {
        get: () => string;
        getPlaceholder: () => string;
        set: (value: string) => string;
        setPlaceholder: (value: string) => string;
        setVisibleState: (isVisible: boolean) => void;
      }
    | undefined;
  buttonReturns:
    | {
        setSelectedState: (isSelected: boolean) => void;
        setVisibleState: (isVisible: boolean) => void;
      }
    | undefined;
};

const EditorBubbleMenuItem = (opts: TOptions): TReturnEditorBubbleMenuItem => {
  if (opts.item.type === BubbleMenuItemType.TEXT) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('editor-bubble-menu-item-text');
    textDiv.classList.add(opts.item.isVisible ? 'show' : 'hide');

    textDiv.textContent = opts.item.text;

    const get = (): string => textDiv.textContent || '';

    const set = (value: string): string => {
      textDiv.textContent = value;
      return value;
    };

    const setVisibleState = (isVisible: boolean): void => {
      if (isVisible) {
        textDiv.classList.add('show');
        textDiv.classList.remove('hide');
      } else {
        textDiv.classList.add('hide');
        textDiv.classList.remove('show');
      }
    };

    return {
      element: textDiv,
      textReturns: {
        get,
        set,
        setVisibleState,
      },
      inputReturns: undefined,
      buttonReturns: undefined,
    };
  }

  if (opts.item.type === BubbleMenuItemType.INPUT) {
    const input = document.createElement('input');
    input.classList.add('editor-bubble-menu-item-input');
    input.classList.add(opts.item.isVisible ? 'show' : 'hide');

    setTestId(input, opts.id);

    if (opts.item.text !== undefined) {
      input.value = opts.item.text;
    }

    if (opts.item.placeholderText) {
      input.placeholder = opts.item.placeholderText;
    }

    const get = (): string => input.value;

    const set = (value: string): string => {
      input.value = value;
      return value;
    };

    const getPlaceholder = (): string => input.placeholder;

    const setPlaceholder = (value: string): string => {
      input.placeholder = value;
      return value;
    };

    const setVisibleState = (isVisible: boolean): void => {
      if (isVisible) {
        input.classList.add('show');
        input.classList.remove('hide');
      } else {
        input.classList.add('hide');
        input.classList.remove('show');
      }
    };

    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && opts.item.type === BubbleMenuItemType.INPUT) {
        opts.item.onSubmit();
      }
    });

    return {
      element: input,
      textReturns: undefined,
      inputReturns: {
        get,
        set,
        getPlaceholder,
        setPlaceholder,
        setVisibleState,
      },
      buttonReturns: undefined,
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

    const setSelectedState = (isSelected: boolean): void => {
      if (isSelected) {
        button.classList.add('editor-bubble-menu-item-button--selected');
      } else {
        button.classList.remove('editor-bubble-menu-item-button--selected');
      }
    };

    const setVisibleState = (isVisible: boolean): void => {
      if (isVisible) {
        button.classList.add('show');
        button.classList.remove('hide');
      } else {
        button.classList.add('hide');
        button.classList.remove('show');
      }
    };

    return {
      element: button,
      textReturns: undefined,
      inputReturns: undefined,
      buttonReturns: {
        setSelectedState,
        setVisibleState,
      },
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
