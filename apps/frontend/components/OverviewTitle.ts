import { gidr } from '../utils/dom/node';
import { setTestId } from '../utils/dom/testId';

type TOptions = {
  id: string;
  title: string;
};

type TReturnOverviewTitle = {
  element: HTMLDivElement;
};

const OverviewTitle = (opts: TOptions): TReturnOverviewTitle => {
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('overview-title');
  titleDiv.innerText = opts.title;

  titleDiv.id = opts.id;
  setTestId(titleDiv, opts.id);

  return {
    element: titleDiv,
  };
};

const updateOverviewTitle = (id: string, newTitle: string): void => {
  const titleElement = gidr(id);

  if (titleElement) {
    titleElement.innerText = newTitle;
  }
};

export type { TOptions as TOverviewTitleOptions, TReturnOverviewTitle };

export { OverviewTitle, updateOverviewTitle };
