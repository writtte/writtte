import {
  AppearanceModal,
  type TAppearanceModalOptions,
  type TReturnAppearanceModal,
} from '../components/AppearanceModal';

type TInternalAppearanceModal = {
  id: string;
  props: TAppearanceModalOptions;
  modalReturn: TReturnAppearanceModal;
  createdAt: number;
};

type TReturnAppearanceModalController = {
  showModal: (props: TAppearanceModalOptions) => TReturnAppearanceModal;
  closeModal: (id: string) => void;
  getModal: () => TInternalAppearanceModal | undefined;
  getModalById: (id: string) => TReturnAppearanceModal | undefined;
};

var currentModal: TInternalAppearanceModal | null = null;

var containerDiv: HTMLDivElement | null = null;

const AppearanceModalController = (): TReturnAppearanceModalController => {
  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
      containerDiv.id = 'appearance-modal-container';
      containerDiv.classList.add('appearance-modal-container');

      document.body.appendChild(containerDiv);
    }
  };

  const closeModal = (id: string): void => {
    if (currentModal && currentModal.id === id) {
      if (containerDiv) {
        containerDiv.classList.add('appearance-modal-container--closing');
        setTimeout(() => {
          currentModal?.modalReturn.element.remove();
          currentModal = null;

          if (containerDiv) {
            containerDiv.classList.remove(
              'appearance-modal-container--closing',
            );

            containerDiv.style.display = 'none';
          }
        }, 300);
      } else {
        currentModal.modalReturn.element.remove();
        currentModal = null;
      }
    }
  };

  const showModal = (
    props: TAppearanceModalOptions,
  ): TReturnAppearanceModal => {
    if (currentModal) {
      currentModal.modalReturn.element.remove();
      currentModal = null;
    }

    ensureContainer();

    if (containerDiv) {
      containerDiv.style.display = '';
    }

    const modalProps: TAppearanceModalOptions = {
      ...props,
    };

    const modalReturn = AppearanceModal(modalProps);

    const modalObj: TInternalAppearanceModal = {
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

  const getModal = (): TInternalAppearanceModal | undefined =>
    currentModal ?? undefined;

  const getModalById = (id: string): TReturnAppearanceModal | undefined => {
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

export type { TInternalAppearanceModal };

export { AppearanceModalController };
