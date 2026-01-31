import {
  FixedMenuItemType,
  type TEditorFixedMenuItemOptions,
} from '../../../components/EditorFixedMenuItem';
import { FlatIcon, FlatIconName } from '../../../components/FlatIcon';
import { getEditorAPI } from '../../../data/stores/mainEditor';
import { isAccountInFreeTrial } from '../../../data/stores/overview';
import { langKeys } from '../../../translations/keys';
import { browseAndInsertImage } from '../image/browseImage';
import { setupAIMenu } from './editorAIMenu';

const setupEditorFixedMenuOptions = (): (TEditorFixedMenuItemOptions & {
  hasLeftDivider: boolean;
  hasRightDivider: boolean;
})[] => {
  const { isFreeTrialExpired } = isAccountInFreeTrial();
  if (isFreeTrialExpired) {
    return [];
  }

  return [
    {
      id: 'button__hjwhvmtaro',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_AI_MAGIC),
        toolTip: langKeys().EditorFixedMenuTooltipAi,
        isVisible: true,
        isSelected: false,
        onClick: async (): Promise<void> => await setupAIMenu(),
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'button__iilmhndxvf',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_GRAMMAR),
        toolTip: langKeys().EditorFixedMenuTooltipGrammar,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().proofreadDocument();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: true,
    },
    {
      id: 'button__klxnihfohr',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_PARAGRAPH),
        toolTip: langKeys().EditorFixedMenuTooltipParagraph,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().setParagraph();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: true,
    },
    {
      id: 'button__jpysaswwpy',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HEADING_01),
        toolTip: langKeys().EditorFixedMenuTooltipHeading01,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().toggleHeader01();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'button__uzmrgwufxq',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HEADING_02),
        toolTip: langKeys().EditorFixedMenuTooltipHeading02,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().toggleHeader02();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'button__rjcbihjhbs',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HEADING_03),
        toolTip: langKeys().EditorFixedMenuTooltipHeading03,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().toggleHeader03();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'button__dgsfcsjebd',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HEADING_04),
        toolTip: langKeys().EditorFixedMenuTooltipHeading04,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().toggleHeader04();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'button__mluahnikxw',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HEADING_05),
        toolTip: langKeys().EditorFixedMenuTooltipHeading05,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().toggleHeader05();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'button__zxgnmasxyj',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HEADING_06),
        toolTip: langKeys().EditorFixedMenuTooltipHeading06,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().toggleHeader06();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: true,
    },
    {
      id: 'button__bgwzhlgllm',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_BULLET_LIST),
        toolTip: langKeys().EditorFixedMenuTooltipBulletList,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().toggleBulletList();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'button__daoekugzpq',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_NUMBER_LIST),
        toolTip: langKeys().EditorFixedMenuTooltipNumberList,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().toggleNumberList();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: true,
    },
    {
      id: 'button__canawcdkkf',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_BLOCK_QUOTE),
        toolTip: langKeys().EditorFixedMenuTooltipBlockQuote,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().setBlockQuote();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: true,
    },
    {
      id: 'button__icyswcgvas',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_CODE_BLOCK),
        toolTip: langKeys().EditorFixedMenuTooltipCodeBlock,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().toggleCodeBlock();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: true,
    },
    {
      id: 'button__bmbympcluk',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HORIZONTAL_RULE),
        toolTip: langKeys().EditorFixedMenuTooltipHorizontalRule,
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().setHorizontalLine();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: true,
    },
    {
      id: 'button__vjciursluw',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_IMAGE),
        toolTip: langKeys().EditorFixedMenuTooltipImage,
        isVisible: true,
        isSelected: false,
        onClick: async (): Promise<void> => await browseAndInsertImage(),
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
  ];
};

export { setupEditorFixedMenuOptions };
