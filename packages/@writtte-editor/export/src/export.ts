import type { TEditorSchema } from '@writtte-editor/editor';
import { parseSchema } from './parse';
import { ExportType } from './type';

const exportToMarkdown = (schema: TEditorSchema): string =>
  parseSchema(ExportType.MD, schema, undefined);

export { exportToMarkdown };
