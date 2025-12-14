type TOptions = {
  placeholderSvg: HTMLElement;
  title: string;
  description: string;
};

type TReturnItemListPlaceholder = {
  element: HTMLDivElement;
};

const ItemListPlaceholder = (opts: TOptions): TReturnItemListPlaceholder => {
  const placeholderDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const svgDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const descriptionDiv = document.createElement('div');

  placeholderDiv.classList.add('item-folder-placeholder');
  containerDiv.classList.add('item-folder-placeholder__container');
  svgDiv.classList.add('item-folder-placeholder__svg');
  contentDiv.classList.add('item-folder-placeholder__content');
  titleDiv.classList.add('item-folder-placeholder__title');
  descriptionDiv.classList.add('item-folder-placeholder__description');

  svgDiv.appendChild(opts.placeholderSvg);
  contentDiv.append(titleDiv, descriptionDiv);
  containerDiv.append(svgDiv, contentDiv);
  placeholderDiv.appendChild(containerDiv);

  titleDiv.textContent = opts.title;
  descriptionDiv.textContent = opts.description;

  return {
    element: placeholderDiv,
  };
};

export type {
  TOptions as TItemListPlaceholderOptions,
  TReturnItemListPlaceholder,
};

export { ItemListPlaceholder };
