import { setTestId } from '../utils/dom/testId';
import { FlatIcon, FlatIconName } from './FlatIcon';

type TOptions = {
  id: string;
  onClick: () => void;
};

type TReturnCloseButton = {
  element: HTMLButtonElement;
};

const CloseButton = (opts: TOptions): TReturnCloseButton => {
  const button = document.createElement('button');
  button.classList.add('close-button');
  button.appendChild(FlatIcon(FlatIconName._18_CROSS));

  setTestId(button, opts.id);

  button.addEventListener('click', (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    opts.onClick();
  });

  return {
    element: button,
  };
};

export type { TOptions as TCloseButtonOptions, TReturnCloseButton };

export { CloseButton };
