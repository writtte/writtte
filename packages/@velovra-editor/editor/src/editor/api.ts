type TEditorAPI = {
  setContent: (content: string) => void;
  replaceContent: (content: string) => string | undefined;
};

export type { TEditorAPI };
