import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { TopBarBadgeType } from '../../components/TopBar';
import { PATHS } from '../../constants/paths';
import { topBarInstance } from '../../controller/topBar';
import { isAccountInFreeTrial } from '../../data/stores/overview';
import { buildError } from '../../helpers/error/build';
import { langKeys } from '../../translations/keys';
import { checkRoute } from '../../utils/routes/helpers';
import { navigate } from '../../utils/routes/routes';
import {
  openSettingsModal,
  settingsPageSectionIDs,
} from '../settings/openSettingsModal';
import { buildAccountMenu } from './menus/accountMenu';

const setupParentTopBar = async (): Promise<void> => {
  if (topBarInstance === null) {
    throw new Error(buildError('the top bar instance still not initialized'));
  }

  topBarInstance.addPageChangeButtons([
    {
      id: 'button_dvbsgjoqen',
      icon: FlatIcon(FlatIconName._18_DOCUMENT),
      text: langKeys().TopBarPageButtonDocuments,
      onClick: async (): Promise<void> => await navigate(PATHS.DOCUMENTS),
    },
    {
      id: 'button_cygsfociml',
      icon: FlatIcon(FlatIconName._18_AI_STYLES),
      text: langKeys().TopBarPageButtonAiStyles,
      onClick: async (): Promise<void> => await navigate(PATHS.STYLES),
    },
  ]);

  if (checkRoute([PATHS.DOCUMENTS])) {
    topBarInstance.selectPageChangeButton('button_dvbsgjoqen');
  }

  if (checkRoute([PATHS.STYLES])) {
    topBarInstance.selectPageChangeButton('button_cygsfociml');
  }

  topBarInstance.addButtonsToRight([
    {
      id: 'action_button__pkyvioodkc',
      icon: FlatIcon(FlatIconName._18_CIRCLE_PLUS),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();

        await navigate(PATHS.CREATE_DOCUMENT);
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
