import { idb } from '@writtte-internal/indexed-db';
import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { ItemList, itemSortCollector } from '../components/ItemList';
import { PageHeader } from '../components/PageHeader';
import {
  STORE_NAMES,
  type TIDBStyles,
  getIndexedDB,
} from '../data/stores/indexedDB';
import { CommonEmpty } from '../emptyState/CommonEmpty';
import { buildError } from '../helpers/error/build';
import { compareStyles } from '../modules/styles/compareStyles';
import { deleteStyle } from '../modules/styles/deleteStyle';
import {
  extractStyleDetailsFromAPIList,
  getStylesFromAPI,
  getStylesFromIDB,
} from '../modules/styles/getStyles';
import { openStyleChangeModal } from '../modules/styles/openStyleChangeModal';
import { langKeys } from '../translations/keys';

const StylesPage = async (): Promise<HTMLElement> => {
  const pageDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const contentDiv = document.createElement('div');

  pageDiv.classList.add('styles-page');
  headerDiv.classList.add('styles-page__header');
  contentDiv.classList.add('styles-page__content');

  pageDiv.setAttribute('data-content-container', 'administrator-layout');

  const itemListElement = ItemList({
    emptyState: CommonEmpty({
      title: langKeys().PageStylesEmptyStateNoStylesTextTitle,
      description: langKeys().PageStylesEmptyStateNoStylesTextDescription,
    }),
  });

  const pageHeaderElement = PageHeader({
    title: langKeys().PageStylesHeaderTextTitle,
    subtitle: langKeys().PageStylesHeaderTextSubtitle,
    buttons: [
      {
        id: 'button__ukpkxkfier',
        text: langKeys().PageStylesHeaderButtonCreate,
        leftIcon: FlatIcon(FlatIconName._18_PLUS),
        onClick: async (): Promise<void> =>
          await openStyleChangeModal(itemListElement, undefined),
      },
    ],
  });

  const idbPromise = (async (): Promise<void> => {
    const styles = await getStylesFromIDB();

    styles.sort((a, b) => itemSortCollector.compare(a.styleName, b.styleName));

    for (let i = 0; i < styles.length; i++) {
      itemListElement.addItemToList({
        id: styles[i].styleCode,
        text: styles[i].styleName,
        optionButton: {
          id: `button__${styles[i].styleCode}`,
          icon: FlatIcon(FlatIconName._18_TRASH),
          onClick: async (): Promise<void> =>
            await deleteStyle(itemListElement, styles[i].styleCode),
        },
        onClick: async (): Promise<void> =>
          await openStyleChangeModal(itemListElement, styles[i].styleCode),
        metadata: undefined,
      });
    }

    contentDiv.appendChild(itemListElement.element);
  })();

  // biome-ignore lint/nursery/noFloatingPromises: We need to wait for both operations to complete
  Promise.all([idbPromise]).then(async (): Promise<void> => {
    const db = getIndexedDB();

    const currentStyleIds = itemListElement.getAllItemIDs();
    const currentStylesFromIDB = await getStylesFromIDB();

    const styles = await getStylesFromAPI();

    if (!styles || styles.length === 0) {
      itemListElement.setNoItems();

      if (!contentDiv.contains(itemListElement.element)) {
        contentDiv.remove();
      }

      return;
    }

    const idsFromAPI: string[] = [];
    for (let i = 0; i < styles.length; i++) {
      idsFromAPI.push(styles[i].style_code);
    }

    const { missedItemIds, extraItemIds } = compareStyles(
      currentStyleIds,
      idsFromAPI,
    );

    for (let i = 0; i < missedItemIds.length; i++) {
      // These items should be removed from the list element

      itemListElement.removeItemFromList(missedItemIds[i]);
    }

    for (let i = 0; i < extraItemIds.length; i++) {
      // These items should be added to the list element

      const extractedStyleDetails = extractStyleDetailsFromAPIList(
        styles,
        extraItemIds[i],
      );

      if (extractedStyleDetails === undefined) {
        throw new Error(
          buildError(
            `invalid id ${extraItemIds[i]} identified when getting style details`,
          ),
        );
      }

      itemListElement.addItemToList({
        id: extraItemIds[i],
        text: extractedStyleDetails.name,
        optionButton: {
          id: `button__${extraItemIds[i]}`,
          icon: FlatIcon(FlatIconName._18_TRASH),
          onClick: async (): Promise<void> =>
            await deleteStyle(itemListElement, extraItemIds[i]),
        },
        onClick: async (): Promise<void> =>
          await openStyleChangeModal(itemListElement, extraItemIds[i]),
        metadata: undefined,
      });

      for (let j = 0; j < styles.length; j++) {
        if (extraItemIds[i] === styles[j].style_code) {
          const objectToAdd: TIDBStyles = {
            accountCode: styles[j].account_code,
            styleCode: styles[j].style_code,
            styleName: styles[j].name,
            styleContent: styles[j].style,
          };

          // biome-ignore lint/performance/noAwaitInLoops: The await inside this loop is required
          await idb.addData(db, STORE_NAMES.STYLES, objectToAdd);
        }
      }
    }

    for (let i = 0; i < styles.length; i++) {
      // Update style names for existing styles that might have
      // changed in another browser

      const styleId = styles[i].style_code;
      if (extraItemIds.includes(styleId)) {
        // Newly added items should be ignored

        continue;
      }

      const itemToUpdate = itemListElement.items.get(styleId);

      if (itemToUpdate && itemToUpdate.getText() !== styles[i].name) {
        itemToUpdate.changeText(styles[i].name);

        const currentStyle = currentStylesFromIDB.find(
          (style) => style.styleCode === styleId,
        );

        if (currentStyle) {
          const updatedStyle: TIDBStyles = {
            ...currentStyle,
            styleName: styles[i].name,
          };

          // biome-ignore lint/performance/noAwaitInLoops: The await inside this loop is required
          await idb.updateData(db, STORE_NAMES.STYLES, updatedStyle);
        }
      }
    }

    // Sort all styles alphabetically after all
    // updates

    itemListElement.sortItemsAlphabetically();
  });

  headerDiv.appendChild(pageHeaderElement.element);
  pageDiv.append(headerDiv, contentDiv);
  return pageDiv;
};

export { StylesPage };
