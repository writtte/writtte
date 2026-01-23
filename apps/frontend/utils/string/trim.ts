const trimString = (str: string, length: number): string => {
  if (!str) {
    return '';
  }

  if (str.length <= length) {
    return str;
  }

  return `${str.substring(0, length)}...`;
};

export { trimString };
