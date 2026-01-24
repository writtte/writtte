import { CloseButton } from './CloseButton';
import {
  EditorAIMenuManual,
  type TEditorAIMenuManualOptions,
  type TReturnEditorAIMenuManual,
} from './EditorAIMenuManual';
import {
  EditorAIMenuQuicks,
  type TEditorAIMenuQuicksOptions,
  type TReturnEditorAIMenuQuicks,
} from './EditorAIMenuQuicks';
import {
  EditorAIMenuResponse,
  type TEditorAIMenuResponseOptions,
  type TReturnEditorAIMenuResponse,
} from './EditorAIMenuResponse';
import { FlatIcon, FlatIconName } from './FlatIcon';

type TOptions = {
  id: string;
  title: string;
  manualEdit: TEditorAIMenuManualOptions;
  quicks: TEditorAIMenuQuicksOptions;
};

type TReturnEditorAIMenu = {
  element: HTMLDivElement;
  manualEditReturn: TReturnEditorAIMenuManual;
  quicksReturn: TReturnEditorAIMenuQuicks;
  setResponse: (
    responseOpts: TEditorAIMenuResponseOptions | undefined,
    shouldSet: boolean,
  ) => TReturnEditorAIMenuResponse | undefined;
};

const EditorAIMenu = (opts: TOptions): TReturnEditorAIMenu => {
  const menuDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const logoDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const betaTagDiv = document.createElement('div');
  const contentDiv = document.createElement('div');

  menuDiv.classList.add('editor-ai-menu');
  headerDiv.classList.add('editor-ai-menu__header');
  logoDiv.classList.add('editor-ai-menu__logo');
  titleDiv.classList.add('editor-ai-menu__title');
  betaTagDiv.classList.add('editor-ai-menu__beta-tag');
  contentDiv.classList.add('editor-ai-menu__content');

  const closeButtonElement = CloseButton({
    id: `${opts.id}-close-button`,
    onClick: (): void => {
      const closeEvent = new CustomEvent('editor-ai-menu:close', {
        detail: {
          id: opts.id,
        },
      });

      document.dispatchEvent(closeEvent);
    },
  });

  menuDiv.id = opts.id;
  titleDiv.textContent = opts.title;
  betaTagDiv.textContent = 'Beta';

  logoDiv.appendChild(FlatIcon(FlatIconName._18_WRITTTE_LOGO));
  headerDiv.append(logoDiv, titleDiv, betaTagDiv, closeButtonElement.element);
  menuDiv.append(headerDiv, contentDiv);

  const manualElement = EditorAIMenuManual({ ...opts.manualEdit });
  const quicksElement = EditorAIMenuQuicks({ ...opts.quicks });

  contentDiv.append(manualElement.element, quicksElement.element);

  let currentResponseElement: TReturnEditorAIMenuResponse | null = null;

  const setResponse = (
    responseOpts: TEditorAIMenuResponseOptions | undefined,
    shouldSet: boolean,
  ): TReturnEditorAIMenuResponse | undefined => {
    if (currentResponseElement) {
      currentResponseElement.element.remove();
      currentResponseElement = null;
    }

    if (responseOpts !== undefined && shouldSet === true) {
      const responseElement = EditorAIMenuResponse({
        ...responseOpts,
      });

      contentDiv.appendChild(responseElement.element);
      currentResponseElement = responseElement;
      return responseElement;
    }

    return;
  };

  return {
    element: menuDiv,
    setResponse,
    manualEditReturn: manualElement,
    quicksReturn: quicksElement,
  };
};

export type { TOptions as TEditorAIMenuOptions, TReturnEditorAIMenu };

export { EditorAIMenu };
