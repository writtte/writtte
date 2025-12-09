const main = async (): Promise<void> => {
  // Add main content here
};

// biome-ignore lint/nursery/noFloatingPromises: A floating promise is required here
(async () => await main())();
