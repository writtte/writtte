import { ERROR_CODES, validate } from '@writtte-internal/validate';
import {
  EditorBubbleMenu,
  type TReturnEditorBubbleMenu,
} from '../../../components/EditorBubbleMenu';
import { BubbleMenuItemType } from '../../../components/EditorBubbleMenuItem';
import { FlatIcon, FlatIconName } from '../../../components/FlatIcon';
import { REGEX } from '../../../constants/regex';
import { ALERT_TIMEOUT } from '../../../constants/timeouts';
import { AlertController } from '../../../controller/alert';
import { getEditorAPI } from '../../../data/stores/mainEditor';
import { langKeys } from '../../../translations/keys';
import {
  type TRemoveWhenRouteChangeInstance,
  removeWhenRouteChange,
} from '../../../utils/ui/removeWhenRouteChange';
import { setupAIMenu } from './editorAIMenu';

var bubbleMenuInstance: TReturnEditorBubbleMenu | null = null;

var routeChangeInstance: TRemoveWhenRouteChangeInstance | null = null;

const setupEditorBubbleMenu = (): HTMLMenuElement => {
  if (routeChangeInstance) {
    routeChangeInstance.destroy();
    routeChangeInstance = null;
  }

  const menu = EditorBubbleMenu({
    id: 'editor_bubble_menu__dfyfzapiir',
    items: [
      {
        id: 'bubble_menu_item__wmljfsahjh',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_AI),
          isVisible: true,
          isSelected: false,
          onClick: async (): Promise<void> => {
            menu.closeMenu();

            await setupAIMenu();
          },
        },
        hasLeftDivider: false,
        hasRightDivider: true,
      },
      {
        id: 'bubble_menu_item__stxjsfxwwc',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_PARAGRAPH),
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
        id: 'bubble_menu_item__kuwhdlobnp',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_BOLD),
          isVisible: true,
          isSelected: false,
          onClick: (): void => {
            getEditorAPI().toggleBold();
          },
        },
        hasLeftDivider: false,
        hasRightDivider: false,
      },
      {
        id: 'bubble_menu_item__khbyselkqs',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_ITALIC),
          isVisible: true,
          isSelected: false,
          onClick: (): void => {
            getEditorAPI().toggleItalic();
          },
        },
        hasLeftDivider: false,
        hasRightDivider: false,
      },
      {
        id: 'bubble_menu_item__fmrtaybdnr',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_UNDERLINE),
          isVisible: true,
          isSelected: false,
          onClick: (): void => {
            getEditorAPI().toggleUnderline();
          },
        },
        hasLeftDivider: false,
        hasRightDivider: true,
      },
      {
        id: 'bubble_menu_item__ijwbhjwgdo',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_INLINE_CODE),
          isVisible: true,
          isSelected: false,
          onClick: (): void => {
            getEditorAPI().toggleInlineCode();
          },
        },
        hasLeftDivider: false,
        hasRightDivider: true,
      },
      {
        id: 'bubble_menu_item__vbkxdfafsd',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_SUPER_SCRIPT),
          isVisible: true,
          isSelected: false,
          onClick: (): void => {
            getEditorAPI().toggleSuperscript();
          },
        },
        hasLeftDivider: false,
        hasRightDivider: false,
      },
      {
        id: 'bubble_menu_item_vdiudmlbgp',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_SUB_SCRIPT),
          isVisible: true,
          isSelected: false,
          onClick: (): void => {
            getEditorAPI().toggleSubscript();
          },
        },
        hasLeftDivider: false,
        hasRightDivider: true,
      },
      {
        id: 'bubble_menu_item__qnyeynzhzh',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_STRIKETHROUGH),
          isVisible: true,
          isSelected: false,
          onClick: (): void => {
            getEditorAPI().toggleStrikethrough();
          },
        },
        hasLeftDivider: false,
        hasRightDivider: true,
      },
      {
        id: 'bubble_menu_item__sndofyfohj',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_BULLET_LIST),
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
        id: 'bubble_menu_item__lynshiadpv',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_NUMBER_LIST),
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
        id: 'bubble_menu_item__pifpwsvwkl',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_HYPERLINK),
          isVisible: false,
          isSelected: false,
          onClick: (): void => {
            if (bubbleMenuInstance) {
              enableHyperLink(bubbleMenuInstance);
            }
          },
        },
        hasLeftDivider: false,
        hasRightDivider: false,
      },
      {
        id: 'input__tqoqiwudxv',
        item: {
          type: BubbleMenuItemType.INPUT,
          text: undefined,
          placeholderText: undefined,
          isVisible: false,
          onSubmit: (): void => {
            if (bubbleMenuInstance) {
              addHyperLink(bubbleMenuInstance);
            }
          },
        },
        hasLeftDivider: false,
        hasRightDivider: false,
      },
      {
        id: 'bubble_menu_item__xvgfmhootu',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_HYPERLINK_ADD),
          isVisible: false,
          isSelected: false,
          onClick: (): void => {
            if (bubbleMenuInstance) {
              addHyperLink(bubbleMenuInstance);
            }
          },
        },
        hasLeftDivider: false,
        hasRightDivider: false,
      },
      {
        id: 'bubble_menu_item__tfygvxwnha',
        item: {
          type: BubbleMenuItemType.BUTTON,
          icon: FlatIcon(FlatIconName._18_HYPERLINK_REMOVE),
          isVisible: false,
          isSelected: false,
          onClick: (): void => {
            getEditorAPI().unsetLink();
            if (bubbleMenuInstance) {
              disableHyperLink(bubbleMenuInstance);
            }
          },
        },
        hasLeftDivider: false,
        hasRightDivider: false,
      },
    ],
  });

  bubbleMenuInstance = menu;

  routeChangeInstance = removeWhenRouteChange(menu.element, {
    enabled: true,
    animationDuration: 0,
    onAfterRemove: () => {
      bubbleMenuInstance = null;
      routeChangeInstance = null;
    },
  });

  return menu.element;
};

