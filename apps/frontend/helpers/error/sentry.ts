import { captureException } from '@sentry/browser';
import { ENVIRONMENT_CONFIGS } from '../../configs/env';

const DEDUPE_WINDOW_MS = 5000; // 5 seconds

type TErrorCacheMap = Map<string, number>;

const errorCache: TErrorCacheMap = new Map<string, number>();

const getErrorKey = (error: unknown): string => {
  if (error instanceof Error) {
    return `${error.name}:${error.message}:${error.stack?.split('\n')[1] || ''}`;
  }

  return String(error);
};

const logFatalToSentry = (error: unknown): void => {
  if (ENVIRONMENT_CONFIGS.ENVIRONMENT !== 'production') {
    // biome-ignore lint/suspicious/noConsole: Console trace is required here
    console.trace(error);
  }

  const errorKey = getErrorKey(error);
  const now = Date.now();

  const lastLogged = errorCache.get(errorKey);
  if (lastLogged && now - lastLogged < DEDUPE_WINDOW_MS) {
    // Skip logging to prevent spam

    return;
  }

  errorCache.set(errorKey, now);

  for (const [key, timestamp] of errorCache.entries()) {
    if (now - timestamp > DEDUPE_WINDOW_MS) {
      errorCache.delete(key);
    }
  }

  captureException(error);
};

export { logFatalToSentry };
