import type { TEditorSchema } from '@writtte-editor/editor';
import { parseSchema } from './parse';
import { parseSchemaSection } from './parseSection';
import { ExportType } from './type';

const exportToMarkdown = (schema: TEditorSchema): string =>
  parseSchema(ExportType.MD, schema, undefined);

const exportToMarkdownSection = (schema: TEditorSchema): string =>
  parseSchemaSection(ExportType.MD, schema);

const exportToXML = (schema: TEditorSchema): string =>
  parseSchema(ExportType.XML, schema, undefined);

const exportToWordpress = (schema: TEditorSchema): string =>
  parseSchema(ExportType.WORDPRESS, schema, undefined);

const exportToMedium = (schema: TEditorSchema): string =>
  parseSchema(ExportType.MEDIUM, schema, undefined);

const exportToSubstack = (schema: TEditorSchema): string =>
  parseSchema(ExportType.SUBSTACK, schema, undefined);

export {
  exportToMarkdown,
  exportToMarkdownSection,
  exportToXML,
  exportToWordpress,
  exportToMedium,
  exportToSubstack,
};
