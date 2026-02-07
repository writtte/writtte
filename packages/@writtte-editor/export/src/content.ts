// biome-ignore-all lint/style/useTemplate: Templates literals are not required in this file

import type { TEditorSchema } from '@writtte-editor/editor';
import { ExportType, type TExportType } from './type';
import {
  extractParagraphContent,
  normalizeNewlines,
  tabsPrefixForListItem,
  textToHTML,
} from './utils';

const setBold = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '**' + text + '**';

    case ExportType.WORDPRESS:
    case ExportType.MEDIUM:
    case ExportType.SUBSTACK:
      return '<strong>' + text + '</strong>';
  }

  return text;
};

const setItalic = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '_' + text + '_';

    case ExportType.WORDPRESS:
    case ExportType.MEDIUM:
    case ExportType.SUBSTACK:
      return '<em>' + text + '</em>';
  }

  return text;
};

const setUnderline = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '<u>' + text + '</u>';

    case ExportType.WORDPRESS:
      return '<span style="text-decoration: underline;">' + text + '</span>';
  }

  return text;
};

const setSuperscript = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
    case ExportType.WORDPRESS:
    case ExportType.SUBSTACK:
      return '<sup>' + text + '</sup>';

    case ExportType.XML:
      return '<superscript>' + text + '</superscript>';
  }

  return text;
};

const setSubscript = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
    case ExportType.SUBSTACK:
    case ExportType.WORDPRESS:
      return '<sub>' + text + '</sub>';

    case ExportType.XML:
      return '<subscript>' + text + '</subscript>';
  }

  return text;
};

const setStrikethrough = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '~~' + text + '~~';

    case ExportType.WORDPRESS:
    case ExportType.SUBSTACK:
      return '<s>' + text + '</s>';
  }

  return text;
};

const setInlineCode = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '`' + text + '`';

    case ExportType.XML:
    case ExportType.WORDPRESS:
    case ExportType.MEDIUM:
    case ExportType.SUBSTACK:
      return '<code>' + text + '</code>';
  }

  return text;
};

const setLink = (
  exportType: TExportType,
  text: string,
  href: string,
): string => {
  switch (exportType) {
    case ExportType.MD:
      return '[' + text + '](' + href + ')';

    case ExportType.XML:
      return '<link href="' + href + '">' + text + '</link>';

    case ExportType.WORDPRESS:
      return '<a href="' + href + '">' + text + '</a>';

    case ExportType.MEDIUM:
    case ExportType.SUBSTACK:
      return (
        '<a href="' +
        href +
        '" data-href="' +
        href +
        '" rel="noopener" target="_blank">' +
        text +
        '</a>'
      );
  }

  return text;
};

const setParagraph = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return text + '\n\n';

    case ExportType.XML:
      return '<paragraph>' + text + '</paragraph>';

    case ExportType.WORDPRESS:
    case ExportType.MEDIUM:
    case ExportType.SUBSTACK:
      return '<p>' + text + '</p>';
  }

  return text;
};

const setHeading = (
  exportType: TExportType,
  text: string,
  level: number,
): string => {
  switch (exportType) {
    case ExportType.MD: {
      const prefix =
        level === 1
          ? '# '
          : level === 2
            ? '## '
            : level === 3
              ? '### '
              : level === 4
                ? '#### '
                : level === 5
                  ? '##### '
                  : level === 6
                    ? '###### '
                    : '';

      return prefix + text + '\n\n';
    }

    case ExportType.XML:
      return '<heading level="' + level + '">' + text + '</heading>';

    case ExportType.MEDIUM: {
      // Medium.com only supports headings and subheadings, which
      // correspond to H3 and H4.

      const mediumBasedLevel = level === 1 ? 3 : 4;

      return (
        '<h' +
        mediumBasedLevel.toString() +
        '>' +
        text +
        '</h' +
        mediumBasedLevel.toString() +
        '>'
      );
    }

    case ExportType.WORDPRESS:
    case ExportType.SUBSTACK:
      return (
        '<h' + level.toString() + '>' + text + '</h' + level.toString() + '>'
      );
  }

  return text;
};

const setHorizontalRule = (exportType: TExportType): string => {
  switch (exportType) {
    case ExportType.MD:
      return '---\n\n';

    case ExportType.WORDPRESS:
      return '<hr>';

    case ExportType.SUBSTACK:
      return '<hr contenteditable="false">';
  }

  return '';
};

