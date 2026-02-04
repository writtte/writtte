const downloadFileFromUrl = async (
  url: string,
  fileName: string,
): Promise<Error | undefined> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `failed to fetch file: ${response.status} ${response.statusText}`,
      );
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);

    return;
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }

    return new Error('unknown error occurred while downloading the file');
  }
};

export { downloadFileFromUrl };
