import type { NodeSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  type InputRule,
  type KeyboardShortcutCommand,
  Node,
  type RawCommands,
  type SingleCommands,
  mergeAttributes,
  wrappingInputRule,
} from '@tiptap/core';

const inputRegex = /^\s*>\s$/;

type TBlockQuoteOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  shortcutKeys: {
    toggleBlockQuote: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    quote: {
      setBlockQuote: () => ReturnType;
      unsetBlockQuote: () => ReturnType;
      toggleBlockQuote: () => ReturnType;
    };
  }
}

const BlockQuoteExtension: AnyExtension = Node.create<TBlockQuoteOptions>({
  name: 'blockQuote',
  content: 'paragraph+',
  marks: 'bold italic underline inlineCode link superscript subscript',
  group: 'block',
  defining: true,
  addOptions(): TBlockQuoteOptions {
    return {
      HTMLAttributes: {},
      shortcutKeys: {
        toggleBlockQuote: '',
      },
    };
  },
  parseHTML(): NodeSpec['parseDOM'] {
    return [{ tag: 'quote' }];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): [string, Record<string, string | number | boolean>, number] {
    return [
      'blockquote',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setBlockQuote:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.wrapIn(this.name),
      toggleBlockQuote:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.toggleWrap(this.name),
      unsetBlockQuote:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.lift(this.name),
    };
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    return {
      [this.options.shortcutKeys.toggleBlockQuote]: () =>
        this.editor.commands.toggleBlockQuote(),
    };
  },
  addInputRules(): InputRule[] {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ];
  },
});

export type { TBlockQuoteOptions };

export { BlockQuoteExtension };
