import type { TVersionListItem } from '../../components/VersionModal';
import { ButtonColor } from '../../components/Button';
import {
  ModalContainerItemDirection,
  ModalContentItemType,
} from '../../components/Modal';
import { VersionModalContent } from '../../components/VersionModalContent';
import { ModalController } from '../../controller/modal';
import { VersionModalController } from '../../controller/versionModal';
import { v1DocumentVersionRetrieve } from '../../data/apis/documentVersion/v1DocumentVersionRetrieve';
import { v1DocumentVersionRetrieveList } from '../../data/apis/documentVersion/v1DocumentVersionRetrieveList';
import { getEditorAPI, getMainEditor } from '../../data/stores/mainEditor';
import { CommonEmpty } from '../../emptyState/CommonEmpty';
import { AccessToken } from '../../helpers/account/accessToken';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';
import { formatDateAndTime } from '../../utils/string/formatDate';
import { checkAndSetImagesInVersionDocument } from '../editor/image/setImagesInVersionDocument';
import { setupEditorExtensionOptions } from '../editor/options/editorOptions';

const openVersionModal = async (): Promise<void> => {
  const { getCurrentAccountData } = AccessToken();

  const versionModalController = VersionModalController();

  const modal = versionModalController.showModal({
    id: 'version_modal__fijfarsbud',
    title: `${langKeys().VersionModalTextTitle} - ${document.title}`,
  });

  modal.setVersionContent(
    CommonEmpty({
      title: langKeys().VersionModalEmptyStateSelectContentTitle,
      description: langKeys().VersionModalEmptyStateSelectContentDescription,
    }),
  );

  const setVersionContent = async (
    documentCode: string,
    versionCode: string,
  ): Promise<void> => {
    modal.setVersionContentLoading('loading_indicator__uqmdtnksic');

    const { status, response } = await v1DocumentVersionRetrieve({
      accessToken: getCurrentAccountData()?.access_token ?? '',
      documentCode,
      versionCode,
    });

    if (status !== HTTP_STATUS.OK || !response?.results.content) {
      modal.setVersionContent(
        CommonEmpty({
          title: langKeys().ErrorApiInternalServerError,
          description: langKeys().ErrorVersionHistoryContentRetrievedFailed,
        }),
      );

      return;
    }

    const editorContent = VersionModalContent({
      options: setupEditorExtensionOptions(false),
      content: response.results.content,
      restoreButton: {
        id: `button__version-content-${versionCode}`,
        text: langKeys().VersionModalButtonRestore,
        onClick: (): void => {
          const modalController = ModalController();

          modalController.showModal({
            id: 'modal__xolagofsjz',
            title: langKeys().ModalVersionHistoryRestoreTextTitle,
            content: [
              {
                type: ModalContentItemType.TEXT,
                text: langKeys().ModalVersionHistoryRestoreTextContent,
              },
              {
                type: ModalContentItemType.BUTTON,
                direction: ModalContainerItemDirection.ROW,
                buttons: [
                  {
                    id: 'button__kesyhdmnhf',
                    text: langKeys().ModalVersionHistoryRestoreButtonCancel,
                    loadingText: undefined,
                    leftIcon: undefined,
                    color: ButtonColor.NEUTRAL,
                    onClick: (): void => {
                      modalController.closeModal('modal__xolagofsjz');
                    },
                  },
                  {
                    id: 'button__hmvftpcoek',
                    text: langKeys().ModalVersionHistoryRestoreButtonRestore,
                    loadingText: undefined,
                    leftIcon: undefined,
                    color: ButtonColor.PRIMARY,
                    onClick: async (): Promise<void> => {
                      const contentInSchema = getEditorAPI().stringToSchema(
                        response.results.content,
                      );

                      getEditorAPI().setContent(contentInSchema);

                      modalController.closeModal('modal__xolagofsjz');
                      versionModalController.closeModal(
                        'version_modal__fijfarsbud',
                      );
                    },
                  },
                ],
              },
            ],
            width: 448,
          });
        },
      },
    });

    checkAndSetImagesInVersionDocument(editorContent.editorElement);

    modal.setVersionContent(editorContent.element);
  };

  const loadVersionList = async (): Promise<void> => {
    modal.setVersionListLoading('loading_indicator__sujnbcmtwu');

    const { status, response } = await v1DocumentVersionRetrieveList({
      accessToken: getCurrentAccountData()?.access_token ?? '',
      documentCode: getMainEditor().documentCode ?? '',
    });

    if (status !== HTTP_STATUS.OK || !response?.results) {
      modal.setVersionListContent(
        CommonEmpty({
          title: langKeys().ErrorApiInternalServerError,
          description: langKeys().ErrorVersionHistoryListRetrievedFailed,
        }),
      );

      return;
    }

    var versionItemList: TVersionListItem[] = [];

    const versions = response.results.versions;

    if (versions.length === 0) {
      modal.setVersionListContent(
        CommonEmpty({
          title: langKeys().VersionModalEmptyStateNoHistoryTitle,
          description: langKeys().VersionModalEmptyStateNoHistoryDescription,
        }),
      );

      return;
    }

    for (let i = 0; i < versions.length; i++) {
      versionItemList.push({
        id: `version_list_item__${versions[i].version_code}`,
        date: formatDateAndTime(versions[i].created_time),
        onClick: async (): Promise<void> =>
          await setVersionContent(
            versions[i].document_code,
            versions[i].version_code,
          ),
      });
    }

    modal.setVersionList(versionItemList);
  };

  await loadVersionList();
};

export { openVersionModal };
