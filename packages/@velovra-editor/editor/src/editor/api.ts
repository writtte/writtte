import type { TEditorSchema } from './schema';

type TEditorAPI = {
  isEditable: () => boolean;
  setEditable: () => void;
  setReadable: () => void;
  setContent: (content: TEditorSchema) => void;
  replaceContent: (content: TEditorSchema) => void;
  stringToSchema: (content: string) => TEditorSchema;
  schemaToString: (schema: TEditorSchema) => string;
  onChange: (callback: (content: TEditorSchema) => void) => void;
};

export type { TEditorAPI };
