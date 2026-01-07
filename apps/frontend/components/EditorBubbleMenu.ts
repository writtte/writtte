import {
  EditorBubbleMenuItem,
  type TEditorBubbleMenuItemOptions,
  type TReturnEditorBubbleMenuItem,
} from './EditorBubbleMenuItem';

type TOptions = {
  id: string;
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

  menu.classList.add('editor-bubble-menu');

  const itemReturnsMap: { [key: string]: TReturnEditorBubbleMenuItem } = {};

  for (let i = 0; i < opts.items.length; i++) {
    const itemElement = EditorBubbleMenuItem(opts.items[i]);

    if (
      opts.items[i].hasLeftDivider !== undefined &&
      opts.items[i].hasLeftDivider === true
    ) {
      const dividerDiv = document.createElement('div');
      dividerDiv.classList.add('editor-bubble-menu__divider');

      menu.appendChild(dividerDiv);
    }

    menu.appendChild(itemElement.element);

    if (
      opts.items[i].hasRightDivider !== undefined &&
      opts.items[i].hasRightDivider === true
    ) {
      const dividerDiv = document.createElement('div');
      dividerDiv.classList.add('editor-bubble-menu__divider');

      menu.appendChild(dividerDiv);
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
