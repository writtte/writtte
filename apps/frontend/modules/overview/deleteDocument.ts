import type { TReturnItemList } from '../../components/ItemList';
import { ButtonColor } from '../../components/Button';
import {
  ModalContainerItemDirection,
  ModalContentItemType,
} from '../../components/Modal';
import { ModalController } from '../../controller/modal';
import {
  DocumentLifecycleState,
  v1DocumentUpdate,
} from '../../data/apis/item/v1DocumentUpdate';
import { AccessToken } from '../../helpers/account/accessToken';
import { documentCodeToKey } from '../../helpers/item/codeToKey';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

const openDocumentDeleteModal = async (
  itemList: TReturnItemList,
  documentCode: string,
): Promise<void> => {
  const modalController = ModalController();

  const modal = modalController.showModal({
    id: 'modal__ivogbppdvg',
    title: langKeys().ModalDocumentDeleteTextTitle,
    content: [
      {
        type: ModalContentItemType.TEXT,
        text: langKeys().ModalDocumentDeleteTextContent,
      },
      {
        type: ModalContentItemType.BUTTON,
        direction: ModalContainerItemDirection.ROW,
        buttons: [
          {
            id: 'button__lcjwbvuhur',
            text: langKeys().ModalDocumentDeleteButtonCancel,
            loadingText: undefined,
            leftIcon: undefined,
            color: ButtonColor.NEUTRAL,
            onClick: (): void => {
              modalController.closeModal('modal__ivogbppdvg');
            },
          },
          {
            id: 'button__jjbfinssus',
            text: langKeys().ModalDocumentDeleteButtonDelete,
            loadingText: langKeys().ModalDocumentDeleteButtonDeleting,
            leftIcon: undefined,
            color: ButtonColor.DANGER,
            onClick: async (): Promise<void> => await performDocumentDelete(),
          },
        ],
      },
    ],
    width: 384,
  });

  const performDocumentDelete = async (): Promise<void> => {
    const button = modal.buttons.button__jjbfinssus;
    button.setLoading(true);

    const isDeleted = await deleteDocument(documentCode);
    if (!isDeleted) {
      button.setLoading(false);
      return;
    }

    const documentId = documentCodeToKey(documentCode);
    itemList.removeItemFromList(documentId);

    modalController.closeModal('modal__ivogbppdvg');
  };
};

const deleteDocument = async (documentCode: string): Promise<boolean> => {
  const { getCurrentAccountData } = AccessToken();

  const { status } = await v1DocumentUpdate({
    accessToken: getCurrentAccountData()?.access_token ?? '',
    documentCode,
    lifecycleState: DocumentLifecycleState.DELETED,
  });

  if (status !== HTTP_STATUS.NO_CONTENT) {
    return false;
  }

  return true;
};

export { openDocumentDeleteModal };
