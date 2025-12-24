import type { TEditorSchema } from './schema';
import type { TEditorState } from './state';

type TEditorAPI = {
  isEditable: () => boolean;
  setEditable: () => void;
  setReadable: () => void;
  setContent: (content: TEditorSchema) => void;
  replaceContent: (content: TEditorSchema) => void;
  stringToSchema: (content: string) => TEditorSchema;
  schemaToString: (schema: TEditorSchema) => string;
  onChange: (callback: (content: TEditorSchema) => void) => void;
  onSelectionUpdate: (callback: (state: TEditorState) => void) => void;
  onFocus: (callback: (state: TEditorState) => void) => void;
  onBlur: (callback: (state: TEditorState) => void) => void;
  onTransaction: (callback: (state: TEditorState) => void) => void;
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
  isBoldActive: () => boolean;
  isItalicActive: () => boolean;
  isUnderlineActive: () => boolean;
  isInlineCodeActive: () => boolean;
  isSuperscriptActive: () => boolean;
  isSubscriptActive: () => boolean;
  isStrikethroughActive: () => boolean;
  isLinkActive: () => boolean;
};

export type { TEditorAPI };
