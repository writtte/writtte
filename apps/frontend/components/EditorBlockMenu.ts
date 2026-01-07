import { setTestId } from '../utils/dom/testId';
import {
  EditorBlockMenuItem,
  type TEditorBlockMenuItemOptions,
} from './EditorBlockMenuItem';

type TOptions = {
  id: string;
  filterText: string;
  filterQuery: string;
  items: (TEditorBlockMenuItemOptions & {
    hasTopDivider: boolean;
    hasBottomDivider: boolean;
    keywords: string[];
  })[];
  onBeforeSelect?: () => void;
  onAfterSelect?: () => void;
};

type TReturnEditorBlockMenu = {
  element: HTMLMenuElement;
  updateQuery: (query: string) => void;
  selectNext: () => void;
  selectPrevious: () => void;
  triggerSelected: () => void;
  getSelectedIndex: () => number;
  getItemCount: () => number;
  setOnBeforeSelect: (callback: () => void) => void;
  setOnAfterSelect: (callback: () => void) => void;
};

const EditorBlockMenu = (opts: TOptions): TReturnEditorBlockMenu => {
  const menu = document.createElement('menu');
  const headerDiv = document.createElement('div');
  const filterTextDiv = document.createElement('div');
  const filterQueryDiv = document.createElement('div');
  const itemsDiv = document.createElement('div');

  menu.classList.add('editor-block-menu');
  headerDiv.classList.add('editor-block-menu__header');
  filterTextDiv.classList.add('editor-block-menu__filter-text');
  filterQueryDiv.classList.add('editor-block-menu__filter-query');
  itemsDiv.classList.add('editor-block-menu__items', 'v-scrollbar');

  filterTextDiv.textContent = opts.filterText;
  if (opts.filterQuery) {
    filterQueryDiv.textContent = opts.filterQuery;
    headerDiv.appendChild(filterQueryDiv);
  }

  headerDiv.appendChild(filterTextDiv);
  menu.append(headerDiv, itemsDiv);

  setTestId(menu, opts.id);

  // Track selected index and current items
  let selectedIndex = 0;
  let currentItems: TOptions['items'] = [];
  let itemElements: HTMLButtonElement[] = [];
  let onBeforeSelect = opts.onBeforeSelect;
  let onAfterSelect = opts.onAfterSelect;

  const setOnBeforeSelect = (callback: () => void): void => {
    onBeforeSelect = callback;
  };

  const setOnAfterSelect = (callback: () => void): void => {
    onAfterSelect = callback;
  };

  const updateSelectedItem = (newIndex: number): void => {
    if (itemElements.length === 0) return;

    // Remove selection from current item
    if (selectedIndex >= 0 && selectedIndex < itemElements.length) {
      itemElements[selectedIndex].classList.remove(
        'editor-block-menu-item--selected',
      );
    }

    // Clamp new index to valid range
    selectedIndex = Math.max(0, Math.min(newIndex, itemElements.length - 1));

    // Add selection to new item
    if (selectedIndex >= 0 && selectedIndex < itemElements.length) {
      itemElements[selectedIndex].classList.add(
        'editor-block-menu-item--selected',
      );

      // Scroll item into view if needed
      itemElements[selectedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  };

  const selectNext = (): void => {
    updateSelectedItem(selectedIndex + 1);
  };

  const selectPrevious = (): void => {
    updateSelectedItem(selectedIndex - 1);
  };

  const executeItemAction = (item: TOptions['items'][number]): void => {
    if (onBeforeSelect) {
      onBeforeSelect();
    }

    item.onClick();

    if (onAfterSelect) {
      onAfterSelect();
    }
  };

  const triggerSelected = (): void => {
    if (
      selectedIndex >= 0 &&
      selectedIndex < currentItems.length &&
      currentItems[selectedIndex]
    ) {
      executeItemAction(currentItems[selectedIndex]);
    }
  };

  const getSelectedIndex = (): number => selectedIndex;

  const getItemCount = (): number => itemElements.length;

  const renderItems = (items: TOptions['items']): void => {
    // Clear existing items
    while (itemsDiv.firstChild) {
      itemsDiv.removeChild(itemsDiv.firstChild);
    }

    currentItems = items;
    itemElements = [];
    selectedIndex = 0;

    for (let i = 0; i < items.length; i++) {
      // Set first item as selected by default
      const originalItem = items[i];
      const itemWithSelection = {
        ...originalItem,
        isSelected: i === 0,
        onClick: (): void => {
          executeItemAction(originalItem);
        },
      };

      const itemElement = EditorBlockMenuItem(itemWithSelection);
      itemElements.push(itemElement);

      if (
        items[i].hasTopDivider !== undefined &&
        items[i].hasTopDivider === true
      ) {
        const dividerDiv = document.createElement('div');
        dividerDiv.classList.add('editor-block-menu__divider');

        itemsDiv.appendChild(dividerDiv);
      }

      itemsDiv.appendChild(itemElement);

      if (
        items[i].hasBottomDivider !== undefined &&
        items[i].hasBottomDivider === true
      ) {
        const dividerDiv = document.createElement('div');
        dividerDiv.classList.add('editor-block-menu__divider');

        itemsDiv.appendChild(dividerDiv);
      }
    }
  };

  // Initial render
  const itemsToDisplay = opts.filterQuery
    ? filterMenuItems(opts.items, opts.filterQuery)
    : opts.items;

  renderItems(itemsToDisplay);

  const updateQuery = (query: string): void => {
    if (filterQueryDiv) {
      filterQueryDiv.textContent = query;
    }

    const filteredItems = filterMenuItems(opts.items, query);
    renderItems(filteredItems);
  };

  return {
    element: menu,
    updateQuery,
    selectNext,
    selectPrevious,
    triggerSelected,
    getSelectedIndex,
    getItemCount,
    setOnBeforeSelect,
    setOnAfterSelect,
  };
};

const filterMenuItems = (
  items: TOptions['items'],
  query: string,
): TOptions['items'] => {
  if (!query) {
    return items;
  }

  const lowerQuery = query.toLowerCase();

  return items.filter((item) => {
    if (item.text.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    if (
      item.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(lowerQuery),
      )
    ) {
      return true;
    }

    return false;
  });
};

export type { TOptions as TEditorBlockMenuOptions, TReturnEditorBlockMenu };

export { EditorBlockMenu };
