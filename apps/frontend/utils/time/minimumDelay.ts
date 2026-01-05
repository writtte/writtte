const minimumDelay = async <T>(
  operation: Promise<T>,
  minimumDisplayTimeMs: number,
): Promise<T> => {
  const startTime = Date.now();

  // Start minimum display timer in parallel with actual
  // operation

  const displayTimerPromise = new Promise<void>((resolve) =>
    setTimeout(resolve, minimumDisplayTimeMs),
  );

  // Wait for both the operation and minimum time to complete

  const [result] = await Promise.all([operation, displayTimerPromise]);

  // If operation finished faster than minimum time, wait for
  // the remainder

  const elapsedTime = Date.now() - startTime;
  if (elapsedTime < minimumDisplayTimeMs) {
    const remainingTime = minimumDisplayTimeMs - elapsedTime;
    await new Promise((resolve) => setTimeout(resolve, remainingTime));
  }

  return result;
};

export { minimumDelay };
