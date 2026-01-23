import { ERROR_CODES, validate } from '@writtte-internal/validate';
import { InputType } from '../../../components/Input';
import {
  SettingsItem,
  SettingsItemType,
} from '../../../components/SettingsItem';
import { ALERT_TIMEOUT, DEBOUNCE_TIMEOUT } from '../../../constants/timeouts';
import { AlertController } from '../../../controller/alert';
import { v1UserUpdate } from '../../../data/apis/user/v1UserUpdate';
import {
  getAccountOverview,
  updateAccountOverview,
} from '../../../data/stores/overview';
import { AccessToken } from '../../../helpers/account/accessToken';
import { handleHTTPError } from '../../../helpers/http/httpError';
import { langKeys } from '../../../translations/keys';
import { HTTP_STATUS } from '../../../utils/data/fetch';
import { debounce } from '../../../utils/time/debounce';

const getOverviewSettingsContent = (): HTMLDivElement[] => {
  const alertController = AlertController();

  const { getCurrentAccountData } = AccessToken();
  const accountOverview = getAccountOverview();

  const nameUpdateElement = SettingsItem({
    title: langKeys().SettingsModalOverviewUpdateNameTextTitle,
    description: langKeys().SettingsModalOverviewUpdateNameTextDescription,
    item: {
      type: SettingsItemType.INPUT,
      input: {
        id: 'input__vijxwyggzm',
        text: accountOverview.name,
        placeholderText:
          langKeys().SettingsModalOverviewUpdateNameInputPlaceholder,
        inlineButton: undefined,
        statusText: undefined,
        type: InputType.TEXT,
        onChange: debounce(
          async (value: string): Promise<void> => {
            const { isValid, results } = validate([
              {
                name: 'name',
                value: value.trim(),
                rules: {
                  min: 2,
                  max: 256,
                  required: true,
                },
              },
            ]);

            var nameErrorStr = '';

            const nameResult = results.find((r) => r.name === 'name');

            if (
              !isValid ||
              !nameResult ||
              (nameResult.errors && nameResult.errors.length > 0)
            ) {
              switch (nameResult?.errors[0]) {
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

              alertController.showAlert(
                {
                  id: 'alert__rpjplskoje',
                  title: langKeys().AlertAccountNameUpdateFailedTitle,
                  description: nameErrorStr,
                },
                ALERT_TIMEOUT.SHORT,
              );

              return;
            }

            const { status } = await v1UserUpdate({
              accessToken: getCurrentAccountData()?.access_token ?? '',
              name: value.trim(),
            });

            if (status !== HTTP_STATUS.NO_CONTENT) {
              const httpError = handleHTTPError(status, undefined);

              alertController.showAlert(
                {
                  id: 'alert__eqwnvmyzsj',
                  title: langKeys().AlertAccountNameUpdateFailedTitle,
                  description: httpError,
                },
                ALERT_TIMEOUT.SHORT,
              );

              return;
            }

            alertController.showAlert(
              {
                id: 'alert__ccmlrmoyvm',
                title: langKeys().AlertAccountNameUpdateSuccessTitle,
                description:
                  langKeys().AlertAccountNameUpdateSuccessDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            // After updating the name, it should be updated in the account
            // overview store and on the overview page title.

            updateAccountOverview({
              name: value.trim(),
            });
          },
          {
            delay: DEBOUNCE_TIMEOUT.SHORT,
          },
        ),
        onSubmit: undefined,
        title: undefined,
      },
    },
  });

  return [nameUpdateElement.element];
};

export { getOverviewSettingsContent };
