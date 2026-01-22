import {
  EditorAIMenu,
  type TEditorAIMenuOptions,
  type TReturnEditorAIMenu,
} from '../components/EditorAIMenu';
import { removeWhenRouteChange } from '../utils/ui/removeWhenRouteChange';

type TInternalEditorAIMenu = {
  id: string;
  props: TEditorAIMenuOptions;
  menuReturn: TReturnEditorAIMenu;
  createdAt: number;
};

type TReturnEditorAIMenuController = {
  showMenu: (props: TEditorAIMenuOptions) => TReturnEditorAIMenu;
  closeMenu: (id: string) => void;
  getMenu: () => TInternalEditorAIMenu | undefined;
  getMenuById: (id: string) => TReturnEditorAIMenu | undefined;
};

var currentMenu: TInternalEditorAIMenu | null = null;
var containerDiv: HTMLDivElement | null = null;

const EditorAIMenuController = (): TReturnEditorAIMenuController => {
  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
      containerDiv.id = 'editor-ai-menu-container';
      containerDiv.classList.add('editor-ai-menu-container');

      document.body.appendChild(containerDiv);

      removeWhenRouteChange(containerDiv, {
        enabled: true,
        animationDuration: 300,
        onBeforeRemove: () => {
          if (containerDiv) {
            containerDiv.classList.add('editor-ai-menu-container--closing');
          }
        },
        onAfterRemove: () => {
          currentMenu = null;
          containerDiv = null;
        },
      });
    }
  };

  document.addEventListener('editor-ai-menu:close', (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.id) {
      closeMenu(customEvent.detail.id);
    }
  });

  const closeMenu = (id: string): void => {
    if (currentMenu && currentMenu.id === id) {
      if (containerDiv) {
        containerDiv.classList.add('editor-ai-menu-container--closing');
        setTimeout(() => {
          currentMenu?.menuReturn.element.remove();
          currentMenu = null;

          if (containerDiv) {
            containerDiv.classList.remove('editor-ai-menu-container--closing');
            containerDiv.style.display = 'none';
          }
        }, 300);
      } else {
        currentMenu.menuReturn.element.remove();
        currentMenu = null;
      }
    }
  };

  const showMenu = (props: TEditorAIMenuOptions): TReturnEditorAIMenu => {
    if (currentMenu) {
      currentMenu.menuReturn.element.remove();
      currentMenu = null;
    }

    ensureContainer();

    if (containerDiv) {
      containerDiv.style.display = '';
    }

    const menuProps: TEditorAIMenuOptions = {
      ...props,
    };

    const menuReturn = EditorAIMenu(menuProps);

    const id = props.id ?? `editor-ai-menu-${Date.now()}`;

    const menuObj: TInternalEditorAIMenu = {
      id,
      props: menuProps,
      menuReturn,
      createdAt: Date.now(),
    };

    currentMenu = menuObj;

    if (containerDiv) {
      containerDiv.appendChild(menuReturn.element);
      menuReturn.element.style.position = 'absolute';
    }

    menuReturn.element.addEventListener('menuClose', () => {
      closeMenu(id);
    });

    return menuReturn;
  };

  const getMenu = (): TInternalEditorAIMenu | undefined =>
    currentMenu ?? undefined;

  const getMenuById = (id: string): TReturnEditorAIMenu | undefined => {
    if (currentMenu?.id === id) {
      return currentMenu.menuReturn;
    }

    return;
  };

  return {
    showMenu,
    closeMenu,
    getMenu,
    getMenuById,
  };
};

export type { TReturnEditorAIMenuController, TInternalEditorAIMenu };

export { EditorAIMenuController };
