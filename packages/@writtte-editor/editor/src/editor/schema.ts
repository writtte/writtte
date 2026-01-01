type TEditorSchema = {
  type?: string;
  attrs?: Record<string, string | number | boolean>;
  content?: TEditorSchema[];
  marks?: {
    type: string;
    attrs?: Record<string, string | number | boolean>;
    [key: string]: unknown;
  }[];
  text?: string;
  [key: string]: unknown;
};

const defaultEditorSchema: TEditorSchema = {
  type: 'document',
};

export type { TEditorSchema };

export { defaultEditorSchema };
