import type {
  TItemListDocumentOptions,
  TReturnItemListDocument,
} from './ItemListDocument';
import { ItemListDocument, removeItemListDocument } from './ItemListDocument';

type TSortOrder = 'asc' | 'desc';

type TSortType = 'alphabetical' | 'lastOpened' | 'created' | 'lastUpdated';

type TSortOptions = {
  type: TSortType;
  order: TSortOrder;
};

type TOptions = {
  emptyState: HTMLElement;
  documents: TItemListDocumentOptions[];
};

type TItemWithMetadata = {
  item: TReturnItemListDocument;
  metadata:
    | {
        createdTime: string;
        lastUpdatedTime: string;
        lastOpenedTime: string;
      }
    | undefined;
};

type TReturnItemList = {
  element: HTMLDivElement;
  items: Map<string, TReturnItemListDocument>;
  getAllItemIDs: () => string[];
  addItemToList: (item: TItemListDocumentOptions) => void;
  removeItemFromList: (id: string) => void;
  setNoItems: () => void;
  sortItems: (options: TSortOptions) => void;
  sortItemsAlphabetically: (order?: TSortOrder) => void;
  sortItemsByLastOpened: (order?: TSortOrder) => void;
  sortItemsByCreated: (order?: TSortOrder) => void;
  sortItemsByLastUpdated: (order?: TSortOrder) => void;
};

const itemSortCollector: Intl.Collator = new Intl.Collator(undefined, {
  sensitivity: 'base',
  numeric: true,
});

