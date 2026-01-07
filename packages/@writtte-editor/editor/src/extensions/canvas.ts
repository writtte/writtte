import type {
  DOMOutputSpec,
  NodeSpec,
  Node as ProsemirrorNode,
} from 'prosemirror-model';
import type { NodeViewConstructor } from 'prosemirror-view';
import {
  type AnyExtension,
  type Attributes,
  type ChainedCommands,
  type Dispatch,
  type Editor,
  type KeyboardShortcutCommand,
  Node,
  type NodeViewRenderer,
  type RawCommands,
  canInsertNode,
  isNodeSelection,
  mergeAttributes,
} from '@tiptap/core';
import {
  type EditorState,
  NodeSelection,
  TextSelection,
  type Transaction,
} from 'prosemirror-state';

type TCanvasAttributes = {
  canvasId: string;
  height?: number;
  data?: Record<string, unknown>;
};

type TCanvasOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  ignoredParents: string[] | undefined;
  createHTMLElement:
    | ((
        attributes: TCanvasAttributes,
        updateCanvas: (attrs: Partial<TCanvasAttributes>) => void,
      ) => HTMLElement)
    | undefined;
  onCanvasCreated:
    | ((canvasId: string, element: HTMLElement) => void)
    | undefined;
  onCanvasRemoved: ((canvasId: string) => void) | undefined;
  onCanvasUpdated:
    | ((canvasId: string, attributes: Partial<TCanvasAttributes>) => void)
    | undefined;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    canvas: {
      addCanvas: (attributes: TCanvasAttributes) => ReturnType;
      updateCanvas: (
        canvasId: string,
        attributes: Partial<TCanvasAttributes>,
      ) => ReturnType;
      removeCanvas: () => ReturnType;
      selectCanvas: (canvasId: string) => ReturnType;
    };
  }
}