const bubbleMenuEventListener = (): void => {
  if (!bubbleMenuInstance) {
    return;
  }

  const boldButton = bubbleMenuInstance.returnsMap.bubble_menu_item__kuwhdlobnp;

  const italicButton =
    bubbleMenuInstance.returnsMap.bubble_menu_item__khbyselkqs;

  const underlineButton =
    bubbleMenuInstance.returnsMap.bubble_menu_item__fmrtaybdnr;

  const inlineCodeButton =
    bubbleMenuInstance.returnsMap.bubble_menu_item__ijwbhjwgdo;

  const superScriptButton =
    bubbleMenuInstance.returnsMap.bubble_menu_item__vbkxdfafsd;

  const subscriptButton =
    bubbleMenuInstance.returnsMap.bubble_menu_item_vdiudmlbgp;

  const strikethroughButton =
    bubbleMenuInstance.returnsMap.bubble_menu_item__qnyeynzhzh;

  const bulletListButton =
    bubbleMenuInstance.returnsMap.bubble_menu_item__sndofyfohj;

  const numberListButton =
    bubbleMenuInstance.returnsMap.bubble_menu_item__lynshiadpv;

  const hyperlinkEnableButton =
    bubbleMenuInstance.returnsMap.bubble_menu_item__pifpwsvwkl;

  getEditorAPI().onTransaction((): void => {
    if (getEditorAPI().isBoldActive()) {
      boldButton.buttonReturns?.setSelectedState?.(true);
    } else {
      boldButton.buttonReturns?.setSelectedState?.(false);
    }

    if (getEditorAPI().isItalicActive()) {
      italicButton.buttonReturns?.setSelectedState?.(true);
    } else {
      italicButton.buttonReturns?.setSelectedState?.(false);
    }

    if (getEditorAPI().isUnderlineActive()) {
      underlineButton.buttonReturns?.setSelectedState?.(true);
    } else {
      underlineButton.buttonReturns?.setSelectedState?.(false);
    }

    if (getEditorAPI().isInlineCodeActive()) {
      inlineCodeButton.buttonReturns?.setSelectedState?.(true);
    } else {
      inlineCodeButton.buttonReturns?.setSelectedState?.(false);
    }

    if (getEditorAPI().isSuperscriptActive()) {
      superScriptButton.buttonReturns?.setSelectedState?.(true);
    } else {
      superScriptButton.buttonReturns?.setSelectedState?.(false);
    }

    if (getEditorAPI().isSubscriptActive()) {
      subscriptButton.buttonReturns?.setSelectedState?.(true);
    } else {
      subscriptButton.buttonReturns?.setSelectedState?.(false);
    }

    if (getEditorAPI().isStrikethroughActive()) {
      strikethroughButton.buttonReturns?.setSelectedState?.(true);
    } else {
      strikethroughButton.buttonReturns?.setSelectedState?.(false);
    }

    if (getEditorAPI().isBulletListActive()) {
      bulletListButton.buttonReturns?.setSelectedState?.(true);
    } else {
      bulletListButton.buttonReturns?.setSelectedState?.(false);
    }

    if (getEditorAPI().isNumberListActive()) {
      numberListButton.buttonReturns?.setSelectedState?.(true);
    } else {
      numberListButton.buttonReturns?.setSelectedState?.(false);
    }
  });

  getEditorAPI().onSelectionUpdate((state): void => {
    if (!bubbleMenuInstance) {
      return;
    }

    if (state.selection === true) {
      if (!getEditorAPI().isLinkActive()) {
        hyperlinkEnableButton.buttonReturns?.setVisibleState(true);
      } else {
        const linkInput = bubbleMenuInstance.returnsMap.input__tqoqiwudxv;

        const linkAddButton =
          bubbleMenuInstance.returnsMap.bubble_menu_item__xvgfmhootu;

        const linkRemoveButton =
          bubbleMenuInstance.returnsMap.bubble_menu_item__tfygvxwnha;

        const getLink = getEditorAPI().getLink();
        if (getLink !== undefined) {
          const { href } = getLink;

          linkInput.inputReturns?.set('');
          linkInput.inputReturns?.setPlaceholder(href.trim());

          linkInput.inputReturns?.setVisibleState(true);
          linkAddButton.buttonReturns?.setVisibleState(true);
          linkRemoveButton.buttonReturns?.setVisibleState(true);
        }

        hyperlinkEnableButton.buttonReturns?.setVisibleState(false);
      }
    } else {
      disableHyperLink(bubbleMenuInstance);
    }
  });
};

