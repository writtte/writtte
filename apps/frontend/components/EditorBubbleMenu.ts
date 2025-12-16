import {
  EditorBubbleMenuItem,
  type TEditorBubbleMenuItemOptions,
  type TReturnEditorBubbleMenuItem,
} from './EditorBubbleMenuItem';

type TOptions = {
  id: string;
  location: {
    x: number;
    y: number;
  };
  items: (TEditorBubbleMenuItemOptions & {
    hasLeftDivider: boolean;
    hasRightDivider: boolean;
  })[];
};

type TReturnEditorBubbleMenu = {
  element: HTMLMenuElement;
  returnsMap: {
    [key: string]: TReturnEditorBubbleMenuItem;
  };
};

const EditorBubbleMenu = (opts: TOptions): TReturnEditorBubbleMenu => {
  const menu = document.createElement('menu');
  const itemsDiv = document.createElement('div');

  menu.classList.add('editor-bubble-menu');
  itemsDiv.classList.add('editor-bubble-menu__items');

  menu.appendChild(itemsDiv);

  menu.style.top = `${opts.location.y}px`;
  menu.style.left = `${opts.location.x}px`;

  const itemReturnsMap: { [key: string]: TReturnEditorBubbleMenuItem } = {};

  for (let i = 0; i < opts.items.length; i++) {
    const itemElement = EditorBubbleMenuItem(opts.items[i]);

    if (
      opts.items[i].hasLeftDivider !== undefined &&
      opts.items[i].hasLeftDivider === true
    ) {
      const dividerDiv = document.createElement('div');
      dividerDiv.classList.add('editor-bubble-menu__divider');

      itemsDiv.appendChild(dividerDiv);
    }

    itemsDiv.appendChild(itemElement.element);

    if (
      opts.items[i].hasRightDivider !== undefined &&
      opts.items[i].hasRightDivider === true
    ) {
      const dividerDiv = document.createElement('div');
      dividerDiv.classList.add('editor-bubble-menu__divider');

      itemsDiv.appendChild(dividerDiv);
    }

    itemReturnsMap[opts.items[i].id] = itemElement;
  }

  return {
    element: menu,
    returnsMap: itemReturnsMap,
  };
};

export type { TOptions as TEditorBubbleMenuOptions, TReturnEditorBubbleMenu };

export { EditorBubbleMenu };
