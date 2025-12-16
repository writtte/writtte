import { setTestId } from '../utils/dom/testId';
import {
  EditorBlockMenuItem,
  type TEditorBlockMenuItemOptions,
} from './EditorBlockMenuItem';

type TOptions = {
  id: string;
  location: {
    x: number;
    y: number;
  };
  filterText: string;
  items: (TEditorBlockMenuItemOptions & {
    hasTopDivider: boolean;
    hasBottomDivider: boolean;
  })[];
};

const EditorBlockMenu = (props: TOptions): HTMLMenuElement => {
  const menu = document.createElement('menu');
  const containerDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const filterTextDiv = document.createElement('div');
  const itemsDiv = document.createElement('div');

  menu.classList.add('editor-block-menu');
  containerDiv.classList.add('editor-block-menu__container');
  headerDiv.classList.add('editor-block-menu__header');
  filterTextDiv.classList.add('editor-block-menu__filter-text');
  itemsDiv.classList.add('editor-block-menu__items');

  filterTextDiv.textContent = props.filterText;
  headerDiv.appendChild(filterTextDiv);
  containerDiv.append(headerDiv, itemsDiv);
  menu.appendChild(containerDiv);

  setTestId(menu, props.id);

  menu.style.top = `${props.location.y}px`;
  menu.style.left = `${props.location.x}px`;

  for (let i = 0; i < props.items.length; i++) {
    const itemElement = EditorBlockMenuItem(props.items[i]);

    if (
      props.items[i].hasTopDivider !== undefined &&
      props.items[i].hasTopDivider === true
    ) {
      const dividerDiv = document.createElement('div');
      dividerDiv.classList.add('editor-block-menu__divider');

      itemsDiv.appendChild(dividerDiv);
    }

    itemsDiv.appendChild(itemElement);

    if (
      props.items[i].hasBottomDivider !== undefined &&
      props.items[i].hasBottomDivider === true
    ) {
      const dividerDiv = document.createElement('div');
      dividerDiv.classList.add('editor-block-menu__divider');

      itemsDiv.appendChild(dividerDiv);
    }
  }

  return menu;
};

export type { TOptions as TEditorBlockMenuOptions };

export { EditorBlockMenu };
