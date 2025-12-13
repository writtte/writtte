// biome-ignore-all lint/suspicious/noConsole: Console logs are required

const setLocalStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('error setting localStorage item:', error);
  }
};

const getLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('error getting localStorage item:', error);
    return null;
  }
};

const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('error removing localStorage item:', error);
  }
};

const hasLocalStorage = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error('error checking localStorage item:', error);
    return false;
  }
};

const getAllLocalStorage = (): Record<string, string> => {
  const items: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        items[key] = localStorage.getItem(key) || '';
      }
    }
  } catch (error) {
    console.error('error getting all localStorage items:', error);
  }

  return items;
};

const clearAllLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('error clearing localStorage:', error);
  }
};

export {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  hasLocalStorage,
  getAllLocalStorage,
  clearAllLocalStorage,
};
