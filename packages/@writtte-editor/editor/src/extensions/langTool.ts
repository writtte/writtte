import type { Node as ProsemirrorNode } from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';
import {
  type AnyExtension,
  type CommandProps,
  Extension,
  type RawCommands,
} from '@tiptap/core';
import { idb } from '@writtte-internal/indexed-db';
import {
  Plugin,
  PluginKey,
  type PluginView,
  type Transaction,
} from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

type TLangToolOptions = {
  apiUrl: string;
  language: string;
  documentId: string | number | null;
  databaseName: string;
  chunkSize: number;
  maxSuggestions: number;
  bearer: string | undefined;
  HTMLAttributes: Record<string, string | number | boolean>;
  onProofreadStart: (() => void) | undefined;
  onProofreadComplete: (() => void) | undefined;
  onError: ((error: Error) => void) | undefined;
};

type TLangToolStorage = {
  isActive: boolean;
  isLoading: boolean;
  currentMatch: TLanguageToolMatch | null;
  matchRange: { from: number; to: number } | null;
  decorations: DecorationSet;
  db: IDBDatabase | null;
  maxSuggestions: number;
};

type TLanguageToolMatch = {
  message: string;
  shortMessage: string;
  replacements: Array<{ value: string }>;
  offset: number;
  length: number;
  context: {
    text: string;
    offset: number;
    length: number;
  };
  sentence: string;
  rule: {
    id: string;
    description: string;
    issueType: string;
    category: {
      id: string;
      name: string;
    };
  };
};

type TLanguageToolResponse = {
  code: number;
  status: boolean;
  id: string;
  results: {
    software: {
      name: string;
      version: string;
      buildDate: string;
      apiVersion: number;
      premium: boolean;
      premiumHint: string;
      status: string;
    };
    warnings: {
      incompleteResults: boolean;
    };
    language: {
      name: string;
      code: string;
      detectedLanguage: {
        name: string;
        code: string;
        confidence: number;
      };
    };
    matches: TLanguageToolMatch[];
  };
};

type TIgnoredSuggestion = {
  id?: number;
  value: string;
  documentId: string | number;
  timestamp: number;
};

type TTextNodeWithPosition = {
  text: string;
  from: number;
  to: number;
};

type TChunk = {
  text: string;
  from: number;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    langTool: {
      proofreadDocument: () => ReturnType;
      toggleLangTool: () => ReturnType;
      acceptSuggestion: (replacement: string) => ReturnType;
      ignoreSuggestion: () => ReturnType;
      clearMatch: () => ReturnType;
      setLanguage: (language: string) => ReturnType;
    };
  }
}

const wordCountingRegex = /\s+/;

