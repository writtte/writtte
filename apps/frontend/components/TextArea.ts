import { setTestId } from '../utils/dom/testId';
import { StatusText, type TStatusTextOptions } from './StatusText';

const TextAreaSize = {
  MEDIUM: 'MEDIUM',
  SMALL: 'SMALL',
} as const;

type TTextAreaSize = (typeof TextAreaSize)[keyof typeof TextAreaSize];

type TOptions = {
  id: string;
  text: string | undefined;
  placeholderText: string | undefined;
  statusText: TStatusTextOptions | undefined;
  size: TTextAreaSize;
  rows: number | undefined;
  isFullWidth: boolean;
  isResizable: boolean;
  onChange: ((value: string) => void) | undefined;
  onSubmit: ((value: string) => void) | undefined;
};

type TReturnTextArea = {
  element: HTMLDivElement;
  setStatusText: (statusTextOpts: TStatusTextOptions | undefined) => void;
  getValue: () => string;
  setValue: (value: string | undefined) => void;
  setReadOnly: (shouldReadOnly: boolean) => void;
  clearStatusTextAfterDelay: (delay: number) => void;
};

const TextArea = (opts: TOptions): TReturnTextArea => {
  const wrapperDiv = document.createElement('div');
  const textAreaDiv = document.createElement('div');
  const textArea = document.createElement('textarea');
  const statusTextDiv = document.createElement('div');

  wrapperDiv.classList.add('text-area-wrapper');
  textAreaDiv.classList.add(
    'text-area',
    `text-area--${opts.size.toLowerCase()}`,
  );

  textArea.classList.add(
    'text-area__element',
    `text-area__element--${opts.size.toLowerCase()}`,
  );

  statusTextDiv.classList.add('text-area-wrapper__status-text', 'hide');

  textAreaDiv.append(textArea);
  wrapperDiv.append(textAreaDiv, statusTextDiv);

  textArea.id = opts.id;

  setTestId(textArea, opts.id);

  if (!opts.isResizable) {
    textArea.style.resize = 'none';
  }

  if (opts.rows) {
    textArea.rows = opts.rows;
  }

  if (opts.text) {
    textArea.value = opts.text;
  }

  if (opts.placeholderText) {
    textArea.placeholder = opts.placeholderText;
  }

  if (opts.statusText) {
    statusTextDiv.appendChild(StatusText(opts.statusText).element);
  }

  if (opts.isFullWidth) {
    wrapperDiv.classList.add('text-area-wrapper--full-width');
  }

  textArea.addEventListener('input', (e) =>
    opts.onChange?.((e.target as HTMLTextAreaElement).value),
  );

  textArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey && opts.onSubmit) {
      e.preventDefault();
      opts.onSubmit((e.target as HTMLTextAreaElement).value);
    }
  });

  textArea.addEventListener('focus', () => {
    textAreaDiv.classList.add('active');
  });

  textAreaDiv.addEventListener('click', () => {
    textArea.focus();
  });

  wrapperDiv.addEventListener(
    'focusin',
    (e) => {
      textAreaDiv.classList.add('active');

      if (e.target !== textArea) {
        textArea.focus();
      }
    },
    true,
  );

  wrapperDiv.addEventListener(
    'focusout',
    (e) => {
      if (!wrapperDiv.contains(e.relatedTarget as Node)) {
        textAreaDiv.classList.remove('active');
      }
    },
    true,
  );

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

  const getValue = (): string => textArea.value;

  const setValue = (value: string | undefined): void => {
    if (value === undefined) {
      textArea.value = '';
      return;
    }

    textArea.value = value;
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

  const setReadOnly = (shouldReadOnly: boolean): void => {
    textArea.readOnly = shouldReadOnly;
  };

  return {
    element: wrapperDiv,
    setStatusText,
    getValue,
    setValue,
    setReadOnly,
    clearStatusTextAfterDelay,
  };
};

export type { TTextAreaSize, TOptions as TTextAreaOptions, TReturnTextArea };

export { TextAreaSize, TextArea };
