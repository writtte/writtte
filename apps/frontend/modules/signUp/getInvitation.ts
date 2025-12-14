import type { TReturnAuthenticationButton } from '../../components/AuthenticationButton';
import type { TReturnInput } from '../../components/Input';
import { ERROR_CODES, validate } from '@velovra-internal/validate';
import { StatusTextType } from '../../components/StatusText';
import { REGEX } from '../../constants/regex';
import { ALERT_TIMEOUT } from '../../constants/timeouts';
import { AlertController } from '../../controller/alert';
import {
  TokenGenerateType,
  v1TemporaryTokenGenerate,
} from '../../data/apis/temporaryToken/v1GenerateTemporaryToken';
import { handleHTTPError } from '../../helpers/http/httpError';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

const getSignUpInvitation = async (
  emailInput: TReturnInput,
  button: TReturnAuthenticationButton,
): Promise<void> => {
  emailInput.setStatusText(undefined);
  button.setLoadingState(true);

  const alertController = AlertController();

  const { isValid, error } = validateForm(emailInput.getValue());
  if (!isValid || error) {
    emailInput.setStatusText({
      id: 'status_text__tayfolkqid',
      text: error ?? langKeys().ErrorApiInternalServerError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    button.setLoadingState(false);
    return;
  }

  const { status } = await v1TemporaryTokenGenerate({
    type: TokenGenerateType.SIGN_UP_VERIFY,
    email: emailInput.getValue(),
    key: emailInput.getValue(),
  });

  if (status !== HTTP_STATUS.CREATED) {
    const httpError = handleHTTPError(status, undefined);

    button.setStatusText({
      id: 'status_text__chahlwfxtm',
      text: httpError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    button.setLoadingState(false);
    return;
  }

  alertController.showAlert(
    {
      id: 'alert__cxswunnauy',
      title: langKeys().AlertSignUpInvitationSentTitle,
      description: langKeys().AlertSignUpInvitationSentDescription,
    },
    ALERT_TIMEOUT.SHORT,
  );

  emailInput.setValue(undefined);
  button.setLoadingState(false);
};

const validateForm = (
  email: string,
): {
  isValid: boolean;
  error: string | null;
} => {
  const { isValid, results } = validate([
    {
      name: 'email-address',
      value: email,
      rules: {
        pattern: REGEX.EMAIL,
        min: 4,
        max: 512,
        required: true,
      },
    },
  ]);

  if (isValid) {
    return {
      isValid: true,
      error: null,
    };
  }

  const emailResult = results.find((r) => r.name === 'email-address');
  if (!emailResult || !emailResult.errors || emailResult.errors.length === 0) {
    return {
      isValid: true,
      error: '',
    };
  }

  const emailError = emailResult.errors[0];

  let errorStr = '';
  switch (emailError) {
    case ERROR_CODES.PATTERN:
      errorStr = langKeys().ErrorEmailInvalid;
      break;

    case ERROR_CODES.REQUIRED:
      errorStr = langKeys().ErrorEmailRequired;
      break;

    case ERROR_CODES.MIN:
      errorStr = langKeys().ErrorEmailMin;
      break;

    case ERROR_CODES.MAX:
      errorStr = langKeys().ErrorEmailMax;
      break;
  }

  return {
    isValid: !errorStr,
    error: errorStr,
  };
};

export { getSignUpInvitation };
