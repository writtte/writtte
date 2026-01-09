// This function is executed on the shared document page, so images
// are expected to load via the CDN.

const checkAndSetImagesInSharedDocument = (
  elementToCheck: HTMLElement,
): void => {
  const elements = elementToCheck.querySelectorAll('[data-image-code]');
  for (let i = 0; i < elements.length; i++) {
    if (!(elements[i] instanceof HTMLImageElement)) {
      elements[i].remove();
      continue;
    }

    const publicUrl = elements[i].getAttribute('data-public-url');
    if (!publicUrl) {
      elements[i].remove();
      continue;
    }

    (elements[i] as HTMLImageElement).src = publicUrl;
  }
};

export { checkAndSetImagesInSharedDocument };
