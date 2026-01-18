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
import { buildAccountMenu } from './menus/accountMenu';
import { buildDocumentMenu } from './menus/documentMenu';
import { buildExportMenu } from './menus/exportMenu';

const setupEditorTopBar = async (): Promise<void> => {
  if (topBarInstance === null) {
    throw new Error(buildError('the top bar instance still not initialized'));
  }

  topBarInstance.addButtonsToLeft([
    {
      id: 'action_button__wzgexjekpk',
      icon: FlatIcon(FlatIconName._18_CHEVRON_LEFT),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();

        await navigate(PATHS.DOCUMENTS);
      },
    },
  ]);

  topBarInstance.addButtonsToRight([
    {
      id: 'action_button__eznfyyfppu',
      icon: FlatIcon(FlatIconName._18_EXPORT),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        await buildExportMenu(e);
      },
    },
    {
      id: 'action_button__skesmzpobn',
      icon: FlatIcon(FlatIconName._18_DOCUMENT),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        await buildDocumentMenu(e);
      },
    },
    {
      id: 'action_button__znkmokydeg',
      icon: FlatIcon(FlatIconName._18_USER),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        await buildAccountMenu(e);
      },
    },
  ]);

  const { isFreeTrialExpired } = isAccountInFreeTrial();

  if (isFreeTrialExpired) {
    topBarInstance.updateBadge({
      id: 'top_bar_badge__vsdssovtec',
      text: langKeys().TopBarBadgeDocumentReadOnly,
      type: TopBarBadgeType.RED,
      onClick: async (): Promise<void> =>
        await openSettingsModal(settingsPageSectionIDs.subscription),
    });
  }
};

export { setupEditorTopBar };
