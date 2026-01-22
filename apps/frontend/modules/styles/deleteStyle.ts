import type { TReturnItemList } from '../../components/ItemList';
import { idb } from '@writtte-internal/indexed-db';
import { ButtonColor } from '../../components/Button';
import {
  ModalContainerItemDirection,
  ModalContentItemType,
} from '../../components/Modal';
import { ModalController } from '../../controller/modal';
import { v1AIStyleUpdate } from '../../data/apis/aiStyles/v1AIStyleUpdate';
import { STORE_NAMES, getIndexedDB } from '../../data/stores/indexedDB';
import { AccessToken } from '../../helpers/account/accessToken';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

const deleteStyle = async (
  itemListElement: TReturnItemList,
  styleCode: string,
): Promise<void> => {
  const db = getIndexedDB();
  const { getCurrentAccountData } = AccessToken();

  const modalController = ModalController();

  const modal = modalController.showModal({
    id: 'modal__vnflqegjep',
    title: langKeys().ModalStyleDeleteTextTitle,
    content: [
      {
        type: ModalContentItemType.TEXT,
        text: langKeys().ModalStyleDeleteTextContent,
      },
      {
        type: ModalContentItemType.BUTTON,
        direction: ModalContainerItemDirection.ROW,
        buttons: [
          {
            id: 'button__hxtxzobdof',
            text: langKeys().ModalStyleDeleteButtonCancel,
            loadingText: undefined,
            leftIcon: undefined,
            color: ButtonColor.NEUTRAL,
            onClick: (): void => {
              modalController.closeModal('modal__ivogbppdvg');
            },
          },
          {
            id: 'button__rhjmgufuzq',
            text: langKeys().ModalStyleDeleteButtonDelete,
            loadingText: langKeys().ModalStyleDeleteButtonDeleting,
            leftIcon: undefined,
            color: ButtonColor.DANGER,
            onClick: async (): Promise<void> => await performStyleDelete(),
          },
        ],
      },
    ],
    width: 384,
  });

  const performStyleDelete = async (): Promise<void> => {
    const button = modal.buttons.button__rhjmgufuzq;

    button.setLoading(true);

    const { status } = await v1AIStyleUpdate({
      accessToken: getCurrentAccountData()?.access_token ?? '',
      styleCode,
      isDeleted: true,
    });

    if (status !== HTTP_STATUS.OK) {
      button.setLoading(false);
      return;
    }

    await idb.deleteData(db, STORE_NAMES.STYLES, styleCode);

    itemListElement.removeItemFromList(styleCode);

    button.setLoading(false);
    modalController.closeModal('modal__vnflqegjep');
  };
};

export { deleteStyle };
