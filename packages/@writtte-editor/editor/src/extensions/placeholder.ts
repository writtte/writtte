import type { Node as ProsemirrorNode } from 'prosemirror-model';
import { type AnyExtension, Extension, isNodeEmpty } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

type TPlaceholderOptions = {
  emptyEditorClass: string;
  emptyNodeClass: string;
  placeholder: string;
  showOnlyWhenEditable: boolean;
  showOnlyIfCurrentNodeIsEmpty: boolean;
};

const PlaceholderExtension: AnyExtension =
  Extension.create<TPlaceholderOptions>({
    name: 'placeholder',
    addOptions(): TPlaceholderOptions {
      return {
        emptyEditorClass: '',
        emptyNodeClass: '',
        placeholder: '',
        showOnlyWhenEditable: true,
        showOnlyIfCurrentNodeIsEmpty: true,
      };
    },
    addProseMirrorPlugins(): Plugin[] {
      return [
        new Plugin({
          key: new PluginKey('placeholder'),
          props: {
            decorations: ({
              doc,
              selection,
            }: {
              doc: ProsemirrorNode;
              selection: { anchor: number };
            }): DecorationSet => {
              const active =
                this.editor.isEditable || !this.options.showOnlyWhenEditable;

              const { anchor } = selection;
              const decorations: Decoration[] = [];

              if (!active) {
                return DecorationSet.empty;
              }

              const isEmptyDoc = this.editor.isEmpty;

              doc.descendants((node: ProsemirrorNode, pos: number): boolean => {
                // Only apply placeholder to the root node (the doc itself)

                if (pos === 0) {
                  const hasAnchor =
                    anchor >= pos && anchor <= pos + node.nodeSize;
                  const isEmpty = !node.isLeaf && isNodeEmpty(node);

                  if (
                    (hasAnchor || !this.options.showOnlyIfCurrentNodeIsEmpty) &&
                    isEmpty
                  ) {
                    const classes = [this.options.emptyNodeClass];

                    if (isEmptyDoc) {
                      classes.push(this.options.emptyEditorClass);
                    }

                    const decoration = Decoration.node(
                      pos,
                      pos + node.nodeSize,
                      {
                        class: classes.join(' '),
                        'data-placeholder': this.options.placeholder,
                      },
                    );

                    decorations.push(decoration);
                  }
                }

                // Do not continue to children

                return false;
              });

              return DecorationSet.create(doc, decorations);
            },
          },
        }),
      ];
    },
  });

export type { TPlaceholderOptions };

export { PlaceholderExtension };
