import { idb } from '@velovra-internal/indexed-db';
import { v1DocumentUpdate } from '../../data/apis/item/v1DocumentUpdate';
import {
  STORE_NAMES,
  type TIDBDocumentContent,
  getIndexedDB,
} from '../../data/stores/indexedDB';
import { getAccountOverview } from '../../data/stores/overview';
import { AccessToken } from '../../helpers/account/accessToken';
import { buildError } from '../../helpers/error/build';
import { HTTP_STATUS } from '../../utils/data/fetch';

const updateDocumentContentFromAPI = async (
  documentCode: string,
  newContent: string,
): Promise<void> => {
  const { getCurrentAccountData } = AccessToken();

  const accessToken = getCurrentAccountData()?.access_token;
  if (!accessToken) {
    throw new Error(
      buildError(
        'unable to update document content because the access token is undefined',
      ),
    );
  }

  const { status } = await v1DocumentUpdate({
    accessToken,
    documentCode,
    content: newContent,
  });

  if (status !== HTTP_STATUS.NO_CONTENT) {
    return;
  }
};

const updateDocumentContentOnIDB = async (
  documentCode: string,
  newContent: string,
): Promise<void> => {
  const db = getIndexedDB();
  const accountOverview = getAccountOverview();

  const getObject = await idb.getObject<TIDBDocumentContent>(
    db,
    STORE_NAMES.DOCUMENT_CONTENTS,
    documentCode,
  );

  if (!getObject) {
    const objectToCreate: TIDBDocumentContent = {
      accountCode: accountOverview.code,
      documentCode,
      content: newContent,
    };

    await idb.addData(db, STORE_NAMES.DOCUMENT_CONTENTS, objectToCreate);
    return;
  }

  const objectToUpdate: TIDBDocumentContent = {
    ...getObject,
    content: newContent,
  };

  await idb.updateData(db, STORE_NAMES.DOCUMENT_CONTENTS, objectToUpdate);
};

export { updateDocumentContentFromAPI, updateDocumentContentOnIDB };
