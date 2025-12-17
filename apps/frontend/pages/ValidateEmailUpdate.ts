import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { PATHS } from '../constants/paths';
import { ALERT_TIMEOUT, WAIT_TIMEOUT } from '../constants/timeouts';
import { AlertController } from '../controller/alert';
import { TokenGenerateType } from '../data/apis/temporaryToken/v1GenerateTemporaryToken';
import { v1TemporaryTokenValidate } from '../data/apis/temporaryToken/v1ValidateTemporaryToken';
import { handleHTTPError } from '../helpers/http/httpError';
import { langKeys } from '../translations/keys';
import { HTTP_STATUS } from '../utils/data/fetch';
import { navigateHard } from '../utils/routes/helpers';
import { decodeArrayParam } from '../utils/string/decodeArrayParam';
import { isExpired } from '../utils/time/isExpired';

const ValidateEmailUpdatePage = async (): Promise<HTMLElement> => {
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('validate-page');

  const loadingIndicatorElement = LoadingIndicator({
    id: 'loading_indicator__xjjueqiwjx',
    text: langKeys().LoadingTextVerifyingEmailUpdateLink,
    isOverlay: true,
  }).element;

  containerDiv.appendChild(loadingIndicatorElement);

  const alertController = AlertController();

  const params = new URLSearchParams(window.location.search);
  const dataParam = params.get('data');

  if (!dataParam || dataParam.length <= 0) {
    containerDiv.replaceChildren(
      ErrorMessage({
        title: langKeys().ErrorMessageNotFoundTitle,
        description: langKeys().ErrorMessageNotFoundDescription,
      }),
    );

    return containerDiv;
  }

  const decodedData = decodeArrayParam<{
    email: string;
    code: string;
    'account-code': string;
    'new-email': string;
    time: string;
  }>(dataParam, ['email', 'code', 'account-code', 'new-email', 'time']);

  if (!decodedData) {
    containerDiv.replaceChildren(
      ErrorMessage({
        title: langKeys().ErrorMessageNotFoundTitle,
        description: langKeys().ErrorMessageNotFoundDescription,
      }),
    );

    return containerDiv;
  }

  if (isExpired(decodedData.time, 15 * 60 * 1000)) {
    containerDiv.replaceChildren(
      ErrorMessage({
        title: langKeys().ErrorMessageNotFoundTitle,
        description: langKeys().ErrorMessageNotFoundDescription,
      }),
    );

    return containerDiv;
  }

  try {
    const { status } = await v1TemporaryTokenValidate({
      type: TokenGenerateType.EMAIL_UPDATE,
      key: decodedData['account-code'],
      value: decodedData.code,
      emailToUpdate: decodedData['new-email'],
    });

    if (status !== HTTP_STATUS.OK) {
      const errorMessage = handleHTTPError(status, {
        [HTTP_STATUS.NOT_FOUND]: langKeys().ErrorMessageNotFoundDescription,
      });

      containerDiv.replaceChildren(
        ErrorMessage({
          title: langKeys().ErrorMessageNotFoundTitle,
          description: errorMessage,
        }),
      );

      return containerDiv;
    }

    alertController.showAlert(
      {
        id: 'alert__bhcrgkbgkz',
        title: langKeys().AlertEmailVerifiedTitle,
        description: langKeys().AlertEmailVerifiedDescription,
      },
      ALERT_TIMEOUT.LONG,
    );

    await new Promise((res) => setTimeout(res, WAIT_TIMEOUT.LONG));

    await navigateHard(PATHS.OVERVIEW);
  } catch {
    containerDiv.replaceChildren(
      ErrorMessage({
        title: langKeys().ErrorMessageNotFoundTitle,
        description: langKeys().ErrorApiInternalServerError,
      }),
    );
  }

  return containerDiv;
};

export { ValidateEmailUpdatePage };
