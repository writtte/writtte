import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { ItemCreateInput } from '../components/ItemCreateInput';
import { ItemList } from '../components/ItemList';
import { OverviewTitle } from '../components/OverviewTitle';
import { PATHS } from '../constants/paths';
import { buildError } from '../helpers/error/build';
import { documentCodeToKey } from '../helpers/item/codeToKey';
import { compareDocuments } from '../modules/overview/compareDocuments';
import { createDocument } from '../modules/overview/createDocument';
import { generateOverviewTitleDynamically } from '../modules/overview/dynamicTitle';
import {
  extractDocumentDetailsFromAPIList,
  getDocumentsFromAPI,
  getDocumentsFromIDB,
} from '../modules/overview/getDocuments';
import { buildDocumentOptionsMenu } from '../modules/overview/manageOptionsMenu';
import { EmptyItemListPlaceholder } from '../placeholders/EmptyItemList';
import { langKeys } from '../translations/keys';
import { navigate } from '../utils/routes/routes';

const OverviewPage = async (): Promise<HTMLElement> => {
  const overviewDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const contentDiv = document.createElement('div');

  overviewDiv.classList.add('overview-page');
  headerDiv.classList.add('overview-page__header');
  contentDiv.classList.add('overview-page__content');

  overviewDiv.append(headerDiv, contentDiv);

  const overviewTitleElement = OverviewTitle({
    title: generateOverviewTitleDynamically(),
  });

  const itemCreateInputElement = ItemCreateInput({
    id: 'item_create_input__ueiwykuysk',
    placeholderText: langKeys().PageOverviewCreateInputPlaceholderNewDocument,
    createButton: {
      id: 'button__ivsmtfanim',
      icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
      onClick: async (): Promise<void> =>
        await createDocument(itemCreateInputElement),
    },
    onSubmit: async (): Promise<void> =>
      await createDocument(itemCreateInputElement),
  });

  headerDiv.append(
    overviewTitleElement.element,
    itemCreateInputElement.element,
  );

  const itemListElement = ItemList({
    documents: [],
    placeholder: {
      placeholderSvg: EmptyItemListPlaceholder(),
      title: langKeys().PageOverviewItemListPlaceholderTitle,
      description: langKeys().PageOverviewItemListPlaceholderDescription,
    },
  });

  const idbPromise = (async (): Promise<void> => {
    const documents = await getDocumentsFromIDB();
    for (let i = 0; i < documents.length; i++) {
      itemListElement.addItemToList({
        id: documentCodeToKey(documents[i].documentCode),
        text: documents[i].title,
        optionButton: {
          id: `button__${documentCodeToKey(documents[i].documentCode)}`,
          icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
          onClick: async (e: PointerEvent): Promise<void> =>
            await buildDocumentOptionsMenu(
              e,
              itemListElement,
              documents[i].documentCode,
            ),
        },
        onClick: async (): Promise<void> =>
          await navigate(`${PATHS.DOCUMENT_EDIT}/${documents[i].documentCode}`),
      });
    }

    contentDiv.appendChild(itemListElement.element);
  })();

  // biome-ignore lint/nursery/noFloatingPromises: We need to wait for both operations to complete
  Promise.all([idbPromise]).then(async (): Promise<void> => {
    const currentDocumentIds = itemListElement.getAllDocumentIDs();

    const documents = await getDocumentsFromAPI();

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
          icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
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
      });
    }
  });

  return overviewDiv;
};

export { OverviewPage };
