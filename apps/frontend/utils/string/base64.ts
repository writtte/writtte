const encodeBase64 = (str: string): string => {
  try {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str).toString('base64');
    }

    return btoa(str);
  } catch (error) {
    throw new Error(`failed to encode string to base64: ${error}`);
  }
};

const decodeBase64 = (base64Str: string): string => {
  try {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(base64Str, 'base64').toString();
    }

    return atob(base64Str);
  } catch {
    return '';
  }
};

export { encodeBase64, decodeBase64 };
