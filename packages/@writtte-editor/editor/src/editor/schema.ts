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

export type { TEditorSchema };
