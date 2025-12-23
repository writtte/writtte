import type { MarkSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  type KeyboardShortcutCommand,
  Mark,
  type RawCommands,
  type SingleCommands,
  mergeAttributes,
} from '@tiptap/core';

type TSuperscriptOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  shortcutKeys: {
    toggleSuperscript: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    superscript: {
      setSuperscript: () => ReturnType;
      unsetSuperscript: () => ReturnType;
      toggleSuperscript: () => ReturnType;
    };
  }
}

const SuperscriptExtension: AnyExtension = Mark.create<TSuperscriptOptions>({
  name: 'superscript',
  addOptions(): TSuperscriptOptions {
    return {
      HTMLAttributes: {},
      shortcutKeys: {
        toggleSuperscript: '',
      },
    };
  },
  parseHTML(): MarkSpec['parseDOM'] {
    return [{ tag: 'sup' }];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): [string, Record<string, string | number | boolean>, number] {
    return [
      'sup',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setSuperscript:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.setMark(this.name),

      unsetSuperscript:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.unsetMark(this.name),

      toggleSuperscript:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.toggleMark(this.name),
    };
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    const shortcuts: { [key: string]: KeyboardShortcutCommand } = {};

    if (this.options.shortcutKeys.toggleSuperscript) {
      shortcuts[this.options.shortcutKeys.toggleSuperscript] = () =>
        this.editor.commands.toggleSuperscript();
    }

    return shortcuts;
  },
});

export type { TSuperscriptOptions };

export { SuperscriptExtension };
