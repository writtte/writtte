import {
  StyleChangeModal,
  type TReturnStyleChangeModal,
  type TStyleChangeModalOptions,
} from '../components/StyleChangeModal';
import { removeWhenRouteChange } from '../utils/ui/removeWhenRouteChange';

type TInternalSettingsModal = {
  id: string;
  props: TStyleChangeModalOptions;
  modalReturn: TReturnStyleChangeModal;
  createdAt: number;
};

type TReturnStyleChangeModalController = {
  showModal: (props: TStyleChangeModalOptions) => TReturnStyleChangeModal;
  closeModal: (id: string) => void;
  getModal: () => TInternalSettingsModal | undefined;
  getModalById: (id: string) => TReturnStyleChangeModal | undefined;
};

var currentModal: TInternalSettingsModal | null = null;

var containerDiv: HTMLDivElement | null = null;

const StyleChangeModalController = (): TReturnStyleChangeModalController => {
  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
      containerDiv.id = 'style-change-modal-container';
      containerDiv.classList.add('style-change-modal-container');

      document.body.appendChild(containerDiv);

      removeWhenRouteChange(containerDiv, {
        enabled: true,
        animationDuration: 300,
        onBeforeRemove: () => {
          if (containerDiv) {
            containerDiv.classList.add('style-change-modal-container--closing');
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
        containerDiv.classList.add('style-change-modal-container--closing');
        setTimeout(() => {
          currentModal?.modalReturn.element.remove();
          currentModal = null;

          if (containerDiv) {
            containerDiv.classList.remove(
              'style-change-modal-container--closing',
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
    props: TStyleChangeModalOptions,
  ): TReturnStyleChangeModal => {
    if (currentModal) {
      currentModal.modalReturn.element.remove();
      currentModal = null;
    }

    ensureContainer();

    if (containerDiv) {
      containerDiv.style.display = '';
    }

    const modalProps: TStyleChangeModalOptions = {
      ...props,
    };

    const modalReturn = StyleChangeModal(modalProps);

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

    modalReturn.element.addEventListener('modalClose', () => {
      closeModal(props.id);
    });

    return modalReturn;
  };

  const getModal = (): TInternalSettingsModal | undefined =>
    currentModal ?? undefined;

  const getModalById = (id: string): TReturnStyleChangeModal | undefined => {
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

export type { TReturnStyleChangeModalController, TInternalSettingsModal };

export { StyleChangeModalController };
