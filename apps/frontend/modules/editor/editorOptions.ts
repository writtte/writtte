import type { TExtensionOptions } from '@writtte-editor/editor';

const shortcutKeys = {
  SET_PARAGRAPH: 'Mod-Alt-0',
  SET_HEADING: 'Mod-Alt', // KEY-[1 .. 6], ex: Mod-Alt-1 for H1
  TOGGLE_BOLD: 'Mod-b',
  TOGGLE_ITALIC: 'Mod-i',
  TOGGLE_UNDERLINE: 'Mod-u',
  TOGGLE_STRIKETHROUGH: 'Mod-Shift-x',
  TOGGLE_SUPERSCRIPT: 'Mod-Shift-+',
  TOGGLE_SUBSCRIPT: 'Mod-Shift--',
  TOGGLE_INLINE_CODE: 'Mod-Shift-c',
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

const setupEditorExtensionOptions = (): TExtensionOptions => ({
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
  trailingNode: {
    isEnabled: true,
  },
  inlineCode: {
    shortcutKeys: {
      toggleInlineCode: shortcutKeys.TOGGLE_INLINE_CODE,
    },
    isEnabled: true,
  },
  horizontalRule: {
    ignoredParents: ['tableCell', 'listItem'],
    isEnabled: true,
  },
  placeholder: {
    isEnabled: true,
  },
});

export { setupEditorExtensionOptions };
