import type { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  type ChainedCommands,
  type InputRule,
  type KeyboardShortcutCommand,
  Node,
  type RawCommands,
  type SingleCommands,
  mergeAttributes,
  wrappingInputRule,
} from '@tiptap/core';

const ListItemName = 'listItem';
const TextStyleName = 'textStyle';

const bulletListInputRegex = /^\s*([-+*])\s$/;

type TBulletListOptions = {
  itemTypeName: string;
  HTMLAttributes: Record<string, string | number | boolean>;
  keepMarksWhenSplitting: boolean;
  keepAttributesWhenSplitting: boolean;
  shortcutKeys: {
    toggleBulletList: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bulletList: {
      toggleBulletList: () => ReturnType;
    };
  }
}

const BulletListExtension: AnyExtension = Node.create<TBulletListOptions>({
  name: 'bulletList',
  group: 'block list',
  addOptions(): TBulletListOptions {
    return {
      itemTypeName: 'listItem',
      HTMLAttributes: {},
      keepMarksWhenSplitting: false,
      keepAttributesWhenSplitting: false,
      shortcutKeys: {
        toggleBulletList: '',
      },
    };
  },
  content(): string {
    return `${this.options.itemTypeName}+`;
  },
  parseHTML(): NodeSpec['parseDOM'] {
    return [{ tag: 'ul' }];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): DOMOutputSpec {
    return [
      'ul',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      toggleBulletList:
        () =>
        ({
          commands,
          chain,
        }: {
          commands: SingleCommands;
          chain: () => ChainedCommands;
        }) => {
          if (this.options.keepAttributesWhenSplitting) {
            return chain()
              .toggleList(
                this.name,
                this.options.itemTypeName,
                this.options.keepMarksWhenSplitting,
              )
              .updateAttributes(
                ListItemName,
                this.editor.getAttributes(TextStyleName),
              )
              .run();
          }

          return commands.toggleList(
            this.name,
            this.options.itemTypeName,
            this.options.keepMarksWhenSplitting,
          );
        },
    };
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    const shortcuts: { [key: string]: KeyboardShortcutCommand } = {};

    if (this.options.shortcutKeys.toggleBulletList) {
      shortcuts[this.options.shortcutKeys.toggleBulletList] = () =>
        this.editor.commands.toggleBulletList();
    }

    return shortcuts;
  },
  addInputRules(): InputRule[] {
    let inputRule: InputRule = wrappingInputRule({
      find: bulletListInputRegex,
      type: this.type,
    });

    if (
      this.options.keepMarksWhenSplitting ||
      this.options.keepAttributesWhenSplitting
    ) {
      inputRule = wrappingInputRule({
        find: bulletListInputRegex,
        type: this.type,
        keepMarks: this.options.keepMarksWhenSplitting,
        keepAttributes: this.options.keepAttributesWhenSplitting,
        getAttributes: () => this.editor.getAttributes(TextStyleName),
        editor: this.editor,
      });
    }

    return [inputRule];
  },
});

export type { TBulletListOptions };

export { BulletListExtension };
