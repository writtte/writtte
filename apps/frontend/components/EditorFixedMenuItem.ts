import { buildError } from '../helpers/error/build';
import { setTestId } from '../utils/dom/testId';
import { AnimatedIcon, AnimatedIconName } from './AnimatedIcon';

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
        isVisible: boolean;
      }
    | {
        type: typeof FixedMenuItemType.INPUT;
        text: string | undefined;
        placeholderText: string | undefined;
        isVisible: boolean;
        onSubmit: () => void;
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
        setLoadingState: (isLoading: boolean) => void;
      }
    | undefined;
};

const EditorFixedMenuItem = (opts: TOptions): TReturnEditorFixedMenuItem => {
  if (opts.item.type === FixedMenuItemType.TEXT) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('editor-fixed-menu-item-text');
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

  if (opts.item.type === FixedMenuItemType.INPUT) {
    const input = document.createElement('input');
    input.classList.add('editor-fixed-menu-item-input');
    input.classList.add(opts.item.isVisible ? 'show' : 'hide');

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
      if (e.key === 'Enter' && opts.item.type === FixedMenuItemType.INPUT) {
        opts.item.onSubmit();
      }
    });

    return {
      element: input,
      textReturns: undefined,
      inputReturns: {
        get,
        getPlaceholder,
        set,
        setPlaceholder,
        setVisibleState,
      },
      buttonReturns: undefined,
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

    const setSelectedState = (isSelected: boolean): void => {
      if (isSelected) {
        button.classList.add('editor-fixed-menu-item-button--selected');
      } else {
        button.classList.remove('editor-fixed-menu-item-button--selected');
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

    const setLoadingState = (isLoading: boolean): void => {
      if (isLoading === true) {
        if (opts.item.type === FixedMenuItemType.BUTTON) {
          button.classList.add('loading');

          iconDiv.replaceChildren(
            AnimatedIcon(AnimatedIconName._18_CIRCLE_SPINNER),
          );
        }

        return;
      }

      if (opts.item.type === FixedMenuItemType.BUTTON) {
        button.classList.remove('loading');
        iconDiv.replaceChildren(opts.item.icon);
      }
    };

    return {
      element: button,
      textReturns: undefined,
      inputReturns: undefined,
      buttonReturns: {
        setSelectedState,
        setVisibleState,
        setLoadingState,
      },
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
