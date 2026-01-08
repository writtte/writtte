import type { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  type InputRule,
  Node,
  type RawCommands,
  type SingleCommands,
  mergeAttributes,
  textblockTypeInputRule,
} from '@tiptap/core';

const inputRegex = /^```([a-z]*)?[\s\n]$/;
const pasteRegex = /^```([a-z]*)?[\s\n]$/;

type TCodeBlockOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  languageClassPrefix: string;
  shortcutKeys: {
    toggleCodeBlock: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    codeBlock: {
      setCodeBlock: (attributes?: { language?: string }) => ReturnType;
      toggleCodeBlock: (attributes?: { language?: string }) => ReturnType;
    };
  }
}

const CodeBlockExtension: AnyExtension = Node.create<TCodeBlockOptions>({
  name: 'codeBlock',
  priority: 1000,
  group: 'block',
  content: 'text*',
  marks: '',
  code: true,
  defining: true,
  addOptions(): TCodeBlockOptions {
    return {
      HTMLAttributes: {
        class: 'writtte-code-block',
      },
      languageClassPrefix: 'language-',
      shortcutKeys: {
        toggleCodeBlock: '',
      },
    };
  },
  addAttributes(): Record<
    string,
    {
      default: null;
      parseHTML: (element: HTMLElement) => string | null;
      rendered: boolean;
    }
  > {
    return {
      language: {
        default: null,
        parseHTML: (element: HTMLElement): string | null => {
          const classNames = element.classList;
          const languages = Array.from(classNames)
            .filter((className) =>
              className.startsWith(this.options.languageClassPrefix),
            )
            .map((className) =>
              className.replace(this.options.languageClassPrefix, ''),
            );

          return languages[0] || null;
        },
        rendered: false,
      },
    };
  },
  parseHTML(): NodeSpec['parseDOM'] {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
      },
    ];
  },
  renderHTML({
    node,
    HTMLAttributes,
  }: {
    node: { attrs: { language?: string } };
    HTMLAttributes: Record<string, string | number | boolean>;
  }): DOMOutputSpec {
    const attrs: Record<string, string | number | boolean> = mergeAttributes(
      this.options.HTMLAttributes,
      HTMLAttributes,
    );

    if (node.attrs.language) {
      attrs.class =
        `${attrs.class || ''} ${this.options.languageClassPrefix}${node.attrs.language}`.trim();
    }

    return [
      'pre',
      attrs,
      [
        'code',
        {
          class: node.attrs.language
            ? `${this.options.languageClassPrefix}${node.attrs.language}`
            : undefined,
        },
        0,
      ],
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setCodeBlock:
        (attributes?: { language?: string }) =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.setNode(this.name, attributes),
      toggleCodeBlock:
        (attributes?: { language?: string }) =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.toggleNode(this.name, 'paragraph', attributes),
    };
  },
  addKeyboardShortcuts(): Record<string, () => boolean> {
    const shortcuts: Record<string, () => boolean> = {};

    if (this.options.shortcutKeys.toggleCodeBlock) {
      shortcuts[this.options.shortcutKeys.toggleCodeBlock] = () =>
        this.editor.commands.toggleCodeBlock();
    }

    shortcuts.Backspace = () => {
      const { empty, $anchor } = this.editor.state.selection;
      const isAtStart = $anchor.pos === 1;

      if (!empty || $anchor.parent.type.name !== this.name) {
        return false;
      }

      if (isAtStart || !$anchor.parent.textContent.length) {
        return this.editor.commands.clearNodes();
      }

      return false;
    };

    shortcuts['Mod-a'] = () => {
      const { $anchor } = this.editor.state.selection;

      if ($anchor.parent.type.name !== this.name) {
        return false;
      }

      this.editor.commands.setTextSelection({
        from: $anchor.start(),
        to: $anchor.end(),
      });

      return true;
    };

    return shortcuts;
  },
  addInputRules(): InputRule[] {
    return [
      textblockTypeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match: RegExpMatchArray) => ({
          language: match[1],
        }),
      }),
    ];
  },
});

export type { TCodeBlockOptions };

export { CodeBlockExtension, inputRegex, pasteRegex };
