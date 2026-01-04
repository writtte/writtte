import type { TEditorAPI, TImageAttributes } from '@writtte-editor/editor';
import { idb } from '@writtte-internal/indexed-db';
import { EditorNodeLoadingIndicator } from '../../../components/EditorNodeLoadingIndicator';
import { ALERT_TIMEOUT } from '../../../constants/timeouts';
import { AlertController } from '../../../controller/alert';
import {
  PresignedURLAction,
  PresignedURLType,
  v1S3PresignedURL,
} from '../../../data/apis/external/aws/v1S3PresignedURL';
import { v1AwsS3PutFile } from '../../../data/apis/thirdParty/v1AwsS3PutFile';
import {
  STORE_NAMES,
  type TIDBDocumentImages,
  getIndexedDB,
} from '../../../data/stores/indexedDB';
import { getMainEditor } from '../../../data/stores/mainEditor';
import { AccessToken } from '../../../helpers/account/accessToken';
import { buildError } from '../../../helpers/error/build';
import { langKeys } from '../../../translations/keys';
import { HTTP_STATUS } from '../../../utils/data/fetch';
import { generateUUID } from '../../../utils/string/uuid';

const setupImageForUpload = async (file: File): Promise<TImageAttributes> => {
  const alertController = AlertController();

  const db = getIndexedDB();
  const mainEditor = getMainEditor();

  if (!mainEditor || !mainEditor.documentCode || !mainEditor.api) {
    throw new Error(buildError('main editor store is undefined'));
  }

  setLoadingIndicator(mainEditor.api);

  const imageCode = generateUUID();
  const imageExtension = file.name.split('.').pop()?.toLowerCase() || '';

  let imageSrcFromIDB: string = '';

  try {
    const imageObject: TIDBDocumentImages = {
      documentCode: mainEditor.documentCode,
      imageCode,
      extension: imageExtension,
      image: file,
    };

    await idb.addData(db, STORE_NAMES.DOCUMENT_IMAGES, imageObject);

    const imageBlob = await idb.getObject<TIDBDocumentImages>(
      db,
      STORE_NAMES.DOCUMENT_IMAGES,
      imageCode,
    );

    if (!imageBlob) {
      removeLoadingIndicator(mainEditor.api);

      throw new Error(
        buildError('failed to retrieve image from IndexedDB after storing it'),
      );
    }

    imageSrcFromIDB = URL.createObjectURL(imageBlob.image);

    const { getCurrentAccountData } = AccessToken();

    const accessToken = getCurrentAccountData()?.access_token;
    if (!accessToken) {
      removeLoadingIndicator(mainEditor.api);

      throw new Error(
        buildError(
          'unable to upload image because the access token is undefined',
        ),
      );
    }

    const { status, response } = await v1S3PresignedURL({
      accessToken,
      type: PresignedURLType.DOCUMENT_IMAGE,
      action: PresignedURLAction.PUT,
      documentCode: mainEditor.documentCode,
      imageCode: imageCode,
      imageExtension,
    });

    if (status !== HTTP_STATUS.OK || !response) {
      removeLoadingIndicator(mainEditor.api);

      throw new Error(
        buildError('failed to generate presigned URL for image upload'),
      );
    }

    const s3UploadResult = await v1AwsS3PutFile({
      presignedURL: response.results.generated_url,
      file,
      contentType: file.type,
      additionalHeaders: undefined,
    });

    if (s3UploadResult.status !== HTTP_STATUS.OK) {
      removeLoadingIndicator(mainEditor.api);

      throw new Error(buildError('failed to upload image to S3'));
    }

    return {
      imageCode,
      extension: imageExtension,
      src: imageSrcFromIDB,
      publicURL: response.results.item_public_url ?? undefined,
    };
  } catch (error) {
    try {
      await idb.deleteData(db, STORE_NAMES.DOCUMENT_IMAGES, imageCode);
    } catch {
      // ignore error...
    }

    alertController.showAlert(
      {
        id: 'alert__wzkkymjdpo',
        title: langKeys().AlertEditorImageUploadFailedTitle,
        description: langKeys().AlertEditorImageUploadFailedDescription,
      },
      ALERT_TIMEOUT.SHORT,
    );

    throw new Error(buildError('unable to upload image to the editor', error));
  }
};

