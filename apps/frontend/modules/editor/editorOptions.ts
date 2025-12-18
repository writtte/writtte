import type { TExtensionOptions } from '@velovra-editor/editor';

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
