import type { Node as ProsemirrorNode } from 'prosemirror-model';
import {
  type AnyExtension,
  type CommandProps,
  Extension,
  type RawCommands,
} from '@tiptap/core';
import { Plugin, PluginKey, type Transaction } from 'prosemirror-state';

type TTocHeading = {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  position: number;
};

type TTocOptions = {
  scrollOffset: number;
  onUpdate: ((headings: TTocHeading[]) => void) | undefined;
  HTMLAttributes: Record<string, string | number | boolean>;
};

type TTocStorage = {
  headings: TTocHeading[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    toc: {
      refreshTableOfContents: () => ReturnType;
      scrollToHeading: (id: string) => ReturnType;
    };
  }
}

const TocExtension: AnyExtension = Extension.create<TTocOptions>({
  name: 'toc',
  addOptions(): TTocOptions {
    return {
      onUpdate: undefined,
      scrollOffset: 0,
      HTMLAttributes: {},
    };
  },
  addStorage(): TTocStorage {
    return {
      headings: [],
    };
  },
  addCommands(): Partial<RawCommands> {
    return {
      refreshTableOfContents:
        () =>
        ({ tr, dispatch }: CommandProps) => {
          if (dispatch) {
            const meta = { refresh: true };

            tr.setMeta('toc', meta);
            dispatch(tr);
          }

          return true;
        },
      scrollToHeading:
        (id: string) =>
        ({ editor }: CommandProps) => {
          const headings = this.storage.headings as TTocHeading[];
          const heading = headings.find((h) => h.id === id);

          if (!heading) {
            return false;
          }

          try {
            const { doc } = editor.state;

            let targetPos: number | null = null;

            doc.descendants((node: ProsemirrorNode, pos: number) => {
              if (node.type.name === 'heading') {
                const currentId = generateHeadingId(node.textContent, pos);
                if (currentId === heading.id) {
                  targetPos = pos;
                  return false;
                }
              }
            });

            if (targetPos === null) {
              return false;
            }

            const cursorPos = targetPos + 1;

            setTimeout(() => {
              editor.chain().focus().setTextSelection(cursorPos).run();
            }, 100);

            return true;
          } catch {
            return false;
          }
        },
    };
  },
  addProseMirrorPlugins(): Plugin[] {
    const editor = this.editor;
    const storage = this.storage;
    const options = this.options;

    return [
      new Plugin({
        key: new PluginKey('toc'),
        state: {
          init: () => null,
          apply: (tr: Transaction) => {
            // Check if this is a document change or manual
            // refresh

            const tocMeta = tr.getMeta('toc');
            const isRefresh = tocMeta?.refresh === true;
            const docChanged = tr.docChanged;

            if (docChanged || isRefresh) {
              const headings: TTocHeading[] = [];

              tr.doc.descendants((node: ProsemirrorNode, pos: number) => {
                if (node.type.name === 'heading') {
                  const level = node.attrs.level as 1 | 2 | 3 | 4 | 5 | 6;
                  const text = node.textContent;

                  // Generate a unique ID based on text content and
                  // position

                  const id = generateHeadingId(text, pos);

                  headings.push({
                    id,
                    level,
                    text,
                    position: pos,
                  });
                }
              });

              storage.headings = headings;

              if (options.onUpdate) {
                options.onUpdate(headings);
              }
            }

            return null;
          },
        },
        view: () => {
          const headings: TTocHeading[] = [];

          editor.state.doc.descendants((node: ProsemirrorNode, pos: number) => {
            if (node.type.name === 'heading') {
              const level = node.attrs.level as 1 | 2 | 3 | 4 | 5 | 6;
              const text = node.textContent;
              const id = generateHeadingId(text, pos);

              headings.push({
                id,
                level,
                text,
                position: pos,
              });
            }
          });

          storage.headings = headings;

          if (options.onUpdate) {
            options.onUpdate(headings);
          }

          return {
            update: () => {
              // Updates are handled in the state.apply function
            },
            destroy: () => {
              // Cleanup if needed
            },
          };
        },
      }),
    ];
  },
});

const generateHeadingId = (text: string, position: number): string => {
  const baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  return baseSlug ? `${baseSlug}-${position}` : `heading-${position}`;
};

export type { TTocHeading, TTocOptions, TTocStorage };

export { TocExtension };
