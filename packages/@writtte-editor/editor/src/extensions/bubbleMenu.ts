import type { EditorView } from 'prosemirror-view';
import { type AnyExtension, Extension, isNodeSelection } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

const excludedNodeTypes: string[] = [
  'image',
  'horizontalLine',
  'blockPlaceholder',
  'codeBlock',
];

type TBubbleMenuOptions = {
  MenuElement: HTMLMenuElement;
  HTMLAttributes: Record<string, string | number | boolean>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    showBubbleMenu: () => ReturnType;
  }
}

const BubbleMenuExtension: AnyExtension = Extension.create<TBubbleMenuOptions>({
  name: 'bubbleMenu',
  addProseMirrorPlugins(): Plugin[] {
    const menuElement = this.options.MenuElement;
    if (!menuElement) {
      return [];
    }

    menuElement.style.position = 'fixed';
    menuElement.style.display = 'none';

    document.body.appendChild(menuElement);

    return [
      new Plugin({
        key: new PluginKey('bubble-menu'),
        view: (view: EditorView) => {
          const update = () => {
            const { selection } = view.state;

            if (selection.empty) {
              menuElement.style.display = 'none';
              menuElement.dataset.isOpen = 'false';
              return;
            }

            // Hide bubble menu when excluded nodes are
            // selected (e.g., image, horizontalRule)

            if (isNodeSelection(selection)) {
              const nodeName = selection.node.type.name;
              if (excludedNodeTypes.includes(nodeName)) {
                menuElement.style.display = 'none';
                menuElement.dataset.isOpen = 'false';
                return;
              }
            }

            // Hide bubble menu when the selection is inside or across
            // excluded node types

            const $from = selection.$from;
            const $to = selection.$to;

            // Check if selection starts in an excluded node type

            for (let depth = $from.depth; depth >= 0; depth--) {
              const node = $from.node(depth);
              if (node && excludedNodeTypes.includes(node.type.name)) {
                menuElement.style.display = 'none';
                menuElement.dataset.isOpen = 'false';
                return;
              }
            }

            // Check if selection ends in an excluded node type

            for (let depth = $to.depth; depth >= 0; depth--) {
              const node = $to.node(depth);
              if (node && excludedNodeTypes.includes(node.type.name)) {
                menuElement.style.display = 'none';
                menuElement.dataset.isOpen = 'false';
                return;
              }
            }

            if (
              menuElement.dataset.isOpen === 'true' &&
              menuElement.style.display === 'flex'
            ) {
              return;
            }

            const from = selection.from;
            const to = selection.to;

            const start = view.coordsAtPos(from);
            const end = view.coordsAtPos(to);

            menuElement.style.visibility = 'hidden';
            menuElement.style.display = 'flex';

            const _ = menuElement.offsetWidth;

            const menuWidth = menuElement.offsetWidth;
            const menuHeight = menuElement.offsetHeight;

            const midX = (start.left + end.right) / 2;
            const topY = Math.min(start.top, end.top);
            const bottomY = Math.max(start.bottom, end.bottom);

            let top = topY - menuHeight - 12;
            let left = midX - menuWidth / 2;

            const viewportWidth = window.innerWidth;

            if (top < 10) {
              top = bottomY + 12;
            }

            left = Math.max(10, Math.min(left, viewportWidth - menuWidth - 10));

            menuElement.style.position = 'fixed';
            menuElement.style.top = `${top}px`;
            menuElement.style.left = `${left}px`;
            menuElement.style.visibility = 'visible';

            menuElement.dataset.isOpen = 'true';

            menuElement.style.pointerEvents = 'none';
            Array.from(menuElement.children).forEach((child) => {
              (child as HTMLElement).style.pointerEvents = 'auto';
            });
          };

          const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
              menuElement.style.display = 'none';
              menuElement.dataset.isOpen = 'false';
            }
          };

          document.addEventListener('keydown', handleKeyDown);

          update();

          return {
            update,
            destroy(): void {
              document.removeEventListener('keydown', handleKeyDown);
              menuElement.remove();
            },
          };
        },
      }),
    ];
  },
});

export type { TBubbleMenuOptions };

export { BubbleMenuExtension };
