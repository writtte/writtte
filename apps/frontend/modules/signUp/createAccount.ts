import type { TReturnAuthenticationButton } from '../../components/AuthenticationButton';
import type { TReturnInput } from '../../components/Input';
import { ERROR_CODES, validate } from '@writtte-internal/validate';
import { StatusTextType } from '../../components/StatusText';
import { PATHS } from '../../constants/paths';
import { REGEX } from '../../constants/regex';
import { WAIT_TIMEOUT } from '../../constants/timeouts';
import { v1SignIn } from '../../data/apis/authentication/v1SignIn';
import { v1SignUp } from '../../data/apis/authentication/v1SignUp';
import { TokenGenerateType } from '../../data/apis/temporaryToken/v1GenerateTemporaryToken';
import { v1TemporaryTokenValidate } from '../../data/apis/temporaryToken/v1ValidateTemporaryToken';
import { AccessToken } from '../../helpers/account/accessToken';
import { handleHTTPError } from '../../helpers/http/httpError';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';
import { navigate } from '../../utils/routes/routes';
import { decodeArrayParam } from '../../utils/string/decodeArrayParam';

const createUserAccount = async (
  nameInput: TReturnInput,
  passwordInput: TReturnInput,
  passwordConfirmationInput: TReturnInput,
  button: TReturnAuthenticationButton,
): Promise<void> => {
  nameInput.setStatusText(undefined);
  passwordInput.setStatusText(undefined);
  passwordConfirmationInput.setStatusText(undefined);

  button.setLoadingState(true);

  const { nameError, passwordError, passwordConfirmError } = validateForm(
    nameInput.getValue(),
    passwordInput.getValue(),
    passwordConfirmationInput.getValue(),
  );

  if (nameError) {
    nameInput.setStatusText({
      id: 'status_text__bmsrzexcvb',
      text: nameError ?? langKeys().ErrorApiInternalServerError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    button.setLoadingState(false);
    return;
  }

  if (passwordError) {
    passwordInput.setStatusText({
      id: 'status_text__jcnuxwlnsc',
      text: passwordError ?? langKeys().ErrorApiInternalServerError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    button.setLoadingState(false);
    return;
  }

  if (passwordConfirmError) {
    passwordConfirmationInput.setStatusText({
      id: 'status_text__uembcuhsqp',
      text: passwordConfirmError ?? langKeys().ErrorApiInternalServerError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    button.setLoadingState(false);
    return;
  }

  const { isExtracted, extractedData } = extractParamData(button);
  if (!isExtracted || extractedData === undefined) {
    button.setLoadingState(false);
    return;
  }

  const { email, code } = extractedData;

  const { status: temporaryTokenValidateStatus } =
    await v1TemporaryTokenValidate({
      type: TokenGenerateType.SIGN_UP_VERIFY,
      key: email,
      value: code,
    });

  if (temporaryTokenValidateStatus !== HTTP_STATUS.OK) {
    button.setStatusText({
      id: 'status_text__jaslvcwwxj',
      text: langKeys().ErrorApiForbidden,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    button.setLoadingState(false);
    return;
  }

  const { status, response } = await v1SignUp({
    email,
    name: nameInput.getValue(),
    password: passwordInput.getValue(),
  });

  if (status !== HTTP_STATUS.CREATED || !response) {
    const httpError = handleHTTPError(status, {
      [HTTP_STATUS.CONFLICT]: langKeys().ErrorAccountAlreadyExists,
    });

    button.setStatusText({
      id: 'status_text__jaslvcwwxj',
      text: httpError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    button.setLoadingState(false);
    return;
  }

  setTimeout(async (): Promise<void> => {
    // Once the account is successfully created, pause for few seconds
    // to allow processing to complete, then automatically sign the user in.

    const { status: signInStatus, response: signInResponse } = await v1SignIn({
      email,
      password: passwordInput.getValue(),
    });

    if (signInStatus !== HTTP_STATUS.OK || !signInResponse) {
      await navigate(PATHS.SIGN_IN);
      return;
    }

    const { name, email_address, account_code, access_token, refresh_token } =
      signInResponse.results;

    const accessToken = AccessToken();

    accessToken.setAccounts(account_code, {
      name,
      email_address,
      access_token,
      refresh_token,
    });

    await navigate(PATHS.ONBOARDING);
  }, WAIT_TIMEOUT.SHORT);
};

const extractParamData = (
  button: TReturnAuthenticationButton,
): {
  isExtracted: boolean;
  extractedData:
    | {
        email: string;
        code: string;
        time: string;
      }
    | undefined;
} => {
  const params = new URLSearchParams(window.location.search);
  const dataParam = params.get('data');

  const setForbiddenError = (): void => {
    button.setStatusText({
      id: 'status_text__jaslvcwwxj',
      text: langKeys().ErrorApiForbidden,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    return;
  };

  if (!dataParam || dataParam.length <= 0) {
    setForbiddenError();
    return {
      isExtracted: false,
      extractedData: undefined,
    };
  }

  const decodedData = decodeArrayParam<{
    email: string;
    code: string;
    time: string;
  }>(dataParam, ['email', 'code', 'time']);

  if (!decodedData) {
    setForbiddenError();
    return {
      isExtracted: false,
      extractedData: undefined,
    };
  }

  if (!decodedData.email || !decodedData.code || !decodedData.time) {
    setForbiddenError();
    return {
      isExtracted: false,
      extractedData: undefined,
    };
  }

  return {
    isExtracted: true,
    extractedData: {
      email: decodedData.email,
      code: decodedData.code,
      time: decodedData.time,
    },
  };
};

const validateForm = (
  name: string,
  password: string,
  confirmPassword: string,
): {
  isValid: boolean;
  nameError: string | null;
  passwordError: string | null;
  passwordConfirmError: string | null;
} => {
  const { isValid, results } = validate([
    {
      name: 'name',
      value: name,
      rules: {
        min: 2,
        max: 256,
        required: true,
      },
    },
    {
      name: 'password',
      value: password,
      rules: {
        pattern: REGEX.PASSWORD,
        min: 8,
        max: 256,
        required: true,
      },
    },
  ]);

  var passwordConfirmError = langKeys().ErrorPasswordMismatch;

  if (isValid) {
    return {
      isValid: password.trim() === confirmPassword.trim(),
      nameError: null,
      passwordError: null,
      passwordConfirmError:
        password.trim() === confirmPassword.trim()
          ? null
          : passwordConfirmError,
    };
  }

  const nameResult = results.find((r) => r.name === 'name');
  const passwordResult = results.find((r) => r.name === 'password');

  if (
    !nameResult ||
    !passwordResult ||
    (nameResult.errors && nameResult.errors.length > 0) ||
    (passwordResult.errors && passwordResult.errors.length > 0)
  ) {
    const nameError = nameResult?.errors[0];
    const passwordError = passwordResult?.errors[0];

    let nameErrorStr = '';
    switch (nameError) {
      case ERROR_CODES.REQUIRED:
        nameErrorStr = langKeys().ErrorNameRequired;
        break;

      case ERROR_CODES.MIN:
        nameErrorStr = langKeys().ErrorNameMin;
        break;

      case ERROR_CODES.MAX:
        nameErrorStr = langKeys().ErrorNameMax;
        break;
    }

    let passwordErrorStr = '';
    switch (passwordError) {
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

    return {
      isValid: false,
      nameError: nameErrorStr ?? null,
      passwordError: passwordErrorStr ?? null,
      passwordConfirmError:
        password.trim() === confirmPassword.trim()
          ? null
          : passwordConfirmError,
    };
  }

  return {
    isValid: password.trim() === confirmPassword.trim(),
    nameError: null,
    passwordError: null,
    passwordConfirmError:
      password.trim() === confirmPassword.trim() ? null : passwordConfirmError,
  };
};

export { createUserAccount };
