import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@writtte-internal/local-storage';

type TAccountData = {
  name: string;
  email_address: string;
  access_token: string;
  refresh_token: string;
};

type TAccountsStorage = {
  current_account: string | null;
  logged_accounts: Record<string, TAccountData>;
};

type TAccessToken = {
  setAccountsStorage: (data: TAccountsStorage) => void;
  setAccounts: (accountCode: string, accountData: TAccountData) => void;
  getAccountByCode: (accountCode: string) => TAccountData | null;
  removeAccount: (accountCode: string) => void;
  setCurrentAccount: (accountCode: string) => void;
  getCurrentAccount: () => string | null;
  getCurrentAccountData: () => TAccountData | null;
  getAllAccounts: () => Record<string, TAccountData>;
  updateAccountDetails: (
    accountCode: string,
    updatedDetails: Partial<TAccountData>,
  ) => boolean;
};

const STORAGE_KEY = 'writtte-accounts';

const AccessToken = (): TAccessToken => {
  const getAccountsStorage = (): TAccountsStorage => {
    const storage = getLocalStorage(STORAGE_KEY);

    return storage
      ? JSON.parse(storage)
      : { current_account: null, logged_accounts: {} };
  };

  const setAccountsStorage = (data: TAccountsStorage): void => {
    setLocalStorage(STORAGE_KEY, JSON.stringify(data));
  };

  const setAccounts = (
    accountCode: string,
    accountData: TAccountData,
  ): void => {
    let storage = getAccountsStorage();

    if (!storage || Object.keys(storage).length === 0) {
      storage = { current_account: null, logged_accounts: {} };
    }

    storage.logged_accounts[accountCode] = {
      name: accountData.name,
      email_address: accountData.email_address,
      access_token: accountData.access_token,
      refresh_token: accountData.refresh_token,
    };

    if (!storage.current_account) {
      storage.current_account = accountCode;
    }

    setAccountsStorage(storage);
  };

  const getAccountByCode = (accountCode: string): TAccountData | null => {
    const storage = getAccountsStorage();
    return storage.logged_accounts[accountCode] || null;
  };

  const removeAccount = (accountCode: string): void => {
    const storage = getAccountsStorage();
    delete storage.logged_accounts[accountCode];

    if (storage.current_account === accountCode) {
      storage.current_account = Object.keys(storage.logged_accounts)[0] || null;
    }

    if (Object.keys(storage.logged_accounts).length === 0) {
      removeLocalStorage(STORAGE_KEY);
    } else {
      setAccountsStorage(storage);
    }
  };

  const setCurrentAccount = (accountCode: string): void => {
    const storage = getAccountsStorage();
    if (storage.logged_accounts[accountCode]) {
      storage.current_account = accountCode;
      setAccountsStorage(storage);
    }
  };

  const getCurrentAccount = (): string | null => {
    const storage = getAccountsStorage();
    return storage.current_account;
  };

  const getCurrentAccountData = (): TAccountData | null => {
    const currentAccountCode = getCurrentAccount();
    if (!currentAccountCode) {
      return null;
    }

    return getAccountByCode(currentAccountCode);
  };

  const getAllAccounts = (): Record<string, TAccountData> => {
    const storage = getAccountsStorage();
    return storage.logged_accounts;
  };

  const updateAccountDetails = (
    accountCode: string,
    updatedDetails: Partial<TAccountData>,
  ): boolean => {
    const storage = getAccountsStorage();
    if (storage.logged_accounts[accountCode]) {
      storage.logged_accounts[accountCode] = {
        ...storage.logged_accounts[accountCode],
        ...updatedDetails,
      };

      setAccountsStorage(storage);
      return true;
    }

    return false;
  };

  return {
    setAccountsStorage,
    setAccounts,
    getAccountByCode,
    removeAccount,
    setCurrentAccount,
    getCurrentAccount,
    getCurrentAccountData,
    getAllAccounts,
    updateAccountDetails,
  };
};

export type { TAccountData, TAccountsStorage };

export { AccessToken };
