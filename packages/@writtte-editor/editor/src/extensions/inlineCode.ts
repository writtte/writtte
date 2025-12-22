import type { MarkSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  type InputRule,
  type KeyboardShortcutCommand,
  Mark,
  type PasteRule,
  type RawCommands,
  type SingleCommands,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from '@tiptap/core';

/**
 * Regular expressions used to identify inline code segments wrapped in backticks.
 *
 * The patterns match:
 *  - An optional character that is not a backtick (or the start of the line),
 *  - An opening backtick,
 *  - One or more characters that are not backticks (captured as the code content),
 *  - A closing backtick,
 *  - Ensuring the closing backtick is not immediately followed by another backtick.
 *
 * These expressions ensure that only properly enclosed inline code is detected and
 * formatted, while avoiding accidental matches with consecutive or nested backticks.
 */

const inputRegex = /(^|[^`])`([^`]+)`(?!`)/;
const pasteRegex = /(^|[^`])`([^`]+)`(?!`)/g;

type TInlineCodeOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  shortcutKeys: {
    toggleInlineCode: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineCode: {
      setInlineCode: () => ReturnType;
      unsetInlineCode: () => ReturnType;
      toggleInlineCode: () => ReturnType;
    };
  }
}

const InlineCodeExtension: AnyExtension = Mark.create<TInlineCodeOptions>({
  name: 'inlineCode',
  excludes: '_',
  code: true,
  exitable: true,
  addOptions(): TInlineCodeOptions {
    return {
      HTMLAttributes: {},
      shortcutKeys: {
        toggleInlineCode: '',
      },
    };
  },
  parseHTML(): MarkSpec['parseDOM'] {
    return [{ tag: 'code' }];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): [string, Record<string, string | number | boolean>, number] {
    return [
      'code',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setInlineCode:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.setMark(this.name),

      unsetInlineCode:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.unsetMark(this.name),

      toggleInlineCode:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.toggleMark(this.name),
    };
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    const shortcuts: { [key: string]: KeyboardShortcutCommand } = {};

    if (this.options.shortcutKeys.toggleInlineCode) {
      shortcuts[this.options.shortcutKeys.toggleInlineCode] = () =>
        this.editor.commands.toggleInlineCode();
    }

    return shortcuts;
  },
  addInputRules(): InputRule[] {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ];
  },
  addPasteRules(): PasteRule[] {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type,
      }),
    ];
  },
});

export type { TInlineCodeOptions };

export { InlineCodeExtension, inputRegex, pasteRegex };
