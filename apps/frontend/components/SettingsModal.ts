import {
  Button,
  ButtonAction,
  ButtonSize,
  type TButtonOptions,
} from './Button';
import {
  SettingsSection,
  type TReturnSettingsSection,
  type TSettingsSectionOptions,
} from './SettingsSection';

type TProps = {
  id: string;
  title: string;
  sections: (TSettingsSectionOptions & {
    isVisible: boolean;
  })[];
  buttons: Pick<
    TButtonOptions,
    'id' | 'text' | 'leftIcon' | 'color' | 'onClick'
  >[];
};

type TReturnSettingsModal = {
  element: HTMLDivElement;
  sections: {
    [key: string]: TReturnSettingsSection;
  };
  setSectionContent: (items: HTMLDivElement[]) => void;
};

type TInternalSettingsModal = {
  id: string;
  props: TProps;
  modalReturn: TReturnSettingsModal;
  createdAt: number;
};

type TReturnSettingsModalManager = {
  showModal: (props: TProps) => TReturnSettingsModal;
  closeModal: (id: string) => void;
  getModals: () => TInternalSettingsModal[];
  getModalById: (id: string) => TReturnSettingsModal | undefined;
};

let settingsModals: TInternalSettingsModal[] = [];

const SettingsModal = (props: TProps): TReturnSettingsModal => {
  const overlayDiv = document.createElement('div');
  const modalDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const sectionsDiv = document.createElement('div');
  const sectionItemsDiv = document.createElement('div');
  const sectionContentDiv = document.createElement('div');
  const footerDiv = document.createElement('div');

  overlayDiv.classList.add('settings-modal-overlay');
  modalDiv.classList.add('settings-modal');
  headerDiv.classList.add('settings-modal__header');
  titleDiv.classList.add('settings-modal__title');
  sectionsDiv.classList.add('settings-modal__content');
  sectionItemsDiv.classList.add('settings-modal__content');
  sectionContentDiv.classList.add('settings-modal__content');
  footerDiv.classList.add('settings-modal__footer');

  headerDiv.appendChild(titleDiv);
  sectionsDiv.append(sectionItemsDiv, sectionContentDiv);
  modalDiv.append(headerDiv, sectionsDiv, footerDiv);
  overlayDiv.appendChild(modalDiv);

  modalDiv.dataset.testId = props.id;
  titleDiv.textContent = props.title;

  for (let i = 0; i < props.buttons.length; i++) {
    const buttonElement = Button({
      ...props.buttons[i],
      loadingText: undefined,
      rightIcon: undefined,
      action: ButtonAction.BUTTON,
      size: ButtonSize.SMALL,
      isFullWidth: false,
    });

    footerDiv.appendChild(buttonElement.element);
  }

  const sections: {
    [key: string]: TReturnSettingsSection;
  } = {};

  for (let i = 0; i < props.sections.length; i++) {
    const sectionProps = props.sections[i];
    if (sectionProps.isVisible === false) {
      continue;
    }

    const section = SettingsSection(sectionProps);
    sectionItemsDiv.appendChild(section.element);
    sections[sectionProps.id] = section;
  }

  // Don’t set a section’s content directly; always use
  // the `setSectionContent` function when loading the settings
  // modal.

  const setSectionContent = (items: HTMLDivElement[]): void => {
    sectionContentDiv.innerHTML = '';

    for (let i = 0; i < items.length; i++) {
      sectionContentDiv.appendChild(items[i]);
    }
  };

  return {
    element: overlayDiv,
    sections,
    setSectionContent,
  };
};

const SettingsModalManager = (): TReturnSettingsModalManager => {
  let containerDiv: HTMLDivElement | null = null;

  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
      containerDiv.id = 'settings-modal-container';
      containerDiv.classList.add('settings-modal-container');
      document.body.appendChild(containerDiv);
    }
  };

  const closeModal = (id: string): void => {
    const modalToClose = settingsModals.find((m) => m.id === id);
    if (modalToClose) {
      modalToClose.modalReturn.element.remove();
      settingsModals = settingsModals.filter((m) => m.id !== id);
    }
  };

  const showModal = (props: TProps): TReturnSettingsModal => {
    const existingModal = settingsModals.find((m) => m.id === props.id);
    if (existingModal) {
      return existingModal.modalReturn;
    }

    ensureContainer();

    const modalProps: TProps = {
      ...props,
    };

    const modalReturn = SettingsModal(modalProps);

    const modalObj: TInternalSettingsModal = {
      id: props.id,
      props: modalProps,
      modalReturn,
      createdAt: Date.now(),
    };

    settingsModals.push(modalObj);

    if (containerDiv) {
      containerDiv.appendChild(modalReturn.element);
    }

    return modalReturn;
  };

  const getModalById = (id: string): TReturnSettingsModal | undefined => {
    const modal = settingsModals.find((m) => m.id === id);
    return modal?.modalReturn;
  };

  return {
    showModal,
    closeModal,
    getModals: () => [...settingsModals],
    getModalById,
  };
};

export type {
  TProps as TSettingsModalProps,
  TReturnSettingsModal,
  TInternalSettingsModal,
  TReturnSettingsModalManager,
};

export { SettingsModal, SettingsModalManager };
