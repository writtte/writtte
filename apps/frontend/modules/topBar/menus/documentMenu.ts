import { FlatIcon, FlatIconName } from '../../../components/FlatIcon';
import { Menu } from '../../../components/Menu';
import { langKeys } from '../../../translations/keys';
import { openVersionModal } from '../../version/openVersionModal';

const buildDocumentMenu = async (e: PointerEvent): Promise<void> => {
  const rect = (e.target as HTMLButtonElement).getBoundingClientRect();

  const location = {
    x: rect.x + 24,
    y: rect.y + rect.height + 12,
  };

  const menu = Menu({
    id: 'menu__nlmyogeyhd',
    location,
    items: [
      {
        id: 'menu_item__caxjryjctd',
        text: langKeys().MenuItemVersionHistory,
        leftIcon: FlatIcon(FlatIconName._18_HISTORY),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => await openVersionModal(),
        sectionTitle: undefined,
        hasTopDivider: false,
        hasBottomDivider: false,
      },
    ],
    menuWidth: 256,
    isRightSideMenu: true,
  });

  document.body.appendChild(menu.element);
};

export { buildDocumentMenu };
