import { gid } from '../utils/dom/node';
import { setTestId } from '../utils/dom/testId';
import {
  ActionButton,
  type TActionButtonOptions,
  type TReturnActionButton,
} from './ActionButton';

const TopBarBadgeType = {
  BLUE: 'BLUE',
} as const;

type TTopBarBadgeType = (typeof TopBarBadgeType)[keyof typeof TopBarBadgeType];

type TTopBarBadge = {
  id: string;
  text: string;
  type: TTopBarBadgeType;
  onClick: () => void;
};

type TOptions = {
  logo: HTMLElement;
  badge: TTopBarBadge | undefined;
  leftButtons: TActionButtonOptions[];
  rightButtons: TActionButtonOptions[];
};

type TReturnTopBar = {
  element: HTMLDivElement;
  buttons: {
    [key: string]: TReturnActionButton;
  };
  changeIcon: (icon: HTMLElement) => void;
  updateBadge: (badge: TTopBarBadge) => void;
  removeBadge: () => void;
  replaceLeftButtons: (buttons: TActionButtonOptions[]) => void;
  replaceRightButtons: (buttons: TActionButtonOptions[]) => void;
  addButtonToLeft: (button: TActionButtonOptions) => void;
  addButtonToRight: (button: TActionButtonOptions) => void;
  addButtonsToLeft: (buttons: TActionButtonOptions[]) => void;
  addButtonsToRight: (buttons: TActionButtonOptions[]) => void;
  removeButtonFromLeft: (id: string) => void;
  removeButtonFromRight: (id: string) => void;
};

