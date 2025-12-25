import type { TEditorSchema } from '@writtte-editor/editor';
import type { TExportType } from './type';
import {
  setBold,
  setHeading,
  setHorizontalRule,
  setInlineCode,
  setItalic,
  setLink,
  setListItem,
  setParagraph,
  setSubscript,
  setSuperscript,
  setUnderline,
} from './content';

const parseSchema = (
  exportType: TExportType,
  schema: TEditorSchema,
  listContext:
    | {
        currentBlock: number;
      }
    | undefined,
): string => {
  const type = schema.type;

  if (type === 'text') {
    return parseText(exportType, schema);
  }

  if (type === 'paragraph') {
    return parseParagraph(exportType, schema);
  }

  if (type === 'heading') {
    return parseHeading(exportType, schema);
  }

  if (type === 'horizontalLine') {
    return parseHorizontalRule(exportType);
  }

  if (type === 'bulletList' || type === 'numberList') {
    return parseBulletAndNumberList(
      exportType,
      schema,
      listContext ? listContext.currentBlock + 1 : 0,
    );
  }

  if (schema.content !== undefined) {
    let contentResults = '';
    for (let i = 0; i < schema.content.length; i++) {
      contentResults += parseSchema(exportType, schema.content[i], listContext);
    }

    return contentResults;
  }

  return '';
};

const parseText = (exportType: TExportType, schema: TEditorSchema): string => {
  if (!schema.marks || schema.marks.length === 0) {
    return schema.text ?? '';
  }

  let parsedText: string = schema.text ?? '';

  let linkAttributes: Record<string, string | number | boolean> | undefined;

  let hasBold = false;
  let hasItalic = false;
  let hasUnderline = false;
  let hasSuperscript = false;
  let hasSubscript = false;
  let hasInlineCode = false;
  let hasLink = false;

  for (let i = 0; i < schema.marks.length; i++) {
    switch (schema.marks[i].type) {
      case 'bold':
        hasBold = true;
        break;

      case 'italic':
        hasItalic = true;
        break;

      case 'underline':
        hasUnderline = true;
        break;

      case 'superscript':
        hasSuperscript = true;
        break;

      case 'subscript':
        hasSubscript = true;
        break;

      case 'inlineCode':
        hasInlineCode = true;
        break;

      case 'link':
        hasLink = true;

        linkAttributes = schema.marks[i].attrs;
        break;
    }
  }

  if (hasBold) {
    parsedText = setBold(exportType, parsedText);
  }

  if (hasItalic) {
    parsedText = setItalic(exportType, parsedText);
  }

  if (hasUnderline) {
    parsedText = setUnderline(exportType, parsedText);
  }

  if (hasSuperscript) {
    parsedText = setSuperscript(exportType, parsedText);
  }

  if (hasSubscript) {
    parsedText = setSubscript(exportType, parsedText);
  }

  if (hasInlineCode) {
    parsedText = setInlineCode(exportType, parsedText);
  }

  if (hasLink) {
    if (!linkAttributes) {
      return parsedText;
    }

    parsedText = setLink(exportType, parsedText, linkAttributes.href as string);
  }

  return parsedText;
};

const parseParagraph = (
  exportType: TExportType,
  schema: TEditorSchema,
): string => {
  const content = schema.content;
  if (!content || content.length <= 0) {
    return '';
  }

  let parsedText: string = '';
  for (let i = 0; i < content.length; i++) {
    parsedText += parseSchema(exportType, content[i], undefined);
  }

  return setParagraph(exportType, parsedText);
};

const parseHeading = (
  exportType: TExportType,
  schema: TEditorSchema,
): string => {
  const content = schema.content;
  const attributes = schema.attrs;

  if (!content || content.length <= 0 || !attributes || !attributes.level) {
    return '';
  }

  let parsedText: string = '';
  for (let i = 0; i < content.length; i++) {
    parsedText += parseSchema(exportType, content[i], undefined);
  }

  return setHeading(exportType, parsedText, attributes.level as number);
};

const parseHorizontalRule = (exportType: TExportType): string =>
  setHorizontalRule(exportType);

const parseBulletAndNumberList = (
  exportType: TExportType,
  schema: TEditorSchema,
  currentBlock: number,
): string => {
  const listItems = schema.content;
  if (!listItems || listItems.length <= 0) {
    return '';
  }

  const itemType: 'bullet' | 'number' =
    schema.type === 'bulletList' ? 'bullet' : 'number';

  let parsedText: string = '';
  for (let i = 0; i < listItems.length; i++) {
    parsedText += parseListItem(
      exportType,
      listItems[i],
      itemType,
      i + 1,
      currentBlock,
      i === listItems.length - 1 && currentBlock === 0,
    );
  }

  return parsedText;
};

const parseListItem = (
  exportType: TExportType,
  schema: TEditorSchema,
  type: 'bullet' | 'number',
  currentId: number,
  currentBlock: number,
  isLastItemInBlock: boolean,
): string => {
  const parsedText = parseSchema(exportType, schema, {
    currentBlock,
  });

  return setListItem(
    exportType,
    parsedText,
    type,
    currentId,
    currentBlock,
    isLastItemInBlock,
  );
};

export { parseSchema };
