import type { EditorState } from 'prosemirror-state';
import {
  type AnyExtension,
  type CommandProps,
  Extension,
  type RawCommands,
  isNodeSelection,
} from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

type TBlockPlaceholderOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockPlaceholder: {
      addPlaceholder: (element: HTMLElement, id: string) => ReturnType;
      removePlaceholder: (id: string) => ReturnType;
      removeAllPlaceholders: () => ReturnType;
    };
  }
}

const BlockPlaceholderExtension: AnyExtension =
  Extension.create<TBlockPlaceholderOptions>({
    name: 'blockPlaceholder',
    addOptions(): TBlockPlaceholderOptions {
      return {
        HTMLAttributes: {},
      };
    },
    addStorage(): {
      placeholders: Record<string, HTMLElement>;
      decorations: DecorationSet;
    } {
      return {
        placeholders: {},
        decorations: DecorationSet.empty,
      };
    },
    addProseMirrorPlugins(): Plugin[] {
      return [
        new Plugin({
          props: {
            decorations: (_state: EditorState) => this.storage.decorations,
          },
        }),
      ];
    },
    addCommands(): Partial<RawCommands> {
      return {
        addPlaceholder:
          (element: HTMLElement, id: string) =>
          ({ state, dispatch, tr }: CommandProps) => {
            if (!dispatch || !tr) {
              return false;
            }

            tr.setMeta('addToHistory', false);

            const placeholderId = element.id || id;
            if (!element.id) {
              element.id = placeholderId;
            }

            this.storage.placeholders[placeholderId] = element;

            const { selection } = state;

            let pos: number;
            if (isNodeSelection(selection)) {
              pos = selection.$to.pos;
            } else {
              pos = selection.head;
            }

            const decoration = Decoration.widget(pos, () => element, {
              id: placeholderId,
              stopEvent: () => true,
            });

            this.storage.decorations = this.storage.decorations.add(tr.doc, [
              decoration,
            ]);

            dispatch(tr);
            return true;
          },
        removePlaceholder:
          (id: string) =>
          ({ dispatch, tr }: CommandProps) => {
            if (!dispatch || !tr) {
              return false;
            }

            tr.setMeta('addToHistory', false);

            const placeholder = this.storage.placeholders[id];
            if (!placeholder) {
              return false;
            }

            this.storage.decorations = this.storage.decorations.remove(
              this.storage.decorations.find(
                undefined,
                undefined,
                (spec: { id: string }) => spec.id === id,
              ),
            );

            delete this.storage.placeholders[id];

            dispatch(tr);
            return true;
          },
        removeAllPlaceholders:
          () =>
          ({ dispatch, tr }: CommandProps) => {
            if (!dispatch || !tr) {
              return false;
            }

            tr.setMeta('addToHistory', false);

            this.storage.decorations = DecorationSet.empty;
            this.storage.placeholders = {};

            dispatch(tr);
            return true;
          },
      };
    },
  });

export type { TBlockPlaceholderOptions };

export { BlockPlaceholderExtension };
