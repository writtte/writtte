import { idb } from '@writtte-internal/indexed-db';
import { EditorNodeLoadingIndicator } from '../../components/EditorNodeLoadingIndicator';
import {
  PresignedURLAction,
  PresignedURLType,
  v1S3PresignedURL,
} from '../../data/apis/external/aws/v1S3PresignedURL';
import { v1AwsS3GetFile } from '../../data/apis/thirdParty/v1AwsS3GetFile';
import {
  STORE_NAMES,
  type TIDBDocumentImages,
  getIndexedDB,
} from '../../data/stores/indexedDB';
import { getMainEditor } from '../../data/stores/mainEditor';
import { AccessToken } from '../../helpers/account/accessToken';
import { HTTP_STATUS } from '../../utils/data/fetch';

const checkAndSetImages = async (): Promise<void> => {
  const elements = document.querySelectorAll('[data-image-code]');
  for (let i = 0; i < elements.length; i++) {
    const attrValue = elements[i].getAttribute('data-image-code');
    if (attrValue) {
      // biome-ignore lint/performance/noAwaitInLoops: The await inside the loop is required here
      await checkAndSetImage(attrValue, undefined);
    }
  }
};

const checkAndSetImage = async (
  imageCode: string,
  src: string | undefined,
): Promise<void> => {
  const mainEditor = getMainEditor();

  const element = document.querySelector(`[data-image-code="${imageCode}"]`);
  if (!element) {
    return;
  }

  if (element instanceof HTMLImageElement && src) {
    element.src = src;
    return;
  }

  // If `src` is undefined, we need to check both IndexedDB and the API
  // to retrieve the image. If the image comes from the API, a loading
  // state should be shown until it finishes loading.

  const db = getIndexedDB();

  const checkImageInIDB = await idb.getObject<TIDBDocumentImages>(
    db,
    STORE_NAMES.DOCUMENT_IMAGES,
    imageCode,
  );

  if (checkImageInIDB !== undefined) {
    const blobURL = URL.createObjectURL(checkImageInIDB.image);
    if (element instanceof HTMLImageElement && blobURL) {
      element.src = blobURL;

      // The editor should be updated here and I literally wasted
      // fucking hours before realizing this needed to be done.

      mainEditor.api?.updateImage(imageCode, {
        src: blobURL,
      });

      return;
    }
  }

  // If the code reaches this point, it means no data exists in IndexedDB, so
  // the image should be retrieved via the API and stored in IndexedDB.

  // Before retrieving the image from the API, the image loading indicator
  // needs to be set for a better user experience.

  const parentDiv = element.parentElement;
  if (!parentDiv) {
    return;
  }

  const loadingIndicator = EditorNodeLoadingIndicator({
    id: 'editor_node_loading_indicator__mfgzmibptx',
    text: undefined,
  }).element;

  element.classList.add('hide');
  parentDiv.appendChild(loadingIndicator);

  const imageExtension = element.getAttribute('data-extension');
  if (!imageExtension) {
    parentDiv.remove();
    return;
  }

  const { getCurrentAccountData } = AccessToken();

  const accessToken = getCurrentAccountData()?.access_token;
  if (!accessToken) {
    parentDiv.remove();
    return;
  }

  const documentCode = getMainEditor().documentCode ?? '';

  const { status, response } = await v1S3PresignedURL({
    accessToken,
    type: PresignedURLType.DOCUMENT_IMAGE,
    action: PresignedURLAction.GET,
    documentCode,
    imageCode,
    imageExtension,
  });

  if (status !== HTTP_STATUS.OK || !response) {
    parentDiv.remove();
    return;
  }

  const presignedURL = response.results.generated_url;
  if (!presignedURL) {
    parentDiv.remove();
    return;
  }

  const { status: s3GetStatus, results: imageFileFromS3 } =
    await v1AwsS3GetFile({
      presignedURL,
      additionalHeaders: undefined,
    });

  if (s3GetStatus !== HTTP_STATUS.OK || !imageFileFromS3) {
    parentDiv.remove();
    return;
  }

  // Need to store new image details in the indexed db

  const dataToStoreInIDB: TIDBDocumentImages = {
    documentCode,
    imageCode,
    extension: imageExtension,
    image: imageFileFromS3,
  };

  await idb.addData(db, STORE_NAMES.DOCUMENT_IMAGES, dataToStoreInIDB);

  const blobURL = URL.createObjectURL(dataToStoreInIDB.image);
  if (element instanceof HTMLImageElement) {
    element.classList.remove('hide');
    loadingIndicator.remove();

    element.src = blobURL;

    mainEditor.api?.updateImage(imageCode, {
      src: blobURL,
    });

    return;
  }
};

export { checkAndSetImages, checkAndSetImage };
