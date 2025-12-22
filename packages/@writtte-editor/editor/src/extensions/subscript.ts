import type { MarkSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  type KeyboardShortcutCommand,
  Mark,
  type RawCommands,
  type SingleCommands,
  mergeAttributes,
} from '@tiptap/core';

type TSubscriptOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  shortcutKeys: {
    toggleSubscript: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    subscript: {
      setSubscript: () => ReturnType;
      unsetSubscript: () => ReturnType;
      toggleSubscript: () => ReturnType;
    };
  }
}

const SubscriptExtension: AnyExtension = Mark.create<TSubscriptOptions>({
  name: 'subscript',
  addOptions(): TSubscriptOptions {
    return {
      HTMLAttributes: {},
      shortcutKeys: {
        toggleSubscript: '',
      },
    };
  },
  parseHTML(): MarkSpec['parseDOM'] {
    return [{ tag: 'sub' }];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): [string, Record<string, string | number | boolean>, number] {
    return [
      'sub',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setSubscript:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.setMark(this.name),

      unsetSubscript:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.unsetMark(this.name),

      toggleSubscript:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.toggleMark(this.name),
    };
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    const shortcuts: { [key: string]: KeyboardShortcutCommand } = {};

    if (this.options.shortcutKeys.toggleSubscript) {
      shortcuts[this.options.shortcutKeys.toggleSubscript] = () =>
        this.editor.commands.toggleSubscript();
    }

    return shortcuts;
  },
});

export type { TSubscriptOptions };

export { SubscriptExtension };
