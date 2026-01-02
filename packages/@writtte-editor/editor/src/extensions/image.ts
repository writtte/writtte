import type {
  DOMOutputSpec,
  NodeSpec,
  Node as ProsemirrorNode,
} from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';
import {
  type AnyExtension,
  type Attributes,
  type ChainedCommands,
  type Dispatch,
  Node,
  type NodeViewRenderer,
  type RawCommands,
  canInsertNode,
  mergeAttributes,
} from '@tiptap/core';
import {
  type EditorState,
  NodeSelection,
  Plugin,
  TextSelection,
  type Transaction,
} from 'prosemirror-state';

type TImageOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  inline: boolean;
  supportedImageFileExtensions: string[];
  allowImagePaste: boolean;
  onImagePaste?: (file: File) => Promise<TImageAttributes>;
  loadingIndicator?: HTMLDivElement;
};

type TImageAttributes = {
  imageCode: string;
  metadata: {
    width?: number;
    height?: number;
  };
  extension: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (attributes: TImageAttributes) => ReturnType;
      updateImage: (attributes: Partial<TImageAttributes>) => ReturnType;
      removeImage: () => ReturnType;
      setUploadingImage: (id: string) => ReturnType;
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
      supportedImageFileExtensions: [],
      allowImagePaste: false,
      onImagePaste: undefined,
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
    };
  },
  parseHTML(): NodeSpec['parseDOM'] {
    return [
      {
        tag: 'img[data-image-code][data-extension]',
        getAttrs: (element: HTMLElement) => {
          if (!(element instanceof HTMLElement)) {
            return false;
          }

          const imageCode = element.getAttribute('data-image-code');
          const extension = element.getAttribute('data-extension');

          if (!imageCode || !extension) {
            return false;
          }

          return {
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
    const { imageCode, extension, metadata } = node.attrs;

    return [
      'img',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
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
      setUploadingImage:
        (id: string) =>
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
              attrs: {
                imageCode: id,
                extension: 'uploading',
                metadata: {},
              },
            })
            .command(({ tr, dispatch }) => {
              if (dispatch) {
                const { $to } = tr.selection;
                const posAfter = $to.end();

                if ($to.pos >= tr.doc.content.size - 2) {
                  const node =
                    $to.parent.type.contentMatch.defaultType?.create();

                  if (node) {
                    tr.insert(posAfter, node);
                    tr.setSelection(TextSelection.create(tr.doc, posAfter + 1));
                  }
                } else {
                  tr.setSelection(TextSelection.create(tr.doc, $to.pos));
                }

                tr.scrollIntoView();
              }

              return true;
            })
            .run();
        },
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
  addNodeView(): NodeViewRenderer {
    return ({ node }: { node: ProsemirrorNode }) => {
      const dom = document.createElement('div');
      dom.classList.add('image-container');

      const img = document.createElement('img');

      // Add data attributes even though src will be managed
      // externally

      if (node.attrs.extension !== 'uploading') {
        // Set required data attributes

        img.setAttribute('data-image-code', node.attrs.imageCode);
        img.setAttribute('data-extension', node.attrs.extension);

        if (node.attrs.metadata?.width) {
          img.width = node.attrs.metadata.width;
        }

        if (node.attrs.metadata?.height) {
          img.height = node.attrs.metadata.height;
        }

        dom.appendChild(img);
      } else if (node.attrs.extension === 'uploading') {
        if (this.options.loadingIndicator) {
          dom.appendChild(this.options.loadingIndicator);
        }
      }

      return {
        dom,
        update: (updatedNode: ProsemirrorNode) => {
          if (updatedNode.type !== node.type) return false;

          if (
            updatedNode.attrs.extension !== 'uploading' &&
            node.attrs.extension === 'uploading'
          ) {
            dom.innerHTML = '';

            const updatedImg = document.createElement('img');

            updatedImg.setAttribute(
              'data-image-code',
              updatedNode.attrs.imageCode,
            );

            updatedImg.setAttribute(
              'data-extension',
              updatedNode.attrs.extension,
            );

            if (updatedNode.attrs.metadata?.width) {
              updatedImg.width = updatedNode.attrs.metadata.width;
            }

            if (updatedNode.attrs.metadata?.height) {
              updatedImg.height = updatedNode.attrs.metadata.height;
            }

            dom.appendChild(updatedImg);
          }

          return true;
        },
      };
    };
  },

  addProseMirrorPlugins(): Plugin[] {
    if (!this.options.allowImagePaste) {
      return [];
    }

    return [
      new Plugin({
        props: {
          handlePaste: (view: EditorView, event: ClipboardEvent): boolean => {
            if (!event.clipboardData) {
              return false;
            }

            const items = Array.from(event.clipboardData.items);
            const imageItems = items.filter(
              (item: DataTransferItem) =>
                item.kind === 'file' && item.type.startsWith('image/'),
            );

            if (imageItems.length === 0) {
              return false;
            }

            event.preventDefault();

            imageItems.forEach(async (item: DataTransferItem) => {
              const file = item.getAsFile();
              if (!file) {
                return;
              }

              // Check if file extension is supported

              const fileExtension =
                file.name.split('.').pop()?.toLowerCase() || '';

              if (
                this.options.supportedImageFileExtensions.length > 0 &&
                !this.options.supportedImageFileExtensions.includes(
                  fileExtension,
                )
              ) {
                return;
              }

              const tempImageCode = `image-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

              const tr = view.state.tr;
              view.dispatch(
                tr.replaceSelectionWith(
                  this.type.create({
                    imageCode: tempImageCode,
                    extension: 'uploading',
                    metadata: {},
                  }),
                ),
              );

              // If custom upload handler is provided, use it

              if (this.options.onImagePaste) {
                try {
                  const attributes = await this.options.onImagePaste(file);

                  // Find the node with our temporary imageCode and
                  // update it

                  const { state } = view;
                  const updateTr = state.tr;

                  let found = false;
                  state.doc.descendants((node, pos) => {
                    if (found) return false;

                    if (
                      node.type === this.type &&
                      node.attrs.imageCode === tempImageCode
                    ) {
                      found = true;
                      updateTr.setNodeMarkup(pos, undefined, {
                        ...attributes,
                      });

                      view.dispatch(updateTr);
                      return false;
                    }

                    return true;
                  });
                } catch {
                  // Handle error silently - the error will be thrown to
                  // the caller and if upload fails, we should remove the
                  // placeholder

                  const { state } = view;
                  const errorTr = state.tr;

                  state.doc.descendants((node, pos) => {
                    if (
                      node.type === this.type &&
                      node.attrs.imageCode === tempImageCode
                    ) {
                      errorTr.delete(pos, pos + node.nodeSize);
                      view.dispatch(errorTr);

                      return false;
                    }

                    return true;
                  });
                }
              }
            });

            return true;
          },
        },
      }),
    ];
  },
});

export type { TImageOptions, TImageAttributes };

export { ImageExtension };
