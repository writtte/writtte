import {
  ErrorMessage,
  type TErrorMessageOptions,
} from '../components/ErrorMessage';

type TReturnErrorMessageController = {
  showError: (props: TErrorMessageOptions) => void;
  hideError: () => void;
  getCurrentError: () => TErrorMessageOptions | null;
};

const ErrorMessageController = (): TReturnErrorMessageController => {
  let currentError: TErrorMessageOptions | null = null;
  let errorElement: HTMLElement | null = null;
  let containerDiv: HTMLDivElement | null = null;

  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div') as HTMLDivElement;
      containerDiv.id = 'global-error-container';
      containerDiv.classList.add('global-error-container');

      document.body.appendChild(containerDiv);
    }
  };

  const showError = (props: TErrorMessageOptions): void => {
    ensureContainer();

    if (errorElement) {
      errorElement.remove();
    }

    currentError = props;
    errorElement = ErrorMessage(props);

    if (containerDiv) {
      containerDiv.appendChild(errorElement);
    }
  };

  const hideError = (): void => {
    if (errorElement && containerDiv) {
      errorElement.remove();
      currentError = null;
      errorElement = null;
    }
  };

  const getCurrentError = (): TErrorMessageOptions | null => currentError;

  return {
    showError,
    hideError,
    getCurrentError,
  };
};

export type { TReturnErrorMessageController };

export { ErrorMessageController };