const LangToolExtension: AnyExtension = Extension.create<TLangToolOptions>({
  name: 'langTool',
  addOptions(): TLangToolOptions {
    return {
      apiUrl: '',
      language: 'auto',
      documentId: null,
      databaseName: '',
      chunkSize: 500,
      maxSuggestions: 5,
      bearer: undefined,
      HTMLAttributes: {},
      onProofreadStart: undefined,
      onProofreadComplete: undefined,
      onError: undefined,
    };
  },
  addStorage(): TLangToolStorage {
    return {
      isActive: true,
      isLoading: false,
      currentMatch: null,
      matchRange: null,
      decorations: DecorationSet.empty,
      db: null,
      maxSuggestions: this.options.maxSuggestions,
    };
  },
  addCommands(): Partial<RawCommands> {
    return {
      proofreadDocument:
        () =>
        ({ tr, dispatch, view }: CommandProps) => {
          if (
            !this.storage.isActive ||
            !this.options.apiUrl ||
            !this.options.databaseName
          ) {
            return false;
          }

          tr.setMeta('proofreadDocument', { view });
          if (dispatch) {
            dispatch(tr);
          }

          return true;
        },
      toggleLangTool: () => () => {
        this.storage.isActive = !this.storage.isActive;

        if (!this.storage.isActive) {
          this.storage.decorations = DecorationSet.empty;
          this.storage.currentMatch = null;
          this.storage.matchRange = null;
        }

        return true;
      },
      acceptSuggestion:
        (replacement: string) =>
        ({ dispatch, tr }: CommandProps) => {
          if (!this.storage.matchRange || !dispatch || !this.storage.isActive) {
            return false;
          }

          const { from, to } = this.storage.matchRange;

          tr.insertText(replacement, from, to);
          tr.setMeta('addToHistory', true);

          this.storage.currentMatch = null;
          this.storage.matchRange = null;

          const decorationsToRemove = this.storage.decorations.find(from, to);

          this.storage.decorations =
            this.storage.decorations.remove(decorationsToRemove);

          dispatch(tr);
          return true;
        },
      ignoreSuggestion:
        () =>
        ({ state, dispatch, tr }: CommandProps) => {
          if (!this.storage.matchRange || !dispatch || !this.storage.isActive) {
            return false;
          }

          const { from, to } = this.storage.matchRange;
          const text = state.doc.textBetween(from, to);

          const decorationsToRemove = this.storage.decorations.find(from, to);
          this.storage.decorations =
            this.storage.decorations.remove(decorationsToRemove);

          this.storage.currentMatch = null;
          this.storage.matchRange = null;

          tr.setMeta('addToHistory', false);
          tr.setMeta('ignoreSuggestion', text);
          dispatch(tr);

          return true;
        },
      clearMatch: () => () => {
        this.storage.currentMatch = null;
        this.storage.matchRange = null;
        return true;
      },
      setLanguage:
        (language: string) =>
        ({ tr, dispatch }: CommandProps) => {
          if (!language || typeof language !== 'string') {
            return false;
          }

          this.options.language = language;

          this.storage.decorations = DecorationSet.empty;
          this.storage.currentMatch = null;
          this.storage.matchRange = null;

          if (this.storage.isActive && dispatch) {
            tr.setMeta('proofreadDocument', true);
            dispatch(tr);
          }

          return true;
        },
    };
  },
  addProseMirrorPlugins(): Plugin[] {
    const initializeDatabase = async (): Promise<void> => {
      if (!this.options.documentId || !this.options.databaseName) {
        return;
      }

      try {
        this.storage.db = await idb.open(
          this.options.databaseName,
          1,
          (db: IDBDatabase): void => {
            if (!db.objectStoreNames.contains('ignored-suggestions')) {
              const store = db.createObjectStore('ignored-suggestions', {
                keyPath: 'id',
                autoIncrement: true,
              });

              store.createIndex('document-value', ['documentId', 'value'], {
                unique: true,
              });

              store.createIndex('documentId', 'documentId', {
                unique: false,
              });
            }
          },
        );
      } catch (error) {
        if (this.options.onError) {
          this.options.onError(error as Error);
        }

        this.storage.isActive = false;
      }
    };

    const isIgnored = async (text: string): Promise<boolean> => {
      if (!this.storage.db || !this.options.documentId) {
        return false;
      }

      try {
        const result = await idb.getDataByIndex(
          this.storage.db,
          'ignored-suggestions',
          'document-value',
          [this.options.documentId, text],
        );
        return result !== undefined;
      } catch {
        return false;
      }
    };

    const addIgnoredSuggestion = async (text: string): Promise<void> => {
      if (!this.storage.db || !this.options.documentId) {
        return;
      }

      const data: TIgnoredSuggestion = {
        value: text,
        documentId: this.options.documentId,
        timestamp: Date.now(),
      };

      try {
        await idb.addData(this.storage.db, 'ignored-suggestions', data);
      } catch {
        // Ignore duplicate key errors
      }
    };

    const createDecoration = (
      from: number,
      to: number,
      match: TLanguageToolMatch,
    ): Decoration => {
      const issueType = match.rule.issueType.toLowerCase();
      const issueClass = `writtte-grammar-${issueType}`;

      return Decoration.inline(from, to, {
        class: `writtte-grammar-mark ${issueClass}`,
        nodeName: 'span',
        'data-grammar-match': JSON.stringify({ match, from, to }),
        ...this.options.HTMLAttributes,
      });
    };

    const fetchGrammarMatches = async (
      text: string,
    ): Promise<TLanguageToolMatch[]> => {
      if (!this.options.apiUrl) {
        return [];
      }

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        };

        if (this.options.bearer) {
          headers.Authorization = `Bearer ${this.options.bearer}`;
        }

        const response = await fetch(this.options.apiUrl, {
          method: 'POST',
          headers,
          body: new URLSearchParams({
            text: text,
            language: this.options.language,
            enabledOnly: 'false',
          }).toString(),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data: TLanguageToolResponse = await response.json();

        if (!data.status || !data.results) {
          throw new Error(
            'Invalid API response: status is false or results missing',
          );
        }

        const filtered: TLanguageToolMatch[] = [];
        for (const match of data.results.matches) {
          const matchText = text.substring(
            match.offset,
            match.offset + match.length,
          );

          // biome-ignore lint/performance/noAwaitInLoops: The await inside this loop is required
          const ignored = await isIgnored(matchText);
          if (!ignored) {
            filtered.push(match);
          }
        }

        return filtered;
      } catch (error) {
        if (this.options.onError) {
          this.options.onError(error as Error);
        }

        return [];
      }
    };

    const setDecorationsForChunk = async (
      doc: ProsemirrorNode,
      text: string,
      offset: number,
    ): Promise<void> => {
      const matches = await fetchGrammarMatches(text);
      const decorations: Decoration[] = [];

      for (const match of matches) {
        const from = match.offset + offset;
        const to = from + match.length;
        decorations.push(createDecoration(from, to, match));
      }

      const decorationsToRemove = this.storage.decorations.find(
        offset,
        offset + text.length,
      );

      this.storage.decorations =
        this.storage.decorations.remove(decorationsToRemove);

      this.storage.decorations = this.storage.decorations.add(doc, decorations);
    };

    const proofreadWholeDocument = async (
      doc: ProsemirrorNode,
      view: EditorView,
    ): Promise<void> => {
      if (!this.storage.isActive || !this.options.apiUrl) {
        return;
      }

      this.storage.isLoading = true;
      if (this.options.onProofreadStart) {
        this.options.onProofreadStart();
      }

      let index = 0;
      const textNodes: TTextNodeWithPosition[] = [];

      doc.descendants((node: ProsemirrorNode, pos: number): void => {
        if (!node.isText) {
          index += 1;
          return;
        }

        const nodeText = node.text || '';

        if (textNodes[index]) {
          textNodes[index].text += nodeText;
          textNodes[index].to = pos + nodeText.length;
        } else {
          textNodes[index] = {
            text: nodeText,
            from: pos,
            to: pos + nodeText.length,
          };
        }
      });

      const filteredNodes = textNodes.filter(Boolean);

      let finalText = '';
      let chunkStartPos = 0;
      let lastPos = 0;

      const chunks: TChunk[] = [];

      for (const { text, from, to } of filteredNodes) {
        if (finalText === '') {
          chunkStartPos = from;
        } else {
          const diff = from - lastPos;
          if (diff > 0) {
            finalText += ' '.repeat(diff);
          }
        }

        lastPos = to;
        finalText += text;

        if (countWords(finalText) >= this.options.chunkSize) {
          chunks.push({
            from: chunkStartPos,
            text: finalText,
          });

          finalText = '';
        }
      }

      if (finalText.trim()) {
        chunks.push({
          from: chunkStartPos,
          text: finalText,
        });
      }

      const requests = chunks.map(
        async ({ text, from }) => await setDecorationsForChunk(doc, text, from),
      );

      await Promise.all(requests);

      this.storage.isLoading = false;
      if (this.options.onProofreadComplete) {
        this.options.onProofreadComplete();
      }

      // Dispatch a transaction to trigger view update
      const tr = view.state.tr;
      tr.setMeta('langToolUpdate', true);
      view.dispatch(tr);
    };

    const updateCurrentMatch = (
      match: TLanguageToolMatch,
      from: number,
      to: number,
    ): void => {
      this.storage.currentMatch = match;
      this.storage.matchRange = { from, to };
    };

    // biome-ignore lint/nursery/noFloatingPromises: Floating promise is required here
    initializeDatabase();

    return [
      new Plugin({
        key: new PluginKey('langTool'),
        state: {
          init: (): DecorationSet => DecorationSet.empty,
          apply: (tr: Transaction): DecorationSet => {
            if (!this.storage.isActive) {
              return DecorationSet.empty;
            }

            const langToolUpdate = tr.getMeta('langToolUpdate');
            const proofreadTrigger = tr.getMeta('proofreadDocument');
            const ignoreSuggestionText = tr.getMeta('ignoreSuggestion');

            if (ignoreSuggestionText) {
              // biome-ignore lint/nursery/noFloatingPromises: Floating promise is required here
              addIgnoredSuggestion(ignoreSuggestionText);
            }

            if (proofreadTrigger) {
              // biome-ignore lint/nursery/noFloatingPromises: Floating promise is required here
              proofreadWholeDocument(tr.doc, proofreadTrigger.view);
            }

            if (langToolUpdate) {
              return this.storage.decorations;
            }

            const mapped = this.storage.decorations.map(tr.mapping, tr.doc);
            this.storage.decorations = mapped;

            return mapped;
          },
        },
        props: {
          decorations: (): DecorationSet => this.storage.decorations,
          attributes: {
            'data-lang-tool-active': `${this.storage.isActive}`,
            spellcheck: 'false',
          },
          handleDOMEvents: {
            mouseover: (_: EditorView, event: MouseEvent): boolean => {
              const target = event.target as HTMLElement;
              if (target.hasAttribute('data-grammar-match')) {
                const matchData = target.getAttribute('data-grammar-match');
                if (matchData) {
                  try {
                    const { match, from, to } = JSON.parse(matchData);
                    updateCurrentMatch(match, from, to);
                  } catch {
                    // Ignore parse errors
                  }
                }
              }

              return false;
            },
          },
        },
        view: (): PluginView => {
          return {
            update: (): void => {
              // View updates handled via transactions
            },
            destroy: (): void => {
              if (this.storage.db) {
                this.storage.db.close();
                this.storage.db = null;
              }
            },
          };
        },
      }),
    ];
  },
});

const countWords = (text: string): number =>
  text.trim().split(wordCountingRegex).filter(Boolean).length;

export type {
  TLangToolOptions,
  TLangToolStorage,
  TLanguageToolMatch,
  TLanguageToolResponse,
  TIgnoredSuggestion,
  TTextNodeWithPosition,
  TChunk,
};

export { LangToolExtension };