const CanvasExtension: AnyExtension = Node.create<TCanvasOptions>({
  name: 'canvas',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,
  addOptions(): TCanvasOptions {
    return {
      HTMLAttributes: {},
      ignoredParents: undefined,
      createHTMLElement: undefined,
      onCanvasCreated: undefined,
      onCanvasRemoved: undefined,
      onCanvasUpdated: undefined,
    };
  },
  addAttributes(): Attributes {
    return {
      canvasId: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('data-canvas-id'),
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-canvas-id': attributes.canvasId as string,
        }),
      },
      height: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const height = element.getAttribute('data-height');
          return height ? Number.parseInt(height, 10) : null;
        },
        renderHTML: (attributes: Record<string, unknown>) => ({
          'data-height': attributes.height as number,
        }),
      },
      data: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const data = element.getAttribute('data-canvas-data');
          if (data) {
            try {
              return JSON.parse(data);
            } catch {
              return null;
            }
          }

          return null;
        },
        renderHTML: (attributes: Record<string, unknown>) => {
          if (attributes.data) {
            return {
              'data-canvas-data': JSON.stringify(attributes.data),
            };
          }

          return {};
        },
      },
    };
  },
  parseHTML(): NodeSpec['parseDOM'] {
    return [
      {
        tag: 'div[data-canvas-id]',
        getAttrs: (element: HTMLElement) => {
          if (!(element instanceof HTMLElement)) {
            return false;
          }

          const canvasId = element.getAttribute('data-canvas-id');

          if (!canvasId) {
            return false;
          }

          const height = element.getAttribute('data-height');
          const dataAttr = element.getAttribute('data-canvas-data');

          let data: Record<string, unknown> | null = null;
          if (dataAttr) {
            try {
              data = JSON.parse(dataAttr);
            } catch {
              data = null;
            }
          }

          return {
            canvasId,
            height: height ? Number.parseInt(height, 10) : null,
            data,
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
    const { canvasId, height, data } = node.attrs;

    const attrs: Record<string, string | number | boolean | null> = {
      'data-canvas-id': canvasId,
      'data-height': height || null,
      class: 'writtte-canvas-container',
      style: 'width: 100%;',
    };

    if (data) {
      attrs['data-canvas-data'] = JSON.stringify(data);
    }

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, attrs),
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      addCanvas:
        (attributes: TCanvasAttributes) =>
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

          if (!attributes.canvasId) {
            return false;
          }

          const { selection } = state;
          const { $from } = selection;

          if (
            this.options.ignoredParents &&
            this.options.ignoredParents.length > 0
          ) {
            const resolvedPosition = state.doc.resolve($from.pos);
            const parentNodes: string[] = [];
            for (let i: number = resolvedPosition.depth; i > 0; i--) {
              parentNodes.push(resolvedPosition.node(i).type.name);
            }

            if (
              parentNodes.some((name) =>
                this.options.ignoredParents?.includes(name),
              )
            ) {
              return false;
            }
          }

          const { $to: $originTo } = selection;
          const currentChain = chain();

          if (isNodeSelection(selection)) {
            currentChain.insertContentAt($originTo.pos, {
              type: this.name,
              attrs: attributes,
            });
          } else {
            currentChain.insertContent({
              type: this.name,
              attrs: attributes,
            });
          }

          return currentChain
            .command(
              ({
                tr,
                dispatch,
              }: {
                tr: Transaction;
                dispatch: ((tr: Transaction) => void) | undefined;
              }) => {
                if (dispatch) {
                  const { $to } = tr.selection;
                  const posAfter = $to.end();

                  if ($to.nodeAfter) {
                    if ($to.nodeAfter.isTextblock) {
                      tr.setSelection(
                        TextSelection.create(tr.doc, $to.pos + 1),
                      );
                    } else if ($to.nodeAfter.isBlock) {
                      tr.setSelection(NodeSelection.create(tr.doc, $to.pos));
                    } else {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos));
                    }
                  } else {
                    const node =
                      $to.parent.type.contentMatch.defaultType?.create();

                    if (node) {
                      tr.insert(posAfter, node);
                      tr.setSelection(
                        TextSelection.create(tr.doc, posAfter + 1),
                      );
                    }
                  }

                  tr.scrollIntoView();
                }

                return true;
              },
            )
            .run();
        },
      updateCanvas:
        (canvasId: string, attributes: Partial<TCanvasAttributes>) =>
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

          state.doc.descendants((docNode, docPos) => {
            if (found) {
              return false;
            }

            if (
              docNode.type === this.type &&
              docNode.attrs.canvasId === canvasId
            ) {
              found = true;
              if (dispatch) {
                tr.setNodeMarkup(docPos, undefined, {
                  ...docNode.attrs,
                  ...attributes,
                });
                dispatch(tr);

                if (this.options.onCanvasUpdated) {
                  this.options.onCanvasUpdated(canvasId, attributes);
                }
              }
              return false;
            }

            return true;
          });

          return found;
        },
      removeCanvas:
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
          const canvasId = selection.node.attrs.canvasId;

          if (dispatch) {
            tr.deleteRange(from, to);
            dispatch(tr);

            if (this.options.onCanvasRemoved && canvasId) {
              this.options.onCanvasRemoved(canvasId);
            }
          }

          return true;
        },
      selectCanvas:
        (canvasId: string) =>
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

          state.doc.descendants((docNode, docPos) => {
            if (found) {
              return false;
            }

            if (
              docNode.type === this.type &&
              docNode.attrs.canvasId === canvasId
            ) {
              found = true;
              if (dispatch) {
                tr.setSelection(NodeSelection.create(tr.doc, docPos));
                tr.scrollIntoView();
                dispatch(tr);
              }
              return false;
            }

            return true;
          });

          return found;
        },
    };
  },
  addNodeView(): NodeViewRenderer {
    return ({
      node,
      editor,
    }: {
      node: Parameters<NodeViewConstructor>[0];
      editor: Editor;
    }) => {
      const dom = document.createElement('div');
      dom.classList.add('writtte-canvas-container');
      dom.setAttribute('data-canvas-id', node.attrs.canvasId);
      dom.style.width = '100%';

      if (node.attrs.height) {
        dom.setAttribute('data-height', String(node.attrs.height));
        dom.style.height = `${node.attrs.height}px`;
      }

      if (node.attrs.data) {
        dom.setAttribute('data-canvas-data', JSON.stringify(node.attrs.data));
      }

      const contentContainer = document.createElement('div');
      contentContainer.classList.add('writtte-canvas-content');
      contentContainer.style.width = '100%';
      contentContainer.style.height = '100%';
      dom.appendChild(contentContainer);

      const updateCanvas = (attrs: Partial<TCanvasAttributes>) => {
        editor.commands.updateCanvas(node.attrs.canvasId, attrs);
      };

      if (this.options.createHTMLElement) {
        const externalElement = this.options.createHTMLElement(
          {
            canvasId: node.attrs.canvasId,
            height: node.attrs.height,
            data: node.attrs.data,
          },
          updateCanvas,
        );

        contentContainer.appendChild(externalElement);

        if (this.options.onCanvasCreated) {
          this.options.onCanvasCreated(node.attrs.canvasId, externalElement);
        }
      }
      return {
        dom,
        update: (updatedNode: ProsemirrorNode) => {
          if (updatedNode.type !== node.type) {
            return false;
          }

          if (updatedNode.attrs.canvasId !== node.attrs.canvasId) {
            dom.setAttribute('data-canvas-id', updatedNode.attrs.canvasId);
          }

          if (updatedNode.attrs.height !== node.attrs.height) {
            if (updatedNode.attrs.height) {
              dom.setAttribute('data-height', String(updatedNode.attrs.height));
              dom.style.height = `${updatedNode.attrs.height}px`;
            } else {
              dom.removeAttribute('data-height');
              dom.style.height = '';
            }
          }

          if (
            JSON.stringify(updatedNode.attrs.data) !==
            JSON.stringify(node.attrs.data)
          ) {
            if (updatedNode.attrs.data) {
              dom.setAttribute(
                'data-canvas-data',
                JSON.stringify(updatedNode.attrs.data),
              );
            } else {
              dom.removeAttribute('data-canvas-data');
            }
          }

          return true;
        },
        destroy: () => {
          if (this.options.onCanvasRemoved) {
            this.options.onCanvasRemoved(node.attrs.canvasId);
          }
        },
      };
    };
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    return {
      Backspace: () => {
        const { selection } = this.editor.state;

        if (
          selection instanceof NodeSelection &&
          selection.node.type === this.type
        ) {
          return this.editor.commands.removeCanvas();
        }

        return false;
      },
      Delete: () => {
        const { selection } = this.editor.state;

        if (
          selection instanceof NodeSelection &&
          selection.node.type === this.type
        ) {
          return this.editor.commands.removeCanvas();
        }

        return false;
      },
    };
  },
});

export type { TCanvasOptions, TCanvasAttributes };

export { CanvasExtension };
