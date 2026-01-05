import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
  enableLogs: true,

  // biome-ignore  lint/correctness/noUndeclaredVariables: This variable was declared in vite config
  release: `writtte-fe-${__APP_VERSION__}`,
});
