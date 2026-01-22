import type { TEditorBlockMenuItemOptions } from '../../../components/EditorBlockMenuItem';
import {
  EditorBlockMenu,
  type TReturnEditorBlockMenu,
} from '../../../components/EditorBlockMenu';
import { FlatIcon, FlatIconName } from '../../../components/FlatIcon';
import { getEditorAPI } from '../../../data/stores/mainEditor';
import { langKeys } from '../../../translations/keys';
import {
  type TRemoveWhenRouteChangeInstance,
  removeWhenRouteChange,
} from '../../../utils/ui/removeWhenRouteChange';
import { browseAndInsertImage } from '../image/browseImage';
import { setupAIMenu } from './editorAIMenu';

let blockMenuQuery = '';
let blockMenuInstance: TReturnEditorBlockMenu | null = null;
let deleteTriggerCallback: (() => void) | null = null;
let hideMenuCallback: (() => void) | null = null;
let routeChangeInstance: TRemoveWhenRouteChangeInstance | null = null;

const menuItems = (): (TEditorBlockMenuItemOptions & {
  hasTopDivider: boolean;
  hasBottomDivider: boolean;
  keywords: string[];
})[] => [
  {
    id: 'block_menu_item__txmoahyroq',
    text: langKeys().EditorMenuItemAIGenerate,
    icon: FlatIcon(FlatIconName._18_AI_MAGIC),
    key: undefined,
    isSelected: false,
    keywords: ['ai', 'generate', 'magic'],
    onClick: async (): Promise<void> => await setupAIMenu(),
    hasTopDivider: false,
    hasBottomDivider: true,
  },
  {
    id: 'block_menu_item__xztlssiejf',
    text: langKeys().EditorMenuItemParagraph,
    icon: FlatIcon(FlatIconName._18_PARAGRAPH),
    key: undefined,
    isSelected: false,
    keywords: [
      'text',
      'paragraph',
      'p',
      'normal',
      'body',
      'plain',
      'regular',
      'content',
    ],
    onClick: (): void => {
      getEditorAPI().setParagraph();
    },
    hasTopDivider: false,
    hasBottomDivider: true,
  },
  {
    id: 'block_menu_item__btfrdjwtym',
    text: langKeys().EditorMenuItemHeading01,
    icon: FlatIcon(FlatIconName._18_HEADING_01),
    key: '#',
    isSelected: false,
    keywords: [
      'title',
      'headline',
      'heading',
      'h1',
      'header',
      '1',
      '01',
      'main',
      'primary',
      'large',
    ],
    onClick: (): void => {
      getEditorAPI().toggleHeader01();
    },
    hasTopDivider: false,
    hasBottomDivider: false,
  },
  {
    id: 'block_menu_item__uwbjzpxgzb',
    text: langKeys().EditorMenuItemHeading02,
    icon: FlatIcon(FlatIconName._18_HEADING_02),
    key: '##',
    isSelected: false,
    keywords: [
      'subtitle',
      'subheadline',
      'heading',
      'h2',
      'header',
      '2',
      '02',
      'secondary',
      'sub',
    ],
    onClick: (): void => {
      getEditorAPI().toggleHeader02();
    },
    hasTopDivider: false,
    hasBottomDivider: false,
  },
  {
    id: 'block_menu_item__hmrfgnivbj',
    text: langKeys().EditorMenuItemHeading03,
    icon: FlatIcon(FlatIconName._18_HEADING_03),
    key: '###',
    isSelected: false,
    keywords: [
      'heading',
      'h3',
      'header',
      '3',
      '03',
      'tertiary',
      'subheading',
      'section',
    ],
    onClick: (): void => {
      getEditorAPI().toggleHeader03();
    },
    hasTopDivider: false,
    hasBottomDivider: false,
  },
  {
    id: 'block_menu_item__tppwytmkwn',
    text: langKeys().EditorMenuItemHeading04,
    icon: FlatIcon(FlatIconName._18_HEADING_04),
    key: '####',
    isSelected: false,
    keywords: [
      'heading',
      'h4',
      'header',
      '4',
      '04',
      'subheading',
      'subsection',
      'small',
    ],
    onClick: (): void => {
      getEditorAPI().toggleHeader04();
    },
    hasTopDivider: false,
    hasBottomDivider: false,
  },
  {
    id: 'block_menu_item__cqpplbycxn',
    text: langKeys().EditorMenuItemHeading05,
    icon: FlatIcon(FlatIconName._18_HEADING_05),
    key: '#####',
    isSelected: false,
    keywords: [
      'heading',
      'h5',
      'header',
      '5',
      '05',
      'subheading',
      'minor',
      'tiny',
    ],
    onClick: (): void => {
      getEditorAPI().toggleHeader05();
    },
    hasTopDivider: false,
    hasBottomDivider: false,
  },
  {
    id: 'block_menu_item__aoumpxzqyx',
    text: langKeys().EditorMenuItemHeading06,
    icon: FlatIcon(FlatIconName._18_HEADING_06),
    key: '######',
    isSelected: false,
    keywords: [
      'heading',
      'h6',
      'header',
      '6',
      '06',
      'subheading',
      'smallest',
      'minimal',
    ],
    onClick: (): void => {
      getEditorAPI().toggleHeader06();
    },
    hasTopDivider: false,
    hasBottomDivider: true,
  },
  {
    id: 'block_menu_item__cnguzmiyyz',
    text: langKeys().EditorMenuItemBulletList,
    icon: FlatIcon(FlatIconName._18_BULLET_LIST),
    key: '*',
    isSelected: false,
    keywords: ['bullets', 'list'],
    onClick: (): void => {
      getEditorAPI().toggleBulletList();
    },
    hasTopDivider: false,
    hasBottomDivider: false,
  },
  {
    id: 'block_menu_item__uyoomociyf',
    text: langKeys().EditorMenuItemNumberList,
    icon: FlatIcon(FlatIconName._18_NUMBER_LIST),
    key: '1.',
    isSelected: false,
    keywords: ['numbers', 'list'],
    onClick: (): void => {
      getEditorAPI().toggleNumberList();
    },
    hasTopDivider: false,
    hasBottomDivider: true,
  },
  {
    id: 'block_menu_item__mpqbebhndd',
    text: langKeys().EditorMenuItemBlockQuote,
    icon: FlatIcon(FlatIconName._18_BLOCK_QUOTE),
    key: '>',
    isSelected: false,
    keywords: ['quote', 'blockQuote', 'note'],
    onClick: (): void => {
      getEditorAPI().toggleBlockQuote();
    },
    hasTopDivider: false,
    hasBottomDivider: false,
  },
  {
    id: 'block_menu_item__mjyeocjthi',
    text: langKeys().EditorMenuItemCodeBlock,
    icon: FlatIcon(FlatIconName._18_CODE_BLOCK),
    key: '```',
    isSelected: false,
    keywords: ['code', 'codeblock'],
    onClick: (): void => {
      getEditorAPI().toggleCodeBlock();
    },
    hasTopDivider: false,
    hasBottomDivider: true,
  },
  {
    id: 'block_menu_item__jleijdtqxw',
    text: langKeys().EditorMenuItemHorizontalRule,
    icon: FlatIcon(FlatIconName._18_HORIZONTAL_RULE),
    key: '---',
    isSelected: false,
    keywords: [
      'hr',
      'horizontal rule',
      'divider',
      'line',
      'separator',
      'break',
      'split',
      'section break',
    ],
    onClick: (): void => {
      getEditorAPI().setHorizontalLine();
    },
    hasTopDivider: false,
    hasBottomDivider: true,
  },
  {
    id: 'block_menu_item__jsgfkrjptx',
    text: langKeys().EditorMenuItemImage,
    icon: FlatIcon(FlatIconName._18_IMAGE),
    key: undefined,
    isSelected: false,
    keywords: [
      'img',
      'image',
      'picture',
      'photo',
      'illustration',
      'figure',
      'graphic',
      'upload',
      'media',
    ],
    onClick: async (): Promise<void> => await browseAndInsertImage(),
    hasTopDivider: false,
    hasBottomDivider: false,
  },
];

