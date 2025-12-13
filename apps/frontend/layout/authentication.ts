import { AuthenticationHeader } from '../components/AuthenticationHeader';

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

  layoutDiv.classList.add('authentication-layout');
  containerDiv.classList.add('authentication-layout__container');

  containerDiv.append(AuthenticationHeader().element, content);
  layoutDiv.appendChild(containerDiv);

  return layoutDiv;
};

export { AuthenticationLayout };
