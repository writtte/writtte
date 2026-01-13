import { setTestId } from '../utils/dom/testId';
import { AnimatedIcon, AnimatedIconName } from './AnimatedIcon';
import { CloseButton } from './CloseButton';
import { FlatIcon, FlatIconName } from './FlatIcon';
import { LoadingIndicator } from './LoadingIndicator';

type TVersionListItem = {
  id: string;
  date: string;
  onClick: () => void;
};

type TOptions = {
  id: string;
  title: string;
};

type TReturnVersionModal = {
  element: HTMLElement;
  setVersionListLoading: (id: string) => void;
  setVersionContentLoading: (id: string) => void;
  setVersionList: (items: TVersionListItem[]) => void;
  setVersionListContent: (content: HTMLElement) => void;
  setVersionContent: (content: HTMLElement) => void;
};

const VersionModal = (opts: TOptions): TReturnVersionModal => {
  const modalDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const logoDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const sectionDividerDiv = document.createElement('div');
  const versionListDiv = document.createElement('div');
  const versionContentDiv = document.createElement('div');

  modalDiv.classList.add('version-modal');
  headerDiv.classList.add('version-modal__header');
  logoDiv.classList.add('version-modal__logo');
  titleDiv.classList.add('version-modal__title');
  contentDiv.classList.add('version-modal__content');
  sectionDividerDiv.classList.add('version-modal__section-divider');
  versionListDiv.classList.add('version-modal__version-list', 'v-scrollbar');
  versionContentDiv.classList.add('version-modal__version-content');

  const closeButtonElement = CloseButton({
    id: `${opts.id}-close-button`,
    onClick: (): void => {
      modalDiv.dispatchEvent(new CustomEvent('modalClose'));
    },
  });

  logoDiv.appendChild(FlatIcon(FlatIconName._18_WRITTTE_LOGO));

  headerDiv.append(logoDiv, titleDiv, closeButtonElement.element);
  contentDiv.append(versionListDiv, sectionDividerDiv, versionContentDiv);
  modalDiv.append(headerDiv, contentDiv);

  modalDiv.dataset.testId = opts.id;
  titleDiv.textContent = opts.title;

  const setVersionListLoading = (id: string): void => {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('version-modal__version-list-loading-indicator');

    const loadingIndicatorElement = LoadingIndicator({
      id,
      text: undefined,
      animatedIcon: AnimatedIcon(AnimatedIconName._18_CIRCLE_SPINNER),
      shouldHideLogoInOverlay: true,
      isOverlay: false,
    });

    loadingDiv.appendChild(loadingIndicatorElement.element);
    versionListDiv.replaceChildren(loadingDiv);
  };

  const setVersionContentLoading = (id: string): void => {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add(
      'version-modal__version-content-loading-indicator',
    );

    const loadingIndicatorElement = LoadingIndicator({
      id,
      text: undefined,
      animatedIcon: AnimatedIcon(AnimatedIconName._18_CIRCLE_SPINNER),
      shouldHideLogoInOverlay: true,
      isOverlay: false,
    });

    loadingDiv.appendChild(loadingIndicatorElement.element);
    versionContentDiv.replaceChildren(loadingDiv);
  };

  const setVersionList = (items: TVersionListItem[]): void => {
    versionListDiv.replaceChildren();

    for (let i = 0; i < items.length; i++) {
      const itemDiv = document.createElement('button');
      itemDiv.classList.add('version-modal__list-item');

      itemDiv.id = items[i].id;
      setTestId(itemDiv, items[i].id);

      itemDiv.textContent = items[i].date;

      itemDiv.addEventListener('click', (e: PointerEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        items[i].onClick();
      });

      versionListDiv.append(itemDiv);
    }
  };

  const setVersionListContent = (content: HTMLElement): void => {
    versionListDiv.replaceChildren(content);
  };

  const setVersionContent = (content: HTMLElement): void => {
    versionContentDiv.replaceChildren(content);
  };

  return {
    element: modalDiv,
    setVersionListLoading,
    setVersionContentLoading,
    setVersionList,
    setVersionListContent,
    setVersionContent,
  };
};

export type {
  TVersionListItem,
  TOptions as TVersionModalOptions,
  TReturnVersionModal,
};

export { VersionModal };
