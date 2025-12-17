import { ERROR_CODES, validate } from '@velovra-internal/validate';
import { InputType } from '../../../components/Input';
import { updateOverviewTitle } from '../../../components/OverviewTitle';
import {
  SettingsItem,
  SettingsItemType,
} from '../../../components/SettingsItem';
import { StatusTextType } from '../../../components/StatusText';
import {
  DEBOUNCE_TIMEOUT,
  STATUS_TEXT_TIMEOUT,
} from '../../../constants/timeouts';
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
import { generateOverviewTitleDynamically } from '../../overview/dynamicTitle';

const getOverviewSettingsContent = (): HTMLDivElement[] => {
  const { getCurrentAccountData } = AccessToken();
  const accountOverview = getAccountOverview();

  const nameUpdateElement = SettingsItem({
    title: langKeys().SettingsModalOverviewUpdateNameTextTitle,
    description: undefined,
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

              nameUpdateElement.inputs?.input__vijxwyggzm.setStatusText({
                id: 'status_text__bqpvnzfcmw',
                text: nameErrorStr,
                type: StatusTextType.ERROR,
                isIconVisible: false,
              });

              nameUpdateElement.inputs?.input__vijxwyggzm.clearStatusTextAfterDelay(
                STATUS_TEXT_TIMEOUT.SHORT,
              );

              return;
            }

            const { status } = await v1UserUpdate({
              accessToken: getCurrentAccountData()?.access_token ?? '',
              name: value.trim(),
            });

            if (status !== HTTP_STATUS.NO_CONTENT) {
              const httpError = handleHTTPError(status, undefined);

              nameUpdateElement.inputs?.input__vijxwyggzm.setStatusText({
                id: 'status_text__bqpvnzfcmw',
                text: httpError,
                type: StatusTextType.ERROR,
                isIconVisible: false,
              });

              nameUpdateElement.inputs?.input__vijxwyggzm.clearStatusTextAfterDelay(
                STATUS_TEXT_TIMEOUT.SHORT,
              );

              return;
            }

            nameUpdateElement.inputs?.input__vijxwyggzm.setStatusText({
              id: 'status_text__bqpvnzfcmw',
              text: langKeys().SuccessNameUpdated,
              type: StatusTextType.SUCCESS,
              isIconVisible: false,
            });

            nameUpdateElement.inputs?.input__vijxwyggzm.clearStatusTextAfterDelay(
              STATUS_TEXT_TIMEOUT.SHORT,
            );

            // After updating the name, it should be updated in the account
            // overview store and on the overview page title.

            updateAccountOverview({
              name: value.trim(),
            });

            updateOverviewTitle(
              'overview_title__gwcalajmpp',
              generateOverviewTitleDynamically(value.trim()),
            );
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
