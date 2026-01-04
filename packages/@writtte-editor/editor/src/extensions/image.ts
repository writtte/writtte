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
  fileExtensions: string[];
  onBeforePaste: ((file: File) => Promise<TImageAttributes>) | undefined;
  onAfterPaste:
    | ((
        file: File,
        currentAttrs: TImageAttributes,
        updateImage: (attrs: Partial<TImageAttributes>) => void,
      ) => Promise<void>)
    | undefined;
};

type TImageAttributes = {
  imageCode: string;
  extension: string;
  src?: string;
  alt?: string;
  publicURL?: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (attributes: TImageAttributes) => ReturnType;
      updateImage: (
        imageCode: string,
        attributes: Partial<TImageAttributes>,
      ) => ReturnType;
      removeImage: () => ReturnType;
    };
  }
}

const ImageExtension: AnyExtension = Node.create<TImageOptions>({
  name: 'image',
  group: 'block',
  selectable: true,
  addOptions(): TImageOptions {
    return {
      HTMLAttributes: {},
      fileExtensions: [],
      onBeforePaste: undefined,
      onAfterPaste: undefined,
    };
  },
  addAttributes(): Attributes {
    return {
      imageCode: {
        default: null,
      },
      extension: {
        default: null,
      },
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      publicURL: {
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
            src: element.getAttribute('src') || null,
            alt: element.getAttribute('alt') || null,
            publicURL: element.getAttribute('data-public-url') || null,
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
    const { imageCode, extension, src, alt, publicURL } = node.attrs;

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-image-code': imageCode,
        'data-extension': extension,
        'data-public-url': publicURL || null,
        src: src || null,
        alt: alt || null,
      }),
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

          if (attributes.src === undefined || attributes.src === null) {
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
        (imageCode: string, attributes: Partial<TImageAttributes>) =>
        ({
          state,
          tr,
          dispatch,
        }: {
          state: EditorState;
          tr: Transaction;
          dispatch: Dispatch;
        }) => {
          let found = false;

          if (attributes.src === undefined || attributes.src === null) {
            return false;
          }

          state.doc.descendants((docNode, docPos) => {
            if (found) {
              return false;
            }

            if (
              docNode.type === this.type &&
              docNode.attrs.imageCode === imageCode
            ) {
              found = true;
              if (dispatch) {
                tr.setNodeMarkup(docPos, undefined, {
                  ...docNode.attrs,
                  ...attributes,
                });
                dispatch(tr);
              }
              return false;
            }

            return true;
          });

          return found;
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
      dom.classList.add('writtte-image-container');

      const img = document.createElement('img');

      img.setAttribute('data-image-code', node.attrs.imageCode);
      img.setAttribute('data-extension', node.attrs.extension);

      if (node.attrs.src) {
        img.src = node.attrs.src;
      }

      if (node.attrs.alt) {
        img.alt = node.attrs.alt;
      }

      if (node.attrs.publicURL) {
        img.setAttribute('data-public-url', node.attrs.publicURL);
      }

      dom.appendChild(img);

      return {
        dom,
        update: (updatedNode: ProsemirrorNode) => {
          if (updatedNode.type !== node.type) {
            return false;
          }

          if (updatedNode.attrs.src !== node.attrs.src) {
            img.src = updatedNode.attrs.src;
          }

          if (updatedNode.attrs.imageCode !== node.attrs.imageCode) {
            img.setAttribute('data-image-code', updatedNode.attrs.imageCode);
          }

          if (updatedNode.attrs.extension) {
            img.setAttribute('data-extension', updatedNode.attrs.extension);
          }

          if (updatedNode.attrs.alt) {
            img.alt = updatedNode.attrs.alt;
          }

          if (updatedNode.attrs.publicURL) {
            img.setAttribute('data-public-url', updatedNode.attrs.publicURL);
          }

          return true;
        },
      };
    };
  },
  addProseMirrorPlugins(): Plugin[] {
    return [
      new Plugin({
        props: {
          handlePaste: (view: EditorView, event: ClipboardEvent): void => {
            // biome-ignore lint/nursery/noFloatingPromises: A floating promise is required here
            (async () => {
              if (!event.clipboardData) {
                return false;
              }

              var imageItems: DataTransferItem[] = [];

              const items = Array.from(event.clipboardData.items);
              for (let i = 0; i < items.length; i++) {
                if (
                  items[i].kind === 'file' &&
                  items[i].type.startsWith('image/')
                ) {
                  imageItems.push(items[i]);
                }
              }

              if (imageItems.length === 0) {
                return false;
              }

              event.preventDefault();

              for (let i = 0; i < imageItems.length; i++) {
                const item = imageItems[i];
                const itemFile = item.getAsFile();

                if (!itemFile) {
                  break;
                }

                const fileExtension =
                  itemFile.name.split('.').pop()?.toLowerCase() || '';

                // Check if the file extension is allowed
                // If fileExtensions is empty, all extensions are allowed
                // Otherwise, check if the extension is in the list

                if (
                  this.options.fileExtensions.length > 0 &&
                  !this.options.fileExtensions.includes(fileExtension)
                ) {
                  break;
                }

                try {
                  if (!this.options.onBeforePaste) {
                    continue;
                  }

                  const imageAttrs: TImageAttributes =
                    // biome-ignore lint/performance/noAwaitInLoops: The await inside the loop is required
                    await this.options.onBeforePaste(itemFile);

                  const imageNode =
                    view.state.schema.nodes[this.name].create(imageAttrs);

                  if (
                    !canInsertNode(
                      view.state,
                      view.state.schema.nodes[this.name],
                    )
                  ) {
                    continue;
                  }

                  const tr = view.state.tr;
                  tr.replaceSelectionWith(imageNode);

                  const { $to } = tr.selection;
                  if ($to.pos >= tr.doc.content.size - 2) {
                    const node =
                      $to.parent.type.contentMatch.defaultType?.create();

                    if (node) {
                      const posAfter = $to.end();

                      tr.insert(posAfter, node);
                      tr.setSelection(
                        TextSelection.create(tr.doc, posAfter + 1),
                      );
                    }
                  } else {
                    tr.setSelection(TextSelection.create(tr.doc, $to.pos));
                  }

                  tr.scrollIntoView();
                  view.dispatch(tr);

                  if (this.options.onAfterPaste) {
                    const updateImageAttrs = (
                      attrs: Partial<TImageAttributes>,
                    ) => {
                      const currentState = view.state;
                      const attrsTr = currentState.tr;

                      let found = false;
                      currentState.doc.descendants((node, pos) => {
                        if (found) {
                          return false;
                        }

                        if (node.type === this.type) {
                          found = true;
                          attrsTr.setNodeMarkup(pos, undefined, {
                            ...node.attrs,
                            ...attrs,
                          });

                          view.dispatch(attrsTr);
                          return false;
                        }

                        return true;
                      });
                    };

                    this.options.onAfterPaste(
                      itemFile,
                      imageAttrs,
                      updateImageAttrs,
                    );
                  }
                } catch {
                  // Handle error silently, the error will be thrown to
                  // the caller and if upload fails, we should remove the
                  // placeholder

                  const { state } = view;

                  const errorTr = state.tr;

                  state.doc.descendants((node, pos) => {
                    if (node.type === this.type) {
                      errorTr.delete(pos, pos + node.nodeSize);
                      view.dispatch(errorTr);

                      return false;
                    }

                    return true;
                  });
                }
              }

              return true;
            })();
          },
        },
      }),
    ];
  },
});

export type { TImageOptions, TImageAttributes };

export { ImageExtension };
