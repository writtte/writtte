import { setTestId } from '../utils/dom/testId';
import { FlatIcon, FlatIconName } from './FlatIcon';

type TOptions = {
  id: string;
  title: string;
  description: string | HTMLElement;
};

type TReturnAlert = {
  element: HTMLDivElement;
};

const Alert = (opts: TOptions): TReturnAlert => {
  const alertDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const descriptionDiv = document.createElement('div');
  const closeButton = document.createElement('button');

  alertDiv.classList.add('alert');
  contentDiv.classList.add('alert__content');
  titleDiv.classList.add('alert__title');
  descriptionDiv.classList.add('alert__description');
  closeButton.classList.add('alert__close-button');

  closeButton.appendChild(FlatIcon(FlatIconName._SAMPLE_CIRCLE));
  contentDiv.append(titleDiv, descriptionDiv);
  alertDiv.append(contentDiv, closeButton);

  titleDiv.textContent = opts.title;

  if (typeof opts.description === 'string') {
    descriptionDiv.textContent = opts.description;
  } else {
    descriptionDiv.appendChild(opts.description);
  }

  alertDiv.id = opts.id;
  setTestId(alertDiv, opts.id);

  setTestId(closeButton, `${opts.id}-close-button`);

  closeButton.addEventListener('click', (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    alertDiv.dispatchEvent(new CustomEvent('alertRemove'));
  });

  return {
    element: alertDiv,
  };
};

export type { TOptions as TAlertOptions, TReturnAlert };

export { Alert };
