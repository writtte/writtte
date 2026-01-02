import type { TEditorAPI } from '@writtte-editor/editor';
import { type TStore, createStore } from '@writtte-internal/store';
import { buildError } from '../../helpers/error/build';

type TStoreMainEditor = {
  documentCode: string | undefined;
  api: TEditorAPI | undefined;
};

const initialState: TStoreMainEditor = {
  documentCode: undefined,
  api: undefined,
};

var isMainEditorLoaded: boolean = false;

const mainEditorStore: TStore<TStoreMainEditor> = createStore(initialState);

const getMainEditor = (): TStoreMainEditor => mainEditorStore.getState();

const updateMainEditor = (data: Partial<TStoreMainEditor>): void =>
  mainEditorStore.setState(data);

const updateOverviewLoadedStatus = (isLoaded: boolean): void => {
  isMainEditorLoaded = isLoaded;
};

const getEditorAPI = (): TEditorAPI => {
  const { api } = getMainEditor();
  if (api === undefined) {
    throw new Error(buildError('editor instance is not initialized yet'));
  }

  return api;
};

export type { TStoreMainEditor };

export {
  isMainEditorLoaded,
  mainEditorStore,
  getMainEditor,
  updateMainEditor,
  updateOverviewLoadedStatus,
  getEditorAPI,
};
