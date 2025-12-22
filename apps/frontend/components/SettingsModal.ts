import { CloseButton } from './CloseButton';
import {
  SettingsSection,
  type TReturnSettingsSection,
  type TSettingsSectionOptions,
} from './SettingsSection';

type TOptions = {
  id: string;
  title: string;
  sections: (TSettingsSectionOptions & {
    isVisible: boolean;
  })[];
};

type TReturnSettingsModal = {
  element: HTMLDivElement;
  sections: {
    [key: string]: TReturnSettingsSection;
  };
  setSectionContent: (items: HTMLDivElement[]) => void;
};

const SettingsModal = (opts: TOptions): TReturnSettingsModal => {
  const modalDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const sectionDividerDiv = document.createElement('div');
  const sectionItemsDiv = document.createElement('div');
  const sectionContentDiv = document.createElement('div');

  modalDiv.classList.add('settings-modal');
  headerDiv.classList.add('settings-modal__header');
  titleDiv.classList.add('settings-modal__title');
  contentDiv.classList.add('settings-modal__content');
  sectionDividerDiv.classList.add('settings-modal__section-divider');
  sectionItemsDiv.classList.add('settings-modal__section-items');
  sectionContentDiv.classList.add('settings-modal__section-content');

  const closeButtonElement = CloseButton({
    id: `${opts.id}-close-button`,
    onClick: (): void => {
      modalDiv.dispatchEvent(new CustomEvent('modalClose'));
    },
  });

  headerDiv.append(titleDiv, closeButtonElement.element);
  contentDiv.append(sectionItemsDiv, sectionDividerDiv, sectionContentDiv);
  modalDiv.append(headerDiv, contentDiv);

  modalDiv.dataset.testId = opts.id;
  titleDiv.textContent = opts.title;

  const sections: {
    [key: string]: TReturnSettingsSection;
  } = {};

  for (let i = 0; i < opts.sections.length; i++) {
    const sectionProps = opts.sections[i];
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

      if (i < items.length - 1) {
        const dividerDiv = document.createElement('div');
        dividerDiv.classList.add('settings-modal__item-divider');

        sectionContentDiv.appendChild(dividerDiv);
      }
    }
  };

  return {
    element: modalDiv,
    sections,
    setSectionContent,
  };
};

export type { TOptions as TSettingsModalOptions, TReturnSettingsModal };

export { SettingsModal };
