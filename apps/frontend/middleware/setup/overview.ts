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

  const { status, response } = await v1AccountOverview({
    accessToken: getCurrentAccountData()?.access_token ?? '',
  });

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

  updateOverviewLoadedStatus(true);
};

export { ensureAccountOverviewLoaded, resetAccountOverviewCache };
