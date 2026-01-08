import type { Node as ProsemirrorNode } from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';
import { type AnyExtension, Extension } from '@tiptap/core';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';

type TBaseNodeOptions = {
  nodeName: string;
  notBefore: string[];
};

const BaseNodeExtension: AnyExtension = Extension.create<TBaseNodeOptions>({
  name: 'baseNode',
  addOptions(): TBaseNodeOptions {
    return {
      nodeName: 'paragraph',
      notBefore: ['paragraph', 'heading'],
    };
  },
  addProseMirrorPlugins(): Plugin[] {
    const plugin = new Plugin({
      key: new PluginKey('baseNode'),
      props: {
        handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
          if (event.key !== 'ArrowUp') {
            return false;
          }

          const { selection, doc } = view.state;
          const { $from } = selection;

          let depth = $from.depth;
          while (depth > 1) {
            depth--;
          }

          if (depth !== 1) {
            return false;
          }

          const topLevelPos = $from.before(1);
          if (topLevelPos !== 0) {
            return false;
          }

          const firstNode: ProsemirrorNode | null = doc.firstChild;

          if (!firstNode) {
            return false;
          }

          // Don't insert if first node is in the notBefore list and is empty
          // But allow leaf nodes (like image, horizontalLine) even if they
          // have no content

          const isEmpty = firstNode.content.size === 0;
          const isLeafNode = firstNode.isLeaf;
          const { notBefore } = this.options;
          const isInNotBeforeList = notBefore.includes(firstNode.type.name);

          if (!isLeafNode && isInNotBeforeList && isEmpty) {
            return false;
          }

          const { nodeName } = this.options;
          const { schema } = view.state;
          const nodeType = schema.nodes[nodeName];

          if (!nodeType) {
            return false;
          }

          const tr = view.state.tr.insert(0, nodeType.create());

          const $pos = tr.doc.resolve(1);
          const newSelection = TextSelection.near($pos);
          tr.setSelection(newSelection);

          view.dispatch(tr);

          return true;
        },
      },
    });

    return [plugin];
  },
});

export type { TBaseNodeOptions };

export { BaseNodeExtension };
