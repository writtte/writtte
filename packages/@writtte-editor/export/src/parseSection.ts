import type { TEditorSchema } from '@writtte-editor/editor';
import type { TExportType } from './type';
import {
  setBlockQuote,
  setBold,
  setBulletList,
  setCodeBlock,
  setHeading,
  setHorizontalRule,
  setImage,
  setInlineCode,
  setItalic,
  setLink,
  setListItem,
  setNumberList,
  setParagraph,
  setStrikethrough,
  setSubscript,
  setSuperscript,
  setUnderline,
} from './content';

type GroupedItem =
  | { type: 'listItems'; items: TEditorSchema[]; listType: 'bullet' | 'number' }
  | { type: 'single'; schema: TEditorSchema };

const parseSchemaSection = (
  exportType: TExportType,
  schemas: TEditorSchema | TEditorSchema[],
): string => {
  const schemaArray = Array.isArray(schemas) ? schemas : [schemas];

  if (schemaArray.length === 0) {
    return '';
  }

  const grouped = groupListItems(schemaArray);

  let result = '';
  for (const group of grouped) {
    if (group.type === 'listItems') {
      result += parseListItemsGroup(exportType, group.items, group.listType);
    } else {
      result += parseSingleSchema(exportType, group.schema);
    }
  }

  return result;
};

const groupListItems = (schemas: TEditorSchema[]): GroupedItem[] => {
  const grouped: GroupedItem[] = [];
  let currentListItems: TEditorSchema[] = [];
  let currentListType: 'bullet' | 'number' | null = null;

  for (const schema of schemas) {
    if (schema.type === 'listItem') {
      if (currentListType === null) {
        currentListType = 'bullet';
      }

      currentListItems.push(schema);
    } else if (schema.type === 'bulletList') {
      if (currentListItems.length > 0 && currentListType !== null) {
        grouped.push({
          type: 'listItems',
          items: currentListItems,
          listType: currentListType,
        });

        currentListItems = [];
        currentListType = null;
      }

      if (schema.content && schema.content.length > 0) {
        grouped.push({
          type: 'listItems',
          items: schema.content,
          listType: 'bullet',
        });
      }
    } else if (schema.type === 'numberList') {
      if (currentListItems.length > 0 && currentListType !== null) {
        grouped.push({
          type: 'listItems',
          items: currentListItems,
          listType: currentListType,
        });

        currentListItems = [];
        currentListType = null;
      }

      if (schema.content && schema.content.length > 0) {
        grouped.push({
          type: 'listItems',
          items: schema.content,
          listType: 'number',
        });
      }
    } else {
      if (currentListItems.length > 0 && currentListType !== null) {
        grouped.push({
          type: 'listItems',
          items: currentListItems,
          listType: currentListType,
        });

        currentListItems = [];
        currentListType = null;
      }

      grouped.push({ type: 'single', schema });
    }
  }

  if (currentListItems.length > 0 && currentListType !== null) {
    grouped.push({
      type: 'listItems',
      items: currentListItems,
      listType: currentListType,
    });
  }

  return grouped;
};

const parseListItemsGroup = (
  exportType: TExportType,
  items: TEditorSchema[],
  listType: 'bullet' | 'number',
): string => {
  let parsedItems = '';

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const parsedContent = parseListItemContent(exportType, item);

    parsedItems += setListItem(
      exportType,
      parsedContent,
      listType,
      i + 1,
      0,
      i === items.length - 1,
    );
  }

  return listType === 'bullet'
    ? setBulletList(exportType, parsedItems)
    : setNumberList(exportType, parsedItems);
};

const parseListItemContent = (
  exportType: TExportType,
  schema: TEditorSchema,
): string => {
  if (!schema.content || schema.content.length === 0) {
    return '';
  }

  let result = '';
  for (const child of schema.content) {
    result += parseSingleSchema(exportType, child);
  }

  return result;
};

