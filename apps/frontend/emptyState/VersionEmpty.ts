type TOptions = {
  title: string;
  description: string;
};

const VersionEmpty = (opts: TOptions): HTMLElement => {
  const emptyStateDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const descriptionDiv = document.createElement('div');

  emptyStateDiv.classList.add('version-empty-empty-state');
  containerDiv.classList.add('version-empty-empty-state__container');
  titleDiv.classList.add('version-empty-empty-state__title');
  descriptionDiv.classList.add('version-empty-empty-state__description');

  titleDiv.textContent = opts.title;
  descriptionDiv.textContent = opts.description;

  containerDiv.append(titleDiv, descriptionDiv);
  emptyStateDiv.appendChild(containerDiv);

  return emptyStateDiv;
};

export type { TOptions as TVersionEmptyOptions };

export { VersionEmpty };
