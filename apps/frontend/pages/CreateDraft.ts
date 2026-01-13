import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { ItemCreateInput } from '../components/ItemCreateInput';
import { createDocument } from '../modules/createDraft/createDocument';
import { langKeys } from '../translations/keys';

const CreateDraftPage = async (): Promise<HTMLElement> => {
  const pageDiv = document.createElement('div');
  const containerDiv = document.createElement('div');

  pageDiv.classList.add('create-draft-page');
  containerDiv.classList.add('create-draft-page__container');

  const itemCreateInputElement = ItemCreateInput({
    id: 'item_create_input__ueiwykuysk',
    placeholderText: langKeys().PageOverviewCreateInputPlaceholderNewDocument,
    createButton: {
      id: 'button__ivsmtfanim',
      icon: FlatIcon(FlatIconName._18_DOCUMENT_ADD),
      onClick: async (): Promise<void> =>
        await createDocument(itemCreateInputElement),
    },
    onSubmit: async (): Promise<void> =>
      await createDocument(itemCreateInputElement),
  });

  containerDiv.appendChild(itemCreateInputElement.element);
  pageDiv.appendChild(containerDiv);
  return pageDiv;
};

export { CreateDraftPage };
