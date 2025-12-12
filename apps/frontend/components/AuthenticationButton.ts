import { setTestId } from '../utils/dom/testId';
import { AnimatedIcon, AnimatedIconName } from './AnimatedIcon';
import { StatusText, type TStatusTextOptions } from './StatusText';

type TOptions = {
  id: string;
  text: string;
  loadingText: string | undefined;
  leftIcon: HTMLElement | undefined;
  rightIcon: HTMLElement | undefined;
  statusText: TStatusTextOptions | undefined;
  onClick: () => void;
};

type TReturnAuthenticationButton = {
  element: HTMLDivElement;
  setStatusText: (statusTextOpts: TStatusTextOptions | undefined) => void;
  setLoadingState: (isLoading: boolean) => void;
};

const AuthenticationButton = (opts: TOptions): TReturnAuthenticationButton => {
  const containerDiv = document.createElement('div');
  const statusTextDiv = document.createElement('div');
  const button = document.createElement('button');
  const loadingIconSpan = document.createElement('span');
  const leftIconSpan = document.createElement('span');
  const rightIconSpan = document.createElement('span');
  const textSpan = document.createElement('span');

  containerDiv.classList.add('authentication-button');
  statusTextDiv.classList.add('authentication-button__status-text', 'hide');
  button.classList.add('authentication-button__button');
  loadingIconSpan.classList.add('authentication-button__icon', 'hide');
  leftIconSpan.classList.add('authentication-button__icon');
  rightIconSpan.classList.add('authentication-button__icon');
  textSpan.classList.add('authentication-button__text');

  button.append(loadingIconSpan, leftIconSpan, textSpan, rightIconSpan);
  containerDiv.append(statusTextDiv, button);

  button.setAttribute('type', 'button');
  setTestId(button, opts.id);

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

  textSpan.textContent = opts.text;

  button.addEventListener('click', (e: PointerEvent) => {
    e.preventDefault();
    opts.onClick();
  });

  const setStatusText = (
    statusTextOpts: TStatusTextOptions | undefined,
  ): void => {
    if (statusTextOpts === undefined) {
      statusTextDiv.classList.add('hide');
      statusTextDiv.classList.remove('show');

      statusTextDiv.replaceChildren();
      return;
    }

    statusTextDiv.replaceChildren(StatusText(statusTextOpts).element);

    statusTextDiv.classList.add('show');
    statusTextDiv.classList.remove('hide');
  };

  const setLoadingState = (isLoading: boolean): void => {
    if (isLoading === true) {
      const loadingIconElement = AnimatedIcon(
        AnimatedIconName._18_CIRCLE_SPINNER,
      );

      loadingIconSpan.classList.add('show');
      loadingIconSpan.classList.remove('hide');

      button.setAttribute('disabled', 'true');

      if (opts.loadingText !== undefined) {
        textSpan.textContent = opts.loadingText;
      }

      loadingIconSpan.replaceChildren(loadingIconElement);

      button.classList.add('authentication-button__button--loading');
      return;
    }

    loadingIconSpan.classList.add('hide');
    loadingIconSpan.classList.add('show');

    button.removeAttribute('disabled');
    button.classList.remove('authentication-button__button--loading');

    loadingIconSpan.replaceChildren();

    textSpan.textContent = opts.text;
  };

  return {
    element: containerDiv,
    setStatusText,
    setLoadingState,
  };
};

export type {
  TOptions as TAuthenticationButtonOptions,
  TReturnAuthenticationButton,
};

export { AuthenticationButton };
