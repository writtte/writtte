import type { EditorView } from 'prosemirror-view';
import { type AnyExtension, Extension } from '@tiptap/core';
import {
  type EditorState,
  Plugin,
  PluginKey,
  type PluginView,
} from 'prosemirror-state';

const INPUT_REGEX = /[\s\n\t]/;

type TBlockMenuOptions = {
  MenuElement: HTMLElement;
  trigger: string;
  canOpen?: (state: EditorState) => boolean;
  onInputUpdate?: (query: string) => void;
  onQueryChange?: (query: string) => void;
  queryStateRef?: { current: string };
  onArrowDown?: () => void;
  onArrowUp?: () => void;
  onEnter?: () => void;
  onSelect?: (deleteTrigger: () => void, hideMenu: () => void) => void;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    showBlockMenu: () => ReturnType;
  }
}

const BlockMenuExtension: AnyExtension = Extension.create<TBlockMenuOptions>({
  name: 'blockMenu',
  addProseMirrorPlugins(): Plugin[] {
    const menuElement = this.options.MenuElement;
    if (!menuElement) {
      return [];
    }

    const trigger = this.options.trigger ?? '/';
    const canOpen = this.options.canOpen ?? (() => true);
    const onInputUpdate = this.options.onInputUpdate;
    const onQueryChange = this.options.onQueryChange;
    const queryStateRef = this.options.queryStateRef;
    const onArrowDown = this.options.onArrowDown;
    const onArrowUp = this.options.onArrowUp;
    const onEnter = this.options.onEnter;
    const onSelect = this.options.onSelect;
    const gap = 8;

    menuElement.style.position = 'fixed';
    menuElement.style.display = 'none';
    document.body.appendChild(menuElement);

    let currentPos: number | null = null;
    let editorView: EditorView | null = null;
    let triggerPos: number | null = null;
    let currentQuery = '';

    const updateMenu = (view: EditorView) => {
      if (currentPos === null) {
        return;
      }

      const coords = view.coordsAtPos(currentPos);
      let top = coords.bottom + gap;
      let left = coords.left;

      if (top + menuElement.offsetHeight > window.innerHeight) {
        top = coords.top - menuElement.offsetHeight - gap;
      }

      left = Math.max(
        8,
        Math.min(left, window.innerWidth - menuElement.offsetWidth - 8),
      );

      menuElement.style.display = 'flex';
      menuElement.style.top = `${top}px`;
      menuElement.style.left = `${left}px`;
    };

    const scrollListener = () => {
      if (
        menuElement.style.display === 'none' ||
        currentPos === null ||
        !editorView
      ) {
        return;
      }

      updateMenu(editorView);
    };

    window.addEventListener('scroll', scrollListener, true);

    const hideMenu = () => {
      menuElement.style.display = 'none';
      triggerPos = null;
      currentPos = null;
      currentQuery = '';

      if (queryStateRef) {
        queryStateRef.current = '';
      }

      if (onQueryChange) {
        onQueryChange('');
      }
    };

    const isMenuVisible = (): boolean => menuElement.style.display !== 'none';

    const deleteTriggerText = (): void => {
      if (triggerPos === null || !editorView) {
        return;
      }

      const { state } = editorView;
      const { from } = state.selection;

      // Delete from trigger position (including the trigger character) to
      // current cursor triggerPos points to after the trigger, so we need to
      // go back 1 to include it

      const deleteFrom = triggerPos - 1;
      const deleteTo = from;

      if (deleteFrom >= 0 && deleteTo > deleteFrom) {
        const tr = state.tr.delete(deleteFrom, deleteTo);
        editorView.dispatch(tr);
      }
    };

    // Expose onSelect callback with deleteTrigger and hideMenu functions
    // This allows external code (like mouse clicks) to properly clean up

    if (onSelect) {
      onSelect(deleteTriggerText, hideMenu);
    }

    return [
      new Plugin({
        key: new PluginKey('block-menu'),
        view(view: EditorView): PluginView {
          editorView = view;

          return {
            update(innerView: EditorView): void {
              const { state } = innerView;
              const { from } = state.selection;

              if (!triggerPos) {
                return;
              }

              if (from < triggerPos) {
                hideMenu();
                return;
              }

              const $from = state.selection.$from;
              if (
                $from.depth === 0 ||
                $from.nodeBefore?.type.name === 'paragraph' ||
                $from.nodeAfter?.type.name === 'paragraph'
              ) {
                hideMenu();
                return;
              }

              const queryText = state.doc.textBetween(
                triggerPos,
                from,
                undefined,
                '\ufffc',
              );

              if (INPUT_REGEX.test(queryText)) {
                hideMenu();
                return;
              }

              if (currentQuery !== queryText) {
                currentQuery = queryText;

                if (queryStateRef) {
                  queryStateRef.current = currentQuery;
                }

                if (onInputUpdate) {
                  onInputUpdate(currentQuery);
                }

                if (onQueryChange) {
                  onQueryChange(currentQuery);
                }
              }

              currentPos = from;
              updateMenu(innerView);
            },
            destroy(): void {
              menuElement.remove();
              editorView = null;
              window.removeEventListener('scroll', scrollListener, true);
            },
          };
        },
        props: {
          handleTextInput(
            view: EditorView,
            from: number,
            _: number,
            text: string,
          ): boolean {
            const { state } = view;

            if (text === trigger && canOpen(state)) {
              currentPos = from + 1;
              triggerPos = from + 1;
              currentQuery = '';

              if (queryStateRef) {
                queryStateRef.current = '';
              }

              updateMenu(view);
            }

            return false;
          },
          handleKeyDown(_: EditorView, event: KeyboardEvent): boolean {
            if (event.key === 'Escape') {
              hideMenu();
              return true;
            }

            if (!isMenuVisible()) {
              return false;
            }

            if (event.key === 'ArrowDown') {
              if (onArrowDown) {
                onArrowDown();
              }

              return true;
            }

            if (event.key === 'ArrowUp') {
              if (onArrowUp) {
                onArrowUp();
              }

              return true;
            }

            if (event.key === 'Enter' || event.key === 'Tab') {
              if (onEnter) {
                onEnter();
              }

              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});

export type { TBlockMenuOptions };

export { BlockMenuExtension };
