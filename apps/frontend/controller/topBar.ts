import type { TActionButtonOptions } from '../components/ActionButton';
import type { TReturnTopBar } from '../components/TopBar';

type TReturnTopBarController = {
  setTopBar: (topBar: TReturnTopBar) => void;
  getTopBar: () => TReturnTopBar | null;
  changeIcon: (icon: HTMLElement) => void;
  replaceLeftButtons: (buttons: TActionButtonOptions[]) => void;
  replaceRightButtons: (buttons: TActionButtonOptions[]) => void;
  addButtonToLeft: (button: TActionButtonOptions) => void;
  addButtonToRight: (button: TActionButtonOptions) => void;
  addButtonsToLeft: (buttons: TActionButtonOptions[]) => void;
  addButtonsToRight: (buttons: TActionButtonOptions[]) => void;
  removeButtonFromLeft: (id: string) => void;
  removeButtonFromRight: (id: string) => void;
};

// This `topBarInstance` variable holds the single TopBar instance

var topBarInstance: TReturnTopBar | null = null;

const TopBarController = (): TReturnTopBarController => {
  const setTopBar = (topBar: TReturnTopBar): void => {
    topBarInstance = topBar;
  };

  const getTopBar = (): TReturnTopBar | null => topBarInstance;

  const changeIcon = (icon: HTMLElement): void => {
    if (topBarInstance) {
      topBarInstance.changeIcon(icon);
    }
  };

  const replaceLeftButtons = (buttons: TActionButtonOptions[]): void => {
    if (topBarInstance) {
      topBarInstance.replaceLeftButtons(buttons);
    }
  };

  const replaceRightButtons = (buttons: TActionButtonOptions[]): void => {
    if (topBarInstance) {
      topBarInstance.replaceRightButtons(buttons);
    }
  };

  const addButtonToLeft = (button: TActionButtonOptions): void => {
    if (topBarInstance) {
      topBarInstance.addButtonToLeft(button);
    }
  };

  const addButtonToRight = (button: TActionButtonOptions): void => {
    if (topBarInstance) {
      topBarInstance.addButtonToRight(button);
    }
  };

  const addButtonsToLeft = (buttons: TActionButtonOptions[]): void => {
    if (topBarInstance) {
      topBarInstance.addButtonsToLeft(buttons);
    }
  };

  const addButtonsToRight = (buttons: TActionButtonOptions[]): void => {
    if (topBarInstance) {
      topBarInstance.addButtonsToRight(buttons);
    }
  };

  const removeButtonFromLeft = (id: string): void => {
    if (topBarInstance) {
      topBarInstance.removeButtonFromLeft(id);
    }
  };

  const removeButtonFromRight = (id: string): void => {
    if (topBarInstance) {
      topBarInstance.removeButtonFromRight(id);
    }
  };

  return {
    setTopBar,
    getTopBar,
    changeIcon,
    replaceLeftButtons,
    replaceRightButtons,
    addButtonToLeft,
    addButtonToRight,
    addButtonsToLeft,
    addButtonsToRight,
    removeButtonFromLeft,
    removeButtonFromRight,
  };
};

export type { TReturnTopBarController };

export { topBarInstance, TopBarController };
