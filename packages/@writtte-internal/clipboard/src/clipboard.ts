const copyToClipboard = async (
  content: unknown,
  options?: {
    stringifyObjects?: boolean;
    mimeType?: string;
    serializer?: (value: unknown) => string;
    prettyPrint?: boolean;
    jsonIndent?: number;
    useFallback?: boolean;
  },
): Promise<boolean> => {
  const {
    stringifyObjects = true,
    mimeType = 'text/plain',
    serializer,
    prettyPrint = true,
    jsonIndent = 2,
    useFallback = true,
  } = options ?? {};

  try {
    let textContent: string;

    if (serializer) {
      textContent = serializer(content);
    } else if (content === null || content === undefined) {
      textContent = '';
    } else if (typeof content === 'string') {
      textContent = content;
    } else if (typeof content === 'number' || typeof content === 'boolean') {
      textContent = String(content);
    } else if (content instanceof Error) {
      textContent = content.stack || content.message || String(content);
    } else if (content instanceof Date) {
      textContent = content.toISOString();
    } else if (typeof content === 'function') {
      textContent = content.toString();
    } else if (typeof content === 'symbol') {
      textContent = content.toString();
    } else if (typeof content === 'bigint') {
      textContent = content.toString();
    } else if (stringifyObjects) {
      try {
        textContent = prettyPrint
          ? JSON.stringify(content, null, jsonIndent)
          : JSON.stringify(content);
      } catch {
        textContent = String(content);
      }
    } else {
      textContent = String(content);
    }

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.write === 'function'
    ) {
      try {
        const blob = new Blob([textContent], { type: mimeType });
        const clipboardItem = new ClipboardItem({ [mimeType]: blob });

        await navigator.clipboard.write([clipboardItem]);
        return true;
      } catch {
        if (useFallback && mimeType === 'text/plain') {
          try {
            await navigator.clipboard.writeText(textContent);
            return true;
          } catch {
            return false;
          }
        }

        return false;
      }
    }

    return false;
  } catch {
    return false;
  }
};

export { copyToClipboard };
