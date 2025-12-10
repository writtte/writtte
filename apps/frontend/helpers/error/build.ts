const buildError = (msg: string, err?: unknown): string => {
  if (err instanceof Error) {
    return `${msg}: ${err.message}`;
  }

  if (err !== undefined) {
    return `${msg}: ${String(err)}`;
  }

  return msg;
};

export { buildError };
