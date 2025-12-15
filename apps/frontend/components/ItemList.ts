import type {
  TItemListDocumentOptions,
  TReturnItemListDocument,
} from './ItemListDocument';
import type { TItemListPlaceholderOptions } from './ItemListPlaceholder';
import { ItemListDocument, removeItemListDocument } from './ItemListDocument';
import { ItemListPlaceholder } from './ItemListPlaceholder';

type TOptions = {
  documents: TItemListDocumentOptions[];
  placeholder: TItemListPlaceholderOptions;
};

type TReturnItemList = {
  element: HTMLDivElement;
  items: Map<string, TReturnItemListDocument>;
  setPlaceholder: (placeholder: TItemListPlaceholderOptions) => void;
  removePlaceholder: () => void;
  getAllDocumentIDs: () => string[];
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

  const documentItems: Map<string, TReturnItemListDocument> = new Map();
  const documentIds: Map<string, string> = new Map();

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
    for (let i = 0; i < opts.documents.length; i++) {
      const item = ItemListDocument(opts.documents[i]);
      containerDiv.appendChild(item.element);

      documentIds.set(opts.documents[i].id, opts.documents[i].id);
      documentItems.set(opts.documents[i].id, item);
    }
  } else {
    setPlaceholder(opts.placeholder);
  }

  const getAllDocumentIDs = (): string[] => Array.from(documentIds.keys());

  const addItemToList = (item: TItemListDocumentOptions): void => {
    if (containerDiv.children.length === 0 || placeholderElement) {
      removePlaceholder();
    }

    const newItem = ItemListDocument(item);
    documentIds.set(item.id, item.id);

    documentItems.set(item.id, newItem);

    if (containerDiv.firstChild) {
      containerDiv.insertBefore(newItem.element, containerDiv.firstChild);
    } else {
      containerDiv.appendChild(newItem.element);
    }
  };

  const removeItemFromList = (id: string): void => {
    removeItemListDocument(id);

    documentIds.delete(id);
    documentItems.delete(id);

    if (containerDiv.children.length === 0) {
      setPlaceholder(opts.placeholder);
    }
  };

  return {
    element: listDiv,
    items: documentItems,
    setPlaceholder,
    removePlaceholder,
    getAllDocumentIDs,
    addItemToList,
    removeItemFromList,
  };
};

export type { TOptions as TItemListOptions, TReturnItemList };

export { ItemList };
