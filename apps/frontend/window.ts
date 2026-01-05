import { logFatalToSentry } from './helpers/error/sentry';

window.onerror = (
  message: string | Event,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error,
): boolean => {
  if (error) {
    logFatalToSentry(error);
  } else {
    const syntheticError = new Error(
      typeof message === 'string' ? message : 'unknown error occurred',
    );

    syntheticError.name = 'WindowError';

    Object.assign(syntheticError, {
      sourceUrl: source,
      lineNumber: lineno,
      columnNumber: colno,
      originalMessage: message,
    });

    logFatalToSentry(syntheticError);
  }

  return false;
};

window.addEventListener(
  'unhandledrejection',
  (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    if (reason instanceof Error) {
      logFatalToSentry(reason);
    } else {
      const syntheticError = new Error(
        typeof reason === 'string' ? reason : JSON.stringify(reason),
      );

      syntheticError.name = 'UnhandledPromiseRejection';

      Object.assign(syntheticError, {
        originalReason: reason,
      });

      logFatalToSentry(syntheticError);
    }
  },
);
