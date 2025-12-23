import type {
  DOMOutputSpec,
  NodeSpec,
  Node as ProsemirrorNode,
} from 'prosemirror-model';
import {
  type AnyExtension,
  type Attributes,
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

export const numberListInputRegex = /^(\d+)\.\s$/;

type TNumberListOptions = {
  itemTypeName: string;
  HTMLAttributes: Record<string, string | number | boolean>;
  keepMarksWhenSplitting: boolean;
  keepAttributesWhenSplitting: boolean;
  shortcutKeys: {
    toggleNumberList: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    numberList: {
      toggleNumberList: () => ReturnType;
    };
  }
}

const NumberListExtension: AnyExtension = Node.create<TNumberListOptions>({
  name: 'numberList',
  group: 'block list',
  addOptions(): TNumberListOptions {
    return {
      itemTypeName: 'listItem',
      HTMLAttributes: {},
      keepMarksWhenSplitting: false,
      keepAttributesWhenSplitting: false,
      shortcutKeys: {
        toggleNumberList: '',
      },
    };
  },
  content(): string {
    return `${this.options.itemTypeName}+`;
  },
  addAttributes(): Attributes {
    return {
      start: {
        default: 1,
        parseHTML: (element: HTMLElement) =>
          element.hasAttribute('start')
            ? parseInt(element.getAttribute('start') || '', 10)
            : 1,
      },
      type: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('type'),
      },
    };
  },
  parseHTML(): NodeSpec['parseDOM'] {
    return [
      {
        tag: 'ol',
      },
    ];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): DOMOutputSpec {
    const { start, ...attributesWithoutStart } = HTMLAttributes;

    return start === 1
      ? [
          'ol',
          mergeAttributes(this.options.HTMLAttributes, attributesWithoutStart),
          0,
        ]
      : ['ol', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands(): Partial<RawCommands> {
    return {
      toggleNumberList:
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

    if (this.options.shortcutKeys.toggleNumberList) {
      shortcuts[this.options.shortcutKeys.toggleNumberList] = () =>
        this.editor.commands.toggleNumberList();
    }

    return shortcuts;
  },
  addInputRules(): InputRule[] {
    let inputRule: InputRule = wrappingInputRule({
      find: numberListInputRegex,
      type: this.type,
      getAttributes: (match: string[]) => ({ start: +match[1] }),
      joinPredicate: (match: string[], node: ProsemirrorNode) =>
        node.childCount + node.attrs.start === +match[1],
    });

    if (
      this.options.keepMarksWhenSplitting ||
      this.options.keepAttributesWhenSplitting
    ) {
      inputRule = wrappingInputRule({
        find: numberListInputRegex,
        type: this.type,
        keepMarks: this.options.keepMarksWhenSplitting,
        keepAttributes: this.options.keepAttributesWhenSplitting,
        getAttributes: (match: string[]) => ({
          start: +match[1],
          ...this.editor.getAttributes(TextStyleName),
        }),
        joinPredicate: (match: string[], node: ProsemirrorNode) =>
          node.childCount + node.attrs.start === +match[1],
        editor: this.editor,
      });
    }

    return [inputRule];
  },
});

export type { TNumberListOptions };

export { NumberListExtension };
