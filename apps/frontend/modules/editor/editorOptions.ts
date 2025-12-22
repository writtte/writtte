import type { TExtensionOptions } from '@writtte-editor/editor';

const setupEditorExtensionOptions = (): TExtensionOptions => ({
  paragraph: { isEnabled: true },
  header: { isEnabled: true },
  bulletList: { isEnabled: true },
  numberList: { isEnabled: true },
  listItem: { isEnabled: true },
  undoRedo: { isEnabled: true },
  link: { isEnabled: true },
  bold: { isEnabled: true },
  italic: { isEnabled: true },
  strikeThrough: { isEnabled: true },
  subscript: { isEnabled: true },
  superScript: { isEnabled: true },
  underline: { isEnabled: true },
  trailingNode: { isEnabled: true },
});

export { setupEditorExtensionOptions };