const TopBar = (opts: TOptions): TReturnTopBar => {
  const topBarDiv = document.createElement('div');
  const logoDiv = document.createElement('div');
  const leftDiv = document.createElement('div');
  const rightDiv = document.createElement('div');
  const badgeDiv = document.createElement('div');
  const leftButtonsDiv = document.createElement('div');
  const rightButtonsDiv = document.createElement('div');

  topBarDiv.classList.add('top-bar');
  logoDiv.classList.add('top-bar__logo');
  leftDiv.classList.add('top-bar__left');
  rightDiv.classList.add('top-bar__right');
  badgeDiv.classList.add('top-bar__badge');
  leftButtonsDiv.classList.add('top-bar__left-buttons');
  rightButtonsDiv.classList.add('top-bar__right-buttons');

  logoDiv.appendChild(opts.logo);
  leftDiv.append(leftButtonsDiv);
  rightDiv.append(badgeDiv, rightButtonsDiv);
  topBarDiv.append(leftDiv, logoDiv, rightDiv);

  const buttons: TReturnTopBar['buttons'] = {};

  for (let i = 0; i < opts.leftButtons.length; i++) {
    const actionButtonElement = ActionButton(opts.leftButtons[i]);
    buttons[opts.leftButtons[i].id] = actionButtonElement;

    leftButtonsDiv.appendChild(actionButtonElement.element);
  }

  if (opts.badge) {
    badgeDiv.classList.add(`top-bar__badge--${opts.badge.type.toLowerCase()}`);

    badgeDiv.id = opts.badge.id;
    setTestId(badgeDiv, opts.badge.id);

    badgeDiv.textContent = opts.badge.text;

    badgeDiv.addEventListener('click', (e: PointerEvent) => {
      e.preventDefault();

      opts.badge?.onClick();
    });
  } else {
    badgeDiv.remove();
  }

  for (let i = 0; i < opts.rightButtons.length; i++) {
    const actionButtonElement = ActionButton(opts.rightButtons[i]);
    buttons[opts.rightButtons[i].id] = actionButtonElement;

    rightButtonsDiv.appendChild(actionButtonElement.element);
  }

  const changeIcon = (icon: HTMLElement): void => {
    logoDiv.replaceChildren(icon);
  };

  const updateBadge = (badge: TTopBarBadge): void => {
    opts.badge = badge;

    const existingBadge = gid(badge.id);
    if (existingBadge) {
      existingBadge.id = badge.id;
      existingBadge.textContent = badge.text;
      setTestId(existingBadge, badge.id);

      const newBadge = existingBadge.cloneNode(true) as HTMLDivElement;
      newBadge.classList.add(`top-bar__badge--${badge.type.toLowerCase()}`);

      existingBadge.parentNode?.replaceChild(newBadge, existingBadge);

      newBadge.addEventListener('click', (e: PointerEvent) => {
        e.preventDefault();
        badge.onClick();
      });
    } else {
      const newBadgeButton = document.createElement('button');
      newBadgeButton.classList.add('top-bar__badge');
      newBadgeButton.classList.add(
        `top-bar__badge--${badge.type.toLowerCase()}`,
      );

      newBadgeButton.id = badge.id;
      setTestId(newBadgeButton, badge.id);

      newBadgeButton.textContent = badge.text;

      newBadgeButton.addEventListener('click', (e: PointerEvent) => {
        e.preventDefault();
        badge.onClick();
      });

      rightDiv.insertBefore(newBadgeButton, rightButtonsDiv);
    }
  };

  const removeBadge = (): void => {
    if (opts.badge) {
      const existingBadge = gid(opts.badge.id);
      if (existingBadge) {
        existingBadge.remove();
      }
    } else {
      const existingBadge = rightDiv.querySelector('.top-bar__badge');
      if (existingBadge) {
        existingBadge.remove();
      }
    }

    opts.badge = undefined;
  };

  const replaceLeftButtons = (newButtons: TActionButtonOptions[]): void => {
    while (leftButtonsDiv.firstChild) {
      leftButtonsDiv.removeChild(leftButtonsDiv.firstChild);
    }

    Object.keys(buttons).forEach((id) => {
      if (buttons[id] && leftButtonsDiv.contains(buttons[id].element)) {
        delete buttons[id];
      }
    });

    for (let i = 0; i < newButtons.length; i++) {
      const actionButtonElement = ActionButton(newButtons[i]);
      buttons[newButtons[i].id] = actionButtonElement;
      leftButtonsDiv.appendChild(actionButtonElement.element);
    }
  };

  const replaceRightButtons = (newButtons: TActionButtonOptions[]): void => {
    while (rightButtonsDiv.firstChild) {
      rightButtonsDiv.removeChild(rightButtonsDiv.firstChild);
    }

    Object.keys(buttons).forEach((id) => {
      if (buttons[id] && rightButtonsDiv.contains(buttons[id].element)) {
        delete buttons[id];
      }
    });

    for (let i = 0; i < newButtons.length; i++) {
      const actionButtonElement = ActionButton(newButtons[i]);
      buttons[newButtons[i].id] = actionButtonElement;
      rightButtonsDiv.appendChild(actionButtonElement.element);
    }
  };

  const addButtonToLeft = (button: TActionButtonOptions): void => {
    const actionButtonElement = ActionButton(button);
    buttons[button.id] = actionButtonElement;
    leftButtonsDiv.appendChild(actionButtonElement.element);
  };

  const addButtonToRight = (button: TActionButtonOptions): void => {
    const actionButtonElement = ActionButton(button);
    buttons[button.id] = actionButtonElement;
    rightButtonsDiv.appendChild(actionButtonElement.element);
  };

  const addButtonsToLeft = (newButtons: TActionButtonOptions[]): void => {
    for (let i = 0; i < newButtons.length; i++) {
      const button = newButtons[i];
      const actionButtonElement = ActionButton(button);
      buttons[button.id] = actionButtonElement;
      leftButtonsDiv.appendChild(actionButtonElement.element);
    }
  };

  const addButtonsToRight = (newButtons: TActionButtonOptions[]): void => {
    for (let i = 0; i < newButtons.length; i++) {
      const button = newButtons[i];
      const actionButtonElement = ActionButton(button);
      buttons[button.id] = actionButtonElement;
      rightButtonsDiv.appendChild(actionButtonElement.element);
    }
  };

  const removeButtonFromLeft = (id: string): void => {
    if (buttons[id] && leftDiv.contains(buttons[id].element)) {
      leftButtonsDiv.removeChild(buttons[id].element);
      delete buttons[id];
    }
  };

  const removeButtonFromRight = (id: string): void => {
    if (buttons[id] && rightDiv.contains(buttons[id].element)) {
      rightButtonsDiv.removeChild(buttons[id].element);
      delete buttons[id];
    }
  };

  return {
    element: topBarDiv,
    buttons,
    changeIcon,
    updateBadge,
    removeBadge,
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

export type {
  TTopBarBadgeType,
  TTopBarBadge,
  TOptions as TTopBarOptions,
  TReturnTopBar,
};

export { TopBarBadgeType, TopBar };
