const AuthenticationLayout = async ({
  content,
}: {
  content: HTMLElement;
}): Promise<HTMLElement> => {
  if (!(content instanceof HTMLElement)) {
    throw new Error('content should be a valid HTMLElement');
  }

  const layoutDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const pageDiv = document.createElement('div');
  const footerDiv = document.createElement('div');

  layoutDiv.classList.add('authentication-layout');
  containerDiv.classList.add('authentication-layout__container');
  headerDiv.classList.add('authentication-layout__header');
  pageDiv.classList.add('authentication-layout__page');
  footerDiv.classList.add('authentication-layout__footer');

  layoutDiv.appendChild(containerDiv);
  containerDiv.appendChild(headerDiv);
  containerDiv.appendChild(pageDiv);
  containerDiv.appendChild(footerDiv);
  pageDiv.appendChild(content);

  return layoutDiv;
};

export { AuthenticationLayout };
