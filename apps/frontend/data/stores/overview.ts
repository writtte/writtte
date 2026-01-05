import { type TStore, createStore } from '@writtte-internal/store';

type TStoreAccountOverview = {
  code: string;
  emailAddress: string;
  name: string;
  status: string;
  subscriptionStatus: string;
  availableFreeTrialDates: number | undefined;
  isEmailVerified: boolean;
};

const initialState: TStoreAccountOverview = {
  code: '',
  emailAddress: '',
  name: '',
  status: '',
  subscriptionStatus: '',
  availableFreeTrialDates: undefined,
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

const isAccountInFreeTrial = (): {
  isFreeTrial: boolean;
  isFreeTrialExpired: boolean | undefined;
  availableDays: number | undefined;
} => {
  if (
    accountOverviewStore.getState().subscriptionStatus !== 'no_subscription'
  ) {
    return {
      isFreeTrial: false,
      isFreeTrialExpired: undefined,
      availableDays: undefined,
    };
  }

  const availableDays = accountOverviewStore.getState().availableFreeTrialDates;
  if (!availableDays) {
    return {
      isFreeTrial: false,
      isFreeTrialExpired: undefined,
      availableDays: undefined,
    };
  }

  return {
    isFreeTrial: true,
    isFreeTrialExpired: availableDays <= 0,
    availableDays,
  };
};

export type { TStoreAccountOverview };

export {
  isOverviewLoaded,
  accountOverviewStore,
  getAccountOverview,
  updateAccountOverview,
  updateOverviewLoadedStatus,
  isAccountInFreeTrial,
};
