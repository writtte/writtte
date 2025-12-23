import type {
  DOMOutputSpec,
  NodeSpec,
  Node as ProsemirrorNode,
} from 'prosemirror-model';
import {
  type AnyExtension,
  type Attributes,
  type Editor,
  type InputRule,
  type KeyboardShortcutCommand,
  Node,
  type RawCommands,
  type SingleCommands,
  mergeAttributes,
  textblockTypeInputRule,
} from '@tiptap/core';

type THeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const defaultLevels: THeadingLevel[] = [1, 2, 3, 4, 5, 6];

type THeadingOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  shortcutKeys: {
    setHeading: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    heading: {
      setHeading: (attributes: { level: THeadingLevel }) => ReturnType;
      toggleHeading: (attributes: { level: THeadingLevel }) => ReturnType;
    };
  }
}

const HeadingExtension: AnyExtension = Node.create<THeadingOptions>({
  name: 'heading',
  content: 'inline*',
  group: 'block',
  defining: true,
  addOptions(): THeadingOptions {
    return {
      HTMLAttributes: {},
      shortcutKeys: {
        setHeading: '',
      },
    };
  },
  addAttributes(): Attributes {
    return {
      level: {
        default: 1,
        rendered: false,
      },
    };
  },
  parseHTML(): NodeSpec['parseDOM'] {
    return defaultLevels.map((level: THeadingLevel) => ({
      tag: `h${level}`,
      attrs: { level },
    }));
  },
  renderHTML({
    node,
    HTMLAttributes,
  }: {
    node: ProsemirrorNode;
    HTMLAttributes: Record<string, string | number | boolean>;
  }): DOMOutputSpec {
    const level = defaultLevels.includes(node.attrs.level as THeadingLevel)
      ? (node.attrs.level as THeadingLevel)
      : defaultLevels[0];

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setHeading:
        (attributes: { level: THeadingLevel }) =>
        ({ commands }: { commands: SingleCommands }) => {
          if (!defaultLevels.includes(attributes.level)) {
            return false;
          }

          return commands.setNode(this.name, attributes);
        },
      toggleHeading:
        (attributes: { level: THeadingLevel }) =>
        ({ commands }: { commands: SingleCommands }) => {
          if (!defaultLevels.includes(attributes.level)) {
            return false;
          }

          return commands.toggleNode(this.name, 'paragraph', attributes);
        },
    };
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    const items: { [key: string]: KeyboardShortcutCommand } = {
      Home: ({ editor }: { editor: Editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        const text = $from.parent.textContent;
        const currentPos = $from.parentOffset;

        const beforeCursor = text.slice(0, currentPos);
        const lastNewline = beforeCursor.lastIndexOf('\n');
        const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

        const newPos = $from.start() + lineStart;
        return editor.commands.setTextSelection(newPos);
      },
      End: ({ editor }: { editor: Editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        const text = $from.parent.textContent;
        const currentPos = $from.parentOffset;

        const afterCursor = text.slice(currentPos);
        const nextNewline = afterCursor.indexOf('\n');
        const lineEnd =
          nextNewline === -1 ? text.length : currentPos + nextNewline;

        const newPos = $from.start() + lineEnd;
        return editor.commands.setTextSelection(newPos);
      },
    };

    if (this.options.shortcutKeys.setHeading) {
      for (let i = 0; i < defaultLevels.length; i++) {
        const level = defaultLevels[i];
        items[`${this.options.shortcutKeys.setHeading}-${level}`] = () =>
          this.editor.commands.toggleHeading({ level });
      }
    }

    return items;
  },
  addInputRules(): InputRule[] {
    return defaultLevels.map((level) =>
      textblockTypeInputRule({
        find: new RegExp(`^(#{${Math.min(...defaultLevels)},${level}})\\s$`),
        type: this.type,
        getAttributes: {
          level,
        },
      }),
    );
  },
});

export type { THeadingLevel, THeadingOptions };

export { HeadingExtension };
