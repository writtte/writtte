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

export { normalizeNewlines, tabsPrefixForListItem };
