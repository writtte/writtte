import type { TEditorAPI } from './api';
import type { TExtensionOptions } from './options';
import type { TEditorSchema } from './schema';
import { type AnyExtension, Editor } from '@tiptap/core';
import { BulletListExtension } from '../extensions/bulletList';
import { DocumentExtension } from '../extensions/document';
import { HeadingExtension } from '../extensions/header';
import { ListItemExtension } from '../extensions/listItem';
import { NumberListExtension } from '../extensions/numberList';
import { ParagraphExtension } from '../extensions/paragraph';
import { TextExtension } from '../extensions/text';
import { UndoRedoExtension } from '../extensions/undoRedo';

type TOptions = {
  element: HTMLDivElement;
  options: TExtensionOptions;
};

const WrittteEditor = (opts: TOptions): TEditorAPI => {
  const extensions: AnyExtension[] = [];

  if (opts.options.paragraph?.isEnabled) {
    extensions.push(
      ParagraphExtension.configure(opts.options.paragraph ?? undefined),
    );
  }

  if (opts.options.header?.isEnabled) {
    extensions.push(
      HeadingExtension.configure(opts.options.header ?? undefined),
    );
  }

  if (opts.options.bulletList.isEnabled) {
    extensions.push(
      BulletListExtension.configure(opts.options.bulletList ?? undefined),
    );
  }

  if (opts.options.numberList.isEnabled) {
    extensions.push(
      NumberListExtension.configure(opts.options.numberList ?? undefined),
    );
  }

  if (opts.options.listItem.isEnabled) {
    extensions.push(
      ListItemExtension.configure(opts.options.listItem ?? undefined),
    );
  }

  if (opts.options.undoRedo.isEnabled) {
    extensions.push(
      UndoRedoExtension.configure(opts.options.undoRedo ?? undefined),
    );
  }

  const _editor = new Editor({
    element: opts.element,
    extensions: [TextExtension, DocumentExtension, ...extensions],
  });

  const isEditable = (): boolean => _editor.isEditable;

  const setEditable = (): void => {
    _editor.setEditable(true);
  };

  const setReadable = (): void => {
    _editor.setEditable(false);
  };

  const setContent = (content: TEditorSchema): void => {
    _editor.commands.setContent(content);
  };

  const replaceContent = (content: TEditorSchema): void => {
    _editor.commands.setContent(content);
  };

  const stringToSchema = (content: string): TEditorSchema => {
    const jsonContent = JSON.parse(content);
    return jsonContent as TEditorSchema;
  };

  const schemaToString = (schema: TEditorSchema): string =>
    JSON.stringify(schema);

  const onChange = (callback: (content: TEditorSchema) => void): void => {
    _editor.on('update', ({ editor }: { editor: Editor }) => {
      const jsonContent = editor.getJSON();
      callback(jsonContent);
    });
  };

  return {
    isEditable,
    setEditable,
    setReadable,
    setContent,
    replaceContent,
    stringToSchema,
    schemaToString,
    onChange,
  };
};

export type { TOptions as TWrittteEditorOptions };

export { WrittteEditor };
