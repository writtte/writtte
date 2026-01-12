import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { TopBarBadgeType } from '../../components/TopBar';
import { PATHS } from '../../constants/paths';
import { topBarInstance } from '../../controller/topBar';
import { isAccountInFreeTrial } from '../../data/stores/overview';
import { buildError } from '../../helpers/error/build';
import { langKeys } from '../../translations/keys';
import { navigate } from '../../utils/routes/routes';
import {
  openSettingsModal,
  settingsPageSectionIDs,
} from '../settings/openSettingsModal';
import { buildAccountMenu } from './accountMenu';

const setupParentTopBar = async (): Promise<void> => {
  if (topBarInstance === null) {
    throw new Error(buildError('the top bar instance still not initialized'));
  }

  topBarInstance.addButtonsToRight([
    {
      id: 'action_button__pkyvioodkc',
      icon: FlatIcon(FlatIconName._18_CIRCLE_PLUS),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();

        await navigate(PATHS.CREATE_DRAFT);
      },
    },
    {
      id: 'action_button__mctduiojnt',
      icon: FlatIcon(FlatIconName._18_USER),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        await buildAccountMenu(e);
      },
    },
  ]);

  const { isFreeTrial, availableDays } = isAccountInFreeTrial();

  if (isFreeTrial && availableDays !== undefined) {
    topBarInstance.updateBadge({
      id: 'top_bar_badge__nmyjdxanui',
      text:
        availableDays > 0
          ? `${availableDays} ${langKeys().TopBarBadgeDaysLeft}`
          : langKeys().TopBarBadgeFreeTrialExpired,
      type: availableDays > 0 ? TopBarBadgeType.BLUE : TopBarBadgeType.YELLOW,
      onClick: async (): Promise<void> =>
        await openSettingsModal(settingsPageSectionIDs.subscription),
    });
  }
};

export { setupParentTopBar };
