import { type TStore, createStore } from '@velovra-internal/store';

type TStoreAccountOverview = {
  code: string;
  emailAddress: string;
  name: string;
  status: string;
  isEmailVerified: boolean;
};

const initialState: TStoreAccountOverview = {
  code: '',
  emailAddress: '',
  name: '',
  status: '',
  isEmailVerified: false,
};

var isOverviewLoaded: boolean = false;

const accountOverviewStore: TStore<TStoreAccountOverview> =
  createStore(initialState);

const getAccountOverview = (): TStoreAccountOverview =>
  accountOverviewStore.getState();

const updateAccountOverview = (data: Partial<TStoreAccountOverview>): void =>
  accountOverviewStore.setState(data);

const updateOverviewLoadedStatus = (isLoaded: boolean): void => {
  isOverviewLoaded = isLoaded;
};

export type { TStoreAccountOverview };

export {
  isOverviewLoaded,
  accountOverviewStore,
  getAccountOverview,
  updateAccountOverview,
  updateOverviewLoadedStatus,
};
