import type { MarkSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  type KeyboardShortcutCommand,
  Mark,
  type RawCommands,
  type SingleCommands,
  mergeAttributes,
} from '@tiptap/core';

type TUnderlineOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  shortcutKeys: {
    toggleUnderline: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    underline: {
      setUnderline: () => ReturnType;
      unsetUnderline: () => ReturnType;
      toggleUnderline: () => ReturnType;
    };
  }
}

const UnderlineExtension: AnyExtension = Mark.create<TUnderlineOptions>({
  name: 'underline',
  addOptions(): TUnderlineOptions {
    return {
      HTMLAttributes: {},
      shortcutKeys: {
        toggleUnderline: '',
      },
    };
  },
  parseHTML(): MarkSpec['parseDOM'] {
    return [
      { tag: 'u' },
      {
        style: 'text-decoration',
        getAttrs: (value: string) => value === 'underline' && null,
      },
    ];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): [string, Record<string, string | number | boolean>, number] {
    return [
      'u',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setUnderline:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.setMark(this.name),

      unsetUnderline:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.unsetMark(this.name),

      toggleUnderline:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.toggleMark(this.name),
    };
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    const shortcuts: { [key: string]: KeyboardShortcutCommand } = {};

    if (this.options.shortcutKeys.toggleUnderline) {
      shortcuts[this.options.shortcutKeys.toggleUnderline] = () =>
        this.editor.commands.toggleUnderline();
    }

    return shortcuts;
  },
});

export type { TUnderlineOptions };

export { UnderlineExtension };
