type TOptions = {
  title: string;
  description: string;
};

const ErrorMessage = (opts: TOptions): HTMLElement => {
  const containerDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const descriptionDiv = document.createElement('div');

  containerDiv.classList.add('error-message');
  titleDiv.classList.add('error-message__title');
  descriptionDiv.classList.add('error-message__description');

  containerDiv.append(titleDiv, descriptionDiv);

  titleDiv.textContent = opts.title;
  descriptionDiv.textContent = opts.description;

  return containerDiv;
};

export type { TOptions as TNotFoundOptions };

export { ErrorMessage };
