import type { TReturnItemList } from '../../components/ItemList';
import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { Menu } from '../../components/Menu';
import { PATHS } from '../../constants/paths';
import { langKeys } from '../../translations/keys';
import { navigateExternal } from '../../utils/routes/helpers';
import { navigate } from '../../utils/routes/routes';
import { openDocumentDeleteModal } from './deleteDocument';
import { openDocumentRenameModal } from './renameDocument';

const buildDocumentOptionsMenu = async (
  e: PointerEvent,
  itemList: TReturnItemList,
  documentCode: string,
): Promise<void> => {
  const rect = (e.target as HTMLButtonElement).getBoundingClientRect();

  const location = {
    x: rect.x + 24,
    y: rect.y + rect.height + 12,
  };

  const menu = Menu({
    id: 'menu__yaikqikrfq',
    location,
    items: [
      {
        id: 'menu_item__moepyznkny',
        text: langKeys().MenuItemOpen,
        leftIcon: undefined,
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> =>
          await navigate(`${PATHS.DOCUMENT_EDIT}/${documentCode}`),
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__kdvrbpcxzz',
        text: langKeys().MenuItemOpenInTab,
        leftIcon: FlatIcon(FlatIconName._16_OPEN_NEW_TAB),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: (): void =>
          navigateExternal(`${PATHS.DOCUMENT_EDIT}/${documentCode}`),
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__yybpiupwdd',
        text: langKeys().MenuItemRenameDocument,
        leftIcon: FlatIcon(FlatIconName._16_EDIT),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> =>
          await openDocumentRenameModal(itemList, documentCode),
        hasTopDivider: true,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__iigulhsowe',
        text: langKeys().MenuItemDeleteDocument,
        leftIcon: FlatIcon(FlatIconName._16_TRASH),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> =>
          await openDocumentDeleteModal(itemList, documentCode),
        hasTopDivider: true,
        hasBottomDivider: false,
      },
    ],
    menuWidth: 208,
    isRightSideMenu: true,
  });

  document.body.appendChild(menu.element);
};

export { buildDocumentOptionsMenu };
