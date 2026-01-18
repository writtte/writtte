const compareDocuments = (
  idsFromIDB: string[],
  idsFromAPI: string[],
): {
  missedItemIds: string[];
  extraItemIds: string[];
} => {
  // Compare IDB (source of truth) with API data to identify discrepancies
  //  - missedItemIds: items present in IDB but missing from API response
  //  - extraItemIds: items present in API but not found in IDB

  const apiSet = new Set<string>();
  for (let i = 0; i < idsFromAPI.length; i++) {
    apiSet.add(idsFromAPI[i]);
  }

  const idbSet = new Set<string>();
  for (let i = 0; i < idsFromIDB.length; i++) {
    idbSet.add(idsFromIDB[i]);
  }

  const missedItemIds: string[] = [];
  for (let i = 0; i < idsFromIDB.length; i++) {
    if (!apiSet.has(idsFromIDB[i])) {
      missedItemIds.push(idsFromIDB[i]);
    }
  }

  const extraItemIds: string[] = [];
  for (let i = 0; i < idsFromAPI.length; i++) {
    if (!idbSet.has(idsFromAPI[i])) {
      extraItemIds.push(idsFromAPI[i]);
    }
  }

  return { missedItemIds, extraItemIds };
};

export { compareDocuments };
