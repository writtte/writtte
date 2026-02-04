import { setTestId } from '../utils/dom/testId';

const ToastType = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const;

type TToastType = (typeof ToastType)[keyof typeof ToastType];

type TOptions = {
  id: string;
  text: string;
  type: TToastType;
};

type TReturnToast = {
  element: HTMLDivElement;
};

const Toast = (opts: TOptions): TReturnToast => {
  const toastDiv = document.createElement('div');
  toastDiv.classList.add('toast', `toast--${opts.type.toLowerCase()}`);

  toastDiv.id = opts.id;
  setTestId(toastDiv, opts.id);

  toastDiv.textContent = opts.text;

  return {
    element: toastDiv,
  };
};

export type { TOptions as TToastOptions, TReturnToast };

export { ToastType, Toast };
