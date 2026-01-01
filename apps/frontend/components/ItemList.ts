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
  sortItemsAlphabetically: () => void;
};

const itemSortCollector: Intl.Collator = new Intl.Collator(undefined, {
  sensitivity: 'base',
  numeric: true,
});

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
    const sortedDocuments = [...opts.documents].sort((a, b) =>
      itemSortCollector.compare(a.text, b.text),
    );

    for (let i = 0; i < sortedDocuments.length; i++) {
      const item = ItemListDocument(sortedDocuments[i]);
      containerDiv.appendChild(item.element);

      documentIds.set(sortedDocuments[i].id, sortedDocuments[i].id);
      documentItems.set(sortedDocuments[i].id, item);
    }
  } else {
    setPlaceholder(opts.placeholder);
  }

  const getAllDocumentIDs = (): string[] => Array.from(documentIds.keys());

  const compareStringsForSort = (a: string, b: string): number =>
    itemSortCollector.compare(a, b);

  const sortItemsAlphabetically = (): void => {
    const itemsArray: Array<[string, HTMLElement, string]> = [];

    documentItems.forEach((item, id) => {
      itemsArray.push([id, item.element, item.getText()]);
    });

    itemsArray.sort((a, b) => compareStringsForSort(a[2], b[2]));

    while (containerDiv.firstChild) {
      containerDiv.removeChild(containerDiv.firstChild);
    }

    for (const [, element] of itemsArray) {
      containerDiv.appendChild(element);
    }
  };

  const addItemToList = (item: TItemListDocumentOptions): void => {
    if (containerDiv.children.length === 0 || placeholderElement) {
      removePlaceholder();
    }

    const newItem = ItemListDocument(item);
    documentIds.set(item.id, item.id);
    documentItems.set(item.id, newItem);

    containerDiv.appendChild(newItem.element);
    sortItemsAlphabetically();
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
    sortItemsAlphabetically,
  };
};

export type { TOptions as TItemListOptions, TReturnItemList };

export { itemSortCollector, ItemList };
