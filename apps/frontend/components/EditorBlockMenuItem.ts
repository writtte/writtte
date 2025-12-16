import { setTestId } from '../utils/dom/testId';

type TOptions = {
  id: string;
  text: string;
  icon: HTMLElement;
  key: string | undefined;
  isSelected: boolean;
  onClick: () => void;
};

const EditorBlockMenuItem = (opts: TOptions): HTMLButtonElement => {
  const button = document.createElement('button');
  const iconSpan = document.createElement('span');
  const textSpan = document.createElement('span');
  const keySpan = document.createElement('span');

  button.classList.add('editor-block-menu-item');
  if (opts.isSelected) {
    button.classList.add('editor-block-menu-item--selected');
  }

  iconSpan.classList.add('editor-block-menu-item__icon');
  textSpan.classList.add('editor-block-menu-item__text');
  keySpan.classList.add('editor-block-menu-item__key');

  textSpan.textContent = opts.text;

  iconSpan.appendChild(opts.icon);
  button.append(iconSpan, textSpan, keySpan);

  if (opts.key) {
    keySpan.textContent = opts.key;
  } else {
    keySpan.remove();
  }

  setTestId(button, opts.id);

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    opts.onClick();
  });

  return button;
};

export type { TOptions as TEditorBlockMenuItemOptions };

export { EditorBlockMenuItem };
