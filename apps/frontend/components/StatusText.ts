import { buildError } from '../helpers/error/build';
import { setTestId } from '../utils/dom/testId';
import { FlatIcon, FlatIconName } from './FlatIcon';

const StatusTextType = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const;

type TStatusTextType = (typeof StatusTextType)[keyof typeof StatusTextType];

type TOptions = {
  id: string;
  text: string;
  type: TStatusTextType;
  isIconVisible: boolean;
};

type TReturnStatusText = {
  element: HTMLDivElement;
};

const StatusText = (opts: TOptions): TReturnStatusText => {
  const containerDiv = document.createElement('div');
  const iconSpan = document.createElement('span');
  const textSpan = document.createElement('span');

  containerDiv.classList.add(
    'status-text',
    `status-text--${opts.type.toLowerCase()}`,
  );

  iconSpan.classList.add('status-text__icon');
  textSpan.classList.add('status-text__text');

  containerDiv.append(iconSpan, textSpan);

  if (opts.isIconVisible) {
    let icon: Element | undefined;
    switch (opts.type) {
      case StatusTextType.SUCCESS:
        icon = FlatIcon(FlatIconName._14_CIRCLE_CHECK);
        break;

      case StatusTextType.ERROR:
        icon = FlatIcon(FlatIconName._14_CIRCLE_ERROR);
        break;

      default:
        throw new Error(buildError(`invalid icon type '${opts.type}' passed`));
    }

    iconSpan.appendChild(icon);
  } else {
    iconSpan.remove();
  }

  containerDiv.id = opts.id;
  textSpan.textContent = opts.text;

  setTestId(containerDiv, opts.id);

  return {
    element: containerDiv,
  };
};

export type { TOptions as TStatusTextOptions, TReturnStatusText };

export { StatusText };
