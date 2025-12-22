import { setTestId } from '../utils/dom/testId';

type TOptions = {
  id: string;
  icon: HTMLElement;
  onClick: (e: PointerEvent) => void;
};

type TReturnActionButton = {
  element: HTMLButtonElement;
  changeIcon: (icon: HTMLElement) => void;
};

const ActionButton = (opts: TOptions): TReturnActionButton => {
  const button = document.createElement('button');
  const iconDiv = document.createElement('div');

  button.classList.add('action-button');
  iconDiv.classList.add('action-button__icon');

  iconDiv.appendChild(opts.icon);
  button.appendChild(iconDiv);

  button.id = opts.id;

  setTestId(button, opts.id);

  button.addEventListener('click', (e: PointerEvent) => {
    e.preventDefault();
    opts.onClick(e);
  });

  const changeIcon = (icon: HTMLElement): void => {
    iconDiv.replaceChildren(icon);
  };

  return {
    element: button,
    changeIcon,
  };
};

export type { TOptions as TActionButtonOptions, TReturnActionButton };

export { ActionButton };
