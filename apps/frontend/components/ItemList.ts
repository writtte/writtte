import type { TItemListDocumentOptions } from './ItemListDocument';
import type { TItemListPlaceholderOptions } from './ItemListPlaceholder';
import { ItemListDocument, removeItemListDocument } from './ItemListDocument';
import { ItemListPlaceholder } from './ItemListPlaceholder';

type TOptions = {
  documents: TItemListDocumentOptions[];
  placeholder: TItemListPlaceholderOptions;
};

type TReturnItemList = {
  element: HTMLDivElement;
  setPlaceholder: (placeholder: TItemListPlaceholderOptions) => void;
  removePlaceholder: () => void;
  addItemToList: (item: TItemListDocumentOptions) => void;
  removeItemFromList: (id: string) => void;
};

const ItemList = (opts: TOptions): TReturnItemList => {
  const listDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  let placeholderElement: HTMLDivElement | null = null;

  listDiv.classList.add('item-list');
  containerDiv.classList.add('item-list__container');

  listDiv.appendChild(containerDiv);

  const removePlaceholder = (): void => {
    if (placeholderElement && containerDiv.contains(placeholderElement)) {
      containerDiv.removeChild(placeholderElement);
      placeholderElement = null;
    }
  };

  const setPlaceholder = (placeholder: TItemListPlaceholderOptions): void => {
    removePlaceholder();

    const placeholderComponent = ItemListPlaceholder(placeholder);
    placeholderElement = placeholderComponent.element;
    containerDiv.appendChild(placeholderElement);
  };

  if (opts.documents && opts.documents.length > 0) {
    opts.documents.forEach((doc) => {
      const item = ItemListDocument(doc);
      containerDiv.appendChild(item.element);
    });
  } else {
    setPlaceholder(opts.placeholder);
  }

  const addItemToList = (item: TItemListDocumentOptions): void => {
    if (containerDiv.children.length === 0 || placeholderElement) {
      removePlaceholder();
    }

    const newItem = ItemListDocument(item);

    if (containerDiv.firstChild) {
      containerDiv.insertBefore(newItem.element, containerDiv.firstChild);
    } else {
      containerDiv.appendChild(newItem.element);
    }
  };

  const removeItemFromList = (id: string): void => {
    removeItemListDocument(id);

    if (containerDiv.children.length === 0) {
      setPlaceholder(opts.placeholder);
    }
  };

  return {
    element: listDiv,
    setPlaceholder,
    removePlaceholder,
    addItemToList,
    removeItemFromList,
  };
};

export type { TOptions as TItemListOptions, TReturnItemList };

export { ItemList };
