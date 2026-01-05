import type { TEditorState } from '@writtte-editor/editor';
import type { TReturnEditorFixedMenu } from '../../../components/EditorFixedMenu';
import { ERROR_CODES, validate } from '@writtte-internal/validate';
import {
  FixedMenuItemType,
  type TEditorFixedMenuItemOptions,
} from '../../../components/EditorFixedMenuItem';
import { FlatIcon, FlatIconName } from '../../../components/FlatIcon';
import { REGEX } from '../../../constants/regex';
import { ALERT_TIMEOUT } from '../../../constants/timeouts';
import { AlertController } from '../../../controller/alert';
import { getEditorAPI } from '../../../data/stores/mainEditor';
import { isAccountInFreeTrial } from '../../../data/stores/overview';
import { langKeys } from '../../../translations/keys';
import { browseAndInsertImage } from '../image/browseImage';

const setupEditorFixedMenuOptions = (
  thisMenu: TReturnEditorFixedMenu,
): (TEditorFixedMenuItemOptions & {
  hasLeftDivider: boolean;
  hasRightDivider: boolean;
})[] => {
  const { isFreeTrialExpired } = isAccountInFreeTrial();
  if (isFreeTrialExpired) {
    return [];
  }

  return [
    {
      id: 'button__klxnihfohr',
      item: {
        type: FixedMenuItemType.BUTTON,
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
      id: 'button__jpysaswwpy',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HEADING_01),
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
      id: 'button__yjtiaomqfn',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HEADING_02),
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
      id: 'button__mhexyelvda',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HEADING_03),
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().toggleHeader03();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: true,
    },
    {
      id: 'button__kovxizjntg',
      item: {
        type: FixedMenuItemType.BUTTON,
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
      id: 'button__xevyzoapsy',
      item: {
        type: FixedMenuItemType.BUTTON,
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
      id: 'button__ctvdbmfnzn',
      item: {
        type: FixedMenuItemType.BUTTON,
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
      id: 'button__blnncjmzml',
      item: {
        type: FixedMenuItemType.BUTTON,
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
      id: 'button__lqwbmmoxus',
      item: {
        type: FixedMenuItemType.BUTTON,
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
      id: 'button__gxvccwmyhl',
      item: {
        type: FixedMenuItemType.BUTTON,
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
      id: 'button__oxwopdzujp',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_IMAGE),
        isVisible: true,
        isSelected: false,
        onClick: async (): Promise<void> => await browseAndInsertImage(),
      },
      hasLeftDivider: false,
      hasRightDivider: true,
    },
    {
      id: 'button__hzouaveanw',
      item: {
        type: FixedMenuItemType.BUTTON,
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
      id: 'button__rrujmyecrv',
      item: {
        type: FixedMenuItemType.BUTTON,
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
      id: 'button__thphluhzux',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_NUMBER_LIST),
        isVisible: true,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().toggleNumberList();
        },
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'button__pkqlfdlqtn',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HYPERLINK),
        isVisible: false,
        isSelected: false,
        onClick: (): void => enableHyperLink(thisMenu),
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'button__pjdfjerfjd',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HYPERLINK),
        isVisible: false,
        isSelected: true,
        onClick: (): void => disableHyperLink(thisMenu),
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'input__eeizujkfwy',
      item: {
        type: FixedMenuItemType.INPUT,
        text: undefined,
        placeholderText: undefined,
        isVisible: false,
        onSubmit: (): void => addHyperLink(thisMenu),
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'button__gqzgqctnnr',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HYPERLINK_ADD),
        isVisible: false,
        isSelected: false,
        onClick: (): void => addHyperLink(thisMenu),
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
    {
      id: 'button__gdrvfruhim',
      item: {
        type: FixedMenuItemType.BUTTON,
        icon: FlatIcon(FlatIconName._18_HYPERLINK_REMOVE),
        isVisible: false,
        isSelected: false,
        onClick: (): void => {
          getEditorAPI().unsetLink();
          disableHyperLink(thisMenu);
        },
      },
      hasLeftDivider: false,
      hasRightDivider: false,
    },
  ];
};

const fixedMenuUpdateEventListener = (menu: TReturnEditorFixedMenu): void => {
  const editorAPI = getEditorAPI();

  const boldButton = menu.returnsMap.button__kovxizjntg;
  const italicButton = menu.returnsMap.button__xevyzoapsy;
  const underlineButton = menu.returnsMap.button__ctvdbmfnzn;
  const inlineCodeButton = menu.returnsMap.button__blnncjmzml;
  const superScriptButton = menu.returnsMap.button__lqwbmmoxus;
  const subscriptButton = menu.returnsMap.button__gxvccwmyhl;
  const strikethroughButton = menu.returnsMap.button__hzouaveanw;
  const bulletListButton = menu.returnsMap.button__rrujmyecrv;
  const numberListButton = menu.returnsMap.button__thphluhzux;
  const hyperlinkEnableButton = menu.returnsMap.button__pkqlfdlqtn;

  const { isFreeTrialExpired } = isAccountInFreeTrial();
  if (isFreeTrialExpired) {
    return;
  }

  editorAPI.onTransaction((): void => {
    if (editorAPI.isBoldActive()) {
      boldButton.buttonReturns?.setSelectedState(true);
    } else {
      boldButton.buttonReturns?.setSelectedState(false);
    }

    if (editorAPI.isItalicActive()) {
      italicButton.buttonReturns?.setSelectedState(true);
    } else {
      italicButton.buttonReturns?.setSelectedState(false);
    }

    if (editorAPI.isUnderlineActive()) {
      underlineButton.buttonReturns?.setSelectedState(true);
    } else {
      underlineButton.buttonReturns?.setSelectedState(false);
    }

    if (editorAPI.isInlineCodeActive()) {
      inlineCodeButton.buttonReturns?.setSelectedState(true);
    } else {
      inlineCodeButton.buttonReturns?.setSelectedState(false);
    }

    if (editorAPI.isSuperscriptActive()) {
      superScriptButton.buttonReturns?.setSelectedState(true);
    } else {
      superScriptButton.buttonReturns?.setSelectedState(false);
    }

    if (editorAPI.isSubscriptActive()) {
      subscriptButton.buttonReturns?.setSelectedState(true);
    } else {
      subscriptButton.buttonReturns?.setSelectedState(false);
    }

    if (editorAPI.isStrikethroughActive()) {
      strikethroughButton.buttonReturns?.setSelectedState(true);
    } else {
      strikethroughButton.buttonReturns?.setSelectedState(false);
    }

    if (editorAPI.isBulletListActive()) {
      bulletListButton.buttonReturns?.setSelectedState(true);
    } else {
      bulletListButton.buttonReturns?.setSelectedState(false);
    }

    if (editorAPI.isNumberListActive()) {
      numberListButton.buttonReturns?.setSelectedState(true);
    } else {
      numberListButton.buttonReturns?.setSelectedState(false);
    }

    if (editorAPI.isLinkActive()) {
      const linkInput = menu.returnsMap.input__eeizujkfwy;
      const linkAddButton = menu.returnsMap.button__gqzgqctnnr;
      const linkRemoveButton = menu.returnsMap.button__gdrvfruhim;

      const getLink = editorAPI.getLink();
      if (getLink === undefined) {
        return;
      }

      const { href } = getLink;

      linkInput.inputReturns?.set('');
      linkInput.inputReturns?.setPlaceholder(href.trim());

      linkInput.inputReturns?.setVisibleState(true);

      linkAddButton.buttonReturns?.setVisibleState(true);
      linkRemoveButton.buttonReturns?.setVisibleState(true);
    }
  });

  editorAPI.onSelectionUpdate((state: TEditorState): void => {
    if (state.selection === true) {
      if (!editorAPI.isLinkActive()) {
        hyperlinkEnableButton.buttonReturns?.setVisibleState(true);
        return;
      }
    } else {
      disableHyperLink(menu);
    }
  });
};

const addHyperLink = (menu: TReturnEditorFixedMenu): void => {
  const alertController = AlertController();

  const linkInput = menu.returnsMap.input__eeizujkfwy;

  if (linkInput.inputReturns) {
    const linkText = linkInput.inputReturns.get().trim();

    const { isValid, urlError } = validateURL(linkText.trim());
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

    const linkRemoveButton = menu.returnsMap.button__gdrvfruhim;
    const linkDisableButton = menu.returnsMap.button__pjdfjerfjd;

    linkRemoveButton.buttonReturns?.setVisibleState(true);
    linkDisableButton.buttonReturns?.setVisibleState(true);
  }
};

const enableHyperLink = (menu: TReturnEditorFixedMenu): void => {
  const linkInput = menu.returnsMap.input__eeizujkfwy;
  const linkAddButton = menu.returnsMap.button__gqzgqctnnr;
  const linkEnableButton = menu.returnsMap.button__pkqlfdlqtn;
  const linkDisableButton = menu.returnsMap.button__pjdfjerfjd;

  linkInput.inputReturns?.set('');
  linkInput.inputReturns?.setPlaceholder('');

  linkInput.inputReturns?.setVisibleState(true);
  linkAddButton.buttonReturns?.setVisibleState(true);
  linkEnableButton.buttonReturns?.setVisibleState(false);
  linkDisableButton.buttonReturns?.setVisibleState(true);
};

const disableHyperLink = (menu: TReturnEditorFixedMenu): void => {
  const linkInput = menu.returnsMap.input__eeizujkfwy;
  const linkAddButton = menu.returnsMap.button__gqzgqctnnr;
  const linkEnableButton = menu.returnsMap.button__pkqlfdlqtn;
  const linkDisableButton = menu.returnsMap.button__pjdfjerfjd;
  const linkRemoveButton = menu.returnsMap.button__gdrvfruhim;

  linkInput.inputReturns?.setVisibleState(false);
  linkAddButton.buttonReturns?.setVisibleState(false);
  linkEnableButton.buttonReturns?.setVisibleState(false);
  linkDisableButton.buttonReturns?.setVisibleState(false);
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
    isValid,
    urlError: urlErrorStr,
  };
};

export { setupEditorFixedMenuOptions, fixedMenuUpdateEventListener };