const parseSingleSchema = (
  exportType: TExportType,
  schema: TEditorSchema,
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

  if (type === 'image') {
    return parseImage(exportType, schema);
  }

  if (type === 'bulletList') {
    return parseBulletList(exportType, schema);
  }

  if (type === 'numberList') {
    return parseNumberList(exportType, schema);
  }

  if (type === 'listItem') {
    const parsedContent = parseListItemContent(exportType, schema);
    const wrappedItem = setListItem(
      exportType,
      parsedContent,
      'bullet',
      1,
      0,
      true,
    );

    return setBulletList(exportType, wrappedItem);
  }

  if (type === 'codeBlock') {
    return parseCodeBlock(exportType, schema);
  }

  if (type === 'blockQuote') {
    return parseBlockQuote(exportType, schema);
  }

  if (schema.content !== undefined) {
    let contentResults = '';
    for (const child of schema.content) {
      contentResults += parseSingleSchema(exportType, child);
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
  let hasStrikethrough = false;
  let hasInlineCode = false;
  let hasLink = false;

  for (const mark of schema.marks) {
    switch (mark.type) {
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

      case 'strikethrough':
        hasStrikethrough = true;
        break;

      case 'inlineCode':
        hasInlineCode = true;
        break;

      case 'link':
        hasLink = true;
        linkAttributes = mark.attrs;
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

  if (hasStrikethrough) {
    parsedText = setStrikethrough(exportType, parsedText);
  }

  if (hasInlineCode) {
    parsedText = setInlineCode(exportType, parsedText);
  }

  if (hasLink && linkAttributes) {
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

  let parsedText = '';
  for (const child of content) {
    parsedText += parseSingleSchema(exportType, child);
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

  let parsedText = '';
  for (const child of content) {
    parsedText += parseSingleSchema(exportType, child);
  }

  return setHeading(exportType, parsedText, attributes.level as number);
};

const parseHorizontalRule = (exportType: TExportType): string =>
  setHorizontalRule(exportType);

const parseImage = (exportType: TExportType, schema: TEditorSchema): string =>
  setImage(exportType, schema);

const parseBulletList = (
  exportType: TExportType,
  schema: TEditorSchema,
): string => {
  const listItems = schema.content;
  if (!listItems || listItems.length <= 0) {
    return '';
  }

  let parsedItems = '';
  for (let i = 0; i < listItems.length; i++) {
    const parsedContent = parseListItemContent(exportType, listItems[i]);
    parsedItems += setListItem(
      exportType,
      parsedContent,
      'bullet',
      i + 1,
      0,
      i === listItems.length - 1,
    );
  }

  return setBulletList(exportType, parsedItems);
};

const parseNumberList = (
  exportType: TExportType,
  schema: TEditorSchema,
): string => {
  const listItems = schema.content;
  if (!listItems || listItems.length <= 0) {
    return '';
  }

  let parsedItems = '';
  for (let i = 0; i < listItems.length; i++) {
    const parsedContent = parseListItemContent(exportType, listItems[i]);
    parsedItems += setListItem(
      exportType,
      parsedContent,
      'number',
      i + 1,
      0,
      i === listItems.length - 1,
    );
  }

  return setNumberList(exportType, parsedItems);
};

const parseCodeBlock = (
  exportType: TExportType,
  schema: TEditorSchema,
): string => {
  const content = schema.content;
  const language: string | undefined =
    (schema.attrs?.language as string) ?? undefined;

  if (!content || content.length <= 0) {
    return '';
  }

  return setCodeBlock(exportType, content[0]?.text, language);
};

const parseBlockQuote = (
  exportType: TExportType,
  schema: TEditorSchema,
): string => {
  const content = schema.content;
  if (!content || content.length <= 0) {
    return '';
  }

  let parsedText = '';
  for (const child of content) {
    parsedText += setBlockQuote(
      exportType,
      parseSingleSchema(exportType, child),
    );
  }

  return parsedText;
};

export { parseSchemaSection };
