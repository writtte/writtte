import {
  FeedbackModal,
  type TFeedbackModalOptions,
  type TReturnFeedbackModal,
} from '../components/FeedbackModal';
import { removeWhenRouteChange } from '../utils/ui/removeWhenRouteChange';

type TInternalFeedbackModal = {
  id: string;
  props: TFeedbackModalOptions;
  modalReturn: TReturnFeedbackModal;
  createdAt: number;
};

type TReturnFeedbackModalController = {
  showModal: (props: TFeedbackModalOptions) => TReturnFeedbackModal;
  closeModal: (id: string) => void;
  getModal: () => TInternalFeedbackModal | undefined;
  getModalById: (id: string) => TReturnFeedbackModal | undefined;
};

var currentModal: TInternalFeedbackModal | null = null;

var containerDiv: HTMLDivElement | null = null;

const FeedbackModalController = (): TReturnFeedbackModalController => {
  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
      containerDiv.id = 'feedback-modal-container';
      containerDiv.classList.add('feedback-modal-container');

      document.body.appendChild(containerDiv);

      removeWhenRouteChange(containerDiv, {
        enabled: true,
        animationDuration: 300,
        onBeforeRemove: () => {
          if (containerDiv) {
            containerDiv.classList.add('feedback-modal-container--closing');
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
        containerDiv.classList.add('feedback-modal-container--closing');
        setTimeout(() => {
          currentModal?.modalReturn.element.remove();
          currentModal = null;

          if (containerDiv) {
            containerDiv.classList.remove('feedback-modal-container--closing');
            containerDiv.style.display = 'none';
          }
        }, 300);
      } else {
        currentModal.modalReturn.element.remove();
        currentModal = null;
      }
    }
  };

  const showModal = (props: TFeedbackModalOptions): TReturnFeedbackModal => {
    if (currentModal) {
      currentModal.modalReturn.element.remove();
      currentModal = null;
    }

    ensureContainer();

    if (containerDiv) {
      containerDiv.style.display = '';
    }

    const modalProps: TFeedbackModalOptions = {
      ...props,
    };

    const modalReturn = FeedbackModal(modalProps);

    const modalObj: TInternalFeedbackModal = {
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

  const getModal = (): TInternalFeedbackModal | undefined =>
    currentModal ?? undefined;

  const getModalById = (id: string): TReturnFeedbackModal | undefined => {
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

export type { TReturnFeedbackModalController, TInternalFeedbackModal };

export { FeedbackModalController };
