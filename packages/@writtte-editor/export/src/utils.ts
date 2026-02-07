const normalizeNewlines = (text: string): string => {
  const idx = text.indexOf('\n\n');
  return idx === -1 ? text : text.slice(0, idx + 1) + text.slice(idx + 2);
};

const tabsPrefixForListItem = (currentBlock: number): string => {
  if (currentBlock === 0) {
    return '';
  }

  let result = '';
  for (let i = 0; i < currentBlock; i++) {
    result += '\t';
  }

  return result;
};

const extractParagraphContent = (text: string): string => {
  const len = text.length;
  if (len < 7) {
    // "<p></p>" is minimum valid length

    return text;
  }

  if (
    text.charCodeAt(0) !== 60 ||
    text.charCodeAt(1) !== 112 ||
    text.charCodeAt(2) !== 62
  ) {
    // Check <p>

    return text;
  }

  if (
    text.charCodeAt(len - 4) !== 60 ||
    text.charCodeAt(len - 3) !== 47 ||
    text.charCodeAt(len - 2) !== 112 ||
    text.charCodeAt(len - 1) !== 62
  ) {
    // Check </p>

    return text;
  }

  return text.substring(3, len - 4);
};

const textToHTML = (text: string): string => {
  const htmlEntities: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
  };

  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const encodedChar = htmlEntities[char] || char;

    result += `<span>${encodedChar}</span>`;
  }

  return result;
};

export {
  normalizeNewlines,
  tabsPrefixForListItem,
  extractParagraphContent,
  textToHTML,
};
