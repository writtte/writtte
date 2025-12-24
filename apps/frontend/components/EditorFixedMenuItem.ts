import { buildError } from '../helpers/error/build';
import { setTestId } from '../utils/dom/testId';

const FixedMenuItemType = {
  TEXT: 'TEXT',
  INPUT: 'INPUT',
  BUTTON: 'BUTTON',
} as const;

type TFixedMenuItemType =
  (typeof FixedMenuItemType)[keyof typeof FixedMenuItemType];

type TOptions = {
  id: string;
  item:
    | {
        type: typeof FixedMenuItemType.TEXT;
        text: string;
      }
    | {
        type: typeof FixedMenuItemType.INPUT;
        text: string | undefined;
        placeholderText: string | undefined;
      }
    | {
        type: typeof FixedMenuItemType.BUTTON;
        icon: HTMLElement;
        isVisible: boolean;
        isSelected: boolean;
        onClick: () => void;
      };
};

type TReturnEditorFixedMenuItem = {
  element: HTMLDivElement | HTMLInputElement | HTMLButtonElement;
  getText: (() => string) | undefined;
  setText: ((text: string) => void) | undefined;
  getTextPlaceholder: (() => string) | undefined;
  setTextPlaceholder: ((text: string) => void) | undefined;
  setButtonVisibility: ((isVisible: boolean) => void) | undefined;
  setButtonSelectedState: ((isSelected: boolean) => void) | undefined;
};

const EditorFixedMenuItem = (opts: TOptions): TReturnEditorFixedMenuItem => {
  if (opts.item.type === FixedMenuItemType.TEXT) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('editor-fixed-menu-item-text');

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

  if (opts.item.type === FixedMenuItemType.INPUT) {
    const input = document.createElement('input');
    input.classList.add('editor-fixed-menu-item-input');

    if (opts.item.text !== undefined) {
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

  if (opts.item.type === FixedMenuItemType.BUTTON) {
    const button = document.createElement('button');
    const iconDiv = document.createElement('div');

    button.classList.add(
      'editor-fixed-menu-item-button',
      opts.item.isVisible ? 'show' : 'hide',
    );

    if (opts.item.isSelected) {
      button.classList.add('editor-fixed-menu-item-button--selected');
    }

    iconDiv.classList.add('editor-fixed-menu-item-button__icon');

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
        button.classList.add('editor-fixed-menu-item-button--selected');
      } else {
        button.classList.remove('editor-fixed-menu-item-button--selected');
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
  TFixedMenuItemType,
  TOptions as TEditorFixedMenuItemOptions,
  TReturnEditorFixedMenuItem,
};

export { FixedMenuItemType, EditorFixedMenuItem };
