import type { Node as ProsemirrorNode } from 'prosemirror-model';
import { type AnyExtension, Extension } from '@tiptap/core';
import {
  type EditorState,
  Plugin,
  PluginKey,
  type Transaction,
} from 'prosemirror-state';

type TTrailingNodeOptions = {
  nodeName: string;
  notAfter: string[];
};

const TrailingNodeExtension: AnyExtension =
  Extension.create<TTrailingNodeOptions>({
    name: 'trailingNode',
    addOptions(): TTrailingNodeOptions {
      return {
        nodeName: 'paragraph',

        // Don't add trailing node after these node types if
        // they're empty

        notAfter: ['paragraph', 'heading'],
      };
    },
    addProseMirrorPlugins(): Plugin[] {
      const plugin = new Plugin({
        key: new PluginKey('trailingNode'),
        appendTransaction: (
          transactions: readonly Transaction[],
          _oldState: EditorState,
          newState: EditorState,
        ) => {
          const docChanged = transactions.some((tr) => tr.docChanged);
          if (!docChanged) {
            return null;
          }

          const { nodeName, notAfter } = this.options;
          const { schema } = newState;
          const nodeType = schema.nodes[nodeName];

          if (!nodeType) {
            return null;
          }

          const lastNode: ProsemirrorNode | null = newState.doc.lastChild;

          if (!lastNode) {
            return newState.tr.insert(
              newState.doc.content.size,
              nodeType.create(),
            );
          }

          const isEmpty = lastNode.content.size === 0;
          const isInNotAfterList = notAfter.includes(lastNode.type.name);

          if (isEmpty && isInNotAfterList) {
            return null;
          }

          if (lastNode.type === nodeType && isEmpty) {
            return null;
          }

          return newState.tr.insert(
            newState.doc.content.size,
            nodeType.create(),
          );
        },
      });

      return [plugin];
    },
  });

export type { TTrailingNodeOptions };

export { TrailingNodeExtension };
