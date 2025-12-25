// biome-ignore-all lint/style/useTemplate: Templates literals are not required in this file

import { ExportType, type TExportType } from './type';
import { normalizeNewlines, tabsPrefixForListItem } from './utils';

const setBold = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '**' + text + '**';
  }

  return text;
};

const setItalic = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '_' + text + '_';
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
  }

  return text;
};

const setSubscript = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '<sub>' + text + '</sub>';
  }

  return text;
};

const setInlineCode = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return '`' + text + '`';
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
  }

  return text;
};

const setParagraph = (exportType: TExportType, text: string): string => {
  switch (exportType) {
    case ExportType.MD:
      return text + '\n\n';
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
  setListItem,
};
