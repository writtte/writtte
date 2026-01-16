import { setTestId } from '../utils/dom/testId';
import { AnimatedIcon, AnimatedIconName } from './AnimatedIcon';
import { CloseButton } from './CloseButton';
import { FlatIcon, FlatIconName } from './FlatIcon';
import { LoadingIndicator } from './LoadingIndicator';

type TSharingItem = {
  id: string;
  text: string;
  onClick: () => void;
  onCopy: () => void;
  onDelete: () => void;
};

type TOptions = {
  id: string;
  title: string;
  onLinkCreate: () => void;
};

type TReturnSharingModal = {
  element: HTMLDivElement;
  setLinkCreateButtonLoadingState: (isLoading: boolean) => void;
  addItem: (item: TSharingItem) => void;
  addItems: (items: TSharingItem[]) => void;
  removeItem: (id: string) => void;
  removeItemListContent: () => void;
  setItemListLoading: (id: string) => void;
  setAnalyticsContentLoading: (id: string) => void;
  setItemListContent: (content: HTMLElement) => void;
  setAnalyticsContent: (content: HTMLElement) => void;
};

const SharingModal = (opts: TOptions): TReturnSharingModal => {
  const modalDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const logoDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const titleButtonsDiv = document.createElement('div');
  const newSharingButton = document.createElement('button');
  const containerDiv = document.createElement('div');
  const itemListDiv = document.createElement('div');
  const analyticsDiv = document.createElement('div');

  modalDiv.classList.add('sharing-modal');
  headerDiv.classList.add('sharing-modal__header');
  logoDiv.classList.add('sharing-modal__logo');
  titleDiv.classList.add('sharing-modal__title');
  titleButtonsDiv.classList.add('sharing-modal__title-buttons');
  newSharingButton.classList.add('sharing-modal__new-sharing-button');
  containerDiv.classList.add('sharing-modal__container');
  itemListDiv.classList.add('sharing-modal__item-list', 'v-scrollbar');
  analyticsDiv.classList.add('sharing-modal__analytics');

  newSharingButton.addEventListener('click', (e: PointerEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    opts.onLinkCreate();
  });

  const closeButtonElement = CloseButton({
    id: `${opts.id}-close-button`,
    onClick: (): void => {
      modalDiv.dispatchEvent(new CustomEvent('modalClose'));
    },
  });

  logoDiv.appendChild(FlatIcon(FlatIconName._18_WRITTTE_LOGO));
  newSharingButton.appendChild(FlatIcon(FlatIconName._18_CIRCLE_PLUS));
  titleButtonsDiv.append(newSharingButton, closeButtonElement.element);
  headerDiv.append(logoDiv, titleDiv, titleButtonsDiv);
  containerDiv.append(itemListDiv, analyticsDiv);
  modalDiv.append(headerDiv, containerDiv);

  modalDiv.dataset.testId = opts.id;
  titleDiv.textContent = opts.title;

  const setLinkCreateButtonLoadingState = (isLoading: boolean): void => {
    if (isLoading) {
      newSharingButton.replaceChildren(
        AnimatedIcon(AnimatedIconName._18_CIRCLE_SPINNER),
      );

      return;
    }

    newSharingButton.replaceChildren(FlatIcon(FlatIconName._18_CIRCLE_PLUS));
  };

  const addItem = (item: TSharingItem): void => {
    const itemButton = document.createElement('button');
    const linkDiv = document.createElement('div');
    const buttonsDiv = document.createElement('div');
    const deleteButton = document.createElement('button');
    const copyButton = document.createElement('button');

    itemButton.classList.add('sharing-modal-item');
    linkDiv.classList.add('sharing-modal-item__link');
    buttonsDiv.classList.add('sharing-modal-item__buttons');
    deleteButton.classList.add('sharing-modal-item__delete-button');
    copyButton.classList.add('sharing-modal-item__copy-button');

    linkDiv.textContent = item.text;

    const copyIcon = FlatIcon(FlatIconName._18_COPY);
    copyButton.appendChild(copyIcon);
    deleteButton.appendChild(FlatIcon(FlatIconName._18_TRASH));
    buttonsDiv.append(copyButton, deleteButton);
    itemButton.append(linkDiv, buttonsDiv);

    itemButton.id = item.id;
    setTestId(itemButton, item.id);

    itemButton.addEventListener('click', (e: PointerEvent): void => {
      e.preventDefault();

      item.onClick();
    });

    copyButton.id = `copy_button__${item.id}`;
    setTestId(copyButton, `copy_button__${item.id}`);

    copyButton.addEventListener('click', (e: PointerEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      // Change the icon to a filled circle check when the user
      // presses the copy button

      const checkIcon = FlatIcon(FlatIconName._18_CIRCLE_CHECK_FILLED);
      checkIcon.classList.add(
        'sharing-link-copy-icon-absolute',
        'icon-fade-out',
      );

      const copyIconElement = copyButton.querySelector('svg');
      if (copyIconElement) {
        copyButton.appendChild(checkIcon);

        setTimeout(() => {
          copyIconElement.classList.add('sharing-link-copy-icon-fade-out');
          checkIcon.classList.remove('sharing-link-copy-icon-fade-out');
          checkIcon.classList.add('sharing-link-copy-icon-fade-in');
        }, 10);

        setTimeout(() => {
          checkIcon.classList.remove('sharing-link-copy-icon-fade-in');
          checkIcon.classList.add('sharing-link-copy-icon-fade-out');
          copyIconElement.classList.remove('sharing-link-copy-icon-fade-out');

          setTimeout(() => {
            if (copyButton.contains(checkIcon)) {
              copyButton.removeChild(checkIcon);
            }
          }, 300);
        }, 5000);
      }

      item.onCopy();
    });

    deleteButton.id = `delete_button__${item.id}`;
    setTestId(deleteButton, `delete_button__${item.id}`);

    deleteButton.addEventListener('click', (e: PointerEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      item.onDelete();
    });

    itemListDiv.prepend(itemButton);
  };

  const addItems = (items: TSharingItem[]): void => {
    itemListDiv.replaceChildren();

    for (let i = 0; i < items.length; i++) {
      addItem(items[i]);
    }
  };

  const removeItem = (id: string): void => {
    const itemToRemove = document.getElementById(id);
    if (itemToRemove && itemListDiv.contains(itemToRemove)) {
      itemListDiv.removeChild(itemToRemove);
    }
  };

  const removeItemListContent = (): void => {
    itemListDiv.replaceChildren();
  };

  const setItemListLoading = (id: string): void => {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('sharing-modal__item-list-loading-indicator');

    const loadingIndicatorElement = LoadingIndicator({
      id,
      text: undefined,
      animatedIcon: AnimatedIcon(AnimatedIconName._18_CIRCLE_SPINNER),
      shouldHideLogoInOverlay: true,
      isOverlay: false,
    });

    loadingDiv.appendChild(loadingIndicatorElement.element);
    itemListDiv.replaceChildren(loadingDiv);
  };

  const setAnalyticsContentLoading = (id: string): void => {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('sharing-modal__analytics-loading-indicator');

    const loadingIndicatorElement = LoadingIndicator({
      id,
      text: undefined,
      animatedIcon: AnimatedIcon(AnimatedIconName._18_CIRCLE_SPINNER),
      shouldHideLogoInOverlay: true,
      isOverlay: false,
    });

    loadingDiv.appendChild(loadingIndicatorElement.element);
    analyticsDiv.replaceChildren(loadingDiv);
  };

  const setItemListContent = (content: HTMLElement): void => {
    itemListDiv.replaceChildren(content);
  };

  const setAnalyticsContent = (content: HTMLElement): void => {
    analyticsDiv.replaceChildren(content);
  };

  return {
    element: modalDiv,
    setLinkCreateButtonLoadingState,
    addItem,
    addItems,
    removeItem,
    removeItemListContent,
    setItemListLoading,
    setAnalyticsContentLoading,
    setItemListContent,
    setAnalyticsContent,
  };
};

export type {
  TSharingItem,
  TOptions as TSharingModalOptions,
  TReturnSharingModal,
};

export { SharingModal };
