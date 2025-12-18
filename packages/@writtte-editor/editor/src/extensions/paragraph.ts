import type { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  Node,
  type RawCommands,
  type SingleCommands,
  mergeAttributes,
} from '@tiptap/core';

type TParagraphOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  shortcutKeys: {
    setParagraph: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    paragraph: {
      setParagraph: () => ReturnType;
    };
  }
}

const ParagraphExtension: AnyExtension = Node.create<TParagraphOptions>({
  name: 'paragraph',
  priority: 1000,
  group: 'block',
  content: 'inline*',
  addOptions(): TParagraphOptions {
    return {
      HTMLAttributes: {},
      shortcutKeys: {
        setParagraph: '',
      },
    };
  },
  parseHTML(): NodeSpec['parseDOM'] {
    return [{ tag: 'p' }];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): DOMOutputSpec {
    return [
      'p',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setParagraph:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.setNode(this.name),
    };
  },
});

export type { TParagraphOptions };

export { ParagraphExtension };
