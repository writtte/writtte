import type { Editor } from '@tiptap/core';

type TEditorState = {
  selection: boolean;
  cursor: {
    position: number;
    from?: number;
    to?: number;
  };
};

const getEditorState = (editor: Editor): TEditorState => {
  const { from, to } = editor.state.selection;
  const hasSelection = from !== to;

  return {
    selection: hasSelection,
    cursor: {
      position: from,
      from: from,
      to: to,
    },
  };
};

const isCursorAtStart = (editor: Editor): boolean => {
  const { from } = editor.state.selection;
  return from === 1;
};

const isCursorAtEnd = (editor: Editor): boolean => {
  const { to } = editor.state.selection;
  const docSize = editor.state.doc.content.size;
  return to >= docSize - 1;
};

const getSelectedText = (editor: Editor): string => {
  const { from, to } = editor.state.selection;
  if (from === to) {
    return '';
  }

  return editor.state.doc.textBetween(from, to);
};

export type { TEditorState };

export { getEditorState, isCursorAtStart, isCursorAtEnd, getSelectedText };
