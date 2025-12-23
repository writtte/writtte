import type { EditorState, Plugin, Transaction } from 'prosemirror-state';
import {
  type AnyExtension,
  Extension,
  type KeyboardShortcutCommand,
  type RawCommands,
} from '@tiptap/core';
import { history, redo, undo } from 'prosemirror-history';

type TUndoRedoOptions = {
  depth: number;
  newGroupDelay: number;
  shortcutKeys: {
    undo: string;
    redo: string;
    redoSecond: string;
    undoRussian: string;
    redoRussian: string;
  };
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    undoRedo: {
      undo: () => ReturnType;
      redo: () => ReturnType;
    };
  }
}

const UndoRedoExtension: AnyExtension = Extension.create<TUndoRedoOptions>({
  name: 'undoRedo',
  addOptions(): TUndoRedoOptions {
    return {
      depth: 0,
      newGroupDelay: 0,
      shortcutKeys: {
        undo: '',
        redo: '',
        redoSecond: '',
        undoRussian: '',
        redoRussian: '',
      },
    };
  },
  addCommands(): Partial<RawCommands> {
    return {
      undo:
        () =>
        ({
          state,
          dispatch,
        }: {
          state: EditorState;
          dispatch: ((tr: Transaction) => void) | undefined;
        }) => {
          try {
            return undo(state, dispatch);
          } catch {
            return false;
          }
        },
      redo:
        () =>
        ({
          state,
          dispatch,
        }: {
          state: EditorState;
          dispatch: ((tr: Transaction) => void) | undefined;
        }) => {
          try {
            return redo(state, dispatch);
          } catch {
            return false;
          }
        },
    };
  },
  addProseMirrorPlugins(): Plugin[] {
    return [history(this.options)];
  },
  addKeyboardShortcuts(): {
    [key: string]: KeyboardShortcutCommand;
  } {
    const shortcuts: { [key: string]: KeyboardShortcutCommand } = {};

    if (this.options.shortcutKeys.undo) {
      shortcuts[this.options.shortcutKeys.undo] = () =>
        this.editor.commands.undo();
    }

    if (this.options.shortcutKeys.redo) {
      shortcuts[this.options.shortcutKeys.redo] = () =>
        this.editor.commands.redo();
    }

    if (this.options.shortcutKeys.redoSecond) {
      shortcuts[this.options.shortcutKeys.redoSecond] = () =>
        this.editor.commands.redo();
    }

    // Russian keyboard layout

    if (this.options.shortcutKeys.undoRussian) {
      shortcuts[this.options.shortcutKeys.undoRussian] = () =>
        this.editor.commands.undo();
    }

    if (this.options.shortcutKeys.redoRussian) {
      shortcuts[this.options.shortcutKeys.redoRussian] = () =>
        this.editor.commands.redo();
    }

    return shortcuts;
  },
});

export type { TUndoRedoOptions };

export { UndoRedoExtension };
