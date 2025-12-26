// biome-ignore-all lint/style/useTemplate: Templates literals are not required in this file

import { ExportType, type TExportType } from './type';
import { normalizeNewlines, tabsPrefixForListItem } from './utils';

const setBold = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '**' + text + '**';

    case ExportType.MEDIUM:
      return '<strong>' + text + '</strong>';
  }

  return text;
};

const setItalic = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '_' + text + '_';

    case ExportType.MEDIUM:
      return '<em>' + text + '</em>';
  }

  return text;
};

const setUnderline = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '<u>' + text + '</u>';
  }

  return text;
};

const setSuperscript = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '<sup>' + text + '</sup>';

    case ExportType.XML:
      return '<superscript>' + text + '</superscript>';
  }

  return text;
};

const setSubscript = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '<sub>' + text + '</sub>';

    case ExportType.XML:
      return '<sub>' + text + '</subscript>';
  }

  return text;
};

const setInlineCode = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '`' + text + '`';

    case ExportType.XML:
    case ExportType.MEDIUM:
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

    case ExportType.MEDIUM:
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

    case ExportType.MEDIUM:
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

    case ExportType.MEDIUM:
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
  }

  return '';
};

const setBulletList = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.XML:
      return '<list type="unordered">' + text + '</list>';

    case ExportType.MEDIUM:
      return '<ul>' + text + '</ul>';
  }

  return text;
};

const setNumberList = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.XML:
      return '<list type="unordered">' + text + '</list>';

    case ExportType.MEDIUM:
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

      case ExportType.MEDIUM:
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

      case ExportType.MEDIUM:
        return '<li>' + text + '</li>';
    }
  }

  return '';
};

export {
  setBold,
  setItalic,
  setUnderline,
  setSuperscript,
  setSubscript,
  setInlineCode,
  setLink,
  setParagraph,
  setHeading,
  setHorizontalRule,
  setBulletList,
  setNumberList,
  setListItem,
};
