import {
  type AnyExtension,
  type CommandProps,
  Extension,
  type RawCommands,
} from '@tiptap/core';

type TBlockPlaceholderOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockPlaceholder: {
      addPlaceholder: (element: HTMLElement, id: string) => ReturnType;
      removePlaceholder: (id: string) => ReturnType;
      removeAllPlaceholders: () => ReturnType;
    };
  }
}

const BlockPlaceholderExtension: AnyExtension =
  Extension.create<TBlockPlaceholderOptions>({
    name: 'blockPlaceholder',
    addOptions(): TBlockPlaceholderOptions {
      return {
        HTMLAttributes: {},
      };
    },
    addStorage(): {
      placeholders: Record<string, HTMLElement>;
    } {
      return {
        placeholders: {},
      };
    },
    addCommands(): Partial<RawCommands> {
      return {
        addPlaceholder:
          (element: HTMLElement, id: string) =>
          ({ editor, dispatch, tr }: CommandProps) => {
            if (!dispatch || !tr) {
              return false;
            }

            tr.setMeta('addToHistory', false);

            const placeholderId = element.id || id;
            if (!element.id) {
              element.id = placeholderId;
            }

            this.storage.placeholders[placeholderId] = element;

            const editorElement = editor.options.element;
            if (!editorElement || typeof editorElement === 'function') {
              return false;
            }

            const domElement =
              'mount' in editorElement
                ? editorElement.mount
                : (editorElement as HTMLElement);

            domElement.appendChild(element);

            dispatch(tr);
            return true;
          },
        removePlaceholder:
          (id: string) =>
          ({ dispatch, tr }: CommandProps) => {
            if (!dispatch || !tr) {
              return false;
            }

            tr.setMeta('addToHistory', false);

            const placeholder = this.storage.placeholders[id];
            if (!placeholder) {
              return false;
            }

            if (placeholder.parentNode) {
              placeholder.parentNode.removeChild(placeholder);
            }

            delete this.storage.placeholders[id];

            dispatch(tr);
            return true;
          },
        removeAllPlaceholders:
          () =>
          ({ dispatch, tr }: CommandProps) => {
            if (!dispatch || !tr) {
              return false;
            }

            tr.setMeta('addToHistory', false);

            const placeholders = Object.values(this.storage.placeholders);
            for (let i = 0; i < placeholders.length; i++) {
              const element = placeholders[i] as HTMLElement;
              if (element.parentNode) {
                element.parentNode.removeChild(element);
              }
            }

            this.storage.placeholders = {};

            dispatch(tr);
            return true;
          },
      };
    },
  });

export type { TBlockPlaceholderOptions };

export { BlockPlaceholderExtension };
