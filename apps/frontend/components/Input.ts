import { setTestId } from '../utils/dom/testId';
import { StatusText, type TStatusTextOptions } from './StatusText';

const InputType = {
  TEXT: 'TEXT',
  PASSWORD: 'PASSWORD',
  EMAIL: 'EMAIL',
  NUMBER: 'NUMBER',
  TEL: 'TEL',
  URL: 'URL',
} as const;

const InputSize = {
  MEDIUM: 'MEDIUM',
  SMALL: 'SMALL',
} as const;

type TInputType = (typeof InputType)[keyof typeof InputType];

type TInputSize = (typeof InputSize)[keyof typeof InputSize];

type TOptions = {
  id: string;
  text: string | undefined;
  placeholderText: string | undefined;
  inlineButton:
    | {
        id: string;
        icon: HTMLElement;
        onClick: () => void;
      }
    | undefined;
  statusText: TStatusTextOptions | undefined;
  type: TInputType;
  size: TInputSize;
  isFullWidth: boolean;
  onChange: ((value: string) => void) | undefined;
  onSubmit: ((value: string) => void) | undefined;
};

type TReturnInput = {
  element: HTMLDivElement;
  changeInputType: (type: TInputType) => void;
  setStatusText: (statusTextOpts: TStatusTextOptions | undefined) => void;
  getValue: () => string;
  setValue: (value: string | undefined) => void;
  getCurrentInputType: () => TInputType;
  changeInlineButtonIcon: (newIcon: HTMLElement) => void;
  clearStatusTextAfterDelay: (delay: number) => void;
};

const Input = (opts: TOptions): TReturnInput => {
  const wrapperDiv = document.createElement('div');
  const inputDiv = document.createElement('div');
  const input = document.createElement('input');
  const inlineButton = document.createElement('button');
  const statusTextDiv = document.createElement('div');

  let hasInlineButton = false;

  wrapperDiv.classList.add('input-wrapper');
  inputDiv.classList.add('input', `input--${opts.size.toLowerCase()}`);

  input.classList.add(
    'input__element',
    `input__element--${opts.size.toLowerCase()}`,
  );

  inlineButton.classList.add('input__inline-button');
  statusTextDiv.classList.add('input-wrapper__status-text', 'hide');

  inputDiv.append(input, inlineButton);
  wrapperDiv.append(inputDiv, statusTextDiv);

  input.id = opts.id;
  input.type = opts.type.toLowerCase();

  setTestId(input, opts.id);

  if (opts.text) {
    input.value = opts.text;
  }

  if (opts.placeholderText) {
    input.placeholder = opts.placeholderText;
  }

  if (opts.inlineButton) {
    hasInlineButton = true;
    setTestId(inlineButton, opts.inlineButton.id);
    inlineButton.appendChild(opts.inlineButton.icon);

    inlineButton.tabIndex = 0;
    inlineButton.addEventListener('click', opts.inlineButton.onClick);
  } else {
    inlineButton.remove();
  }

  if (opts.statusText) {
    statusTextDiv.appendChild(StatusText(opts.statusText).element);
  }

  if (opts.isFullWidth) {
    wrapperDiv.classList.add('input-wrapper--full-width');
  }

  input.addEventListener('input', (e) =>
    opts.onChange?.((e.target as HTMLInputElement).value),
  );

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && opts.onSubmit) {
      e.preventDefault();
      opts.onSubmit((e.target as HTMLInputElement).value);
    }
  });

  input.addEventListener('focus', () => {
    inputDiv.classList.add('active');
  });

  inputDiv.addEventListener('click', (e) => {
    if (
      hasInlineButton &&
      (e.target === inlineButton || inlineButton.contains(e.target as Node))
    ) {
      return;
    }

    input.focus();
  });

  wrapperDiv.addEventListener(
    'focusin',
    (e) => {
      inputDiv.classList.add('active');

      if (
        !(
          hasInlineButton &&
          (e.target === inlineButton || inlineButton.contains(e.target as Node))
        )
      ) {
        if (e.target !== input) {
          input.focus();
        }
      }
    },
    true,
  );

  wrapperDiv.addEventListener(
    'focusout',
    (e) => {
      if (!wrapperDiv.contains(e.relatedTarget as Node)) {
        inputDiv.classList.remove('active');
      }
    },
    true,
  );

  const changeInputType = (type: TInputType): void => {
    input.type = type.toLowerCase();
  };

  const setStatusText = (
    statusTextOpts: TStatusTextOptions | undefined,
  ): void => {
    if (statusTextOpts === undefined) {
      statusTextDiv.classList.add('hide');
      statusTextDiv.classList.remove('show');
      return;
    }

    statusTextDiv.classList.add('show');
    statusTextDiv.classList.remove('hide');

    statusTextDiv.replaceChildren(StatusText(statusTextOpts).element);
  };

  const getValue = (): string => input.value;

  const setValue = (value: string | undefined): void => {
    if (value === undefined) {
      input.value = '';
      return;
    }

    input.value = value;
  };

  const getCurrentInputType = (): TInputType =>
    input.type.toUpperCase() as TInputType;

  const changeInlineButtonIcon = (newIcon: HTMLElement): void => {
    if (opts.inlineButton) {
      inlineButton.replaceChildren(newIcon);
    }
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

  return {
    element: wrapperDiv,
    changeInputType,
    setStatusText,
    getValue,
    setValue,
    getCurrentInputType,
    changeInlineButtonIcon,
    clearStatusTextAfterDelay,
  };
};

export type { TInputType, TInputSize, TOptions as TInputOptions, TReturnInput };

export { InputType, InputSize, Input };
