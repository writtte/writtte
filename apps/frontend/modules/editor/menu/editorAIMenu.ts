import type { TEditorSchema } from '@writtte-editor/editor';
import type { TReturnEditorAIMenu } from '../../../components/EditorAIMenu';
import type { TEditorAIMenuStyle } from '../../../components/EditorAIMenuManual';
import type { TEditorAIMenuQuick } from '../../../components/EditorAIMenuQuicks';
import { idb } from '@writtte-internal/indexed-db';
import { micromark } from 'micromark';
import { exportToMarkdownSection } from '../../../../../packages/@writtte-editor/export/dist';
import { FlatIcon, FlatIconName } from '../../../components/FlatIcon';
import { StatusTextType } from '../../../components/StatusText';
import {
  EditorAIMenuController,
  type TReturnEditorAIMenuController,
} from '../../../controller/editorAIMenu';
import {
  type TPayloadV1AIGenerateStreaming,
  v1AIGenerateStreaming,
} from '../../../data/apis/aiGenerate/v1AIGenerateStreaming';
import {
  STORE_NAMES,
  type TIDBStyles,
  getIndexedDB,
} from '../../../data/stores/indexedDB';
import { getEditorAPI } from '../../../data/stores/mainEditor';
import { AccessToken } from '../../../helpers/account/accessToken';
import { buildError } from '../../../helpers/error/build';
import { logFatalToSentry } from '../../../helpers/error/sentry';
import { langKeys } from '../../../translations/keys';

const setupAIMenu = async (): Promise<void> => {
  const editorAIMenuController = EditorAIMenuController();

  const customStyles = await getCustomStyles();

  const menu = editorAIMenuController.showMenu({
    id: 'editor_ai_menu__ghdznlihjg',
    title: langKeys().EditorAiMenuTitle,
    manualEdit: {
      id: 'editor_ai_menu_manual_edit__hfiitwreif',
      placeholderText: langKeys().EditorAiMenuPlaceholder,
      stylesText: langKeys().EditorAiMenuStyles,
      customStyles,
      submitButton: {
        id: 'button__mwqgokxqov',
        icon: FlatIcon(FlatIconName._18_ARROW_UP),
        onClick: async (): Promise<void> =>
          await submitRequest(editorAIMenuController, undefined),
      },
    },
    quicks: {
      id: 'editor_ai_menu_quicks__vbfngdybyc',
      quicks: await setQuicks(editorAIMenuController),
    },
  });

  menu.manualEditReturn.focusInput();
};

const getCustomStyles = async (): Promise<TEditorAIMenuStyle[]> => {
  const db = getIndexedDB();

  const { getCurrentAccount } = AccessToken();

  const accountCode = getCurrentAccount();
  if (accountCode === null || accountCode.length === 0) {
    return [];
  }

  const stylesForList: TEditorAIMenuStyle[] = [];
  const allStyles: TIDBStyles[] = await idb.getAllData(db, STORE_NAMES.STYLES);

  for (let i = 0; i < allStyles.length; i++) {
    const style = allStyles[i];
    if (style.accountCode !== accountCode) {
      continue;
    }

    stylesForList.push({
      id: `editor_ai_menu_custom_style__${style.styleCode}`,
      code: style.styleCode,
      name: style.styleName,
      isVisible: true,
    });
  }

  return stylesForList;
};

const setQuicks = async (
  controller: TReturnEditorAIMenuController,
): Promise<TEditorAIMenuQuick[]> => [
  {
    id: 'editor_ai_menu_quick__rbluuuuehc',
    label: langKeys().EditorAiMenuQuickFixGrammar,
    isVisible: true,
    onClick: async (): Promise<void> =>
      await submitRequest(controller, 'fix-grammar'),
  },
  {
    id: 'editor_ai_menu_quick__bppcodmici',
    label: langKeys().EditorAiMenuQuickShorten,
    isVisible: true,
    onClick: async (): Promise<void> =>
      await submitRequest(controller, 'shorten'),
  },
  {
    id: 'editor_ai_menu_quick__izchfyeved',
    label: langKeys().EditorAiMenuQuickLengthen,
    isVisible: true,
    onClick: async (): Promise<void> =>
      await submitRequest(controller, 'lengthen'),
  },
  {
    id: 'editor_ai_menu_quick__gkhblwketj',
    label: langKeys().EditorAiMenuQuickSummarize,
    isVisible: true,
    onClick: async (): Promise<void> =>
      await submitRequest(controller, 'summarize'),
  },
  {
    id: 'editor_ai_menu_quick__mlsbxiqxdc',
    label: langKeys().EditorAiMenuQuickSimplify,
    isVisible: true,
    onClick: async (): Promise<void> =>
      await submitRequest(controller, 'simplify'),
  },
];

