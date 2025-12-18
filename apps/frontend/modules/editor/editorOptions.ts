import type { TExtensionOptions } from '@writtte-editor/editor';

const setupEditorExtensionOptions = (): TExtensionOptions => ({
  paragraph: {
    HTMLAttributes: {},
    shortcutKeys: {
      setParagraph: '',
    },
    isEnabled: true,
  },
});

export { setupEditorExtensionOptions };
