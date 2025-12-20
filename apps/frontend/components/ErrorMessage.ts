import { FlatIcon, FlatIconName } from './FlatIcon';

type TOptions = {
  title: string;
  description: string;
};

const ErrorMessage = (opts: TOptions): HTMLElement => {
  const overlayDiv = document.createElement('div');
  const logoDiv = document.createElement('div');
  const messageDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const descriptionDiv = document.createElement('div');

  overlayDiv.classList.add('error-message-overlay');
  logoDiv.classList.add('error-message-logo');
  messageDiv.classList.add('error-message');
  titleDiv.classList.add('error-message__title');
  descriptionDiv.classList.add('error-message__description');

  logoDiv.appendChild(FlatIcon(FlatIconName._26_WRITTTE_LOGO));
  messageDiv.append(titleDiv, descriptionDiv);
  overlayDiv.append(logoDiv, messageDiv);

  titleDiv.textContent = opts.title;
  descriptionDiv.textContent = opts.description;

  return messageDiv;
};

export type { TOptions as TErrorMessageOptions };

export { ErrorMessage };
