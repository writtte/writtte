import type {
  TExtensionOptions,
  TImageAttributes,
} from '@writtte-editor/editor';
import { langKeys } from '../../../translations/keys';
import { ALLOWED_IMAGE_FILE_EXTENSIONS } from '../image/browseImage';
import { imageAfterPaste, setupImageForUpload } from '../image/imageUpload';
import {
  getQueryStateRef,
  selectNextBlockMenuItem,
  selectPreviousBlockMenuItem,
  setBlockMenuCallbacks,
  setupEditorBlockMenu,
  triggerSelectedBlockMenuItem,
  updateBlockMenuQuery,
} from '../menu/editorBlockMenu';
import { setupEditorBubbleMenu } from '../menu/editorBubbleMenu';

const shortcutKeys = {
  SET_PARAGRAPH: 'Mod-Alt-0',
  SET_HEADING: 'Mod-Alt', // Mod-Alt-[1 .. 6]
  TOGGLE_BOLD: 'Mod-b',
  TOGGLE_ITALIC: 'Mod-i',
  TOGGLE_UNDERLINE: 'Mod-u',
  TOGGLE_STRIKETHROUGH: 'Mod-Shift-x',
  TOGGLE_SUPERSCRIPT: 'Mod-Shift-+',
  TOGGLE_SUBSCRIPT: 'Mod-Shift--',
  TOGGLE_INLINE_CODE: 'Mod-Shift-c',
  TOGGLE_CODE_BLOCK: 'Mod-Alt-c',
  UNDO: 'Mod-z',
  REDO: 'Mod-y',
  REDO_SECOND: 'Shift-Mod-z',
  UNDO_RUSSIAN: 'Mod-я',
  REDO_RUSSIAN: 'Shift-Mod-я',
  LIST_ITEM_SPLIT: 'Enter',
  LIST_ITEM_SINK: 'Tab',
  LIST_ITEM_LIFT: 'Shift-Tab',
  BULLET_LIST_TOGGLE: 'Mod-Shift-8',
  NUMBER_LIST_TOGGLE: 'Mod-Shift-7',
};

const setupEditorExtensionOptions = (
  isEditable: boolean,
): TExtensionOptions => ({
  paragraph: {
    shortcutKeys: {
      setParagraph: shortcutKeys.SET_PARAGRAPH,
    },
    isEnabled: true,
  },
  header: {
    shortcutKeys: {
      setHeading: shortcutKeys.SET_HEADING,
    },
    isEnabled: true,
  },
  bulletList: {
    keepMarksWhenSplitting: true,
    keepAttributesWhenSplitting: true,
    shortcutKeys: {
      toggleBulletList: shortcutKeys.BULLET_LIST_TOGGLE,
    },
    isEnabled: true,
  },
  numberList: {
    keepMarksWhenSplitting: true,
    keepAttributesWhenSplitting: true,
    shortcutKeys: {
      toggleNumberList: shortcutKeys.NUMBER_LIST_TOGGLE,
    },
    isEnabled: true,
  },
  listItem: {
    shortcutKeys: {
      splitListItem: shortcutKeys.LIST_ITEM_SPLIT,
      sinkListItem: shortcutKeys.LIST_ITEM_SINK,
      liftListItem: shortcutKeys.LIST_ITEM_LIFT,
    },
    isEnabled: true,
  },
  undoRedo: {
    shortcutKeys: {
      undo: shortcutKeys.UNDO,
      redo: shortcutKeys.REDO,
      redoSecond: shortcutKeys.REDO_SECOND,
      undoRussian: shortcutKeys.UNDO_RUSSIAN,
      redoRussian: shortcutKeys.REDO_RUSSIAN,
    },
    isEnabled: true,
  },
  link: {
    HTMLAttributes: {
      rel: 'noopener noreferrer nofollow',
      'data-disable-progress': 'true',
    },
    isEnabled: true,
  },
  bold: {
    shortcutKeys: {
      toggleBold: shortcutKeys.TOGGLE_BOLD,
    },
    isEnabled: true,
  },
  italic: {
    shortcutKeys: {
      toggleItalic: shortcutKeys.TOGGLE_ITALIC,
    },
    isEnabled: true,
  },
  strikeThrough: {
    shortcutKeys: {
      toggleStrikethrough: shortcutKeys.TOGGLE_STRIKETHROUGH,
    },
    isEnabled: true,
  },
  subscript: {
    shortcutKeys: {
      toggleSubscript: shortcutKeys.TOGGLE_SUBSCRIPT,
    },
    isEnabled: true,
  },
  superScript: {
    shortcutKeys: {
      toggleSuperscript: shortcutKeys.TOGGLE_SUPERSCRIPT,
    },
    isEnabled: true,
  },
  underline: {
    shortcutKeys: {
      toggleUnderline: shortcutKeys.TOGGLE_UNDERLINE,
    },
    isEnabled: true,
  },
  baseNode: {
    isEnabled: true,
  },
  trailingNode: {
    isEnabled: true,
  },
  inlineCode: {
    shortcutKeys: {
      toggleInlineCode: shortcutKeys.TOGGLE_INLINE_CODE,
    },
    isEnabled: true,
  },
  codeBlock: {
    shortcutKeys: {
      toggleCodeBlock: shortcutKeys.TOGGLE_CODE_BLOCK,
    },
    isEnabled: true,
  },
  horizontalRule: {
    ignoredParents: ['tableCell', 'listItem'],
    isEnabled: true,
  },
  placeholder: {
    placeholder: langKeys().PageEditorPlaceholder,
    showOnlyWhenEditable: true,
    showOnlyIfCurrentNodeIsEmpty: true,
    isEnabled: true,
  },
  blockPlaceholder: {
    isEnabled: true,
  },
  image: {
    fileExtensions: ALLOWED_IMAGE_FILE_EXTENSIONS,
    onBeforePaste: async (file: File): Promise<TImageAttributes> =>
      await setupImageForUpload(file),
    onAfterPaste: async (
      _: File,
      __: TImageAttributes,
      ___: (attrs: Partial<TImageAttributes>) => void,
    ): Promise<void> => await imageAfterPaste(),
    isEnabled: true,
  },
  bubbleMenu: {
    MenuElement: setupEditorBubbleMenu(),
    isEnabled: isEditable,
  },
  blockMenu: {
    MenuElement: setupEditorBlockMenu(),
    trigger: '/',
    onInputUpdate: (query: string): void => updateBlockMenuQuery(query),
    queryStateRef: getQueryStateRef(),
    onArrowDown: (): void => selectNextBlockMenuItem(),
    onArrowUp: (): void => selectPreviousBlockMenuItem(),
    onEnter: (): void => triggerSelectedBlockMenuItem(),
    onSelect: (deleteTrigger: () => void, hideMenu: () => void): void =>
      setBlockMenuCallbacks(deleteTrigger, hideMenu),
    isEnabled: isEditable,
  },
  blockQuote: {
    isEnabled: true,
  },
});

export { setupEditorExtensionOptions };
