import { setTestId } from '../utils/dom/testId';

type TOptions = {
  id: string;
  text: string;
};

type TReturnEditorUploadLoadingIndicator = {
  element: HTMLDivElement;
};

const EditorUploadLoadingIndicator = (
  opts: TOptions,
): TReturnEditorUploadLoadingIndicator => {
  const indicatorDiv = document.createElement('div');
  const animatedSvgDiv = document.createElement('div');
  const textDiv = document.createElement('div');

  textDiv.textContent = opts.text;
  indicatorDiv.append(animatedSvgDiv, textDiv);

  setTestId(indicatorDiv, opts.id);

  return {
    element: indicatorDiv,
  };
};

export type {
  TOptions as TEditorUploadLoadingIndicatorOptions,
  TReturnEditorUploadLoadingIndicator,
};

export { EditorUploadLoadingIndicator };
