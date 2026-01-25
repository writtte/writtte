import type { TImageAttributes } from '../extensions/image';
import type {
  TLangToolStorage,
  TLanguageToolMatch,
} from '../extensions/langTool';
import type { TEditorSchema } from './schema';
import type { TEditorState } from './state';

type TEditorAPI = {
  isEditable: () => boolean;
  setEditable: () => void;
  setReadable: () => void;
  getContent: () => TEditorSchema | undefined;
  setContent: (content: TEditorSchema) => void;
  setContentInHTML: (position: number, content: string) => void;
  replaceContentInHTML: (from: number, to: number, content: string) => void;
  replaceContentInText: (from: number, to: number, content: string) => void;
  replaceContent: (content: TEditorSchema) => TEditorSchema;
  stringToSchema: (content: string) => TEditorSchema;
  schemaToString: (schema: TEditorSchema) => string;
  focus: () => void;
  onChange: (callback: (content: TEditorSchema) => void) => void;
  onSelectionUpdate: (callback: (state: TEditorState) => void) => void;
  onFocus: (callback: (state: TEditorState) => void) => void;
  onBlur: (callback: (state: TEditorState) => void) => void;
  onTransaction: (callback: (state: TEditorState) => void) => void;
  getCursorPosition: () => { x: number; y: number } | null;
  getCurrentPosition: () => number | null;
  getCurrentSelectionRange: () => { from: number; to: number } | null;
  getSelectedRangeInText: () => string | null;
  getSelectedRangeInSchema: () => TEditorSchema | null;
  proofreadDocument: () => boolean;
  toggleLangTool: () => boolean;
  acceptSuggestion: (replacement: string) => boolean;
  ignoreSuggestion: () => boolean;
  clearMatch: () => boolean;
  setLanguage: (language: string) => boolean;
  getLanguage: () => string;
  getLangToolMatch: () => TLanguageToolMatch | null;
  getLangToolMatchRange: () => { from: number; to: number } | null;
  getLangToolStorage: () => TLangToolStorage | null;
  isLangToolActive: () => boolean;
  isLangToolLoading: () => boolean;
  setParagraph: () => boolean;
  setHorizontalLine: () => boolean;
  setLink: (href: string, target: string) => boolean;
  getLink: () =>
    | {
        href: string;
        target: string;
      }
    | undefined;
  unsetLink: () => boolean;
  setImage: (attributes: TImageAttributes) => boolean;
  updateImage: (
    imageCode: string,
    attributes: Partial<TImageAttributes>,
  ) => boolean;
  removeImage: () => boolean;
  addPlaceholder: (element: HTMLElement, id: string) => boolean;
  removePlaceholder: (id: string) => boolean;
  removeAllPlaceholders: () => boolean;
  setBlockQuote: () => boolean;
  unsetBlockQuote: () => boolean;
  toggleBlockQuote: () => boolean;
  toggleHeader01: () => boolean;
  toggleHeader02: () => boolean;
  toggleHeader03: () => boolean;
  toggleHeader04: () => boolean;
  toggleHeader05: () => boolean;
  toggleHeader06: () => boolean;
  toggleBold: () => boolean;
  toggleItalic: () => boolean;
  toggleUnderline: () => boolean;
  toggleInlineCode: () => boolean;
  toggleSuperscript: () => boolean;
  toggleSubscript: () => boolean;
  toggleStrikethrough: () => boolean;
  toggleBulletList: () => boolean;
  toggleNumberList: () => boolean;
  toggleCodeBlock: () => boolean;
  isBoldActive: () => boolean;
  isItalicActive: () => boolean;
  isUnderlineActive: () => boolean;
  isInlineCodeActive: () => boolean;
  isSuperscriptActive: () => boolean;
  isSubscriptActive: () => boolean;
  isStrikethroughActive: () => boolean;
  isLinkActive: () => boolean;
  isBulletListActive: () => boolean;
  isNumberListActive: () => boolean;
  isImageActive: () => boolean;
  isCodeBlockActive: () => boolean;
};

export type { TEditorAPI };
