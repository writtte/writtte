import { ButtonColor } from '../../../components/Button';
import { FlatIcon, FlatIconName } from '../../../components/FlatIcon';
import {
  SettingsItem,
  SettingsItemType,
  type TReturnSettingsItem,
} from '../../../components/SettingsItem';
import { FRONTEND_CONFIGS } from '../../../configs/fe';
import { PATHS } from '../../../constants/paths';
import { ALERT_TIMEOUT } from '../../../constants/timeouts';
import { AlertController } from '../../../controller/alert';
import { v1CreditRetrieve } from '../../../data/apis/credit/v1CreditRetrieve';
import { v1CheckoutSessionLink } from '../../../data/apis/external/polar/v1CheckoutSessionLink';
import { v1CustomerPortalLink } from '../../../data/apis/external/polar/v1CustomerPortalLink';
import { getAccountOverview } from '../../../data/stores/overview';
import { AccessToken } from '../../../helpers/account/accessToken';
import { langKeys } from '../../../translations/keys';
import { HTTP_STATUS } from '../../../utils/data/fetch';
import { navigateExternal } from '../../../utils/routes/helpers';

const getSubscriptionSettingsContent = (): HTMLDivElement[] => {
  const { getCurrentAccountData } = AccessToken();

  const accountOverview = getAccountOverview();

  const alertController = AlertController();

  const isInActiveSubscription =
    accountOverview.subscriptionStatus === 'active';

  const aiUsageElement = SettingsItem({
    title: langKeys().SettingsModalSubscriptionAiUsageTextTitle,
    description: langKeys().SettingsModalSubscriptionAiUsageTextDescription,
    item: {
      type: SettingsItemType.TEXT,
      title: langKeys().SettingsModalSubscriptionAiUsageTextLoading,
      description: langKeys().SettingsModalSubscriptionAiUsageTextLoading,
    },
  });

  const subscribeToPlanElement = SettingsItem({
    title: langKeys().SettingsModalSubscriptionSubscribeTextTitle,
    description: undefined,
    item: {
      type: SettingsItemType.BUTTON,
      button: {
        id: 'button__jowowqqysp',
        text: langKeys().SettingsModalSubscriptionSubscribeButtonPlans,
        loadingText: langKeys().SettingsModalSubscriptionSubscribeButtonWait,
        leftIcon: FlatIcon(FlatIconName._18_OPEN_NEW_TAB),
        rightIcon: undefined,
        color: ButtonColor.NEUTRAL,
        onClick: async (): Promise<void> => {
          subscribeToPlanElement.button?.setLoading(true);

          const { status, response } = await v1CheckoutSessionLink({
            accessToken: getCurrentAccountData()?.access_token ?? '',
            returnURL: `${FRONTEND_CONFIGS.URL}/${PATHS.DOCUMENTS}`,
          });

          if (status !== HTTP_STATUS.OK || !response) {
            alertController.showAlert(
              {
                id: 'alert__vrzvqebwch',
                title:
                  langKeys().AlertSubscriptionCheckoutSessionLinkFailedTitle,
                description:
                  langKeys()
                    .AlertSubscriptionCheckoutSessionLinkFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            subscribeToPlanElement.button?.setLoading(false);
            return;
          }

          navigateExternal(response.results.checkout_link);

          subscribeToPlanElement.button?.setLoading(false);
        },
      },
    },
  });

  const customerPortalElement = SettingsItem({
    title: langKeys().SettingsModalSubscriptionCustomerPortalTextTitle,
    description:
      langKeys().SettingsModalSubscriptionCustomerPortalTextDescription,
    item: {
      type: SettingsItemType.BUTTON,
      button: {
        id: 'button__zdbvhgbnse',
        text: langKeys().SettingsModalSubscriptionCustomerPortalButtonOpen,
        loadingText:
          langKeys().SettingsModalSubscriptionCustomerPortalButtonWait,
        leftIcon: FlatIcon(FlatIconName._18_OPEN_NEW_TAB),
        rightIcon: undefined,
        color: ButtonColor.NEUTRAL,
        onClick: async (): Promise<void> => {
          customerPortalElement.button?.setLoading(true);

          const { status, response } = await v1CustomerPortalLink({
            accessToken: getCurrentAccountData()?.access_token ?? '',
            returnURL: `${FRONTEND_CONFIGS.URL}/${PATHS.DOCUMENTS}`,
          });

          if (status !== HTTP_STATUS.OK || !response) {
            alertController.showAlert(
              {
                id: 'alert__wcmcahqyxa',
                title:
                  langKeys().AlertSubscriptionCustomerPortalLinkFailedTitle,
                description:
                  langKeys()
                    .AlertSubscriptionCustomerPortalLinkFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            customerPortalElement.button?.setLoading(false);
            return;
          }

          navigateExternal(response.results.portal_link);

          customerPortalElement.button?.setLoading(false);
        },
      },
    },
  });

  // biome-ignore lint/nursery/noFloatingPromises: A floating promise was required here
  (async (): Promise<void> => {
    await checkAndSetCreditUsage(aiUsageElement);
  })();

  return [
    aiUsageElement.element,
    ...(isInActiveSubscription
      ? [customerPortalElement.element]
      : [subscribeToPlanElement.element]),
  ];
};

const checkAndSetCreditUsage = async (
  element: TReturnSettingsItem,
): Promise<void> => {
  const { getCurrentAccountData } = AccessToken();

  const { status, response } = await v1CreditRetrieve({
    accessToken: getCurrentAccountData()?.access_token ?? '',
  });

  if (status !== HTTP_STATUS.OK || !response?.results) {
    element.setTextContent('0%', '0');
    return;
  }

  const { subscription, manual } = response.results;

  const totalAllocated =
    (subscription?.allocated_amount || 0) + (manual?.allocated_amount || 0);

  const totalAvailable =
    (subscription?.credit_amount || 0) + (manual?.credit_amount || 0);

  let percentageUsed = 0;
  if (totalAllocated > 0) {
    const used = totalAllocated - totalAvailable;

    percentageUsed = Math.round((used / totalAllocated) * 100);
    percentageUsed = Math.max(0, Math.min(100, percentageUsed));
  }

  const percentageText = `${percentageUsed}%`;

  const availableAmount = Number.isInteger(totalAvailable)
    ? totalAvailable.toString()
    : totalAvailable.toFixed(2);

  const totalAmountText = `${availableAmount} ${langKeys().SettingsModalSubscriptionAiUsageTextAvailable}`;

  element.setTextContent(percentageText, totalAmountText);
};

export { getSubscriptionSettingsContent };