const addHyperLink = (menu: TReturnEditorBubbleMenu): void => {
  const alertController = AlertController();

  const linkInput = menu.returnsMap.input__tqoqiwudxv;

  if (linkInput.inputReturns) {
    const linkText = linkInput.inputReturns.get().trim();

    const { isValid, urlError } = validateURL(linkText);
    if (!isValid) {
      if (urlError === null) {
        alertController.showAlert(
          {
            id: 'alert__saqivthfvm',
            title: langKeys().AlertUnableToAddHyperlinkTitle,
            description: langKeys().AlertUnableToAddHyperlinkDescription,
          },
          ALERT_TIMEOUT.SHORT,
        );

        return;
      }

      alertController.showAlert(
        {
          id: 'alert__uruxvslgrt',
          title: langKeys().AlertUnableToAddHyperlinkTitle,
          description: urlError,
        },
        ALERT_TIMEOUT.SHORT,
      );

      return;
    }

    getEditorAPI().setLink(linkText, '_blank');

    linkInput.inputReturns?.set('');

    const linkRemoveButton = menu.returnsMap.bubble_menu_item__tfygvxwnha;
    linkRemoveButton.buttonReturns?.setVisibleState(true);
  }
};

const enableHyperLink = (menu: TReturnEditorBubbleMenu): void => {
  const linkInput = menu.returnsMap.input__tqoqiwudxv;
  const linkAddButton = menu.returnsMap.bubble_menu_item__xvgfmhootu;
  const linkRemoveButton = menu.returnsMap.bubble_menu_item__tfygvxwnha;
  const linkEnableButton = menu.returnsMap.bubble_menu_item__pifpwsvwkl;

  linkInput.inputReturns?.set('');
  linkInput.inputReturns?.setPlaceholder('');

  linkInput.inputReturns?.setVisibleState(true);
  linkAddButton.buttonReturns?.setVisibleState(true);
  linkRemoveButton.buttonReturns?.setVisibleState(true);
  linkEnableButton.buttonReturns?.setVisibleState(false);
};

const disableHyperLink = (menu: TReturnEditorBubbleMenu): void => {
  const linkInput = menu.returnsMap.input__tqoqiwudxv;
  const linkAddButton = menu.returnsMap.bubble_menu_item__xvgfmhootu;
  const linkEnableButton = menu.returnsMap.bubble_menu_item__pifpwsvwkl;
  const linkRemoveButton = menu.returnsMap.bubble_menu_item__tfygvxwnha;

  linkInput.inputReturns?.set('');

  linkInput.inputReturns?.setVisibleState(false);
  linkAddButton.buttonReturns?.setVisibleState(false);
  linkEnableButton.buttonReturns?.setVisibleState(true);
  linkRemoveButton.buttonReturns?.setVisibleState(false);
};

const validateURL = (
  url: string,
): { isValid: boolean; urlError: string | null } => {
  const { isValid, results } = validate([
    {
      name: 'url',
      value: url,
      rules: {
        min: 2,
        max: 1024,
        pattern: REGEX.URL,
        required: true,
      },
    },
  ]);

  if (isValid) {
    return {
      isValid,
      urlError: null,
    };
  }

  let urlErrorStr = '';

  const urlResults = results.find((r) => r.name === 'url');
  switch (urlResults?.errors[0]) {
    case ERROR_CODES.REQUIRED:
      urlErrorStr = langKeys().ErrorUrlRequired;
      break;

    case ERROR_CODES.PATTERN:
      urlErrorStr = langKeys().ErrorUrlPattern;
      break;

    case ERROR_CODES.MIN:
      urlErrorStr = langKeys().ErrorUrlMin;
      break;

    case ERROR_CODES.MAX:
      urlErrorStr = langKeys().ErrorUrlMax;
      break;

    default:
      urlErrorStr = langKeys().ErrorApiInternalServerError;
      break;
  }

  return {
    isValid: false,
    urlError: urlErrorStr,
  };
};

export { setupEditorBubbleMenu, bubbleMenuEventListener };
