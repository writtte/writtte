import { setTestId } from '../utils/dom/testId';
import { CloseButton } from './CloseButton';

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

  alertDiv.classList.add('alert');
  contentDiv.classList.add('alert__content');
  titleDiv.classList.add('alert__title');
  descriptionDiv.classList.add('alert__description');

  const closeButtonElement = CloseButton({
    id: `${opts.id}-close-button`,
    onClick: (): void => {
      alertDiv.classList.add('alert--closing');
      setTimeout(() => {
        alertDiv.dispatchEvent(new CustomEvent('alertRemove'));
      }, 300);
    },
  });

  contentDiv.append(titleDiv, descriptionDiv);
  alertDiv.append(contentDiv, closeButtonElement.element);

  titleDiv.textContent = opts.title;

  if (typeof opts.description === 'string') {
    descriptionDiv.textContent = opts.description;
  } else {
    descriptionDiv.appendChild(opts.description);
  }

  alertDiv.id = opts.id;
  setTestId(alertDiv, opts.id);

  return {
    element: alertDiv,
  };
};

export type { TOptions as TAlertOptions, TReturnAlert };

export { Alert };
