import { ERROR_CODES, validate } from '@writtte-internal/validate';
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
import { REGEX } from '../../../constants/regex';
import {
  ALERT_TIMEOUT,
  STATUS_TEXT_TIMEOUT,
} from '../../../constants/timeouts';
import { AlertController } from '../../../controller/alert';
import { ModalController } from '../../../controller/modal';
import {
  TokenGenerateType,
  v1TemporaryTokenGenerate,
} from '../../../data/apis/temporaryToken/v1GenerateTemporaryToken';
import { v1UserUpdate } from '../../../data/apis/user/v1UserUpdate';
import { getAccountOverview } from '../../../data/stores/overview';
import { AccessToken } from '../../../helpers/account/accessToken';
import { handleHTTPError } from '../../../helpers/http/httpError';
import { langKeys } from '../../../translations/keys';
import { HTTP_STATUS } from '../../../utils/data/fetch';

const getSecuritySettingsContent = (): HTMLDivElement[] => {
  const { getCurrentAccountData } = AccessToken();
  const accountOverview = getAccountOverview();

  const alertController = AlertController();
  const modalController = ModalController();

  const emailUpdateElement = SettingsItem({
    title: langKeys().SettingsModalSecurityUpdateEmailTextTitle,
    description: langKeys().SettingsModalSecurityUpdateEmailTextDescription,
    item: {
      type: SettingsItemType.BUTTON,
      button: {
        id: 'button__ffagvnisny',
        text: langKeys().SettingsModalSecurityUpdateEmailButtonUpdate,
        loadingText: undefined,
        leftIcon: undefined,
        rightIcon: undefined,
        color: ButtonColor.NEUTRAL,
        onClick: (): void => {
          const modal = modalController.showModal({
            id: 'modal__xytmtsbgho',
            title: langKeys().ModalEmailUpdateTextTitle,
            content: [
              {
                type: ModalContentItemType.TEXT,
                text: langKeys().ModalEmailUpdateTextContent,
              },
              {
                type: ModalContentItemType.INPUT,
                direction: ModalContainerItemDirection.ROW,
                inputs: [
                  {
                    title: undefined,
                    input: {
                      id: 'input__fawmwhkzme',
                      text: accountOverview.emailAddress,
                      placeholderText: langKeys().InputPlaceholderEmailAddress,
                      inlineButton: undefined,
                      statusText: undefined,
                      type: InputType.TEXT,
                      onSubmit: async (): Promise<void> =>
                        await sendEmailUpdateRequest(),
                    },
                  },
                ],
              },
              {
                type: ModalContentItemType.BUTTON,
                direction: ModalContainerItemDirection.ROW,
                buttons: [
                  {
                    id: 'button__nfukoizbpa',
                    text: langKeys().ModalEmailUpdateButtonCancel,
                    loadingText: undefined,
                    leftIcon: undefined,
                    color: ButtonColor.NEUTRAL,
                    onClick: (): void =>
                      modalController.closeModal('modal__xytmtsbgho'),
                  },
                  {
                    id: 'button__vgzgeojcri',
                    text: langKeys().ModalEmailUpdateButtonSend,
                    loadingText: langKeys().ModalEmailUpdateButtonSending,
                    leftIcon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
                    color: ButtonColor.PRIMARY,
                    onClick: async (): Promise<void> =>
                      await sendEmailUpdateRequest(),
                  },
                ],
              },
            ],
            width: 512,
          });

          const sendEmailUpdateRequest = async (): Promise<void> => {
            const input = modal.inputs.input__fawmwhkzme;
            const button = modal.buttons.button__vgzgeojcri;

            button.setLoading(true);

            const { isValid, results } = validate([
              {
                name: 'email-address',
                value: input.getValue(),
                rules: {
                  pattern: REGEX.EMAIL,
                  min: 4,
                  max: 512,
                  required: true,
                },
              },
            ]);

            var emailErrorStr = '';

            const emailResult = results.find((r) => r.name === 'email-address');

            if (
              !isValid ||
              !emailResult ||
              (emailResult.errors && emailResult.errors.length > 0)
            ) {
              switch (emailResult?.errors[0]) {
                case ERROR_CODES.PATTERN:
                  emailErrorStr = langKeys().ErrorEmailInvalid;
                  break;

                case ERROR_CODES.REQUIRED:
                  emailErrorStr = langKeys().ErrorEmailRequired;
                  break;

                case ERROR_CODES.MIN:
                  emailErrorStr = langKeys().ErrorEmailMin;
                  break;

                case ERROR_CODES.MAX:
                  emailErrorStr = langKeys().ErrorEmailMax;
                  break;
              }

              input.setStatusText({
                id: 'status_text__jxgribhweq',
                text: emailErrorStr,
                type: StatusTextType.ERROR,
                isIconVisible: false,
              });

              input.clearStatusTextAfterDelay(STATUS_TEXT_TIMEOUT.SHORT);
              button.setLoading(false);
              return;
            }

            const { status } = await v1TemporaryTokenGenerate({
              type: TokenGenerateType.EMAIL_UPDATE,
              email: input.getValue().trim(),
              key: accountOverview.code,
              newAccountEmailAddress: input.getValue().trim(),
            });

            if (status !== HTTP_STATUS.CREATED) {
              const httpError = handleHTTPError(status, undefined);

              input.setStatusText({
                id: 'status_text__jxgribhweq',
                text: httpError,
                type: StatusTextType.ERROR,
                isIconVisible: false,
              });

              input.clearStatusTextAfterDelay(STATUS_TEXT_TIMEOUT.SHORT);

              button.setLoading(false);
              return;
            }

            // Do not update the email address in the account overview
            // here, because this process only sends a verification email
            // and does not update the current email directly.

            alertController.showAlert(
              {
                id: 'alert__mfnoqqssia',
                title: langKeys().AlertEmailUpdateRequestSentTitle,
                description: langKeys().AlertEmailUpdateRequestSentDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            modalController.closeModal('modal__xytmtsbgho');
          };
        },
      },
    },
  });

  const passwordUpdateElement = SettingsItem({
    title: langKeys().SettingsModalSecurityUpdatePasswordTextTitle,
    description: langKeys().SettingsModalSecurityUpdatePasswordTextDescription,
    item: {
      type: SettingsItemType.BUTTON,
      button: {
        id: 'button__rfyfpyewbv',
        text: langKeys().SettingsModalSecurityUpdatePasswordButtonUpdate,
        loadingText: undefined,
        leftIcon: undefined,
        rightIcon: undefined,
        color: ButtonColor.NEUTRAL,
        onClick: (): void => {
          const modal = modalController.showModal({
            id: 'modal__hupeqdndow',
            title: langKeys().ModalPasswordUpdateTextTitle,
            content: [
              {
                type: ModalContentItemType.TEXT,
                text: langKeys().ModalPasswordUpdateTextContent,
              },
              {
                type: ModalContentItemType.INPUT,
                direction: ModalContainerItemDirection.COLUMN,
                inputs: [
                  {
                    title: undefined,
                    input: {
                      id: 'input__znzeioyjkn',
                      text: undefined,
                      placeholderText: langKeys().InputPlaceholderPassword,
                      inlineButton: undefined,
                      statusText: undefined,
                      type: InputType.PASSWORD,
                      onSubmit: async (): Promise<void> =>
                        await updateAccountPassword(),
                    },
                  },
                  {
                    title: undefined,
                    input: {
                      id: 'input__fpymvxrnim',
                      text: undefined,
                      placeholderText:
                        langKeys().InputPlaceholderPasswordConfirm,
                      inlineButton: undefined,
                      statusText: undefined,
                      type: InputType.PASSWORD,
                      onSubmit: async (): Promise<void> =>
                        await updateAccountPassword(),
                    },
                  },
                ],
              },
              {
                type: ModalContentItemType.BUTTON,
                direction: ModalContainerItemDirection.ROW,
                buttons: [
                  {
                    id: 'button__whikgauuqn',
                    text: langKeys().ModalPasswordUpdateButtonCancel,
                    loadingText: undefined,
                    leftIcon: undefined,
                    color: ButtonColor.NEUTRAL,
                    onClick: (): void =>
                      modalController.closeModal('modal__hupeqdndow'),
                  },
                  {
                    id: 'button__kwildirfxa',
                    text: langKeys().ModalPasswordUpdateButtonUpdate,
                    loadingText: langKeys().ModalPasswordUpdateButtonUpdating,
                    leftIcon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
                    color: ButtonColor.PRIMARY,
                    onClick: async (): Promise<void> =>
                      await updateAccountPassword(),
                  },
                ],
              },
            ],
            width: 512,
          });

          const updateAccountPassword = async (): Promise<void> => {
            const button = modal.buttons.button__kwildirfxa;
            const passwordInput = modal.inputs.input__znzeioyjkn;
            const passwordConfirmInput = modal.inputs.input__fpymvxrnim;

            button.setLoading(true);

            const { isValid, results } = validate([
              {
                name: 'password',
                value: passwordInput.getValue(),
                rules: {
                  pattern: REGEX.PASSWORD,
                  min: 8,
                  max: 256,
                  required: true,
                },
              },
            ]);

            var passwordErrorStr = '';

            const passwordResult = results.find((r) => r.name === 'password');

            if (
              !isValid ||
              !passwordResult ||
              (passwordResult.errors && passwordResult.errors.length > 0)
            ) {
              switch (passwordResult?.errors[0]) {
                case ERROR_CODES.PATTERN:
                  passwordErrorStr = langKeys().ErrorPasswordInvalid;
                  break;

                case ERROR_CODES.REQUIRED:
                  passwordErrorStr = langKeys().ErrorPasswordRequired;
                  break;

                case ERROR_CODES.MIN:
                  passwordErrorStr = langKeys().ErrorPasswordMin;
                  break;

                case ERROR_CODES.MAX:
                  passwordErrorStr = langKeys().ErrorPasswordMax;
                  break;
              }

              passwordInput.setStatusText({
                id: 'status_text__sqybzxkovg',
                text: passwordErrorStr,
                type: StatusTextType.ERROR,
                isIconVisible: false,
              });

              passwordInput.clearStatusTextAfterDelay(
                STATUS_TEXT_TIMEOUT.SHORT,
              );

              button.setLoading(false);
              return;
            }

            if (passwordInput.getValue() !== passwordConfirmInput.getValue()) {
              passwordConfirmInput.setStatusText({
                id: 'status_text__blnsttslmp',
                text: langKeys().ErrorPasswordMismatch,
                type: StatusTextType.ERROR,
                isIconVisible: false,
              });

              passwordConfirmInput.clearStatusTextAfterDelay(
                STATUS_TEXT_TIMEOUT.SHORT,
              );

              button.setLoading(false);
              return;
            }

            const { status } = await v1UserUpdate({
              accessToken: getCurrentAccountData()?.access_token ?? '',
              password: passwordInput.getValue().trim(),
            });

            if (status !== HTTP_STATUS.NO_CONTENT) {
              const httpError = handleHTTPError(status, undefined);

              passwordInput.setStatusText({
                id: 'status_text__sqybzxkovg',
                text: httpError,
                type: StatusTextType.ERROR,
                isIconVisible: false,
              });

              passwordInput.clearStatusTextAfterDelay(
                STATUS_TEXT_TIMEOUT.SHORT,
              );

              return;
            }

            alertController.showAlert(
              {
                id: 'alert__mfnoqqssia',
                title: langKeys().AlertPasswordUpdatedTitle,
                description: langKeys().AlertPasswordUpdatedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            modalController.closeModal('modal__hupeqdndow');
          };
        },
      },
    },
  });

  return [emailUpdateElement.element, passwordUpdateElement.element];
};

export { getSecuritySettingsContent };
