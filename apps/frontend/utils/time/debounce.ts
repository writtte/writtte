type TDebounceOptions = {
  delay: number | undefined;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

// biome-ignore lint/suspicious/noExplicitAny: Type `any` is required here
const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  options: TDebounceOptions = {
    delay: undefined,
    leading: undefined,
    trailing: undefined,
    maxWait: undefined,
  },
): ((...args: Parameters<T>) => void) & {
  flush: () => void;
  cancel: () => void;
  pending: () => boolean;
} => {
  const { delay = 300, leading = false, trailing = true, maxWait } = options;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let maxWaitTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime = 0;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: unknown;
  let result: ReturnType<T>;
  let leadingEdgeCalled = false;
  let isPending = false;

  const shouldInvoke = (time: number): boolean => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= delay ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  };

  const invokeFunc = (time: number): ReturnType<T> => {
    const args = lastArgs;
    const thisArg = lastThis as ThisParameterType<T>;

    lastArgs = undefined;
    lastThis = undefined;
    lastInvokeTime = time;
    isPending = false;
    leadingEdgeCalled = false;
    result = fn.apply(thisArg, args as Parameters<T>) as ReturnType<T>;

    return result;
  };

  const trailingEdge = (time: number): void => {
    timeoutId = undefined;

    if (trailing && lastArgs) {
      invokeFunc(time);
    }

    lastArgs = undefined;
    lastThis = undefined;
    isPending = false;
  };

  const leadingEdge = (time: number): ReturnType<T> => {
    leadingEdgeCalled = true;
    lastInvokeTime = time;
    isPending = true;

    timeoutId = setTimeout(() => {
      trailingEdge(Date.now());
    }, delay);

    if (leading) {
      return invokeFunc(time);
    }

    // For non-leading edge, we need to return something valid
    // Since the function hasn't been called yet, we'll return undefined
    // as ReturnType<T>

    return undefined as ReturnType<T>;
  };

  const remainingWait = (time: number): number => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = delay - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  };

  const timerExpired = (): void => {
    const time = Date.now();

    if (shouldInvoke(time)) {
      trailingEdge(time);
      return;
    }

    timeoutId = setTimeout(timerExpired, remainingWait(time));
  };

  const debounced = function (this: unknown, ...args: Parameters<T>): void {
    const time = Date.now();
    lastCallTime = time;
    lastArgs = args;
    lastThis = this;
    isPending = true;

    if (shouldInvoke(time)) {
      if (timeoutId === undefined && !leadingEdgeCalled) {
        leadingEdge(time);
        return;
      }

      if (maxWait !== undefined) {
        if (maxWaitTimeoutId) {
          clearTimeout(maxWaitTimeoutId);
        }

        maxWaitTimeoutId = setTimeout(() => {
          invokeFunc(Date.now());
          maxWaitTimeoutId = undefined;
        }, maxWait);
      }

      if (timeoutId === undefined) {
        timeoutId = setTimeout(timerExpired, delay);
      }

      return;
    }

    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, delay);
    }
  } as ((...args: Parameters<T>) => void) & {
    flush: () => void;
    cancel: () => void;
    pending: () => boolean;
  };

  debounced.flush = (): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    if (maxWaitTimeoutId !== undefined) {
      clearTimeout(maxWaitTimeoutId);
      maxWaitTimeoutId = undefined;
    }

    if (lastArgs) {
      invokeFunc(Date.now());
    }
  };

  debounced.cancel = (): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    if (maxWaitTimeoutId !== undefined) {
      clearTimeout(maxWaitTimeoutId);
      maxWaitTimeoutId = undefined;
    }

    lastCallTime = 0;
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastThis = undefined;
    leadingEdgeCalled = false;
    isPending = false;
  };

  debounced.pending = (): boolean => isPending;

  return debounced;
};

export type { TDebounceOptions };

export { debounce };
