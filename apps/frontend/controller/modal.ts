import {
  Modal,
  type TModalOptions,
  type TReturnModal,
} from '../components/Modal';

type TInternalModal = {
  id: string;
  props: TModalOptions;
  modalReturn: TReturnModal;
  createdAt: number;
};

type TReturnModalController = {
  showModal: (opts: TModalOptions) => TReturnModal;
  closeModal: (id: string) => void;
  getModals: () => TInternalModal[];
  getModalById: (id: string) => TReturnModal | undefined;
};

// This `modals` variable holds all the modals on the pages

var modals: TInternalModal[] = [];

var containerDiv: HTMLDivElement | null = null;

const ModalController = (): TReturnModalController => {
  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
      containerDiv.id = 'modal-container';
      containerDiv.classList.add('modal-container');

      document.body.appendChild(containerDiv);
    }
  };

  const closeModal = (id: string): void => {
    const modalToClose = modals.find((m) => m.id === id);
    if (modalToClose) {
      modalToClose.modalReturn.element.remove();
      const newModals: TInternalModal[] = [];

      for (let i = 0; i < modals.length; i++) {
        if (modals[i].id !== id) {
          newModals.push(modals[i]);
        }
      }

      modals = newModals;
    }
  };

  const showModal = (props: TModalOptions): TReturnModal => {
    const existingModal = modals.find((m) => m.id === props.id);
    if (existingModal) {
      return existingModal.modalReturn;
    }

    ensureContainer();

    const modalProps: TModalOptions = {
      ...props,
    };

    const modalReturn = Modal(modalProps);

    const modalObj: TInternalModal = {
      id: props.id,
      props: modalProps,
      modalReturn,
      createdAt: Date.now(),
    };

    modals.push(modalObj);

    if (containerDiv) {
      containerDiv.appendChild(modalReturn.element);
    }

    const closeButton = modalReturn.element.querySelector(
      '.modal__close-button',
    );

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        closeModal(props.id);
      });
    }

    return modalReturn;
  };

  const getModalById = (id: string): TReturnModal | undefined => {
    const modal = modals.find((m) => m.id === id);
    return modal?.modalReturn;
  };

  return {
    showModal,
    closeModal,
    getModals: () => [...modals],
    getModalById,
  };
};

export { ModalController };
