type TOptions = {
  id: string;
  text: string;
  isOverlay: boolean;
};

type TReturnLoadingIndicator = {
  element: HTMLDivElement;
};

const LoadingIndicator = (opts: TOptions): TReturnLoadingIndicator => {
  const overlayDiv = document.createElement('div');
  const indicatorDiv = document.createElement('div');
  const spinnerSpan = document.createElement('span');
  const textSpan = document.createElement('span');

  overlayDiv.classList.add('loading-indicator-overlay');
  indicatorDiv.classList.add('loading-indicator');
  spinnerSpan.classList.add('loading-indicator__spinner');
  textSpan.classList.add('loading-indicator__text');

  indicatorDiv.append(spinnerSpan, textSpan);

  textSpan.textContent = opts.text;

  if (!opts.isOverlay) {
    overlayDiv.remove();

    return {
      element: indicatorDiv,
    };
  }

  overlayDiv.appendChild(indicatorDiv);

  return {
    element: overlayDiv,
  };
};

export type { TOptions as TLoadingIndicatorOptions, TReturnLoadingIndicator };

export { LoadingIndicator };
