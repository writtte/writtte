import {
  EditorFixedMenuItem,
  type TEditorFixedMenuItemOptions,
  type TReturnEditorFixedMenuItem,
} from './EditorFixedMenuItem';

type TOptions = {
  id: string;
  items: (TEditorFixedMenuItemOptions & {
    hasLeftDivider: boolean;
    hasRightDivider: boolean;
  })[];
};

type TReturnEditorFixedMenu = {
  element: HTMLMenuElement;
  returnsMap: {
    [key: string]: TReturnEditorFixedMenuItem;
  };
};

const EditorFixedMenu = (opts: TOptions): TReturnEditorFixedMenu => {
  const menu = document.createElement('menu');
  menu.classList.add('editor-fixed-menu');

  const itemReturnsMap: { [key: string]: TReturnEditorFixedMenuItem } = {};

  for (let i = 0; i < opts.items.length; i++) {
    const itemElement = EditorFixedMenuItem(opts.items[i]);

    if (
      opts.items[i].hasLeftDivider !== undefined &&
      opts.items[i].hasLeftDivider === true
    ) {
      const dividerDiv = document.createElement('div');
      dividerDiv.classList.add('editor-fixed-menu__divider');

      menu.appendChild(dividerDiv);
    }

    menu.appendChild(itemElement.element);

    if (
      opts.items[i].hasRightDivider !== undefined &&
      opts.items[i].hasRightDivider === true
    ) {
      const dividerDiv = document.createElement('div');
      dividerDiv.classList.add('editor-fixed-menu__divider');

      menu.appendChild(dividerDiv);
    }

    itemReturnsMap[opts.items[i].id] = itemElement;
  }

  return {
    element: menu,
    returnsMap: itemReturnsMap,
  };
};

export type { TOptions as TEditorFixedMenuOptions, TReturnEditorFixedMenu };

export { EditorFixedMenu };
