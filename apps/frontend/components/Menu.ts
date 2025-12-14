import {
  MenuItem,
  type TMenuItemOptions,
  type TReturnMenuItem,
} from './MenuItem';

type TOptions = {
  id: string;
  location: {
    x: number;
    y: number;
  };
  items: (TMenuItemOptions & {
    hasTopDivider: boolean;
    hasBottomDivider: boolean;
  })[];
  menuWidth: number;
  isSubMenu: boolean;
};

type TReturnMenu = {
  element: HTMLMenuElement;
  items: {
    [key: string]: TReturnMenuItem;
  };
};

const Menu = (opts: TOptions): TReturnMenu => {
  const menu = document.createElement('menu');
  const containerDiv = document.createElement('div');

  menu.classList.add('menu');
  containerDiv.classList.add('menu__container');

  menu.style.width = `${opts.menuWidth}px`;
  menu.style.top = `${opts.location.y}px`;
  menu.style.left = `${opts.location.x}px`;

  menu.appendChild(containerDiv);

  const items: TReturnMenu['items'] = {};

  for (let i = 0; i < opts.items.length; i++) {
    if (opts.items[i].hasTopDivider === true) {
      const dividerDiv = document.createElement('div');
      dividerDiv.classList.add('menu__divider');

      containerDiv.appendChild(dividerDiv);
    }

    const menuElement = MenuItem(opts.items[i]);
    items[opts.items[i].id] = menuElement;

    containerDiv.appendChild(menuElement.element);

    if (opts.items[i].hasBottomDivider === true) {
      const dividerDiv = document.createElement('div');
      dividerDiv.classList.add('menu__divider');

      containerDiv.appendChild(dividerDiv);
    }
  }

  return {
    element: menu,
    items,
  };
};

export type { TOptions as TMenuOptions, TReturnMenu };

export { Menu };
