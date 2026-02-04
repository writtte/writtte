import { type TToastOptions, Toast } from '../components/Toast';
import { removeWhenRouteChange } from '../utils/ui/removeWhenRouteChange';

type TInternalToast = {
  id: string;
  props: TToastOptions;
  createdAt: number;
};

type TReturnToastController = {
  showToast: (props: TToastOptions, autoDismissMs: number) => void;
  closeToast: (id: string) => void;
  getToasts: () => TInternalToast[];
};

// This `toasts` variable holds all the toasts on the pages

var toasts: TInternalToast[] = [];

var containerDiv: HTMLDivElement | null = null;

const ToastController = (): TReturnToastController => {
  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
      containerDiv.id = 'toast-container';

      containerDiv.classList.add('toast-container');
      document.body.appendChild(containerDiv);

      removeWhenRouteChange(containerDiv, {
        enabled: true,
        animationDuration: 0,
        onAfterRemove: () => {
          toasts = [];
          containerDiv = null;
        },
      });
    }
  };

  const showToast = (props: TToastOptions, autoDismissMs: number): void => {
    ensureContainer();

    const toastObj: TInternalToast = {
      id: props.id,
      createdAt: Date.now(),
      props: {
        ...props,
      },
    };

    toasts.push(toastObj);

    const toastNode: HTMLDivElement = Toast(toastObj.props).element;

    toastNode.addEventListener('toastRemove', () => {
      toastNode.remove();
    });

    if (containerDiv) {
      containerDiv.appendChild(toastNode);
    }

    if (autoDismissMs > 0) {
      setTimeout(() => {
        const stillExists = toasts.some((t) => t.id === props.id);
        if (stillExists) {
          closeToast(props.id);
        }
      }, autoDismissMs);
    }
  };

  const closeToast = (id: string): void => {
    toasts = toasts.filter((t) => t.id !== id);

    const toastElements = containerDiv?.querySelectorAll<HTMLElement>(
      `[id="${id}"]`,
    );

    if (toastElements) {
      toastElements.forEach((element) => {
        element.classList.add('toast--closing');
        setTimeout(() => {
          element.dispatchEvent(new CustomEvent('toastRemove'));
        }, 300);
      });
    }
  };

  return {
    showToast,
    closeToast,
    getToasts: () => [...toasts],
  };
};

export type { TInternalToast, TReturnToastController };

export { ToastController };
