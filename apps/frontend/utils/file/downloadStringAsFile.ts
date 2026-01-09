const downloadStringAsFile = (filename: string, content: string): void => {
  const blob = new Blob([content], {
    type: 'text/plain',
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};

export { downloadStringAsFile };
