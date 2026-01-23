import { ButtonColor } from '../../../components/Button';
import { FlatIcon, FlatIconName } from '../../../components/FlatIcon';
import { InputType } from '../../../components/Input';
import {
  ModalContainerItemDirection,
  ModalContentItemType,
} from '../../../components/Modal';
import {
  SettingsItem,
  SettingsItemType,
} from '../../../components/SettingsItem';
import { StatusTextType } from '../../../components/StatusText';
import { STATUS_TEXT_TIMEOUT } from '../../../constants/timeouts';
import { ModalController } from '../../../controller/modal';
import { v1RetrieveSubscription } from '../../../data/apis/subscription/v1RetrieveSubscription';
import { v1UserUpdate } from '../../../data/apis/user/v1UserUpdate';
import { getAccountOverview } from '../../../data/stores/overview';
import { AccessToken } from '../../../helpers/account/accessToken';
import { signOutCurrentAccount } from '../../../helpers/account/signOut';
import { langKeys } from '../../../translations/keys';
import { HTTP_STATUS } from '../../../utils/data/fetch';

const getHighRiskSettingsContent = (): HTMLDivElement[] => {
  const { getCurrentAccountData } = AccessToken();
  const accountOverview = getAccountOverview();

  const modalController = ModalController();

  const accountDeleteElement = SettingsItem({
    title: langKeys().SettingsModalHighRiskDeleteAccountTextTitle,
    description: langKeys().SettingsModalHighRiskDeleteAccountTextDescription,
    item: {
      type: SettingsItemType.BUTTON,
      button: {
        id: 'button__fitlcxlief',
        text: langKeys().SettingsModalHighRiskDeleteAccountButtonDelete,
        loadingText: undefined,
        leftIcon: undefined,
        rightIcon: undefined,
        color: ButtonColor.DANGER,
        onClick: (): void => {
          const modal = modalController.showModal({
            id: 'modal__unrghhhgak',
            title: langKeys().ModalAccountDeleteConfirmationTextTitle,
            content: [
              {
                type: ModalContentItemType.TEXT,
                text: langKeys().ModalAccountDeleteConfirmationTextContent,
              },
              {
                type: ModalContentItemType.TEXT,
                text: langKeys()
                  .ModalAccountDeleteConfirmationTextContentNotice,
              },
              {
                type: ModalContentItemType.INPUT,
                direction: ModalContainerItemDirection.ROW,
                inputs: [
                  {
                    title: undefined,
                    input: {
                      id: 'input__xbuqaocryp',
                      text: undefined,
                      placeholderText: `please delete ${accountOverview.emailAddress}`,
                      inlineButton: undefined,
                      statusText: undefined,
                      type: InputType.TEXT,
                      onSubmit: async (): Promise<void> =>
                        await checkAndDeleteAccount(),
                    },
                  },
                ],
              },
              {
                type: ModalContentItemType.BUTTON,
                direction: ModalContainerItemDirection.ROW,
                buttons: [
                  {
                    id: 'button__kjzbtjmlwu',
                    text: langKeys().ModalAccountDeleteConfirmationButtonCancel,
                    loadingText: undefined,
                    leftIcon: undefined,
                    color: ButtonColor.NEUTRAL,
                    onClick: (): void =>
                      modalController.closeModal('modal__unrghhhgak'),
                  },
                  {
                    id: 'button__usagxhtwyl',
                    text: langKeys()
                      .ModalAccountDeleteConfirmationButtonConfirm,
                    loadingText:
                      langKeys().ModalAccountDeleteConfirmationButtonDeleting,
                    leftIcon: FlatIcon(FlatIconName._18_TRASH),
                    color: ButtonColor.DANGER,
                    onClick: async (): Promise<void> =>
                      await checkAndDeleteAccount(),
                  },
                ],
              },
            ],
            width: 512,
          });

          modal.inputs.input__xbuqaocryp.focus();

          const checkAndDeleteAccount = async (): Promise<void> => {
            const input = modal.inputs.input__xbuqaocryp;
            const button = modal.buttons.button__usagxhtwyl;

            button.setLoading(true);

            if (!confirmText(input.getValue())) {
              input.setStatusText({
                id: 'status_text__rdjdduikzs',
                text: langKeys().ErrorAccountDeleteConfirmationFailed,
                type: StatusTextType.ERROR,
                isIconVisible: false,
              });

              input.clearStatusTextAfterDelay(STATUS_TEXT_TIMEOUT.SHORT);
              button.setLoading(false);
              return;
            }

            const isInFree = await checkSubscription();
            if (!isInFree) {
              input.setStatusText({
                id: 'status_text__rdjdduikzs',
                text: langKeys().ErrorAccountDeleteAlreadyInSubscription,
                type: StatusTextType.ERROR,
                isIconVisible: false,
              });

              input.clearStatusTextAfterDelay(STATUS_TEXT_TIMEOUT.SHORT);
              button.setLoading(false);
              return;
            }

            const { status } = await v1UserUpdate({
              accessToken: getCurrentAccountData()?.access_token ?? '',
              status: 'pending-deletion',
            });

            if (status !== HTTP_STATUS.NO_CONTENT) {
              input.setStatusText({
                id: 'status_text__rdjdduikzs',
                text: langKeys().ErrorApiInternalServerError,
                type: StatusTextType.ERROR,
                isIconVisible: false,
              });

              input.clearStatusTextAfterDelay(STATUS_TEXT_TIMEOUT.SHORT);
              button.setLoading(false);
              return;
            }

            await signOutCurrentAccount();
          };

          const checkSubscription = async (): Promise<boolean> => {
            const { status, response } = await v1RetrieveSubscription({
              accessToken: getCurrentAccountData()?.access_token ?? '',
            });

            if (status !== HTTP_STATUS.OK) {
              return false;
            }

            const subscriptionStatus = response?.results.status;
            if (!subscriptionStatus) {
              return false;
            }

            return !(subscriptionStatus === 'active');
          };

          const confirmText = (value: string): boolean =>
            value === `please delete ${accountOverview.emailAddress}`;
        },
      },
    },
  });

  return [accountDeleteElement.element];
};

export { getHighRiskSettingsContent };
