import {
  EditorLanguageToolPopup,
  type TEditorLanguageToolPopup,
} from '../components/EditorLanguageToolPopup';
import { getEditorAPI } from '../data/stores/mainEditor';

type TReturnEditorLanguageToolPopupController = {
  setEventListener: (editorElement: HTMLDivElement) => void;
  cleanEventListener: (editorElement: HTMLDivElement) => void;
};

const editorLanguageToolPopupController =
  (): TReturnEditorLanguageToolPopupController => {
    let currentPopup: HTMLDivElement | null = null;

    const removePopup = (): void => {
      if (currentPopup) {
        currentPopup.remove();
        currentPopup = null;
      }
    };

    const calculatePopupPosition = (
      targetElement: HTMLElement,
    ): { x: number; y: number } => {
      const rect = targetElement.getBoundingClientRect();
      const x = rect.left + window.scrollX;
      const y = rect.bottom + window.scrollY + 8;

      return { x, y };
    };

    const showPopup = (target: HTMLElement): void => {
      const editorAPI = getEditorAPI();
      if (!editorAPI) {
        return;
      }

      const match = editorAPI.getLangToolMatch();
      const matchRange = editorAPI.getLangToolMatchRange();
      const storage = editorAPI.getLangToolStorage();

      if (!match || !matchRange) {
        return;
      }

      removePopup();

      const location = calculatePopupPosition(target);

      const maxSuggestions = storage?.maxSuggestions || 5;
      const limitedReplacements = match.replacements.slice(0, maxSuggestions);

      const popupOptions: TEditorLanguageToolPopup = {
        id: 'editor-language-tool-popup__coisesimnf',
        text: match.message,
        suggestions: limitedReplacements.map((replacement) => ({
          text: replacement.value,
          onClick: (): void => {
            editorAPI.acceptSuggestion(replacement.value);
            removePopup();
          },
        })),
        ignoreButton: {
          text: 'Ignore',
          onClick: (): void => {
            editorAPI.ignoreSuggestion();
            removePopup();
          },
        },
        location,
      };

      const popup = EditorLanguageToolPopup(popupOptions);
      currentPopup = popup.element;

      document.body.appendChild(currentPopup);
    };

    const handleDocumentClick = (e: MouseEvent): void => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        '[data-grammar-match]',
      );

      if (target) {
        e.preventDefault();
        e.stopPropagation();

        setTimeout(() => {
          showPopup(target);
        }, 50);

        return;
      }

      if (currentPopup && !currentPopup.contains(e.target as HTMLElement)) {
        removePopup();
      }
    };

    const handleEscapeKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && currentPopup) {
        removePopup();
      }
    };

    const setEventListener = (editorElement: HTMLDivElement): void => {
      editorElement.addEventListener('click', handleDocumentClick);
      document.addEventListener('keydown', handleEscapeKey);
    };

    const cleanEventListener = (editorElement: HTMLDivElement): void => {
      editorElement.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleEscapeKey);
      removePopup();
    };

    return {
      setEventListener,
      cleanEventListener,
    };
  };

export type { TReturnEditorLanguageToolPopupController };

export { editorLanguageToolPopupController };
