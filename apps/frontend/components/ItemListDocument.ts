import { gidr } from '../utils/dom/node';
import { setTestId } from '../utils/dom/testId';
import { ActionButton } from './ActionButton';
import { FlatIcon, FlatIconName } from './FlatIcon';

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
  getText: () => string;
  changeText: (text: string) => void;
};

const ItemListDocument = (opts: TOptions): TReturnItemListDocument => {
  const itemButton = document.createElement('button');
  const iconDiv = document.createElement('div');
  const textDiv = document.createElement('div');

  itemButton.classList.add('item-list-document-item');
  iconDiv.classList.add('item-list-document-item__icon');
  textDiv.classList.add('item-list-document-item__text');

  iconDiv.appendChild(FlatIcon(FlatIconName._18_DOCUMENT));

  const optionButtonElement = ActionButton({
    id: opts.optionButton.id,
    icon: opts.optionButton.icon,
    onClick: (e: PointerEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      opts.optionButton.onClick(e);
    },
  });

  itemButton.append(iconDiv, textDiv, optionButtonElement.element);

  textDiv.id = `${opts.id}-text`;
  textDiv.textContent = opts.text;

  itemButton.id = opts.id;

  setTestId(itemButton, opts.id);

  const changeText = (text: string): void => {
    textDiv.textContent = text;
  };

  const getText = (): string => textDiv.textContent || '';

  itemButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    opts.onClick();
  });

  return {
    element: itemButton,
    getText,
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
