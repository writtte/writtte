type TOptions = {
  title: string;
};

type TReturnOverviewTitle = {
  element: HTMLDivElement;
};

const OverviewTitle = (opts: TOptions): TReturnOverviewTitle => {
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('overview-title');
  titleDiv.innerText = opts.title;

  return {
    element: titleDiv,
  };
};

export type { TOptions as TOverviewTitleOptions, TReturnOverviewTitle };

export { OverviewTitle };
