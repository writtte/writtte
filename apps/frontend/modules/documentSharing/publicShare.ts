import { ButtonColor } from '../../components/Button';
import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { InputType } from '../../components/Input';
import {
  ModalContainerItemDirection,
  ModalContentItemType,
} from '../../components/Modal';
import { StatusTextType } from '../../components/StatusText';
import { PATHS } from '../../constants/paths';
import { STATUS_TEXT_TIMEOUT } from '../../constants/timeouts';
import { ModalController } from '../../controller/modal';
import { v1DocumentSharingCreate } from '../../data/apis/documentSharing/v1DocumentSharingCreate';
import { v1DocumentSharingDelete } from '../../data/apis/documentSharing/v1DocumentSharingDelete';
import { v1DocumentSharingRetrieveList } from '../../data/apis/documentSharing/v1DocumentSharingRetreiveList';
import { getMainEditor } from '../../data/stores/mainEditor';
import { AccessToken } from '../../helpers/account/accessToken';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

const openDocumentPublicShareModal = async (): Promise<void> => {
  const modalController = ModalController();
  const { getCurrentAccountData } = AccessToken();

  const modal = modalController.showModal({
    id: 'modal__ryjntpvgra',
    title: langKeys().ModalDocumentSharingTextTitle,
    content: [
      {
        type: ModalContentItemType.TEXT,
        text: langKeys().ModalDocumentSharingTextContent,
      },
      {
        type: ModalContentItemType.INPUT,
        direction: ModalContainerItemDirection.COLUMN,
        inputs: [],
      },
      {
        type: ModalContentItemType.BUTTON,
        direction: ModalContainerItemDirection.ROW,
        buttons: [
          {
            id: 'button__tcbxmxqvfo',
            text: langKeys().ModalDocumentSharingButtonCancel,
            loadingText: undefined,
            leftIcon: undefined,
            color: ButtonColor.NEUTRAL,
            onClick: (): void => {
              modalController.closeModal('modal__ryjntpvgra');
            },
          },
          {
            id: 'button__kaxyanrlsx',
            text: langKeys().ModalDocumentSharingButtonGenerate,
            loadingText: langKeys().ModalDocumentSharingButtonGenerating,
            leftIcon: undefined,
            color: ButtonColor.PRIMARY,
            onClick: async (): Promise<void> => await createSharingLink(),
          },
        ],
      },
    ],
    width: 512,
  });

  const loadExistingSharingLinks = async (): Promise<void> => {
    const mainEditor = getMainEditor();
    const accessToken = getCurrentAccountData()?.access_token ?? '';

    const { status, response } = await v1DocumentSharingRetrieveList({
      accessToken,
      documentCode: mainEditor.documentCode ?? '',
    });

    if (status !== HTTP_STATUS.OK || !response) {
      return;
    }

    if (
      response.results.sharing_list &&
      response.results.sharing_list.length > 0
    ) {
      for (let i = 0; i < response.results.sharing_list.length; i++) {
        const sharing = response.results.sharing_list[i];
        addSharingLinkToModal(sharing.sharing_code);
      }
    }
  };

  const addSharingLinkToModal = (sharingCode: string): void => {
    const inputId = `input__${sharingCode}`;
    const sharingUrl = `https://writtte.com${PATHS.SHARE_DOCUMENT}/${sharingCode}`;

    modal.addInput(1, {
      title: undefined,
      input: {
        id: inputId,
        text: sharingUrl,
        placeholderText: undefined,
        inlineButton: {
          id: `button__${sharingCode}`,
          icon: FlatIcon(FlatIconName._18_TRASH),
          onClick: async (): Promise<void> => {
            await deleteSharingLink(sharingCode, inputId);
          },
        },
        statusText: undefined,
        type: InputType.TEXT,
        onSubmit: undefined,
      },
    });

    const inputReturn = modal.inputs[inputId];
    inputReturn.setReadOnly(true);
  };

  const deleteSharingLink = async (
    sharingCode: string,
    inputId: string,
  ): Promise<void> => {
    const mainEditor = getMainEditor();
    const accessToken = getCurrentAccountData()?.access_token ?? '';

    const { status } = await v1DocumentSharingDelete({
      accessToken,
      documentCode: mainEditor.documentCode ?? '',
      sharingCode,
    });

    if (status !== HTTP_STATUS.OK) {
      const inputComponent = modal.inputs[inputId];
      if (inputComponent) {
        inputComponent.setStatusText({
          id: 'status_text__dohhchiavx',
          text: langKeys().ErrorApiInternalServerError,
          type: StatusTextType.ERROR,
          isIconVisible: false,
        });

        inputComponent.clearStatusTextAfterDelay(STATUS_TEXT_TIMEOUT.SHORT);
      }

      return;
    }

    modal.removeInput(1, inputId);
  };

  const createSharingLink = async (): Promise<void> => {
    const button = modal.buttons.button__kaxyanrlsx;
    button.setLoading(true);

    const mainEditor = getMainEditor();
    const accessToken = getCurrentAccountData()?.access_token ?? '';

    const { status, response } = await v1DocumentSharingCreate({
      accessToken,
      documentCode: mainEditor.documentCode ?? '',
    });

    if (status !== HTTP_STATUS.CREATED || !response) {
      button.setLoading(false);
      return;
    }

    const sharingCode = response.results.sharing_code;
    addSharingLinkToModal(sharingCode);

    button.setLoading(false);
  };

  await loadExistingSharingLinks();
};

export { openDocumentPublicShareModal };
