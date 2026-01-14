import {
  type TReturnVersionModal,
  type TVersionModalOptions,
  VersionModal,
} from '../components/VersionModal';
import { removeWhenRouteChange } from '../utils/ui/removeWhenRouteChange';

type TInternalVersionModal = {
  id: string;
  props: TVersionModalOptions;
  modalReturn: TReturnVersionModal;
  createdAt: number;
};

type TReturnVersionModalController = {
  showModal: (props: TVersionModalOptions) => TReturnVersionModal;
  closeModal: (id: string) => void;
  getModal: () => TInternalVersionModal | undefined;
  getModalById: (id: string) => TReturnVersionModal | undefined;
};

var currentModal: TInternalVersionModal | null = null;

var containerDiv: HTMLDivElement | null = null;

const VersionModalController = (): TReturnVersionModalController => {
  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
      containerDiv.id = 'version-modal-container';
      containerDiv.classList.add('version-modal-container');

      document.body.appendChild(containerDiv);

      removeWhenRouteChange(containerDiv, {
        enabled: true,
        animationDuration: 300,
        onBeforeRemove: () => {
          if (containerDiv) {
            containerDiv.classList.add('version-modal-container--closing');
          }
        },
        onAfterRemove: () => {
          currentModal = null;
          containerDiv = null;
        },
      });
    }
  };

  const closeModal = (id: string): void => {
    if (currentModal && currentModal.id === id) {
      if (containerDiv) {
        containerDiv.classList.add('version-modal-container--closing');
        setTimeout(() => {
          currentModal?.modalReturn.element.remove();
          currentModal = null;

          if (containerDiv) {
            containerDiv.classList.remove('version-modal-container--closing');
            containerDiv.style.display = 'none';
          }
        }, 300);
      } else {
        currentModal.modalReturn.element.remove();
        currentModal = null;
      }
    }
  };

  const showModal = (props: TVersionModalOptions): TReturnVersionModal => {
    if (currentModal) {
      currentModal.modalReturn.element.remove();
      currentModal = null;
    }

    ensureContainer();

    if (containerDiv) {
      containerDiv.style.display = '';
    }

    const modalProps: TVersionModalOptions = {
      ...props,
    };

    const modalReturn = VersionModal(modalProps);

    const modalObj: TInternalVersionModal = {
      id: props.id,
      props: modalProps,
      modalReturn,
      createdAt: Date.now(),
    };

    currentModal = modalObj;

    if (containerDiv) {
      containerDiv.appendChild(modalReturn.element);
    }

    modalReturn.element.addEventListener('click', (e) => {
      if (e.target === modalReturn.element) {
        closeModal(props.id);
      }
    });

    modalReturn.element.addEventListener('modalClose', () => {
      closeModal(props.id);
    });

    return modalReturn;
  };

  const getModal = (): TInternalVersionModal | undefined =>
    currentModal ?? undefined;

  const getModalById = (id: string): TReturnVersionModal | undefined => {
    if (currentModal?.id === id) {
      return currentModal.modalReturn;
    }

    return;
  };

  return {
    showModal,
    closeModal,
    getModal,
    getModalById,
  };
};

export type { TInternalVersionModal };

export { VersionModalController };
