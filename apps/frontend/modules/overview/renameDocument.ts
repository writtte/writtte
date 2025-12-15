import type { TReturnItemList } from '../../components/ItemList';
import { idb } from '@velovra-internal/indexed-db';
import { ERROR_CODES, validate } from '@velovra-internal/validate';
import { ButtonAction, ButtonColor, ButtonSize } from '../../components/Button';
import { InputSize, InputType } from '../../components/Input';
import {
  ModalContainerItemDirection,
  ModalContentItemType,
} from '../../components/Modal';
import { StatusTextType } from '../../components/StatusText';
import { ModalController } from '../../controller/modal';
import { v1DocumentUpdate } from '../../data/apis/item/v1DocumentUpdate';
import {
  STORE_NAMES,
  type TIDBDocument,
  getIndexedDB,
} from '../../data/stores/indexedDB';
import { AccessToken } from '../../helpers/account/accessToken';
import { buildError } from '../../helpers/error/build';
import { documentCodeToKey } from '../../helpers/item/codeToKey';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

const openDocumentRenameModal = async (
  itemList: TReturnItemList,
  documentCode: string,
): Promise<void> => {
  const modalController = ModalController();

  const modal = modalController.showModal({
    id: 'modal__qxtfaslqkw',
    title: langKeys().ModalDocumentRenameTextTitle,
    content: [
      {
        type: ModalContentItemType.TEXT,
        text: langKeys().ModalDocumentRenameTextContent,
      },
      {
        type: ModalContentItemType.INPUT,
        direction: ModalContainerItemDirection.COLUMN,
        inputs: [
          {
            title: undefined,
            input: {
              id: 'input__bbnophhgew',
              text: '', // todo
              placeholderText: undefined,
              inlineButton: undefined,
              statusText: undefined,
              type: InputType.TEXT,
              size: InputSize.MEDIUM,
              isFullWidth: true,
              onChange: undefined,
              onSubmit: async (): Promise<void> =>
                await performDocumentRename(),
            },
          },
        ],
      },
      {
        type: ModalContentItemType.BUTTON,
        direction: ModalContainerItemDirection.COLUMN,
        buttons: [
          {
            id: 'button__mmygztoxor',
            text: langKeys().ModalDocumentRenameButtonCancel,
            loadingText: undefined,
            leftIcon: undefined,
            rightIcon: undefined,
            action: ButtonAction.BUTTON,
            color: ButtonColor.NEUTRAL,
            size: ButtonSize.MEDIUM,
            isFullWidth: false,
            onClick: (): void => {
              modalController.closeModal('modal__qxtfaslqkw');
            },
          },
          {
            id: 'button__hqvgtxctib',
            text: langKeys().ModalDocumentRenameButtonRename,
            loadingText: langKeys().ModalDocumentRenameButtonRenaming,
            leftIcon: undefined,
            rightIcon: undefined,
            action: ButtonAction.BUTTON,
            color: ButtonColor.NEUTRAL,
            size: ButtonSize.MEDIUM,
            isFullWidth: false,
            onClick: async (): Promise<void> => await performDocumentRename(),
          },
        ],
      },
    ],
    width: 384,
  });

  const performDocumentRename = async (): Promise<void> => {
    const input = modal.inputs.input__bbnophhgew;
    const button = modal.buttons.button__hqvgtxctib;

    button.setLoading(true);

    const error = validateDocumentTitle(input.getValue().trim());
    if (error !== undefined) {
      input.setStatusText({
        id: 'status_text__yrqntjrhea',
        text: error,
        type: StatusTextType.ERROR,
        isIconVisible: false,
      });

      button.setLoading(false);
      return;
    }

    const isUpdated = await renameDocument(documentCode, input.getValue());
    if (!isUpdated) {
      input.setStatusText({
        id: 'status_text__yrqntjrhea',
        text: langKeys().ErrorApiInternalServerError,
        type: StatusTextType.ERROR,
        isIconVisible: false,
      });

      button.setLoading(false);
      return;
    }

    const documentId = documentCodeToKey(documentCode);
    const itemToUpdate = itemList.items.get(documentId);
    if (!itemToUpdate) {
      throw new Error(
        buildError(
          `unable to find an item with id '${documentId}' in the list`,
        ),
      );
    }

    await updateDocumentTitleInIDB(documentCode, input.getValue().trim());

    itemToUpdate.changeText(input.getValue());
    modalController.closeModal('modal__qxtfaslqkw');
  };
};

const renameDocument = async (
  documentCode: string,
  newTitle: string,
): Promise<boolean> => {
  const { getCurrentAccountData } = AccessToken();

  const { status } = await v1DocumentUpdate({
    accessToken: getCurrentAccountData()?.access_token ?? '',
    documentCode,
    title: newTitle,
  });

  if (status !== HTTP_STATUS.NO_CONTENT) {
    return false;
  }

  return true;
};

const validateDocumentTitle = (newTitle: string): string | undefined => {
  const { isValid, results } = validate([
    {
      name: 'title',
      value: newTitle,
      rules: {
        min: 2,
        max: 256,
        required: true,
      },
    },
  ]);

  if (isValid) {
    return;
  }

  const titleResults = results.find((r) => r.name === 'title');
  switch (titleResults?.errors[0]) {
    case ERROR_CODES.REQUIRED:
      return langKeys().ErrorDocumentTitleRequired;

    case ERROR_CODES.MIN:
      return langKeys().ErrorDocumentTitleMin;

    case ERROR_CODES.MAX:
      return langKeys().ErrorDocumentTitleMax;
  }

  return;
};

const updateDocumentTitleInIDB = async (
  documentCode: string,
  newTitle: string,
): Promise<void> => {
  const db = getIndexedDB();

  const getObject = await idb.getObject<TIDBDocument>(
    db,
    STORE_NAMES.DOCUMENTS,
    documentCode,
  );

  if (!getObject) {
    return;
  }

  const newDataToUpdate: TIDBDocument = {
    ...getObject,
    title: newTitle,
  };

  await idb.updateData(db, STORE_NAMES.DOCUMENTS, newDataToUpdate);
};

export { openDocumentRenameModal };
