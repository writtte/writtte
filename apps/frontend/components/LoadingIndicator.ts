import { FlatIcon, FlatIconName } from './FlatIcon';

type TOptions = {
  id: string;
  text: string | undefined;
  animatedIcon: HTMLElement;
  shouldHideLogoInOverlay: boolean;
  isOverlay: boolean;
};

type TReturnLoadingIndicator = {
  element: HTMLDivElement;
};

const LoadingIndicator = (opts: TOptions): TReturnLoadingIndicator => {
  const overlayDiv = document.createElement('div');
  const logoDiv = document.createElement('div');
  const indicatorDiv = document.createElement('div');
  const spinnerSpan = document.createElement('span');
  const textSpan = document.createElement('span');

  overlayDiv.classList.add('loading-indicator-overlay');
  logoDiv.classList.add('loading-indicator-logo');
  indicatorDiv.classList.add('loading-indicator');
  spinnerSpan.classList.add('loading-indicator__spinner');
  textSpan.classList.add('loading-indicator__text');

  logoDiv.appendChild(FlatIcon(FlatIconName._26_WRITTTE_LOGO));
  spinnerSpan.appendChild(opts.animatedIcon);
  indicatorDiv.append(spinnerSpan, textSpan);

  if (opts.text) {
    textSpan.textContent = opts.text;
  } else {
    textSpan.remove();
  }

  if (!opts.isOverlay) {
    overlayDiv.remove();
    logoDiv.remove();

    return {
      element: indicatorDiv,
    };
  }

  overlayDiv.append(logoDiv, indicatorDiv);

  if (opts.shouldHideLogoInOverlay) {
    logoDiv.remove();
  }

  return {
    element: overlayDiv,
  };
};

export type { TOptions as TLoadingIndicatorOptions, TReturnLoadingIndicator };

export { LoadingIndicator };
