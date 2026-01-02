import type {
  DOMOutputSpec,
  NodeSpec,
  Node as ProsemirrorNode,
} from 'prosemirror-model';
import {
  type AnyExtension,
  type Attributes,
  type ChainedCommands,
  type Dispatch,
  Node,
  type RawCommands,
  canInsertNode,
  mergeAttributes,
} from '@tiptap/core';
import {
  type EditorState,
  NodeSelection,
  TextSelection,
  type Transaction,
} from 'prosemirror-state';

type TImageOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  inline: boolean;
};

type TImageAttributes = {
  imageCode: string;
  metadata: {
    width?: number;
    height?: number;
  };
  extension: string;
  src?: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (attributes: TImageAttributes) => ReturnType;
      updateImage: (attributes: Partial<TImageAttributes>) => ReturnType;
      removeImage: () => ReturnType;
    };
  }
}

const ImageExtension: AnyExtension = Node.create<TImageOptions>({
  name: 'image',
  group: 'block',
  selectable: true,
  draggable: true,
  addOptions(): TImageOptions {
    return {
      HTMLAttributes: {},
      inline: false,
    };
  },
  addAttributes(): Attributes {
    return {
      imageCode: {
        default: null,
      },
      metadata: {
        default: {},
        parseHTML: (element: HTMLElement) => {
          const metadataStr = element.getAttribute('data-metadata');
          if (metadataStr) {
            try {
              return JSON.parse(metadataStr);
            } catch {
              return {};
            }
          }
          return {};
        },
        renderHTML: (attributes: Record<string, string | number | boolean>) => {
          if (attributes.metadata) {
            return {
              'data-metadata': JSON.stringify(attributes.metadata),
            };
          }
          return {};
        },
      },
      extension: {
        default: null,
      },
      src: {
        default: null,
      },
    };
  },
  parseHTML(): NodeSpec['parseDOM'] {
    return [
      {
        tag: 'img[src]',
        getAttrs: (element: HTMLElement) => {
          if (!(element instanceof HTMLElement)) {
            return false;
          }

          const src = element.getAttribute('src');
          const imageCode = element.getAttribute('data-image-code');
          const extension = element.getAttribute('data-extension');

          if (!src || !imageCode || !extension) {
            return false;
          }

          return {
            src,
            imageCode,
            extension,
          };
        },
      },
    ];
  },
  renderHTML({
    node,
    HTMLAttributes,
  }: {
    node: ProsemirrorNode;
    HTMLAttributes: Record<string, string | number | boolean>;
  }): DOMOutputSpec {
    const { imageCode, extension, src, metadata } = node.attrs;

    return [
      'img',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          src,
          'data-image-code': imageCode,
          'data-extension': extension,
        },
        metadata?.width ? { width: metadata.width } : {},
        metadata?.height ? { height: metadata.height } : {},
      ),
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setImage:
        (attributes: TImageAttributes) =>
        ({
          chain,
          state,
        }: {
          chain: () => ChainedCommands;
          state: EditorState;
        }) => {
          if (!canInsertNode(state, state.schema.nodes[this.name])) {
            return false;
          }

          return chain()
            .insertContent({
              type: this.name,
              attrs: attributes,
            })
            .command(({ tr, dispatch }) => {
              if (dispatch) {
                const { $to } = tr.selection;
                const posAfter = $to.end();

                // Add node after image if it's the end of the
                // document

                if ($to.pos >= tr.doc.content.size - 2) {
                  const node =
                    $to.parent.type.contentMatch.defaultType?.create();

                  if (node) {
                    tr.insert(posAfter, node);
                    tr.setSelection(TextSelection.create(tr.doc, posAfter + 1));
                  }
                } else {
                  // Set cursor after image

                  tr.setSelection(TextSelection.create(tr.doc, $to.pos));
                }

                tr.scrollIntoView();
              }

              return true;
            })
            .run();
        },
      updateImage:
        (attributes: Partial<TImageAttributes>) =>
        ({
          state,
          tr,
          dispatch,
        }: {
          state: EditorState;
          tr: Transaction;
          dispatch: Dispatch;
        }) => {
          const { selection } = state;
          if (
            !(selection instanceof NodeSelection) ||
            selection.node.type !== this.type
          ) {
            return false;
          }

          const { from } = selection;

          if (dispatch) {
            tr.setNodeMarkup(from, undefined, {
              ...selection.node.attrs,
              ...attributes,
              metadata: {
                ...selection.node.attrs.metadata,
                ...(attributes.metadata || {}),
              },
            });
            tr.setSelection(NodeSelection.create(tr.doc, from));
            dispatch(tr);
          }

          return true;
        },
      removeImage:
        () =>
        ({
          state,
          tr,
          dispatch,
        }: {
          state: EditorState;
          tr: Transaction;
          dispatch: Dispatch;
        }) => {
          const { selection } = state;

          if (
            !(selection instanceof NodeSelection) ||
            selection.node.type !== this.type
          ) {
            return false;
          }

          const { from, to } = selection;

          if (dispatch) {
            tr.deleteRange(from, to);
            dispatch(tr);
          }

          return true;
        },
    };
  },
});

export type { TImageOptions, TImageAttributes };

export { ImageExtension };
