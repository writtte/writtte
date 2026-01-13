// This function is executed on the version document modal, so images
// are expected to load via the CDN.

const checkAndSetImagesInVersionDocument = (
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

export { checkAndSetImagesInVersionDocument };
