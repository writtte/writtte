import type { TCanvasAttributes } from '../extensions/canvas';
import type { TImageAttributes } from '../extensions/image';
import type { TEditorSchema } from './schema';
import type { TEditorState } from './state';

type TEditorAPI = {
  isEditable: () => boolean;
  setEditable: () => void;
  setReadable: () => void;
  getContent: () => TEditorSchema | undefined;
  setContent: (content: TEditorSchema) => void;
  replaceContent: (content: TEditorSchema) => TEditorSchema;
  stringToSchema: (content: string) => TEditorSchema;
  focus: () => void;
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
  setImage: (attributes: TImageAttributes) => boolean;
  updateImage: (
    imageCode: string,
    attributes: Partial<TImageAttributes>,
  ) => boolean;
  removeImage: () => boolean;
  addCanvas: (attributes: TCanvasAttributes) => boolean;
  updateCanvas: (
    canvasId: string,
    attributes: Partial<TCanvasAttributes>,
  ) => boolean;
  removeCanvas: () => boolean;
  selectCanvas: (canvasId: string) => boolean;
  isCanvasActive: () => boolean;
  addPlaceholder: (element: HTMLElement, id: string) => boolean;
  removePlaceholder: (id: string) => boolean;
  removeAllPlaceholders: () => boolean;
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
  isBulletListActive: () => boolean;
  isNumberListActive: () => boolean;
  isImageActive: () => boolean;
};

export type { TEditorAPI };
