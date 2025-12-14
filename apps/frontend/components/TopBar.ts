import {
  ActionButton,
  type TActionButtonOptions,
  type TReturnActionButton,
} from './ActionButton';

type TOptions = {
  icon: HTMLElement;
  leftButtons: TActionButtonOptions[];
  rightButtons: TActionButtonOptions[];
};

type TReturnTopBar = {
  element: HTMLDivElement;
  buttons: {
    [key: string]: TReturnActionButton;
  };
  changeIcon: (icon: HTMLElement) => void;
  replaceLeftButtons: (buttons: TActionButtonOptions[]) => void;
  replaceRightButtons: (buttons: TActionButtonOptions[]) => void;
  addButtonToLeft: (button: TActionButtonOptions) => void;
  addButtonToRight: (button: TActionButtonOptions) => void;
  removeButtonFromLeft: (id: string) => void;
  removeButtonFromRight: (id: string) => void;
};

const TopBar = (opts: TOptions): TReturnTopBar => {
  const topBarDiv = document.createElement('div');
  const iconDiv = document.createElement('div');
  const leftDiv = document.createElement('div');
  const rightDiv = document.createElement('div');

  topBarDiv.classList.add('top-bar');
  iconDiv.classList.add('top-bar__icon');
  leftDiv.classList.add('top-bar__left');
  rightDiv.classList.add('top-bar__right');

  iconDiv.appendChild(opts.icon);
  topBarDiv.append(leftDiv, rightDiv);

  const buttons: TReturnTopBar['buttons'] = {};

  for (let i = 0; i < opts.leftButtons.length; i++) {
    const actionButtonElement = ActionButton(opts.leftButtons[i]);
    buttons[opts.leftButtons[i].id] = actionButtonElement;

    leftDiv.appendChild(actionButtonElement.element);
  }

  leftDiv.appendChild(iconDiv);

  for (let i = 0; i < opts.rightButtons.length; i++) {
    const actionButtonElement = ActionButton(opts.rightButtons[i]);
    buttons[opts.rightButtons[i].id] = actionButtonElement;

    rightDiv.appendChild(actionButtonElement.element);
  }

  const changeIcon = (icon: HTMLElement): void => {
    iconDiv.replaceChildren(icon);
  };

  const replaceLeftButtons = (newButtons: TActionButtonOptions[]): void => {
    while (leftDiv.firstChild && leftDiv.firstChild !== iconDiv) {
      leftDiv.removeChild(leftDiv.firstChild);
    }

    Object.keys(buttons).forEach((id) => {
      if (buttons[id] && leftDiv.contains(buttons[id].element)) {
        delete buttons[id];
      }
    });

    for (let i = 0; i < newButtons.length; i++) {
      const actionButtonElement = ActionButton(newButtons[i]);
      buttons[newButtons[i].id] = actionButtonElement;
      leftDiv.insertBefore(actionButtonElement.element, iconDiv);
    }
  };

  const replaceRightButtons = (newButtons: TActionButtonOptions[]): void => {
    while (rightDiv.firstChild) {
      rightDiv.removeChild(rightDiv.firstChild);
    }

    Object.keys(buttons).forEach((id) => {
      if (buttons[id] && rightDiv.contains(buttons[id].element)) {
        delete buttons[id];
      }
    });

    for (let i = 0; i < newButtons.length; i++) {
      const actionButtonElement = ActionButton(newButtons[i]);
      buttons[newButtons[i].id] = actionButtonElement;
      rightDiv.appendChild(actionButtonElement.element);
    }
  };

  const addButtonToLeft = (button: TActionButtonOptions): void => {
    const actionButtonElement = ActionButton(button);
    buttons[button.id] = actionButtonElement;
    leftDiv.insertBefore(actionButtonElement.element, iconDiv);
  };

  const addButtonToRight = (button: TActionButtonOptions): void => {
    const actionButtonElement = ActionButton(button);
    buttons[button.id] = actionButtonElement;
    rightDiv.appendChild(actionButtonElement.element);
  };

  const removeButtonFromLeft = (id: string): void => {
    if (buttons[id] && leftDiv.contains(buttons[id].element)) {
      leftDiv.removeChild(buttons[id].element);
      delete buttons[id];
    }
  };

  const removeButtonFromRight = (id: string): void => {
    if (buttons[id] && rightDiv.contains(buttons[id].element)) {
      rightDiv.removeChild(buttons[id].element);
      delete buttons[id];
    }
  };

  return {
    element: topBarDiv,
    changeIcon,
    buttons,
    replaceLeftButtons,
    replaceRightButtons,
    addButtonToLeft,
    addButtonToRight,
    removeButtonFromLeft,
    removeButtonFromRight,
  };
};

export type { TOptions as TTopBarOptions, TReturnTopBar };

export { TopBar };
