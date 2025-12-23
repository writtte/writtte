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

// **bold**

const starInputRegex = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/;
const starPasteRegex = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g;

// __bold__

const underscoreInputRegex = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/;
const underscorePasteRegex = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g;

const attributeRegex = /^(bold(er)?|[5-9]\d{2,})$/;

type TBoldOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  shortcutKeys: {
    toggleBold: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bold: {
      setBold: () => ReturnType;
      unsetBold: () => ReturnType;
      toggleBold: () => ReturnType;
    };
  }
}

const BoldExtension: AnyExtension = Mark.create<TBoldOptions>({
  name: 'bold',
  addOptions(): TBoldOptions {
    return {
      HTMLAttributes: {},
      shortcutKeys: {
        toggleBold: '',
      },
    };
  },
  parseHTML(): MarkSpec['parseDOM'] {
    return [
      {
        tag: 'strong',
      },
      {
        tag: 'b',
        getAttrs: (node: HTMLElement) =>
          node.style.fontWeight !== 'normal' && null,
      },
      {
        style: 'font-weight=400',
        clearMark: (mark: ProsemirrorMark) => mark.type.name === this.name,
      },
      {
        style: 'font-weight',
        getAttrs: (value: string) =>
          attributeRegex.test(value as string) && null,
      },
    ];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): [string, Record<string, string | number | boolean>, number] {
    return [
      'strong',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setBold:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.setMark(this.name),

      unsetBold:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.unsetMark(this.name),

      toggleBold:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.toggleMark(this.name),
    };
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    const shortcuts: { [key: string]: KeyboardShortcutCommand } = {};

    if (this.options.shortcutKeys.toggleBold) {
      shortcuts[this.options.shortcutKeys.toggleBold] = () =>
        this.editor.commands.toggleBold();
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

export type { TBoldOptions };

export {
  BoldExtension,
  starInputRegex,
  starPasteRegex,
  underscoreInputRegex,
  underscorePasteRegex,
};