const imageAfterPaste = async (): Promise<void> => {
  const mainEditor = getMainEditor();

  if (!mainEditor || !mainEditor.documentCode || !mainEditor.api) {
    return;
  }

  removeLoadingIndicator(mainEditor.api);
};

const imageUploadForBrowse = async (
  file: File,
  updateImage: (attrs: Partial<TImageAttributes>) => void,
): Promise<void> => {
  const alertController = AlertController();

  const db = getIndexedDB();
  const mainEditor = getMainEditor();

  if (!mainEditor || !mainEditor.documentCode || !mainEditor.api) {
    return;
  }

  setLoadingIndicator(mainEditor.api);

  const imageCode = generateUUID();
  const imageExtension = file.name.split('.').pop()?.toLowerCase() || '';

  let imageSrcFromIDB: string = '';

  try {
    const imageObject: TIDBDocumentImages = {
      documentCode: mainEditor.documentCode,
      imageCode: imageCode,
      extension: imageExtension,
      image: file,
    };

    await idb.addData(db, STORE_NAMES.DOCUMENT_IMAGES, imageObject);

    const imageBlob = await idb.getObject<TIDBDocumentImages>(
      db,
      STORE_NAMES.DOCUMENT_IMAGES,
      imageCode,
    );

    if (!imageBlob) {
      removeLoadingIndicator(mainEditor.api);

      throw new Error(
        buildError('failed to retrieve image from IndexedDB after storing it'),
      );
    }

    imageSrcFromIDB = URL.createObjectURL(imageBlob.image);

    const { getCurrentAccountData } = AccessToken();

    const accessToken = getCurrentAccountData()?.access_token;
    if (!accessToken) {
      removeLoadingIndicator(mainEditor.api);

      throw new Error(
        buildError(
          'unable to upload image because the access token is undefined',
        ),
      );
    }

    const { status, response } = await v1S3PresignedURL({
      accessToken,
      type: PresignedURLType.DOCUMENT_IMAGE,
      action: PresignedURLAction.PUT,
      documentCode: mainEditor.documentCode,
      imageCode,
      imageExtension,
    });

    if (status !== HTTP_STATUS.OK || !response) {
      removeLoadingIndicator(mainEditor.api);

      throw new Error(
        buildError('failed to generate presigned URL for image upload'),
      );
    }

    const s3UploadResult = await v1AwsS3PutFile({
      presignedURL: response.results.generated_url,
      file,
      contentType: file.type,
      additionalHeaders: undefined,
    });

    if (s3UploadResult.status !== HTTP_STATUS.OK) {
      removeLoadingIndicator(mainEditor.api);

      throw new Error(buildError('failed to upload image to S3'));
    }

    removeLoadingIndicator(mainEditor.api);

    updateImage({
      src: imageSrcFromIDB,
      imageCode,
      extension: imageExtension,
      alt: '',
      publicURL: response.results.item_public_url ?? undefined,
    });
  } catch (error) {
    try {
      await idb.deleteData(db, STORE_NAMES.DOCUMENT_IMAGES, imageCode);
    } catch {
      // ignore error...
    }

    alertController.showAlert(
      {
        id: 'alert__ruvnmwqxdn',
        title: langKeys().AlertEditorImageUploadFailedTitle,
        description: langKeys().AlertEditorImageUploadFailedDescription,
      },
      ALERT_TIMEOUT.SHORT,
    );

    throw new Error(buildError('unable to upload image to the editor', error));
  }
};

const setLoadingIndicator = (api: TEditorAPI): void => {
  const loadingIndicatorElement = EditorNodeLoadingIndicator({
    id: 'editor_node_loading_indicator__lmumdrlhro',
    text: langKeys().EditorLoadingUploadingImage,
  });

  api.addPlaceholder(
    loadingIndicatorElement.element,
    'editor_node_loading_indicator__lmumdrlhro',
  );
};

const removeLoadingIndicator = (api: TEditorAPI): void => {
  api.removePlaceholder('editor_node_loading_indicator__lmumdrlhro');
};

export { setupImageForUpload, imageAfterPaste, imageUploadForBrowse };
