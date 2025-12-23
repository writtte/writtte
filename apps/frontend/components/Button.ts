import { setTestId } from '../utils/dom/testId';
import { AnimatedIcon, AnimatedIconName } from './AnimatedIcon';

const ButtonAction = {
  BUTTON: 'BUTTON',
  SUBMIT: 'SUBMIT',
  RESET: 'RESET',
} as const;

const ButtonColor = {
  PRIMARY: 'PRIMARY',
  DANGER: 'DANGER',
  NEUTRAL: 'NEUTRAL',
} as const;

const ButtonSize = {
  MEDIUM: 'MEDIUM',
  SMALL: 'SMALL',
} as const;

type TButtonAction = (typeof ButtonAction)[keyof typeof ButtonAction];

type TButtonColor = (typeof ButtonColor)[keyof typeof ButtonColor];

type TButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

type TOptions = {
  id: string;
  text: string;
  loadingText: string | undefined;
  leftIcon: HTMLElement | undefined;
  rightIcon: HTMLElement | undefined;
  action: TButtonAction;
  color: TButtonColor;
  size: TButtonSize;
  isFullWidth: boolean;
  onClick: () => void;
};

type TReturnButton = {
  element: HTMLButtonElement;
  setLoading: (isLoading: boolean) => void;
};

const Button = (opts: TOptions): TReturnButton => {
  const button = document.createElement('button');
  const loadingIconSpan = document.createElement('span');
  const leftIconSpan = document.createElement('span');
  const textSpan = document.createElement('span');
  const rightIconSpan = document.createElement('span');

  button.classList.add(
    'button',
    `button--${opts.color.toLowerCase()}`,
    `button--${opts.size.toLowerCase()}`,
  );

  if (opts.isFullWidth === true) {
    button.classList.add('button--full-width');
  }

  loadingIconSpan.classList.add('button__loading-icon', 'hide');
  leftIconSpan.classList.add('button__icon');
  textSpan.classList.add('button__text');
  rightIconSpan.classList.add('button__icon');

  textSpan.textContent = opts.text;
  button.append(loadingIconSpan, leftIconSpan, textSpan, rightIconSpan);

  button.id = opts.id;
  button.setAttribute('type', opts.action.toLowerCase());

  setTestId(button, button.id);

  if (opts.leftIcon) {
    leftIconSpan.appendChild(opts.leftIcon);
  } else {
    leftIconSpan.remove();
  }

  if (opts.rightIcon) {
    rightIconSpan.appendChild(opts.rightIcon);
  } else {
    rightIconSpan.remove();
  }

  button.addEventListener('click', () => {
    opts.onClick();
  });

  const setLoading = (isLoading: boolean): void => {
    if (isLoading) {
      loadingIconSpan.classList.add('show');
      loadingIconSpan.classList.remove('hide');

      if (opts.leftIcon && leftIconSpan.parentNode === button) {
        leftIconSpan.classList.add('hide');
      }

      if (opts.rightIcon && rightIconSpan.parentNode === button) {
        rightIconSpan.classList.add('hide');
      }

      if (opts.loadingText) {
        textSpan.textContent = opts.loadingText;
        loadingIconSpan.replaceChildren(
          AnimatedIcon(AnimatedIconName._18_CIRCLE_SPINNER),
        );
      }

      button.classList.add('button--loading');
    } else {
      loadingIconSpan.innerHTML = '';
      loadingIconSpan.classList.add('hide');
      loadingIconSpan.classList.remove('show');

      if (opts.leftIcon && leftIconSpan.parentNode === button) {
        leftIconSpan.classList.remove('hide');
      }

      if (opts.rightIcon && rightIconSpan.parentNode === button) {
        rightIconSpan.classList.remove('hide');
      }

      button.classList.remove('button--loading');

      if (opts.text) {
        textSpan.textContent = opts.text;
      }
    }
  };

  return {
    element: button,
    setLoading,
  };
};

export type {
  TButtonAction,
  TButtonColor,
  TButtonSize,
  TOptions as TButtonOptions,
  TReturnButton,
};

export { ButtonAction, ButtonColor, ButtonSize, Button };
