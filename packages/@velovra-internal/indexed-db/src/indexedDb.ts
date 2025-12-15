const openIdb = async (
  name: string,
  version: number,
  upgradeCallback?: (db: IDBDatabase) => void,
): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = indexedDB.open(name, version);

    request.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (upgradeCallback !== undefined) {
        upgradeCallback(db);
      }
    };

    request.onsuccess = (): void => {
      resolve(request.result);
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const addDataToIdb = async (
  db: IDBDatabase,
  storeName: string,
  data: object,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    const request = store.add(data);

    request.onsuccess = (): void => {
      resolve();
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const retrieveDataFromIdb = async (
  db: IDBDatabase,
  storeName: string,
  key: IDBValidKey,
  // biome-ignore lint/suspicious/noExplicitAny: Use any here
): Promise<any> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);

    const request = store.get(key);

    request.onsuccess = (): void => {
      resolve(request.result);
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const updateDataInIdb = async (
  db: IDBDatabase,
  storeName: string,
  data: object,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = (): void => {
      resolve();
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const deleteDataFromIdb = async (
  db: IDBDatabase,
  storeName: string,
  key: IDBValidKey,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = (): void => {
      resolve();
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const clearStoreInIdb = async (
  db: IDBDatabase,
  storeName: string,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = (): void => {
      resolve();
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const getObjectByKeyFromIdb = async <T>(
  db: IDBDatabase,
  storeName: string,
  key: IDBValidKey,
): Promise<T | undefined> =>
  new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = (): void => {
        resolve(request.result as T | undefined);
      };

      request.onerror = (): void => {
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });

const getSpecificDataFromIdb = async <T, K extends keyof T>(
  db: IDBDatabase,
  storeName: string,
  key: IDBValidKey,
  propertyName: K,
): Promise<T[K] | undefined> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = (): void => {
      if (request.result && propertyName in request.result) {
        resolve(request.result[propertyName as string] as T[K]);
      } else {
        resolve(undefined);
      }
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const getAllDataFromIdb = async (
  db: IDBDatabase,
  storeName: string,
  // biome-ignore lint/suspicious/noExplicitAny: Use any here
): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = (): void => {
      resolve(request.result);
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const getAllKeysFromIdb = async (
  db: IDBDatabase,
  storeName: string,
): Promise<IDBValidKey[]> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAllKeys();

    request.onsuccess = (): void => {
      resolve(request.result);
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const countDataInIdb = async (
  db: IDBDatabase,
  storeName: string,
  query?: IDBValidKey | IDBKeyRange,
): Promise<number> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.count(query);

    request.onsuccess = (): void => {
      resolve(request.result);
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const getDataByIndexFromIdb = async (
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  key: IDBValidKey,
  // biome-ignore lint/suspicious/noExplicitAny: Use any here
): Promise<any> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.get(key);

    request.onsuccess = (): void => {
      resolve(request.result);
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const getAllDataByIndexFromIdb = async (
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  query?: IDBValidKey | IDBKeyRange,
  // biome-ignore lint/suspicious/noExplicitAny: Use any here
): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(query);

    request.onsuccess = (): void => {
      resolve(request.result);
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const iterateWithCursorInIdb = async (
  db: IDBDatabase,
  storeName: string,
  // biome-ignore lint/suspicious/noExplicitAny: Use any here
  callback: (value: any, key: IDBValidKey) => boolean,
  direction: IDBCursorDirection = 'next',
): Promise<void> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.openCursor(null, direction);

    request.onsuccess = (): void => {
      const cursor = request.result;
      if (cursor) {
        const shouldContinue = callback(cursor.value, cursor.key);
        if (shouldContinue !== false) {
          cursor.continue();
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

const deleteDbIdb = async (name: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);

    request.onsuccess = (): void => {
      resolve();
    };

    request.onerror = (): void => {
      reject(request.error);
    };

    request.onblocked = (): void => {
      reject(new Error(`delete database ${name} is blocked`));
    };
  });

const checkKeyExistsInIdb = async (
  db: IDBDatabase,
  storeName: string,
  key: IDBValidKey,
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = (): void => {
      resolve(request.result !== undefined);
    };

    request.onerror = (): void => {
      reject(request.error);
    };
  });

// biome-ignore lint/nursery/useExplicitType: It's ok not to define the type here
const idb = {
  open: openIdb,
  addData: addDataToIdb,
  retrieveData: retrieveDataFromIdb,
  updateData: updateDataInIdb,
  deleteData: deleteDataFromIdb,
  clearStore: clearStoreInIdb,
  getObject: getObjectByKeyFromIdb,
  getData: getSpecificDataFromIdb,
  getAllData: getAllDataFromIdb,
  getAllKeys: getAllKeysFromIdb,
  countData: countDataInIdb,
  getDataByIndex: getDataByIndexFromIdb,
  getAllDataByIndex: getAllDataByIndexFromIdb,
  iterateWithCursor: iterateWithCursorInIdb,
  deleteDatabase: deleteDbIdb,
  checkKeyExists: checkKeyExistsInIdb,
};

export { idb };
