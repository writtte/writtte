import type { DOMOutputSpec, NodeSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  type KeyboardShortcutCommand,
  Node,
  mergeAttributes,
} from '@tiptap/core';

type TListItemOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  shortcutKeys: {
    splitListItem: string;
    sinkListItem: string;
    liftListItem: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    listItem: {
      // These commands are already defined in the tiptap/core
      // package, but we're declaring them here for completeness

      splitListItem: (typeOrName: string) => ReturnType;
      sinkListItem: (typeOrName: string) => ReturnType;
      liftListItem: (typeOrName: string) => ReturnType;
    };
  }
}

const ListItemExtension: AnyExtension = Node.create<TListItemOptions>({
  name: 'listItem',
  content: 'paragraph block*',
  defining: true,
  addOptions(): TListItemOptions {
    return {
      HTMLAttributes: {},
      shortcutKeys: {
        splitListItem: 'Enter',
        sinkListItem: 'Tab',
        liftListItem: 'Shift-Tab',
      },
    };
  },
  parseHTML(): NodeSpec['parseDOM'] {
    return [
      {
        tag: 'li',
      },
    ];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): DOMOutputSpec {
    return [
      'li',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    const shortcuts: { [key: string]: KeyboardShortcutCommand } = {};

    if (this.options.shortcutKeys.splitListItem) {
      shortcuts[this.options.shortcutKeys.splitListItem] = () =>
        this.editor.commands.splitListItem(this.name);
    }

    if (this.options.shortcutKeys.sinkListItem) {
      shortcuts[this.options.shortcutKeys.sinkListItem] = () =>
        this.editor.commands.sinkListItem(this.name);
    }

    if (this.options.shortcutKeys.liftListItem) {
      shortcuts[this.options.shortcutKeys.liftListItem] = () =>
        this.editor.commands.liftListItem(this.name);
    }

    return shortcuts;
  },
});

export type { TListItemOptions };

export { ListItemExtension };
