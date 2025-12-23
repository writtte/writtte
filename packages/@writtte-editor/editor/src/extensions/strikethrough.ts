import type { MarkSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  type KeyboardShortcutCommand,
  Mark,
  type RawCommands,
  type SingleCommands,
  mergeAttributes,
} from '@tiptap/core';

type TStrikethroughOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  shortcutKeys: {
    toggleStrikethrough: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    strikethrough: {
      setStrikethrough: () => ReturnType;
      unsetStrikethrough: () => ReturnType;
      toggleStrikethrough: () => ReturnType;
    };
  }
}

const StrikethroughExtension: AnyExtension = Mark.create<TStrikethroughOptions>(
  {
    name: 'strikethrough',
    addOptions(): TStrikethroughOptions {
      return {
        HTMLAttributes: {},
        shortcutKeys: {
          toggleStrikethrough: '',
        },
      };
    },
    parseHTML(): MarkSpec['parseDOM'] {
      return [
        { tag: 's' },
        { tag: 'del' },
        {
          style: 'text-decoration',
          getAttrs: (value: string) => value === 'line-through' && null,
        },
      ];
    },
    renderHTML({
      HTMLAttributes,
    }: {
      HTMLAttributes: Record<string, string | number | boolean>;
    }): [string, Record<string, string | number | boolean>, number] {
      return [
        's',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        0,
      ];
    },
    addCommands(): Partial<RawCommands> {
      return {
        setStrikethrough:
          () =>
          ({ commands }: { commands: SingleCommands }) =>
            commands.setMark(this.name),

        unsetStrikethrough:
          () =>
          ({ commands }: { commands: SingleCommands }) =>
            commands.unsetMark(this.name),

        toggleStrikethrough:
          () =>
          ({ commands }: { commands: SingleCommands }) =>
            commands.toggleMark(this.name),
      };
    },
    addKeyboardShortcuts(): {
      [key: string]: KeyboardShortcutCommand;
    } {
      const shortcuts: { [key: string]: KeyboardShortcutCommand } = {};

      if (this.options.shortcutKeys.toggleStrikethrough) {
        shortcuts[this.options.shortcutKeys.toggleStrikethrough] = () =>
          this.editor.commands.toggleStrikethrough();
      }

      return shortcuts;
    },
  },
);

export type { TStrikethroughOptions };

export { StrikethroughExtension };
