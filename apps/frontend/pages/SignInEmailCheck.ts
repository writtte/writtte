import { AnimatedIcon, AnimatedIconName } from '../components/AnimatedIcon';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { PATHS } from '../constants/paths';
import { AccessToken } from '../helpers/account/accessToken';
import { langKeys } from '../translations/keys';
import { navigateHard } from '../utils/routes/helpers';
import { decodeArrayParam } from '../utils/string/decodeArrayParam';
import { isExpired } from '../utils/time/isExpired';

const SignInEmailCheckPage = async (): Promise<HTMLElement> => {
  if (!checkParams()) {
    return ErrorMessage({
      title: langKeys().ErrorMessageNotFoundTitle,
      description: langKeys().ErrorMessageNotFoundDescription,
    });
  }

  navigateHard(PATHS.OVERVIEW);

  return LoadingIndicator({
    id: 'loading_indicator__cbxmwowiyf',
    text: langKeys().LoadingTextCheckingMagicLink,
    animatedIcon: AnimatedIcon(AnimatedIconName._18_CIRCLE_SPINNER),
    shouldHideLogoInOverlay: false,
    isOverlay: true,
  }).element;
};

const checkParams = (): boolean => {
  const params = new URLSearchParams(window.location.search);
  const dataParam = params.get('data');

  if (!dataParam || dataParam.length <= 0) {
    return false;
  }

  const decodedData = decodeArrayParam<{
    time: string;
    name: string;
    account_code: string;
    email_address: string;
    access_token: string;
    refresh_token: string;
  }>(dataParam, [
    'time',
    'name',
    'account_code',
    'email_address',
    'access_token',
    'refresh_token',
  ]);

  if (!decodedData) {
    return false;
  }

  if (isExpired(decodedData.time, 30 * 60 * 1000)) {
    return false;
  }

  const accessToken = AccessToken();

  accessToken.setAccounts(decodedData.account_code, {
    name: decodedData.name,
    email_address: decodedData.email_address,
    access_token: decodedData.access_token,
    refresh_token: decodedData.refresh_token,
  });

  return true;
};

export { SignInEmailCheckPage };
