import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { Menu } from '../../components/Menu';
import { langKeys } from '../../translations/keys';

const buildExportMenu = async (e: PointerEvent): Promise<void> => {
  const rect = (e.target as HTMLButtonElement).getBoundingClientRect();

  const location = {
    x: rect.x + 24,
    y: rect.y + rect.height + 12,
  };

  const menu = Menu({
    id: 'menu__kitjfiudfe',
    location,
    items: [
      {
        id: 'menu_item__jwfoepxugv',
        text: langKeys().MenuItemDocumentExportMarkdown,
        leftIcon: FlatIcon(FlatIconName._18_MARKDOWN),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          // complete later
        },
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__ijguhtlhrm',
        text: langKeys().MenuItemDocumentExportMarkdownX,
        leftIcon: undefined,
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          // complete later
        },
        hasTopDivider: false,
        hasBottomDivider: true,
      },
      {
        id: 'menu_item__knnagvxbau',
        text: langKeys().MenuItemDocumentExportXml,
        leftIcon: FlatIcon(FlatIconName._18_XML),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          // complete later
        },
        hasTopDivider: false,
        hasBottomDivider: true,
      },
      {
        id: 'menu_item__tsruhzbbkp',
        text: langKeys().MenuItemDocumentExportPlatformWordpress,
        leftIcon: FlatIcon(FlatIconName._18_WORDPRESS),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          // complete later
        },
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__hljiwhjewh',
        text: langKeys().MenuItemDocumentExportPlatformMedium,
        leftIcon: FlatIcon(FlatIconName._18_MEDIUM),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          // complete later
        },
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__jrphotxfzj',
        text: langKeys().MenuItemDocumentExportPlatformSubstack,
        leftIcon: FlatIcon(FlatIconName._18_SUBSTACK),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          // complete later
        },
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__hnzhdaotoh',
        text: langKeys().MenuItemDocumentExportHelp,
        leftIcon: FlatIcon(FlatIconName._18_CIRCLE_HELP),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          // complete later
        },
        hasTopDivider: true,
        hasBottomDivider: false,
      },
    ],
    menuWidth: 256,
    isRightSideMenu: true,
  });

  document.body.appendChild(menu.element);
};

export { buildExportMenu };
