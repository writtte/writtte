type TListener<T> = (state: T) => void;

type TSelector<T, R> = (state: T) => R;

type TStore<T> = {
  getState: () => T;
  setState: (updater: Partial<T> | ((prevState: T) => Partial<T>)) => void;
  subscribe: (listener: TListener<T>) => () => void;
  useSelector: <R>(selector: TSelector<T, R>) => R;
};

const createStore = <
  T extends Record<
    string,
    JSON | object | string | number | boolean | null | undefined
  >,
>(
  initialState: T,
): TStore<T> => {
  let state = initialState;
  const listeners = new Set<TListener<T>>();

  const getState = (): T => state;

  const setState = (
    updater: Partial<T> | ((prevState: T) => Partial<T>),
  ): void => {
    const updates = typeof updater === 'function' ? updater(state) : updater;

    state = { ...state, ...updates };

    listeners.forEach((listener) => {
      listener(state);
    });
  };

  const subscribe = (listener: TListener<T>): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const useSelector = <R>(selector: TSelector<T, R>): R => selector(state);

  return {
    getState,
    setState,
    subscribe,
    useSelector,
  };
};

export type { TListener, TSelector, TStore };

export { createStore };
