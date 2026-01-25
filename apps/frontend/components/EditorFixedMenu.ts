import { setTestId } from '../utils/dom/testId';
import {
  EditorFixedMenuItem,
  type TEditorFixedMenuItemOptions,
  type TReturnEditorFixedMenuItem,
} from './EditorFixedMenuItem';

type TOptions = {
  id: string;
};

type TReturnEditorFixedMenu = {
  element: HTMLMenuElement;
  setItems: (
    items: (TEditorFixedMenuItemOptions & {
      hasLeftDivider: boolean;
      hasRightDivider: boolean;
    })[],
  ) => void;
  returnsMap: {
    [key: string]: TReturnEditorFixedMenuItem;
  };
  remove: () => void;
};

const EditorFixedMenu = (opts: TOptions): TReturnEditorFixedMenu => {
  const menu = document.createElement('menu');
  menu.classList.add('editor-fixed-menu');

  setTestId(menu, opts.id);

  const itemReturnsMap: { [key: string]: TReturnEditorFixedMenuItem } = {};

  const setItems = (
    items: (TEditorFixedMenuItemOptions & {
      hasLeftDivider: boolean;
      hasRightDivider: boolean;
    })[],
  ): void => {
    for (let i = 0; i < items.length; i++) {
      const itemElement = EditorFixedMenuItem(items[i]);

      if (
        items[i].hasLeftDivider !== undefined &&
        items[i].hasLeftDivider === true
      ) {
        const dividerDiv = document.createElement('div');
        dividerDiv.classList.add('editor-fixed-menu__divider');

        menu.appendChild(dividerDiv);
      }

      menu.appendChild(itemElement.element);

      if (
        items[i].hasRightDivider !== undefined &&
        items[i].hasRightDivider === true
      ) {
        const dividerDiv = document.createElement('div');
        dividerDiv.classList.add('editor-fixed-menu__divider');

        menu.appendChild(dividerDiv);
      }

      itemReturnsMap[items[i].id] = itemElement;
    }
  };

  const remove = (): void => {
    menu.remove();
  };

  return {
    element: menu,
    setItems,
    returnsMap: itemReturnsMap,
    remove,
  };
};

export type { TOptions as TEditorFixedMenuOptions, TReturnEditorFixedMenu };

export { EditorFixedMenu };
