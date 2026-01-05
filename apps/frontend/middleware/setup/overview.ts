import { AnimatedIcon, AnimatedIconName } from '../../components/AnimatedIcon';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ErrorMessageController } from '../../controller/errorMessage';
import { v1AccountOverview } from '../../data/apis/overview/v1AccountOverview';
import {
  isOverviewLoaded,
  updateAccountOverview,
  updateOverviewLoadedStatus,
} from '../../data/stores/overview';
import { AccessToken } from '../../helpers/account/accessToken';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';
import { minimumDelay } from '../../utils/time/minimumDelay';

const overviewMinimumDelayTime = 800;

let fetchPromise: Promise<void> | null = null;

const ensureAccountOverviewLoaded = async (): Promise<void> => {
  if (isOverviewLoaded === true) {
    return;
  }

  if (!fetchPromise) {
    fetchPromise = setAccountOverview();
  }

  await fetchPromise;
};

const resetAccountOverviewCache = (): void => {
  fetchPromise = null;
  updateOverviewLoadedStatus(false);
};

const setAccountOverview = async (): Promise<void> => {
  const errorMessageController = ErrorMessageController();
  const { getCurrentAccountData } = AccessToken();

  const loadingIndicatorElement = LoadingIndicator({
    id: 'loading_indicator__ywpzqvfuth',
    text: undefined,
    animatedIcon: AnimatedIcon(AnimatedIconName._26_WRITTTE_LOGO_SPINNER),
    shouldHideLogoInOverlay: true,
    isOverlay: true,
  }).element;

  document.body.appendChild(loadingIndicatorElement);

  // Execute API call with minimum display time of 500ms
  const { status, response } = await minimumDelay(
    v1AccountOverview({
      accessToken: getCurrentAccountData()?.access_token ?? '',
    }),
    overviewMinimumDelayTime,
  );

  if (status !== HTTP_STATUS.OK || !response) {
    errorMessageController.showError({
      title: langKeys().ErrorMessageOverviewNotLoadedTitle,
      description: langKeys().ErrorMessageOverviewNotLoadedDescription,
    });

    return;
  }

  updateAccountOverview({
    code: response.results.account_code,
    emailAddress: response.results.email_address,
    name: response.results.name,
    status: response.results.status,
    subscriptionStatus: response.results.subscription_status,
    availableFreeTrialDates: response.results.available_free_trial_dates,
    isEmailVerified: response.results.is_email_verified,
  });

  document.body.removeChild(loadingIndicatorElement);

  updateOverviewLoadedStatus(true);
};

export { ensureAccountOverviewLoaded, resetAccountOverviewCache };
