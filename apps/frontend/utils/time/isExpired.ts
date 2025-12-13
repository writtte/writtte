const isExpired = (expirationTime: string, limit: number): boolean => {
  const timestamp = parseInt(expirationTime || '0', 10);
  const currentTime = Date.now();

  return currentTime - timestamp > limit;
};

export { isExpired };
