import { clickOutside } from '../utils/ui/clickOutside';
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
    sectionTitle: string | undefined;
    hasTopDivider: boolean;
    hasBottomDivider: boolean;
  })[];
  menuWidth: number;
  isRightSideMenu: boolean;
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

  if (opts.isRightSideMenu) {
    menu.style.right = `${window.innerWidth - opts.location.x}px`;
  } else {
    menu.style.left = `${opts.location.x}px`;
  }

  menu.appendChild(containerDiv);

  const items: TReturnMenu['items'] = {};

  for (let i = 0; i < opts.items.length; i++) {
    if (opts.items[i].sectionTitle) {
      const menuSectionTitleDiv = document.createElement('div');
      menuSectionTitleDiv.classList.add('menu__section-title');

      menuSectionTitleDiv.textContent = opts.items[i].sectionTitle ?? '';

      containerDiv.appendChild(menuSectionTitleDiv);
    }

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

  document.body.appendChild(menu);

  const menuRect = menu.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  if (menuRect.bottom > viewportHeight) {
    const newTop = Math.max(0, opts.location.y - menuRect.height);
    menu.style.top = `${newTop}px`;
  }

  if (!opts.isRightSideMenu && menuRect.right > viewportWidth) {
    menu.style.left = 'auto';
    menu.style.right = `${window.innerWidth - opts.location.x}px`;
  } else if (opts.isRightSideMenu && menuRect.left < 0) {
    menu.style.right = 'auto';
    menu.style.left = `${opts.location.x}px`;
  }

  let clickOutsideInstance: ReturnType<typeof clickOutside> | null = null;

  const destroy = (): void => {
    clickOutsideInstance?.destroy();
    menu.remove();
  };

  setTimeout(() => {
    clickOutsideInstance = clickOutside(
      menu,
      () => {
        destroy();
      },
      {
        enabled: true,
        listenForEscape: true,
        ignoreMenus: true,
      },
    );
  }, 0);

  return {
    element: menu,
    items,
  };
};

export type { TOptions as TMenuOptions, TReturnMenu };

export { Menu };
