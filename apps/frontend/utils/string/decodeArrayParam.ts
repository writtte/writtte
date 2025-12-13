import { decodeBase64 } from './base64';

type TDecodedItem = {
  key: string;
  value: string;
};

const decodeArrayParam = <T extends Record<string, string>>(
  dataParam: string,
  requiredKeys: (keyof T)[],
): T | null => {
  try {
    const decodedData = decodeBase64(dataParam);
    const decodedJSON = JSON.parse(decodedData) as TDecodedItem[];

    if (!Array.isArray(decodedJSON)) {
      return null;
    }

    const dataMap = Object.fromEntries(
      decodedJSON.map((item) => [item.key, item.value]),
    ) as T;

    const isMissing = requiredKeys.some((key) => {
      const value = dataMap[key];
      return !value || !value.toString().trim().length;
    });

    if (isMissing) {
      return null;
    }

    return dataMap;
  } catch {
    return null;
  }
};

export type { TDecodedItem };

export { decodeArrayParam };
