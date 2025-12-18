type JSONContent = {
  type?: string;
  attrs?: Record<string, string | number | boolean>;
  content?: JSONContent[];
  marks?: {
    type: string;
    attrs?: Record<string, string | number | boolean>;
    [key: string]: unknown;
  }[];
  text?: string;
  [key: string]: unknown;
};

type TEditorSchema = JSONContent;

export type { TEditorSchema, JSONContent };