const ItemList = (opts?: Partial<TOptions>): TReturnItemList => {
  const listDiv = document.createElement('div');
  const containerDiv = document.createElement('div');

  const emptyStateElement: HTMLElement | null = opts?.emptyState || null;

  listDiv.classList.add('item-list');
  containerDiv.classList.add('item-list__container');

  listDiv.appendChild(containerDiv);

  if (emptyStateElement) {
    emptyStateElement.style.display = 'none';
    listDiv.appendChild(emptyStateElement);
  }

  const documentItems: Map<string, TReturnItemListDocument> = new Map();
  const documentMetadata: Map<string, TItemWithMetadata['metadata']> =
    new Map();

  const documentIds: Map<string, string> = new Map();

  const getAllItemIDs = (): string[] => Array.from(documentIds.keys());

  const addItemToList = (item: TItemListDocumentOptions): void => {
    const newItem = ItemListDocument(item);
    documentIds.set(item.id, item.id);
    documentItems.set(item.id, newItem);

    if (item.metadata) {
      documentMetadata.set(item.id, item.metadata);
    }

    containerDiv.appendChild(newItem.element);

    // If this is the first item, make sure to hide the empty state
    if (containerDiv.children.length === 1 && emptyStateElement) {
      emptyStateElement.style.display = 'none';
      containerDiv.classList.remove('hide');
    }

    updateGridLayout();
  };

  const removeItemFromList = (id: string): void => {
    removeItemListDocument(id);

    documentIds.delete(id);
    documentItems.delete(id);
    documentMetadata.delete(id);

    updateGridLayout();
  };

  const setNoItems = (): void => {
    containerDiv.classList.add('hide');
    if (emptyStateElement) {
      emptyStateElement.style.display = 'flex';
    }

    updateGridLayout();
  };

  const updateGridLayout = (): void => {
    const itemCount = containerDiv.children.length;
    containerDiv.classList.remove('single-item', 'two-items');

    if (itemCount === 0 && emptyStateElement) {
      containerDiv.classList.add('hide');
      emptyStateElement.style.display = 'flex';
    } else {
      containerDiv.classList.remove('hide');
      if (emptyStateElement) {
        emptyStateElement.style.display = 'none';
      }

      if (itemCount === 1) {
        containerDiv.classList.add('single-item');
      } else if (itemCount === 2) {
        containerDiv.classList.add('two-items');
      }
    }

    // For 3 or more items, use the default grid
    // layout (no additional class needed)
  };

  const compareStringsForSort = (a: string, b: string): number =>
    itemSortCollector.compare(a, b);

  const compareDatesForSort = (a: string, b: string): number => {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    return dateA - dateB;
  };

  const reorderContainer = (sortedIds: string[]): void => {
    while (containerDiv.firstChild) {
      containerDiv.removeChild(containerDiv.firstChild);
    }

    for (let i = 0; i < sortedIds.length; i++) {
      const item = documentItems.get(sortedIds[i]);
      if (item) {
        containerDiv.appendChild(item.element);
      }
    }

    updateGridLayout();
  };

  const extractSortedIds = (itemsArray: Array<[string, string]>): string[] => {
    const ids: string[] = [];
    for (let i = 0; i < itemsArray.length; i++) {
      ids.push(itemsArray[i][0]);
    }

    return ids;
  };

  const sortItemsAlphabetically = (order: TSortOrder = 'asc'): void => {
    const itemsArray: Array<[string, string]> = [];
    const entries = Array.from(documentItems.entries());

    for (let i = 0; i < entries.length; i++) {
      const [id, item] = entries[i];
      itemsArray.push([id, item.getText()]);
    }

    itemsArray.sort((a, b) => {
      const comparison = compareStringsForSort(a[1], b[1]);
      return order === 'asc' ? comparison : -comparison;
    });

    reorderContainer(extractSortedIds(itemsArray));
  };

  const sortItemsByLastOpened = (order: TSortOrder = 'desc'): void => {
    const itemsArray: Array<[string, string]> = [];
    const entries = Array.from(documentItems.entries());
    const now = new Date().toISOString();

    for (let i = 0; i < entries.length; i++) {
      const [id, _] = entries[i];
      const metadata = documentMetadata.get(id);
      const lastOpenedTime = metadata?.lastOpenedTime || now;
      itemsArray.push([id, lastOpenedTime]);
    }

    itemsArray.sort((a, b) => {
      const comparison = compareDatesForSort(a[1], b[1]);
      return order === 'asc' ? comparison : -comparison;
    });

    reorderContainer(extractSortedIds(itemsArray));
  };

  const sortItemsByCreated = (order: TSortOrder = 'desc'): void => {
    const itemsArray: Array<[string, string]> = [];
    const entries = Array.from(documentItems.entries());
    const now = new Date().toISOString();

    for (let i = 0; i < entries.length; i++) {
      const [id, _] = entries[i];
      const metadata = documentMetadata.get(id);
      const createdTime = metadata?.createdTime || now;
      itemsArray.push([id, createdTime]);
    }

    itemsArray.sort((a, b) => {
      const comparison = compareDatesForSort(a[1], b[1]);
      return order === 'asc' ? comparison : -comparison;
    });

    reorderContainer(extractSortedIds(itemsArray));
  };

  const sortItemsByLastUpdated = (order: TSortOrder = 'desc'): void => {
    const itemsArray: Array<[string, string]> = [];
    const entries = Array.from(documentItems.entries());
    const now = new Date().toISOString();

    for (let i = 0; i < entries.length; i++) {
      const [id, _] = entries[i];
      const metadata = documentMetadata.get(id);
      const lastUpdatedTime = metadata?.lastUpdatedTime || now;
      itemsArray.push([id, lastUpdatedTime]);
    }

    itemsArray.sort((a, b) => {
      const comparison = compareDatesForSort(a[1], b[1]);
      return order === 'asc' ? comparison : -comparison;
    });

    reorderContainer(extractSortedIds(itemsArray));
  };

  const sortItems = (options: TSortOptions): void => {
    switch (options.type) {
      case 'alphabetical':
        sortItemsAlphabetically(options.order);
        break;

      case 'lastOpened':
        sortItemsByLastOpened(options.order);
        break;

      case 'created':
        sortItemsByCreated(options.order);
        break;

      case 'lastUpdated':
        sortItemsByLastUpdated(options.order);
        break;
    }
  };

  return {
    element: listDiv,
    items: documentItems,
    getAllItemIDs,
    addItemToList,
    removeItemFromList,
    setNoItems,
    sortItems,
    sortItemsAlphabetically,
    sortItemsByLastOpened,
    sortItemsByCreated,
    sortItemsByLastUpdated,
  };
};

export type {
  TOptions as TItemListOptions,
  TReturnItemList,
  TSortOptions,
  TSortType,
  TSortOrder,
};

export { itemSortCollector, ItemList };
