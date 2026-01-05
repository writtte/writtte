import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { TopBarBadgeType } from '../../components/TopBar';
import { topBarInstance } from '../../controller/topBar';
import { isAccountInFreeTrial } from '../../data/stores/overview';
import { buildError } from '../../helpers/error/build';
import { langKeys } from '../../translations/keys';
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

  if (isFreeTrial) {
    topBarInstance.updateBadge({
      id: 'top_bar_badge__nmyjdxanui',
      text: `${availableDays} ${langKeys().TopBarBadgeDaysLeft}`,
      type: TopBarBadgeType.BLUE,
      onClick: async (): Promise<void> =>
        await openSettingsModal(settingsPageSectionIDs.subscription),
    });
  }
};

export { setupParentTopBar };
