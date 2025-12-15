import { idb } from '@velovra-internal/indexed-db';
import { type TStore, createStore } from '@velovra-internal/store';
import { buildError } from '../../helpers/error/build';

const DB_VERSION = 1;

const DB_NAME = 'velovra';

const STORE_NAMES = {
  DOCUMENTS: 'documents',
};

type TIDBDocument = {
  accountCode: string;
  documentCode: string;
  title: string;
  lifecycleState: string;
  workflowState: string;
};

type TIndexedDBStore = {
  idbInstance: IDBDatabase | null;
};

const indexedDBStore: TStore<TIndexedDBStore> = createStore<TIndexedDBStore>({
  idbInstance: null,
});

const initializeIDB = async (): Promise<void> => {
  if (indexedDBStore.getState().idbInstance) {
    return;
  }

  const db = await idb.open(DB_NAME, DB_VERSION, (database: IDBDatabase) => {
    setupItemStore(database);
  });

  indexedDBStore.setState({
    idbInstance: db,
  });
};

const getIndexedDB = (): IDBDatabase => {
  const instance = indexedDBStore.getState().idbInstance;
  if (!instance) {
    throw new Error(buildError('indexed db instance is not available'));
  }

  return instance;
};

const setupItemStore = (database: IDBDatabase): void => {
  const store = database.createObjectStore(STORE_NAMES.DOCUMENTS, {
    keyPath: 'documentCode',
  });

  store.createIndex('documentCode', 'documentCode', {
    unique: false,
  });
};

export type { TIDBDocument, TIndexedDBStore };

export { DB_VERSION, DB_NAME, STORE_NAMES, initializeIDB, getIndexedDB };
