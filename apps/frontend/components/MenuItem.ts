import { setTestId } from '../utils/dom/testId';

type TOptions = {
  id: string;
  text: string;
  leftIcon: HTMLElement | undefined;
  rightIcon: HTMLElement | undefined;
  isLeftIconVisible: boolean;
  onClick: (e: PointerEvent) => void;
};

type TReturnMenuItem = {
  element: HTMLButtonElement;
  changeText: (text: string) => void;
  changeLeftIcon: (icon: HTMLElement) => void;
  changeRightIcon: (icon: HTMLElement) => void;
};

const MenuItem = (opts: TOptions): TReturnMenuItem => {
  const button = document.createElement('button');
  const leftIconSpan = document.createElement('span');
  const textSpan = document.createElement('span');
  const rightIconSpan = document.createElement('span');

  button.classList.add('menu-item');
  leftIconSpan.classList.add('menu-item__left-icon');
  textSpan.classList.add('menu-item__text');
  rightIconSpan.classList.add('menu-item__right-icon');

  textSpan.textContent = opts.text;
  button.append(leftIconSpan, textSpan, rightIconSpan);

  button.id = opts.id;

  setTestId(button, opts.id);

  if (opts.leftIcon && opts.isLeftIconVisible) {
    leftIconSpan.appendChild(opts.leftIcon);
  } else if (!opts.isLeftIconVisible) {
    leftIconSpan.remove();
  }

  if (opts.rightIcon) {
    rightIconSpan.appendChild(opts.rightIcon);
  } else {
    rightIconSpan.remove();
  }

  button.addEventListener('click', (e: PointerEvent) => {
    e.preventDefault();
    opts.onClick(e);
  });

  const changeText = (text: string): void => {
    textSpan.textContent = text;
  };

  const changeLeftIcon = (icon: HTMLElement): void => {
    leftIconSpan.replaceChildren(icon);

    if (!leftIconSpan.parentElement) {
      button.insertBefore(leftIconSpan, textSpan);
    }
  };

  const changeRightIcon = (icon: HTMLElement): void => {
    rightIconSpan.replaceChildren(icon);

    if (!rightIconSpan.parentElement) {
      button.appendChild(rightIconSpan);
    }
  };

  return {
    element: button,
    changeText,
    changeLeftIcon,
    changeRightIcon,
  };
};

export type { TOptions as TMenuItemOptions, TReturnMenuItem };

export { MenuItem };
