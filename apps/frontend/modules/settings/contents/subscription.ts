import { ButtonColor } from '../../../components/Button';
import { FlatIcon, FlatIconName } from '../../../components/FlatIcon';
import {
  SettingsItem,
  SettingsItemType,
} from '../../../components/SettingsItem';
import { FRONTEND_CONFIGS } from '../../../configs/fe';
import { PATHS } from '../../../constants/paths';
import { ALERT_TIMEOUT } from '../../../constants/timeouts';
import { AlertController } from '../../../controller/alert';
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

  const subscribeToPlanElement = SettingsItem({
    title: langKeys().SettingsModalSubscriptionSubscribeTextTitle,
    description: undefined,
    item: {
      type: SettingsItemType.BUTTON,
      button: {
        id: 'button__jowowqqysp',
        text: langKeys().SettingsModalSubscriptionSubscribeButtonPlans,
        loadingText: langKeys().SettingsModalSubscriptionSubscribeButtonWait,
        leftIcon: FlatIcon(FlatIconName._16_OPEN_NEW_TAB),
        rightIcon: undefined,
        color: ButtonColor.NEUTRAL,
        onClick: async (): Promise<void> => {
          subscribeToPlanElement.button?.setLoading(true);

          const { status, response } = await v1CheckoutSessionLink({
            accessToken: getCurrentAccountData()?.access_token ?? '',
            returnURL: `${FRONTEND_CONFIGS.URL}/${PATHS.OVERVIEW}`,
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
        leftIcon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
        rightIcon: undefined,
        color: ButtonColor.NEUTRAL,
        onClick: async (): Promise<void> => {
          customerPortalElement.button?.setLoading(true);

          const { status, response } = await v1CustomerPortalLink({
            accessToken: getCurrentAccountData()?.access_token ?? '',
            returnURL: `${FRONTEND_CONFIGS.URL}/${PATHS.OVERVIEW}`,
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

  return isInActiveSubscription
    ? [customerPortalElement.element]
    : [subscribeToPlanElement.element];
};

export { getSubscriptionSettingsContent };
