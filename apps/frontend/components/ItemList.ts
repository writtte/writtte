import type {
  TItemListDocumentOptions,
  TReturnItemListDocument,
} from './ItemListDocument';
import { ItemListDocument, removeItemListDocument } from './ItemListDocument';

type TOptions = {
  documents: TItemListDocumentOptions[];
};

type TReturnItemList = {
  element: HTMLDivElement;
  items: Map<string, TReturnItemListDocument>;
  getAllDocumentIDs: () => string[];
  addItemToList: (item: TItemListDocumentOptions) => void;
  removeItemFromList: (id: string) => void;
  setNoItems: () => void;
  sortItemsAlphabetically: () => void;
};

const itemSortCollector: Intl.Collator = new Intl.Collator(undefined, {
  sensitivity: 'base',
  numeric: true,
});

const ItemList = (): TReturnItemList => {
  const listDiv = document.createElement('div');
  const containerDiv = document.createElement('div');

  listDiv.classList.add('item-list');
  containerDiv.classList.add('item-list__container');

  listDiv.appendChild(containerDiv);

  const documentItems: Map<string, TReturnItemListDocument> = new Map();
  const documentIds: Map<string, string> = new Map();

  const getAllDocumentIDs = (): string[] => Array.from(documentIds.keys());

  const addItemToList = (item: TItemListDocumentOptions): void => {
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
  };

  const setNoItems = (): void => {
    listDiv.classList.add('hide');
  };

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

  return {
    element: listDiv,
    items: documentItems,
    getAllDocumentIDs,
    addItemToList,
    removeItemFromList,
    setNoItems,
    sortItemsAlphabetically,
  };
};

export type { TOptions as TItemListOptions, TReturnItemList };

export { itemSortCollector, ItemList };
