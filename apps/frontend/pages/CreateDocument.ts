import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { ItemCreateInput } from '../components/ItemCreateInput';
import { createDocument } from '../modules/createDocument/createDocument';
import { langKeys } from '../translations/keys';

const CreateDocumentPage = async (): Promise<HTMLElement> => {
  const pageDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const subtitleDiv = document.createElement('div');

  pageDiv.classList.add('create-document-page');
  containerDiv.classList.add('create-document-page__container');
  headerDiv.classList.add('create-document-page___header');
  titleDiv.classList.add('create-document-page__title');
  subtitleDiv.classList.add('create-document-page___subtitle');

  const itemCreateInputElement = ItemCreateInput({
    id: 'item_create_input__ueiwykuysk',
    placeholderText: langKeys().PageCreateDocumentInputPlaceholderNewDocument,
    createButton: {
      id: 'button__ivsmtfanim',
      icon: FlatIcon(FlatIconName._18_DOCUMENT_ADD),
      onClick: async (): Promise<void> =>
        await createDocument(itemCreateInputElement),
    },
    onSubmit: async (): Promise<void> =>
      await createDocument(itemCreateInputElement),
  });

  titleDiv.textContent = langKeys().PageCreateDocumentTextTitle;
  subtitleDiv.textContent = langKeys().PageCreateDocumentTextSubtitle;

  headerDiv.append(titleDiv, subtitleDiv);
  containerDiv.append(headerDiv, itemCreateInputElement.element);
  pageDiv.appendChild(containerDiv);
  return pageDiv;
};

export { CreateDocumentPage };
