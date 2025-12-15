const documentCodeToKey = (itemCode: string): string => {
  let hash = 2166136261;
  for (let i = 0; i < itemCode.length; i++) {
    hash ^= itemCode.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return (hash >>> 0).toString(36);
};

export { documentCodeToKey };
