import type { TReturnAuthenticationButton } from '../../components/AuthenticationButton';
import type { TReturnInput } from '../../components/Input';
import { ERROR_CODES, validate } from '@velovra-internal/validate';
import { StatusTextType } from '../../components/StatusText';
import { REGEX } from '../../constants/regex';
import { ALERT_TIMEOUT } from '../../constants/timeouts';
import { AlertController } from '../../controller/alert';
import { v1SignInLink } from '../../data/apis/authentication/v1SignInLink';
import { handleHTTPError } from '../../helpers/http/httpError';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

const getMagicSignInLink = async (
  emailInput: TReturnInput,
  button: TReturnAuthenticationButton,
): Promise<void> => {
  emailInput.setStatusText(undefined);
  button.setLoadingState(true);

  const alertController = AlertController();

  const { isValid, error } = validateForm(emailInput.getValue());
  if (!isValid || error) {
    emailInput.setStatusText({
      id: 'status_text__vqqtdesdug',
      text: error ?? langKeys().ErrorApiInternalServerError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    button.setLoadingState(false);
    return;
  }

  const { status } = await v1SignInLink({
    email: emailInput.getValue(),
  });

  if (status !== HTTP_STATUS.CREATED) {
    const httpError = handleHTTPError(status, {
      [HTTP_STATUS.NOT_FOUND]: langKeys().ErrorAccountNotExists,
    });

    button.setStatusText({
      id: 'status_text__ecdotmwqpq',
      text: httpError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    button.setLoadingState(false);
    return;
  }

  alertController.showAlert(
    {
      id: 'alert__xqbluhclqn',
      title: langKeys().AlertSignInMagicLinkSentTitle,
      description: langKeys().AlertSignInMagicLinkSentDescription,
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
      error: null,
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
  }

  return {
    isValid: !errorStr,
    error: errorStr,
  };
};

export { getMagicSignInLink };
