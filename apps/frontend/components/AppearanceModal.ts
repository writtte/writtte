import { setTestId } from '../utils/dom/testId';
import { CloseButton } from './CloseButton';
import { FlatIcon, FlatIconName } from './FlatIcon';

type TAppearancePanelButton = {
  id: string;
  text: string;
  isSelected: boolean;
  onClick: () => void;
};

type TAppearancePanel = {
  id: string;
  title: string;
  buttons: TAppearancePanelButton[];
};

type TOptions = {
  id: string;
  title: string;
  leftPanel: TAppearancePanel;
  rightPanel: TAppearancePanel;
};

type TReturnAppearanceButton = {
  element: HTMLButtonElement;
  setSelectedState: (isSelected: boolean) => void;
};

type TReturnAppearanceModal = {
  element: HTMLDivElement;
  leftPanelButtons: {
    [key: string]: TReturnAppearanceButton;
  };
  rightPanelButtons: {
    [key: string]: TReturnAppearanceButton;
  };
  setButtonSelectedState: (
    panelId: string,
    buttonId: string,
    isSelected: boolean,
  ) => void;
};

const AppearanceButton = (
  opts: TAppearancePanelButton,
): TReturnAppearanceButton => {
  const button = document.createElement('button');
  const textSpan = document.createElement('span');

  button.classList.add('appearance-button');
  textSpan.classList.add('appearance-button__text');

  if (opts.isSelected) {
    button.classList.add('appearance-button--selected');
  }

  button.appendChild(textSpan);

  textSpan.textContent = opts.text;

  setTestId(button, opts.id);

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    opts.onClick();
  });

  const setSelectedState = (isSelected: boolean): void => {
    if (isSelected) {
      button.classList.add('appearance-button--selected');
    } else {
      button.classList.remove('appearance-button--selected');
    }
  };

  return {
    element: button,
    setSelectedState,
  };
};

const AppearanceModal = (opts: TOptions): TReturnAppearanceModal => {
  const modalDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const logoDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const leftPanelDiv = document.createElement('div');
  const leftPanelTitleDiv = document.createElement('div');
  const leftPanelButtonsDiv = document.createElement('div');
  const panelDividerDiv = document.createElement('div');
  const rightPanelDiv = document.createElement('div');
  const rightPanelTitleDiv = document.createElement('div');
  const rightPanelButtonsDiv = document.createElement('div');

  modalDiv.classList.add('appearance-modal');
  headerDiv.classList.add('appearance-modal__header');
  logoDiv.classList.add('appearance-modal__logo');
  titleDiv.classList.add('appearance-modal__title');
  contentDiv.classList.add('appearance-modal__content');
  leftPanelDiv.classList.add('appearance-modal__panel');
  leftPanelTitleDiv.classList.add('appearance-modal__panel-title');
  leftPanelButtonsDiv.classList.add(
    'appearance-modal__panel-buttons',
    'v-scrollbar',
  );

  panelDividerDiv.classList.add('appearance-modal__panel-divider');
  rightPanelDiv.classList.add('appearance-modal__panel');
  rightPanelTitleDiv.classList.add('appearance-modal__panel-title');
  rightPanelButtonsDiv.classList.add(
    'appearance-modal__panel-buttons',
    'v-scrollbar',
  );

  const closeButtonElement = CloseButton({
    id: `${opts.id}-close-button`,
    onClick: (): void => {
      modalDiv.dispatchEvent(new CustomEvent('modalClose'));
    },
  });

  logoDiv.appendChild(FlatIcon(FlatIconName._18_WRITTTE_LOGO));

  titleDiv.textContent = opts.title;

  leftPanelTitleDiv.textContent = opts.leftPanel.title;
  rightPanelTitleDiv.textContent = opts.rightPanel.title;

  modalDiv.dataset.testId = opts.id;
  leftPanelDiv.dataset.panelId = opts.leftPanel.id;
  rightPanelDiv.dataset.panelId = opts.rightPanel.id;

  headerDiv.append(logoDiv, titleDiv, closeButtonElement.element);

  leftPanelDiv.append(leftPanelTitleDiv, leftPanelButtonsDiv);
  rightPanelDiv.append(rightPanelTitleDiv, rightPanelButtonsDiv);

  contentDiv.append(leftPanelDiv, panelDividerDiv, rightPanelDiv);
  modalDiv.append(headerDiv, contentDiv);

  const leftPanelButtons: { [key: string]: TReturnAppearanceButton } = {};
  for (let i = 0; i < opts.leftPanel.buttons.length; i++) {
    const buttonOpts = opts.leftPanel.buttons[i];
    const buttonElement = AppearanceButton(buttonOpts);

    leftPanelButtonsDiv.appendChild(buttonElement.element);
    leftPanelButtons[buttonOpts.id] = buttonElement;
  }

  const rightPanelButtons: { [key: string]: TReturnAppearanceButton } = {};
  for (let i = 0; i < opts.rightPanel.buttons.length; i++) {
    const buttonOpts = opts.rightPanel.buttons[i];
    const buttonElement = AppearanceButton(buttonOpts);

    rightPanelButtonsDiv.appendChild(buttonElement.element);
    rightPanelButtons[buttonOpts.id] = buttonElement;
  }

  const setButtonSelectedState = (
    panelId: string,
    buttonId: string,
    isSelected: boolean,
  ): void => {
    let targetButtons: { [key: string]: TReturnAppearanceButton } | undefined;

    if (panelId === opts.leftPanel.id) {
      targetButtons = leftPanelButtons;
    } else if (panelId === opts.rightPanel.id) {
      targetButtons = rightPanelButtons;
    }

    if (!targetButtons) {
      return;
    }

    for (const key in targetButtons) {
      targetButtons[key].setSelectedState(false);
    }

    if (targetButtons[buttonId] && isSelected) {
      targetButtons[buttonId].setSelectedState(true);
    }
  };

  return {
    element: modalDiv,
    leftPanelButtons,
    rightPanelButtons,
    setButtonSelectedState,
  };
};

export type {
  TOptions as TAppearanceModalOptions,
  TReturnAppearanceModal,
  TAppearancePanel,
  TAppearancePanelButton,
  TReturnAppearanceButton,
};

export { AppearanceModal, AppearanceButton };
