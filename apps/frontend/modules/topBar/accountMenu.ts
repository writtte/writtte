import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { Menu } from '../../components/Menu';
import { LINKS } from '../../constants/links';
import { signOutCurrentAccount } from '../../helpers/account/signOut';
import { langKeys } from '../../translations/keys';
import { navigateExternal } from '../../utils/routes/helpers';
import { openAppearanceModal } from '../appearance/openAppearanceModal';
import {
  openSettingsModal,
  settingsPageSectionIDs,
} from '../settings/openSettingsModal';

const buildAccountMenu = async (e: PointerEvent): Promise<void> => {
  const rect = (e.target as HTMLButtonElement).getBoundingClientRect();

  const location = {
    x: rect.x + 24,
    y: rect.y + rect.height + 12,
  };

  const menu = Menu({
    id: 'menu__keeqfrpcuq',
    location,
    items: [
      {
        id: 'menu_item__pvovhxmpmt',
        text: langKeys().MenuItemSettings,
        leftIcon: FlatIcon(FlatIconName._18_SETTINGS),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> =>
          await openSettingsModal(settingsPageSectionIDs.overview),
        sectionTitle: undefined,
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__jqvjjehwnn',
        text: langKeys().MenuItemAppearance,
        leftIcon: undefined,
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: (): void => openAppearanceModal(),
        sectionTitle: undefined,
        hasTopDivider: false,
        hasBottomDivider: true,
      },
      {
        id: 'menu_item__eqvjtlzaru',
        text: langKeys().MenuItemHelpAndDocumentation,
        leftIcon: FlatIcon(FlatIconName._18_CIRCLE_HELP),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: (): void => navigateExternal(LINKS.PRODUCT_DOCUMENTATION),
        sectionTitle: undefined,
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__krhjuglykb',
        text: langKeys().MenuItemChangelogs,
        leftIcon: undefined,
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: (): void => navigateExternal(LINKS.PRODUCT_CHANGELOGS),
        sectionTitle: undefined,
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__skauzwsbhh',
        text: langKeys().MenuItemSignOut,
        leftIcon: FlatIcon(FlatIconName._18_SIGN_OUT),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => await signOutCurrentAccount(),
        sectionTitle: undefined,
        hasTopDivider: true,
        hasBottomDivider: false,
      },
    ],
    menuWidth: 256,
    isRightSideMenu: true,
  });

  document.body.appendChild(menu.element);
};

export { buildAccountMenu };
