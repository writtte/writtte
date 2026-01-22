import type { TReturnAuthenticationButton } from '../../components/AuthenticationButton';
import type { TReturnInput } from '../../components/Input';
import { ERROR_CODES, validate } from '@writtte-internal/validate';
import { StatusTextType } from '../../components/StatusText';
import { PATHS } from '../../constants/paths';
import { REGEX } from '../../constants/regex';
import { v1SignIn } from '../../data/apis/authentication/v1SignIn';
import { AccessToken } from '../../helpers/account/accessToken';
import { handleHTTPError } from '../../helpers/http/httpError';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';
import { navigate } from '../../utils/routes/routes';

const signInToAccount = async (
  emailInput: TReturnInput,
  passwordInput: TReturnInput,
  button: TReturnAuthenticationButton,
): Promise<void> => {
  emailInput.setStatusText(undefined);
  passwordInput.setStatusText(undefined);

  button.setLoadingState(true);

  const { emailError, passwordError } = validateForm(
    emailInput.getValue(),
    passwordInput.getValue(),
  );

  if (emailError) {
    emailInput.setStatusText({
      id: 'status_text__hptzggphhq',
      text: emailError ?? langKeys().ErrorApiInternalServerError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    button.setLoadingState(false);
    return;
  }

  if (passwordError) {
    passwordInput.setStatusText({
      id: 'status_text__qxyphvvsqq',
      text: passwordError ?? langKeys().ErrorApiInternalServerError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    button.setLoadingState(false);
    return;
  }

  const { status, response } = await v1SignIn({
    email: emailInput.getValue(),
    password: passwordInput.getValue(),
  });

  if (status !== HTTP_STATUS.OK || !response) {
    const httpError = handleHTTPError(status, {
      [HTTP_STATUS.NOT_FOUND]: langKeys().ErrorAccountNotExists,
      [HTTP_STATUS.NO_CONTENT]: langKeys().ErrorAccountInvalidCredentials,
    });

    if (status === HTTP_STATUS.NO_CONTENT) {
      passwordInput.setStatusText({
        id: 'status_text__qxyphvvsqq',
        text: httpError,
        type: StatusTextType.ERROR,
        isIconVisible: true,
      });
    } else {
      emailInput.setStatusText({
        id: 'status_text__hptzggphhq',
        text: httpError,
        type: StatusTextType.ERROR,
        isIconVisible: true,
      });
    }

    button.setLoadingState(false);
    return;
  }

  const { name, email_address, account_code, access_token, refresh_token } =
    response.results;

  const accessToken = AccessToken();

  accessToken.setAccounts(account_code, {
    name,
    email_address,
    access_token,
    refresh_token,
  });

  await navigate(PATHS.DOCUMENTS);
};

const validateForm = (
  email: string,
  password: string,
): {
  isValid: boolean;
  emailError: string | null;
  passwordError: string | null;
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
    {
      name: 'password',
      value: password,
      rules: {
        required: true,
      },
    },
  ]);

  if (isValid) {
    return {
      isValid: true,
      emailError: null,
      passwordError: null,
    };
  }

  const emailResult = results.find((r) => r.name === 'email-address');
  const passwordResult = results.find((r) => r.name === 'password');

  let emailErrorStr = '';
  if (emailResult?.errors && emailResult.errors.length > 0) {
    switch (emailResult.errors[0]) {
      case ERROR_CODES.PATTERN:
        emailErrorStr = langKeys().ErrorEmailInvalid;
        break;
      case ERROR_CODES.REQUIRED:
        emailErrorStr = langKeys().ErrorEmailRequired;
        break;
    }
  }

  let passwordErrorStr = '';
  if (passwordResult?.errors && passwordResult.errors.length > 0) {
    if (passwordResult.errors[0] === ERROR_CODES.REQUIRED) {
      passwordErrorStr = langKeys().ErrorPasswordRequired;
    }
  }

  return {
    isValid: false,
    emailError: emailErrorStr ?? null,
    passwordError: passwordErrorStr ?? null,
  };
};

export { signInToAccount };
