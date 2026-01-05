import { logFatalToSentry } from './sentry';

const buildError = (msg: string, err?: unknown): string => {
  const errorToLog =
    err instanceof Error
      ? Object.assign(err, { buildErrorMessage: msg })
      : new Error(msg + (err !== undefined ? `: ${String(err)}` : ''));

  logFatalToSentry(errorToLog);

  if (err instanceof Error) {
    return `${msg}: ${err.message}`;
  }

  if (err !== undefined) {
    return `${msg}: ${String(err)}`;
  }

  return msg;
};

export { buildError };
