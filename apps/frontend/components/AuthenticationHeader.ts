import { FlatIcon, FlatIconName } from './FlatIcon';

type TReturnAuthenticationHeader = {
  element: HTMLDivElement;
};

const AuthenticationHeader = (): TReturnAuthenticationHeader => {
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('authentication-header');
  headerDiv.appendChild(FlatIcon(FlatIconName._26_VELOVRA));

  return {
    element: headerDiv,
  };
};

export type { TReturnAuthenticationHeader };

export { AuthenticationHeader };
