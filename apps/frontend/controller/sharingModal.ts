import {
  SharingModal,
  type TReturnSharingModal,
  type TSharingModalOptions,
} from '../components/SharingModal';
import { removeWhenRouteChange } from '../utils/ui/removeWhenRouteChange';

type TInternalSharingModal = {
  id: string;
  props: TSharingModalOptions;
  modalReturn: TReturnSharingModal;
  createdAt: number;
};

type TReturnSharingModalController = {
  showModal: (props: TSharingModalOptions) => TReturnSharingModal;
  closeModal: (id: string) => void;
  getModal: () => TInternalSharingModal | undefined;
  getModalById: (id: string) => TReturnSharingModal | undefined;
};

var currentModal: TInternalSharingModal | null = null;

var containerDiv: HTMLDivElement | null = null;

const SharingModalController = (): TReturnSharingModalController => {
  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
      containerDiv.id = 'sharing-modal-container';
      containerDiv.classList.add('sharing-modal-container');

      document.body.appendChild(containerDiv);

      removeWhenRouteChange(containerDiv, {
        enabled: true,
        animationDuration: 300,
        onBeforeRemove: () => {
          if (containerDiv) {
            containerDiv.classList.add('sharing-modal-container--closing');
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
        containerDiv.classList.add('sharing-modal-container--closing');

        setTimeout(() => {
          currentModal?.modalReturn.element.remove();
          currentModal = null;

          if (containerDiv) {
            containerDiv.classList.remove('sharing-modal-container--closing');
            containerDiv.remove();
            containerDiv = null;
          }
        }, 300);
      } else {
        currentModal.modalReturn.element.remove();
        currentModal = null;
      }
    }
  };

  const showModal = (props: TSharingModalOptions): TReturnSharingModal => {
    if (currentModal) {
      currentModal.modalReturn.element.remove();
      currentModal = null;
    }

    ensureContainer();

    const modalProps: TSharingModalOptions = {
      ...props,
    };

    const modalReturn = SharingModal(modalProps);

    const modalObj: TInternalSharingModal = {
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

  const getModal = (): TInternalSharingModal | undefined =>
    currentModal ?? undefined;

  const getModalById = (id: string): TReturnSharingModal | undefined => {
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

export type { TInternalSharingModal };

export { SharingModalController };
