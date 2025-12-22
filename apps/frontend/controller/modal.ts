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

  document.addEventListener('modal:close', (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.id) {
      closeModal(customEvent.detail.id);
    }
  });

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

      if (containerDiv) {
        containerDiv.remove();
        containerDiv = null;
      }
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

    // We don't need to add a click event listener here anymore
    // since the Modal component will emit a custom event that
    // this controller listens for

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
