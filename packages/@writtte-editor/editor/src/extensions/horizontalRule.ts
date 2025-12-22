import type { NodeSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  type ChainedCommands,
  InputRule,
  Node,
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

const inputRegex = /^(?:---|—-|___\s|\*\*\*\s)$/;

type THorizontalLineOptions = {
  ignoredParents: string[] | undefined;
  HTMLAttributes: Record<string, string | number | boolean>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    horizontalLine: {
      setHorizontalLine: () => ReturnType;
    };
  }
}

const HorizontalLineExtension: AnyExtension =
  Node.create<THorizontalLineOptions>({
    name: 'horizontalLine',
    group: 'block',
    selectable: true,
    addOptions(): THorizontalLineOptions {
      return {
        ignoredParents: undefined,
        HTMLAttributes: {},
      };
    },
    parseHTML(): NodeSpec['parseDOM'] {
      return [{ tag: 'hr' }];
    },
    renderHTML({
      HTMLAttributes,
    }: {
      HTMLAttributes: Record<string, string | number | boolean>;
    }): [string, Record<string, string | number | boolean>] {
      return [
        'hr',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ];
    },
    addCommands(): Partial<RawCommands> {
      return {
        setHorizontalLine:
          () =>
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

            const { selection } = state;
            const { $from } = selection;

            if (
              this.options.ignoredParents &&
              this.options.ignoredParents.length > 0
            ) {
              // Prevent insertion for selected parents

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
              });
            } else {
              currentChain.insertContent({ type: this.name });
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
                      // Add node after horizontal line if it's the end of the document

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
      };
    },
    addInputRules(): InputRule[] {
      return [
        new InputRule({
          find: inputRegex,
          handler: ({
            state,
            range,
            commands,
          }: {
            state: EditorState;
            range: { from: number; to: number };
            commands: any;
          }) => {
            const { $from } = state.selection;

            if (
              this.options.ignoredParents &&
              this.options.ignoredParents.length > 0
            ) {
              // Prevent insertion for selected parents

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
                return;
              }
            }

            // Delete the matched text (e.g., '---') before inserting
            // the horizontal line

            const tr = state.tr.delete(range.from, range.to);
            state.apply(tr);

            commands.insertContent({ type: this.name });
          },
        }),
      ];
    },
  });

export type { THorizontalLineOptions };

export { HorizontalLineExtension, inputRegex };
