import {
  SettingsModal,
  type TInternalSettingsModal,
  type TReturnSettingsModal,
  type TSettingsModalProps,
} from '../components/SettingsModal';

type TReturnSettingsModalController = {
  showModal: (props: TSettingsModalProps) => TReturnSettingsModal;
  closeModal: (id: string) => void;
  getModal: () => TInternalSettingsModal | undefined;
  getModalById: (id: string) => TReturnSettingsModal | undefined;
};

var currentModal: TInternalSettingsModal | null = null;

var containerDiv: HTMLDivElement | null = null;

const SettingsModalController = (): TReturnSettingsModalController => {
  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
      containerDiv.id = 'settings-modal-container';
      containerDiv.classList.add('settings-modal-container');

      document.body.appendChild(containerDiv);
    }
  };

  const closeModal = (id: string): void => {
    if (currentModal && currentModal.id === id) {
      currentModal.modalReturn.element.remove();
      currentModal = null;
    }
  };

  const showModal = (props: TSettingsModalProps): TReturnSettingsModal => {
    if (currentModal) {
      currentModal.modalReturn.element.remove();
      currentModal = null;
    }

    ensureContainer();

    const modalProps: TSettingsModalProps = {
      ...props,
    };

    const modalReturn = SettingsModal(modalProps);

    const modalObj: TInternalSettingsModal = {
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

    return modalReturn;
  };

  const getModalById = (id: string): TReturnSettingsModal | undefined => {
    if (currentModal?.id === id) {
      return currentModal.modalReturn;
    }

    return;
  };

  return {
    showModal,
    closeModal,
    getModal(): TInternalSettingsModal | undefined {
      return currentModal ?? undefined;
    },
    getModalById,
  };
};

export { SettingsModalController };