const setupEditorBlockMenu = (): HTMLMenuElement => {
  if (routeChangeInstance) {
    routeChangeInstance.destroy();
    routeChangeInstance = null;
  }

  const menu = EditorBlockMenu({
    id: 'editor_block_menu__ihhzzfwpjj',
    filterText: langKeys().EditorMenuTitleFilter,
    filterQuery: blockMenuQuery,
    items: [...menuItems()],
  });

  blockMenuInstance = menu;

  routeChangeInstance = removeWhenRouteChange(menu.element, {
    enabled: true,
    animationDuration: 0,
    onAfterRemove: () => {
      blockMenuInstance = null;
      routeChangeInstance = null;
    },
  });

  return menu.element;
};

const updateBlockMenuQuery = (query: string): void => {
  blockMenuQuery = query;

  if (blockMenuInstance) {
    blockMenuInstance.updateQuery(query);
  }
};

const selectNextBlockMenuItem = (): void => {
  if (blockMenuInstance) {
    blockMenuInstance.selectNext();
  }
};

const selectPreviousBlockMenuItem = (): void => {
  if (blockMenuInstance) {
    blockMenuInstance.selectPrevious();
  }
};

const triggerSelectedBlockMenuItem = (): void => {
  if (blockMenuInstance) {
    blockMenuInstance.triggerSelected();
  }
};

const setBlockMenuCallbacks = (
  deleteTrigger: () => void,
  hideMenu: () => void,
): void => {
  deleteTriggerCallback = deleteTrigger;
  hideMenuCallback = hideMenu;

  // Configure the menu instance to call cleanup callbacks before/after selection
  if (blockMenuInstance) {
    blockMenuInstance.setOnBeforeSelect(() => {
      if (deleteTriggerCallback) {
        deleteTriggerCallback();
      }
    });
    blockMenuInstance.setOnAfterSelect(() => {
      if (hideMenuCallback) {
        hideMenuCallback();
      }
    });
  }
};

const getBlockMenuSelectedIndex = (): number => {
  if (blockMenuInstance) {
    return blockMenuInstance.getSelectedIndex();
  }

  return -1;
};

const getBlockMenuItemCount = (): number => {
  if (blockMenuInstance) {
    return blockMenuInstance.getItemCount();
  }

  return 0;
};

const getQueryStateRef = (): { current: string } => ({
  get current(): string {
    return blockMenuQuery;
  },
  set current(value: string) {
    updateBlockMenuQuery(value);
  },
});

export {
  setupEditorBlockMenu,
  updateBlockMenuQuery,
  getQueryStateRef,
  selectNextBlockMenuItem,
  selectPreviousBlockMenuItem,
  triggerSelectedBlockMenuItem,
  getBlockMenuSelectedIndex,
  getBlockMenuItemCount,
  setBlockMenuCallbacks,
};
