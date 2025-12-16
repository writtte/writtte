// biome-ignore-all lint/correctness/noUnusedFunctionParameters: Need to disable this rule temporary

import type { TEditorAPI } from './api';

type TOptions = {
  element: HTMLDivElement;
};

const VelovraEditor = (opts: TOptions): TEditorAPI => {
  const setContent = (content: string): void => {
    return;
  };

  const replaceContent = (content: string): string | undefined => {
    return;
  };

  return {
    setContent,
    replaceContent,
  };
};

export type { TOptions as TVelovraEditorOptions };

export { VelovraEditor };
