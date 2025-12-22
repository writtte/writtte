import type { MarkSpec, Mark as ProsemirrorMark } from 'prosemirror-model';
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

// *italic*

const starInputRegex = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/;
const starPasteRegex = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g;

// _italic_

const underscoreInputRegex = /(?:^|\s)(_(!?\s+_)((?:[^_]+))_(?!\s+_))$/;
const underscorePasteRegex = /(?:^|\s)(_(!?\s+_)((?:[^_]+))_(?!\s+_))/g;

type TItalicOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  shortcutKeys: {
    toggleItalic: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    italic: {
      setItalic: () => ReturnType;
      unsetItalic: () => ReturnType;
      toggleItalic: () => ReturnType;
    };
  }
}

const ItalicExtension: AnyExtension = Mark.create<TItalicOptions>({
  name: 'italic',
  addOptions(): TItalicOptions {
    return {
      HTMLAttributes: {},
      shortcutKeys: {
        toggleItalic: '',
      },
    };
  },
  parseHTML(): MarkSpec['parseDOM'] {
    return [
      {
        tag: 'em',
      },
      {
        tag: 'i',
        getAttrs: (node: HTMLElement) =>
          node.style.fontStyle !== 'normal' && null,
      },
      {
        style: 'font-style=italic',
        clearMark: (mark: ProsemirrorMark) => mark.type.name === this.name,
      },
      {
        style: 'font-style',
        getAttrs: (value: string) => value === 'italic' && null,
      },
    ];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): [string, Record<string, string | number | boolean>, number] {
    return [
      'em',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setItalic:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.setMark(this.name),

      unsetItalic:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.unsetMark(this.name),

      toggleItalic:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.toggleMark(this.name),
    };
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    const shortcuts: { [key: string]: KeyboardShortcutCommand } = {};

    if (this.options.shortcutKeys.toggleItalic) {
      shortcuts[this.options.shortcutKeys.toggleItalic] = () =>
        this.editor.commands.toggleItalic();
    }

    return shortcuts;
  },
  addInputRules(): InputRule[] {
    return [
      markInputRule({
        find: starInputRegex,
        type: this.type,
      }),
      markInputRule({
        find: underscoreInputRegex,
        type: this.type,
      }),
    ];
  },
  addPasteRules(): PasteRule[] {
    return [
      markPasteRule({
        find: starPasteRegex,
        type: this.type,
      }),
      markPasteRule({
        find: underscorePasteRegex,
        type: this.type,
      }),
    ];
  },
});

export type { TItalicOptions };

export {
  ItalicExtension,
  starInputRegex,
  starPasteRegex,
  underscoreInputRegex,
  underscorePasteRegex,
};
