import { idb } from '@writtte-internal/indexed-db';
import { v1DocumentRetrieve } from '../../data/apis/item/v1DocumentRetrieve';
import {
  STORE_NAMES,
  type TIDBDocument,
  type TIDBDocumentContent,
  getIndexedDB,
} from '../../data/stores/indexedDB';
import { AccessToken } from '../../helpers/account/accessToken';
import { buildError } from '../../helpers/error/build';
import { HTTP_STATUS } from '../../utils/data/fetch';

const getDocumentContentFromAPI = async (
  documentCode: string,
): Promise<{
  title: string | undefined;
  content: string | undefined;
}> => {
  const { getCurrentAccountData } = AccessToken();

  const accessToken = getCurrentAccountData()?.access_token;
  if (!accessToken) {
    throw new Error(
      buildError(
        'unable to retrieve document content because the access token is undefined',
      ),
    );
  }

  const { status, response } = await v1DocumentRetrieve({
    accessToken,
    documentCode,
  });

  if (status !== HTTP_STATUS.OK || !response) {
    return {
      title: undefined,
      content: undefined,
    };
  }

  const content = response.results.content;
  const title = response.results.title;

  return {
    title,
    content,
  };
};

const getDocumentContentFromIDB = async (
  documentCode: string,
): Promise<{
  title: string | undefined;
  content: string | undefined;
}> => {
  const db = getIndexedDB();

  const documentContentObject = await idb.getObject<TIDBDocumentContent>(
    db,
    STORE_NAMES.DOCUMENT_CONTENTS,
    documentCode,
  );

  if (!documentContentObject) {
    return {
      title: undefined,
      content: undefined,
    };
  }

  const documentObject = await idb.getObject<TIDBDocument>(
    db,
    STORE_NAMES.DOCUMENTS,
    documentCode,
  );

  return {
    title: documentObject?.title,
    content: documentContentObject.content,
  };
};

export { getDocumentContentFromAPI, getDocumentContentFromIDB };
