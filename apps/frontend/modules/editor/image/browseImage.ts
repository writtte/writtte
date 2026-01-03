import type { TImageAttributes } from '@writtte-editor/editor';
import { getMainEditor } from '../../../data/stores/mainEditor';
import { ALLOWED_IMAGE_FILE_EXTENSIONS } from '../options/editorOptions';
import { imageUpload } from './imageUpload';

const ALLOWED_MIME_TYPES: string = ALLOWED_IMAGE_FILE_EXTENSIONS.map((ext) => {
  if (ext === 'jpg' || ext === 'jpeg') {
    return 'image/jpeg';
  }

  if (ext === 'svg') {
    return 'image/svg+xml';
  }

  return `image/${ext}`;
}).join(',');

const browseAndInsertImage = async (): Promise<void> => {
  const mainEditor = getMainEditor();

  if (!mainEditor || !mainEditor.documentCode || !mainEditor.api) {
    return;
  }

  const fileInput: HTMLInputElement = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = ALLOWED_MIME_TYPES;
  fileInput.style.display = 'none';

  document.body.appendChild(fileInput);

  return new Promise<void>((resolve) => {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];

      document.body.removeChild(fileInput);

      if (!file) {
        resolve();
        return;
      }

      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

      if (!ALLOWED_IMAGE_FILE_EXTENSIONS.includes(fileExtension)) {
        resolve();
        return;
      }

      // Don't insert image node here. The imageUpload function handles
      // showing a loading indicator via addPlaceholder, and the image
      // will only be inserted after upload completes via setImage

      const updateImage = (attrs: Partial<TImageAttributes>): void => {
        // After upload completes, insert the image with the final attributes

        mainEditor.api?.setImage({
          imageCode: attrs.imageCode ?? '',
          extension: attrs.extension ?? fileExtension,
          src: attrs.src ?? '',
          alt: attrs.alt ?? '',
        });
      };

      imageUpload(file, updateImage)
        .then(() => {
          resolve();
        })
        .catch(() => {
          // Error handling and alerts are done in imageUpload
          // function

          resolve();
        });
    });

    fileInput.addEventListener('cancel', () => {
      document.body.removeChild(fileInput);
      resolve();
    });

    // Fallback for browsers that don't support the 'cancel' event
    // Listen for focus returning to the window without a file selection

    const handleFocusBack = (): void => {
      setTimeout(() => {
        if (fileInput.parentNode && !fileInput.files?.length) {
          document.body.removeChild(fileInput);
          resolve();
        }
        window.removeEventListener('focus', handleFocusBack);
      }, 300);
    };

    window.addEventListener('focus', handleFocusBack);
    fileInput.click();
  });
};

export { browseAndInsertImage };
