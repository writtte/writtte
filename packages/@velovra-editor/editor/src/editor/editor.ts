import type { TEditorAPI } from './api';
import type { TExtensionOptions } from './options';
import type { TEditorSchema } from './schema';
import { type AnyExtension, Editor } from '@tiptap/core';
import { DocumentExtension } from '../extensions/document';
import { ParagraphExtension } from '../extensions/paragraph';
import { TextExtension } from '../extensions/text';

type TOptions = {
  element: HTMLDivElement;
  options: TExtensionOptions;
};

const VelovraEditor = (opts: TOptions): TEditorAPI => {
  const extensions: AnyExtension[] = [];

  if (opts.options.paragraph.isEnabled) {
    extensions.push(ParagraphExtension.configure(opts.options.paragraph));
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

export type { TOptions as TVelovraEditorOptions };

export { VelovraEditor };