const submitRequest = async (
  controller: TReturnEditorAIMenuController,
  quick: string | undefined,
): Promise<void> => {
  const menu = controller.getMenuById('editor_ai_menu__ghdznlihjg');
  if (menu === undefined) {
    throw new Error(buildError('unable to find the editor AI menu'));
  }

  const instructions = menu.manualEditReturn.getInstructions();
  const styleCode = menu.manualEditReturn.getSelectedStyle();

  if (!quick && (!instructions || instructions.trim().length === 0)) {
    menu.manualEditReturn.setStatusText({
      id: 'status_text__fxlsszdbvk',
      text: langKeys().ErrorAiInputRequired,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    return;
  }

  const { getCurrentAccountData } = AccessToken();

  menu.manualEditReturn.setGenerating(true);
  menu.quicksReturn.setGenerating(true);

  const payload: TPayloadV1AIGenerateStreaming = {
    accessToken: getCurrentAccountData()?.access_token ?? '',
    message: setMessage(instructions, quick),
  };

  if (styleCode && styleCode.trim().length > 0) {
    payload.styleCode = styleCode;
  }

  if (quick !== undefined) {
    payload.quick = quick;
  }

  let fullResponse = '';

  const responseElement = menu.setResponse(
    {
      id: 'editor_ai_menu_response__ghamzvtudf',
      response: '',
      cancelButton: {
        id: 'button__xlwqdrzgae',
        text: langKeys().EditorAiMenuButtonCancel,
        onClick: (): void => cancelChanges(controller),
      },
      confirmButton: {
        id: 'button__tueypfznim',
        text: langKeys().EditorAiMenuButtonConfirm,
        onClick: (): void => setChanges(controller, menu, fullResponse),
      },
    },
    true,
  );

  if (responseElement === undefined) {
    throw new Error(buildError('response element is undefined'));
  }

  responseElement.setVisibility(false);

  try {
    await v1AIGenerateStreaming(payload, {
      onChunk: (chunk: string) => {
        fullResponse += chunk;
        if (fullResponse.trim().length > 0) {
          responseElement.setVisibility(true);
        }

        responseElement.setValue(fullResponse);
      },
      onFinal: ({
        inputTokens: _,
        outputTokens: __,
      }: {
        inputTokens: number;
        outputTokens: number;
      }) => {
        // do nothing here...
      },
      onError: (error: string) => {
        logFatalToSentry(error);

        menu.manualEditReturn.setStatusText({
          id: 'status_text__fxlsszdbvk',
          text: langKeys().ErrorApiInternalServerError,
          type: StatusTextType.ERROR,
          isIconVisible: true,
        });

        menu.setResponse(undefined, false);
        menu.manualEditReturn.setGenerating(false);
        menu.quicksReturn.setGenerating(false);
      },
      onComplete: () => {
        menu.manualEditReturn.setGenerating(false);
        menu.quicksReturn.setGenerating(false);
      },
    });
  } catch (error) {
    logFatalToSentry(error);

    menu.manualEditReturn.setStatusText({
      id: 'status_text__fxlsszdbvk',
      text: langKeys().ErrorApiInternalServerError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    menu.manualEditReturn.setGenerating(false);
    menu.quicksReturn.setGenerating(false);
  }
};

const setMessage = (instruction: string, quick: string | undefined): string => {
  if (quick === undefined) {
    // In this case, the instructions should be used directly

    return instruction;
  }

  // In this case, the selected text from the editor should be retrieved
  // and passed as the message

  const editorAPI = getEditorAPI();

  const rangeInSchema: TEditorSchema | null =
    editorAPI.getSelectedRangeInSchema();

  if (rangeInSchema === null) {
    return instruction;
  }

  const rangeInMD = exportToMarkdownSection(rangeInSchema);
  return rangeInMD;
};

const cancelChanges = (controller: TReturnEditorAIMenuController): void => {
  controller.closeMenu('editor_ai_menu__ghdznlihjg');
};

const setChanges = (
  controller: TReturnEditorAIMenuController,
  menu: TReturnEditorAIMenu,
  responseToSet: string,
): void => {
  const editorAPI = getEditorAPI();
  const htmlContent = micromark(responseToSet);
  const selectedText = editorAPI.getSelectedRangeInText();

  if (selectedText === null || selectedText.trim() === '') {
    // In this case, the response should be inserted

    const positionToInsert = editorAPI.getCurrentPosition();
    if (positionToInsert === null) {
      logFatalToSentry(
        'unable to insert AI generated content because position to insert is null',
      );

      menu.manualEditReturn.setStatusText({
        id: 'status_text__fxlsszdbvk',
        text: langKeys().ErrorApiInternalServerError,
        type: StatusTextType.ERROR,
        isIconVisible: true,
      });

      return;
    }

    editorAPI.setContentInHTML(positionToInsert, htmlContent);

    controller.closeMenu('editor_ai_menu__ghdznlihjg');
    return;
  }

  // In this case, the response should be replaced

  const positionsToReplace = editorAPI.getCurrentSelectionRange();
  if (positionsToReplace === null) {
    logFatalToSentry(
      'unable to replace AI generated content because position to replace (from,to) is null',
    );

    menu.manualEditReturn.setStatusText({
      id: 'status_text__fxlsszdbvk',
      text: langKeys().ErrorApiInternalServerError,
      type: StatusTextType.ERROR,
      isIconVisible: true,
    });

    return;
  }

  editorAPI.replaceContentInHTML(
    positionsToReplace.from,
    positionsToReplace.to,
    htmlContent,
  );

  controller.closeMenu('editor_ai_menu__ghdznlihjg');
};

export { setupAIMenu };
