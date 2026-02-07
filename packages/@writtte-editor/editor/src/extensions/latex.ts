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

type TLatexOptions = {
  optionsElement: (() => HTMLDivElement | null) | null;
  HTMLAttributes: Record<string, string | number | boolean>;
  fileExtensions: string[];
  onBeforePaste: ((file: File) => Promise<TLatexAttributes>) | undefined;
  onAfterPaste:
    | ((
        file: File,
        currentAttrs: TLatexAttributes,
        updateLatex: (attrs: Partial<TLatexAttributes>) => void,
      ) => Promise<void>)
    | undefined;
};

type TLatexAttributes = {
  latexCode: string;
  extension: string;
  src?: string;
  publicURL?: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    latex: {
      setLatex: (attributes: TLatexAttributes) => ReturnType;
      updateLatex: (
        latexCode: string,
        attributes: Partial<TLatexAttributes>,
      ) => ReturnType;
      removeLatex: () => ReturnType;
    };
  }
}

const LatexExtension: AnyExtension = Node.create<TLatexOptions>({
  name: 'latex',
  group: 'block',
  selectable: true,
  addOptions(): TLatexOptions {
    return {
      HTMLAttributes: {},
      fileExtensions: ['svg', 'png', 'jpeg'],
      onBeforePaste: undefined,
      onAfterPaste: undefined,
      optionsElement: null,
    };
  },
  addAttributes(): Attributes {
    return {
      latexCode: {
        default: null,
      },
      extension: {
        default: null,
      },
      src: {
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
        tag: 'img[data-latex-code][data-extension]',
        getAttrs: (element: HTMLElement) => {
          if (!(element instanceof HTMLElement)) {
            return false;
          }

          const latexCode = element.getAttribute('data-latex-code');
          const extension = element.getAttribute('data-extension');

          if (!latexCode || !extension) {
            return false;
          }

          return {
            latexCode,
            extension,
            src: element.getAttribute('src') || null,
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
    const { latexCode, extension, src, publicURL } = node.attrs;

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-latex-code': latexCode,
        'data-extension': extension,
        'data-public-url': publicURL || null,
        src: src || null,
      }),
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setLatex:
        (attributes: TLatexAttributes) =>
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

                // Add node after latex if it's the end of the
                // document

                if ($to.pos >= tr.doc.content.size - 2) {
                  const node =
                    $to.parent.type.contentMatch.defaultType?.create();

                  if (node) {
                    tr.insert(posAfter, node);
                    tr.setSelection(TextSelection.create(tr.doc, posAfter + 1));
                  }
                } else {
                  // Set cursor after latex

                  tr.setSelection(TextSelection.create(tr.doc, $to.pos));
                }
              }

              return true;
            })
            .run();
        },
      updateLatex:
        (latexCode: string, attributes: Partial<TLatexAttributes>) =>
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
              docNode.attrs.latexCode === latexCode
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
      removeLatex:
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
    return ({
      node,
      view,
      getPos,
    }: {
      node: ProsemirrorNode;
      view: EditorView;
      getPos: () => number | undefined;
    }) => {
      const dom = document.createElement('div');
      dom.classList.add('writtte-latex-container');
      dom.style.position = 'relative';

      const img = document.createElement('img');

      img.setAttribute('data-latex-code', node.attrs.latexCode);
      img.setAttribute('data-extension', node.attrs.extension);

      if (node.attrs.src) {
        img.src = node.attrs.src;
      }

      if (node.attrs.publicURL) {
        img.setAttribute('data-public-url', node.attrs.publicURL);
      }

      dom.appendChild(img);

      let clickHandler: ((e: MouseEvent) => void) | null = null;
      let latexClickHandler: ((e: MouseEvent) => void) | null = null;
      let optionsElement: HTMLDivElement | null = null;

      if (this.options.optionsElement) {
        optionsElement = this.options.optionsElement();

        if (optionsElement) {
          optionsElement.style.display = 'none';
          optionsElement.style.position = 'absolute';
          optionsElement.style.zIndex = '10';

          dom.appendChild(optionsElement);

          const isSelected = () => {
            const pos = getPos();
            if (pos === undefined) return false;

            const { selection } = view.state;
            return selection instanceof NodeSelection && selection.from === pos;
          };

          clickHandler = (e: MouseEvent) => {
            if (
              optionsElement &&
              optionsElement !== e.target &&
              !optionsElement.contains(e.target as Element)
            ) {
              if (!isSelected()) {
                optionsElement.style.display = 'none';
              }
            }
          };

          document.addEventListener('click', clickHandler);
        }
      }

      latexClickHandler = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const pos = getPos();
        if (pos === undefined) return;

        const tr = view.state.tr.setSelection(
          NodeSelection.create(view.state.doc, pos),
        );

        view.dispatch(tr);
      };

      img.addEventListener('click', latexClickHandler);
      img.style.cursor = 'pointer';

      return {
        dom,
        update: (updatedNode: ProsemirrorNode) => {
          if (updatedNode.type !== node.type) {
            return false;
          }

          if (updatedNode.attrs.src !== node.attrs.src) {
            img.src = updatedNode.attrs.src;
          }

          if (updatedNode.attrs.latexCode !== node.attrs.latexCode) {
            img.setAttribute('data-latex-code', updatedNode.attrs.latexCode);
          }

          if (updatedNode.attrs.extension) {
            img.setAttribute('data-extension', updatedNode.attrs.extension);
          }

          if (updatedNode.attrs.publicURL) {
            img.setAttribute('data-public-url', updatedNode.attrs.publicURL);
          }

          return true;
        },
        selectNode: () => {
          if (optionsElement) {
            optionsElement.style.display = 'flex';
          }

          dom.classList.add('ProseMirror-selectednode');
        },
        deselectNode: () => {
          if (optionsElement) {
            optionsElement.style.display = 'none';
          }

          dom.classList.remove('ProseMirror-selectednode');
        },
        destroy: () => {
          if (clickHandler) {
            document.removeEventListener('click', clickHandler);
          }

          if (latexClickHandler) {
            img.removeEventListener('click', latexClickHandler);
          }
        },
      };
    };
  },
  addProseMirrorPlugins(): Plugin[] {
    return [
      new Plugin({
        props: {
          handleKeyDown: (view: EditorView, event: KeyboardEvent): boolean => {
            const { selection } = view.state;

            if (
              selection instanceof NodeSelection &&
              selection.node.type === this.type
            ) {
              // Only allow Backspace (8) and Delete (46) keys to remove
              // the latex

              if (event.keyCode !== 8 && event.keyCode !== 46) {
                return true;
              }
            }

            return false;
          },
          handlePaste: (view: EditorView, event: ClipboardEvent): void => {
            // biome-ignore lint/nursery/noFloatingPromises: A floating promise is required here
            (async () => {
              if (!event.clipboardData) {
                return false;
              }

              var latexItems: DataTransferItem[] = [];

              const items = Array.from(event.clipboardData.items);
              for (let i = 0; i < items.length; i++) {
                if (
                  items[i].kind === 'file' &&
                  items[i].type.startsWith('image/')
                ) {
                  latexItems.push(items[i]);
                }
              }

              if (latexItems.length === 0) {
                return false;
              }

              event.preventDefault();

              for (let i = 0; i < latexItems.length; i++) {
                const item = latexItems[i];
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

                  const latexAttrs: TLatexAttributes =
                    // biome-ignore lint/performance/noAwaitInLoops: The await inside the loop is required
                    await this.options.onBeforePaste(itemFile);

                  const latexNode =
                    view.state.schema.nodes[this.name].create(latexAttrs);

                  if (
                    !canInsertNode(
                      view.state,
                      view.state.schema.nodes[this.name],
                    )
                  ) {
                    continue;
                  }

                  const tr = view.state.tr;
                  tr.replaceSelectionWith(latexNode);

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

                  view.dispatch(tr);

                  if (this.options.onAfterPaste) {
                    const updateLatexAttrs = (
                      attrs: Partial<TLatexAttributes>,
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
                      latexAttrs,
                      updateLatexAttrs,
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

export type { TLatexOptions, TLatexAttributes };

export { LatexExtension };
