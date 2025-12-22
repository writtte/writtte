import { gidr } from '../utils/dom/node';
import { setTestId } from '../utils/dom/testId';
import { ActionButton } from './ActionButton';

type TOptions = {
  id: string;
  text: string;
  optionButton: {
    id: string;
    icon: HTMLElement;
    onClick: (e: PointerEvent) => void;
  };
  onClick: () => void;
};

type TReturnItemListDocument = {
  element: HTMLButtonElement;
  changeText: (text: string) => void;
};

const ItemListDocument = (opts: TOptions): TReturnItemListDocument => {
  const itemButton = document.createElement('button');
  const textDiv = document.createElement('div');

  itemButton.classList.add('item-list-document-item');
  textDiv.classList.add('item-list-document-item__text');

  const optionButtonElement = ActionButton({
    id: opts.optionButton.id,
    icon: opts.optionButton.icon,
    onClick: (e: PointerEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      opts.optionButton.onClick(e);
    },
  });

  itemButton.append(textDiv, optionButtonElement.element);

  textDiv.id = `${opts.id}-text`;
  textDiv.textContent = opts.text;

  itemButton.id = opts.id;

  setTestId(itemButton, opts.id);

  const changeText = (text: string): void => {
    textDiv.textContent = text;
  };

  itemButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    opts.onClick();
  });

  return {
    element: itemButton,
    changeText,
  };
};

const removeItemListDocument = (id: string): void => {
  const el = gidr(id);
  el.remove();
};

const renameItemListDocumentText = (id: string, newText: string): void => {
  const el = gidr(`${id}-text`);
  el.textContent = newText;
};

export type { TOptions as TItemListDocumentOptions, TReturnItemListDocument };

export { ItemListDocument, removeItemListDocument, renameItemListDocumentText };
