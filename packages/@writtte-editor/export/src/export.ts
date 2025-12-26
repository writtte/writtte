import type { TEditorSchema } from '@writtte-editor/editor';
import { parseSchema } from './parse';
import { ExportType } from './type';

const exportToMarkdown = (schema: TEditorSchema): string =>
  parseSchema(ExportType.MD, schema, undefined);

const exportToXML = (schema: TEditorSchema): string =>
  parseSchema(ExportType.XML, schema, undefined);

const exportToMedium = (schema: TEditorSchema): string =>
  parseSchema(ExportType.MEDIUM, schema, undefined);

const exportToSubstack = (schema: TEditorSchema): string =>
  parseSchema(ExportType.SUBSTACK, schema, undefined);

export { exportToMarkdown, exportToXML, exportToMedium, exportToSubstack };
