import { idb } from '@writtte-internal/indexed-db';
import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { ItemList, itemSortCollector } from '../components/ItemList';
import { PATHS } from '../constants/paths';
import {
  STORE_NAMES,
  type TIDBDocument,
  getIndexedDB,
} from '../data/stores/indexedDB';
import { NoDocuments } from '../emptyState/NoDocuments';
import { buildError } from '../helpers/error/build';
import { documentCodeToKey } from '../helpers/item/codeToKey';
import { compareDocuments } from '../modules/documents/compareDocuments';
import {
  extractDocumentDetailsFromAPIList,
  getDocumentsFromAPI,
  getDocumentsFromIDB,
} from '../modules/documents/getDocuments';
import { buildDocumentOptionsMenu } from '../modules/documents/optionsMenu';
import { langKeys } from '../translations/keys';
import { navigate } from '../utils/routes/routes';

const DocumentsPage = async (): Promise<HTMLElement> => {
  const pageDiv = document.createElement('div');
  const contentDiv = document.createElement('div');

  pageDiv.classList.add('documents-page');
  contentDiv.classList.add('documents-page__content');

  pageDiv.setAttribute('data-content-container', 'administrator-layout');

  pageDiv.appendChild(contentDiv);

  const itemListElement = ItemList({
    emptyState: NoDocuments({
      title: langKeys().PageDocumentsEmptyStateNoDocumentsTextTitle,
      description: langKeys().PageDocumentsEmptyStateNoDocumentsTextDescription,
      button: {
        id: 'button__xxzjzmxkga',
        text: langKeys().PageDocumentsEmptyStateNoDocumentsButtonCreate,
        rightIcon: FlatIcon(FlatIconName._18_ARROW_TOP_RIGHT),
        onClick: async (): Promise<void> => {
          await navigate(PATHS.CREATE_DOCUMENT);
        },
      },
    }),
  });

  const idbPromise = (async (): Promise<void> => {
    const documents = await getDocumentsFromIDB();

    documents.sort((a, b) => itemSortCollector.compare(a.title, b.title));

    for (let i = 0; i < documents.length; i++) {
      itemListElement.addItemToList({
        id: documentCodeToKey(documents[i].documentCode),
        text: documents[i].title,
        optionButton: {
          id: `button__${documentCodeToKey(documents[i].documentCode)}`,
          icon: FlatIcon(FlatIconName._18_DOTS_HORIZONTAL),
          onClick: async (e: PointerEvent): Promise<void> =>
            await buildDocumentOptionsMenu(
              e,
              itemListElement,
              documents[i].documentCode,
            ),
        },
        onClick: async (): Promise<void> =>
          await navigate(`${PATHS.DOCUMENT_EDIT}/${documents[i].documentCode}`),
        metadata: undefined,
      });
    }

    contentDiv.appendChild(itemListElement.element);
  })();

  // biome-ignore lint/nursery/noFloatingPromises: We need to wait for both operations to complete
  Promise.all([idbPromise]).then(async (): Promise<void> => {
    const db = getIndexedDB();

    const currentDocumentIds = itemListElement.getAllItemIDs();
    const currentDocumentsFromIDB = await getDocumentsFromIDB();

    const documents = await getDocumentsFromAPI();

    if (!documents || documents.length === 0) {
      itemListElement.setNoItems();

      if (!contentDiv.contains(itemListElement.element)) {
        contentDiv.remove();
      }

      return;
    }

    const idsFromAPI: string[] = [];
    for (let i = 0; i < documents.length; i++) {
      idsFromAPI.push(documentCodeToKey(documents[i].document_code));
    }

    const { missedItemIds, extraItemIds } = compareDocuments(
      currentDocumentIds,
      idsFromAPI,
    );

    for (let i = 0; i < missedItemIds.length; i++) {
      // These items should be removed from the list element

      itemListElement.removeItemFromList(missedItemIds[i]);
    }

    for (let i = 0; i < extraItemIds.length; i++) {
      // These items should be added to the list element

      const extractedDocumentDetails = extractDocumentDetailsFromAPIList(
        documents,
        extraItemIds[i],
      );

      if (extractedDocumentDetails === undefined) {
        throw new Error(
          buildError(
            `invalid id ${extraItemIds[i]} identified when getting document details`,
          ),
        );
      }

      itemListElement.addItemToList({
        id: documentCodeToKey(extraItemIds[i]),
        text: extractedDocumentDetails.title,
        optionButton: {
          id: `button__${documentCodeToKey(documents[i].document_code)}`,
          icon: FlatIcon(FlatIconName._18_DOTS_HORIZONTAL),
          onClick: async (e: PointerEvent): Promise<void> =>
            await buildDocumentOptionsMenu(
              e,
              itemListElement,
              documents[i].document_code,
            ),
        },
        onClick: async (): Promise<void> =>
          await navigate(
            `${PATHS.DOCUMENT_EDIT}/${documents[i].document_code}`,
          ),
        metadata: undefined,
      });

      for (let j = 0; j < documents.length; j++) {
        if (extraItemIds[i] === documentCodeToKey(documents[j].document_code)) {
          const objectToAdd: TIDBDocument = {
            accountCode: documents[j].account_code,
            documentCode: documents[j].document_code,
            title: documents[j].title,
            lifecycleState: documents[j].lifecycle_state,
            workflowState: documents[j].workflow_state,
          };

          // biome-ignore lint/performance/noAwaitInLoops: The await inside this loop is required
          await idb.addData(db, STORE_NAMES.DOCUMENTS, objectToAdd);
        }
      }
    }

    for (let i = 0; i < documents.length; i++) {
      // Update document titles for existing documents that might have
      // changed in another browser

      const documentId = documentCodeToKey(documents[i].document_code);
      if (extraItemIds.includes(documentId)) {
        // Newly added items should be ignored

        continue;
      }

      const itemToUpdate = itemListElement.items.get(documentId);

      if (itemToUpdate && itemToUpdate.getText() !== documents[i].title) {
        itemToUpdate.changeText(documents[i].title);

        const currentDoc = currentDocumentsFromIDB.find(
          (doc) => documentCodeToKey(doc.documentCode) === documentId,
        );

        if (currentDoc) {
          const updatedDoc: TIDBDocument = {
            ...currentDoc,
            title: documents[i].title,
          };

          // biome-ignore lint/performance/noAwaitInLoops: The await inside this loop is required
          await idb.updateData(db, STORE_NAMES.DOCUMENTS, updatedDoc);
        }
      }
    }

    // Sort all documents alphabetically after all
    // updates

    itemListElement.sortItemsAlphabetically();
  });

  return pageDiv;
};

export { DocumentsPage };
