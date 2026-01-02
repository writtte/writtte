import type { TImageAttributes } from '@writtte-editor/editor';
import { idb } from '@writtte-internal/indexed-db';
import { ALERT_TIMEOUT } from '../../constants/timeouts';
import { AlertController } from '../../controller/alert';
import {
  PresignedURLAction,
  PresignedURLType,
  v1S3PresignedURL,
} from '../../data/apis/external/aws/v1S3PresignedURL';
import { v1AwsS3PutFile } from '../../data/apis/thirdParty/v1AwsS3PutFile';
import {
  STORE_NAMES,
  type TIDBDocumentImages,
  getIndexedDB,
} from '../../data/stores/indexedDB';
import { getMainEditor } from '../../data/stores/mainEditor';
import { AccessToken } from '../../helpers/account/accessToken';
import { buildError } from '../../helpers/error/build';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';
import { generateUUID } from '../../utils/string/uuid';

const imageUpload = async (file: File): Promise<TImageAttributes> => {
  const alertController = AlertController();

  const db = getIndexedDB();

  const imageCode = generateUUID();
  const imageExtension = file.name.split('.').pop()?.toLowerCase() || '';

  const documentCode = getMainEditor().documentCode ?? '';

  let imageSrcFromIDB: string = '';

  try {
    const imageObject: TIDBDocumentImages = {
      documentCode: documentCode,
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
      throw new Error(
        buildError('failed to retrieve image from IndexedDB after storing it'),
      );
    }

    imageSrcFromIDB = URL.createObjectURL(imageBlob.image);

    const { getCurrentAccountData } = AccessToken();

    const accessToken = getCurrentAccountData()?.access_token;
    if (!accessToken) {
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
      documentCode,
      imageCode,
      imageExtension,
    });

    if (status !== HTTP_STATUS.OK || !response) {
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
      throw new Error(buildError('failed to upload image to S3'));
    }

    return {
      imageCode: imageCode,
      extension: imageExtension,
      metadata: {
        width: undefined,
        height: undefined,
      },
      srcWhenCreate: imageSrcFromIDB,
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

export { imageUpload };