const setImage = (exportType: TExportType, schema: TEditorSchema): string => {
  const src = schema.attrs?.publicURL;
  const alt = schema.attrs?.alt;

  if (!src || typeof src !== 'string' || src?.trim().length === 0) {
    return '';
  }

  // Set private general bucket read only access to true (only read only),
  // and then store its address in the image extension new attribute
  // pass that value here :D
  //
  // the same thing doing Medium and Substack editors

  switch (exportType) {
    case ExportType.MD:
      return `![](${src})\n\n`;

    case ExportType.XML:
      return `<image alt="${alt}">${src}</image>`;

    case ExportType.WORDPRESS:
    case ExportType.SUBSTACK:
      return `<img src="${src}" alt="${alt}" />`;

    case ExportType.MEDIUM:
      return `<figure><img src="${src}" alt="${alt}" /></figure>`;
  }

  return '';
};

const setBulletList = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.XML:
      return '<list type="unordered">' + text + '</list>';

    case ExportType.WORDPRESS:
      return '<ul data-type="core/list" data-title="List">' + text + '</ul>';

    case ExportType.MEDIUM:
    case ExportType.SUBSTACK:
      return '<ul>' + text + '</ul>';
  }

  return text;
};

const setNumberList = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.XML:
      return '<list type="unordered">' + text + '</list>';

    case ExportType.WORDPRESS:
      return '<ol data-type="core/list" data-title="List">' + text + '</ol>';

    case ExportType.MEDIUM:
    case ExportType.SUBSTACK:
      return '<ol>' + text + '</ol>';
  }

  return text;
};

const setListItem = (
  exportType: TExportType,
  text: string,
  type: 'bullet' | 'number',
  currentId: number,
  currentBlock: number,
  isLastItemInBlock: boolean,
): string => {
  if (type === 'bullet') {
    switch (exportType) {
      case ExportType.MD: {
        const normalizedText = isLastItemInBlock
          ? text
          : normalizeNewlines(text);

        return tabsPrefixForListItem(currentBlock) + '* ' + normalizedText;
      }

      case ExportType.XML:
        return '<item>' + text + '</text>';

      case ExportType.WORDPRESS:
        return (
          '<li data-type="core/list-item" data-title="List Item">' +
          text +
          '</li>'
        );

      case ExportType.MEDIUM:
        return '<li>' + extractParagraphContent(text) + '</li>';

      case ExportType.SUBSTACK:
        return '<li>' + text + '</li>';
    }
  } else if (type === 'number') {
    switch (exportType) {
      case ExportType.MD: {
        const normalizedText = isLastItemInBlock
          ? text
          : normalizeNewlines(text);

        return (
          tabsPrefixForListItem(currentBlock) +
          currentId.toString() +
          '. ' +
          normalizedText
        );
      }

      case ExportType.XML:
        return '<item>' + text + '</text>';

      case ExportType.WORDPRESS:
        return (
          '<li data-type="core/list-item" data-title="List Item">' +
          text +
          '</li>'
        );

      case ExportType.MEDIUM:
        return '<li>' + extractParagraphContent(text) + '</li>';

      case ExportType.SUBSTACK:
        return '<li>' + text + '</li>';
    }
  }

  return '';
};

const setCodeBlock = (
  exportType: TExportType,
  content: string | undefined,
  language: string | undefined,
): string => {
  if (!content) {
    return '';
  }

  switch (exportType) {
    case ExportType.MD:
      return '```' + (language ?? '') + '\n' + content + '\n```\n';

    case ExportType.XML:
      return '<pre>' + content + '</pre>';

    case ExportType.WORDPRESS:
      return '<pre>' + textToHTML(content) + '</pre>';

    case ExportType.MEDIUM:
      return (
        '<pre data-code-block-lang="' +
        (language ?? '') +
        '">' +
        textToHTML(content) +
        '</pre>'
      );

    case ExportType.SUBSTACK:
      return '<pre><code>' + textToHTML(content) + '</code></pre>';
  }

  return '';
};

const setBlockQuote = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '> ' + text;

    case ExportType.XML:
      return '<blockQuote>' + text + '</blockQuote>';

    case ExportType.MEDIUM:
      return '<blockquote>' + extractParagraphContent(text) + '</blockquote>';

    case ExportType.WORDPRESS:
    case ExportType.SUBSTACK:
      return '<blockquote>' + text + '</blockquote>';
  }

  return '';
};

export {
  setBold,
  setItalic,
  setUnderline,
  setSuperscript,
  setSubscript,
  setStrikethrough,
  setInlineCode,
  setLink,
  setParagraph,
  setHeading,
  setHorizontalRule,
  setImage,
  setBulletList,
  setNumberList,
  setListItem,
  setCodeBlock,
  setBlockQuote,
};
