import { setTestId } from '../utils/dom/testId';

type TOptions = {
  id: string;
  text: string | undefined;
};

type TReturnEditorNodeLoadingIndicator = {
  element: HTMLDivElement;
};

const EditorNodeLoadingIndicator = (
  opts: TOptions,
): TReturnEditorNodeLoadingIndicator => {
  const indicatorDiv = document.createElement('div');
  const animatedSvgDiv = document.createElement('div');
  const textDiv = document.createElement('div');

  if (opts.text !== undefined) {
    textDiv.textContent = opts.text;
  } else {
    textDiv.remove();
  }

  indicatorDiv.append(animatedSvgDiv, textDiv);

  setTestId(indicatorDiv, opts.id);

  return {
    element: indicatorDiv,
  };
};

export type {
  TOptions as TEditorNodeLoadingIndicatorOptions,
  TReturnEditorNodeLoadingIndicator,
};

export { EditorNodeLoadingIndicator };
