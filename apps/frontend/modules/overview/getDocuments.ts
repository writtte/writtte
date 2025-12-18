import { idb } from '@writtte-internal/indexed-db';
import { ALERT_TIMEOUT } from '../../constants/timeouts';
import { AlertController } from '../../controller/alert';
import {
  type TResponseV1DocumentRetrieveListDocument,
  v1DocumentRetrieveList,
} from '../../data/apis/item/v1DocumentRetrieveList';
import { DocumentLifecycleState } from '../../data/apis/item/v1DocumentUpdate';
import {
  STORE_NAMES,
  type TIDBDocument,
  getIndexedDB,
} from '../../data/stores/indexedDB';
import { getAccountOverview } from '../../data/stores/overview';
import { AccessToken } from '../../helpers/account/accessToken';
import { buildError } from '../../helpers/error/build';
import { documentCodeToKey } from '../../helpers/item/codeToKey';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

const getDocumentsFromAPI = async (): Promise<
  TResponseV1DocumentRetrieveListDocument[]
> => {
  const alertController = AlertController();

  const { getCurrentAccountData } = AccessToken();
  const accessToken = getCurrentAccountData()?.access_token;

  if (!accessToken) {
    throw new Error(buildError(`access token is undefined or null`));
  }

  const { status, response } = await v1DocumentRetrieveList({
    accessToken,
    lifecycleState: DocumentLifecycleState.ACTIVE,
  });

  if (status !== HTTP_STATUS.OK || !response) {
    alertController.showAlert(
      {
        id: 'alert__nqpgqytqtr',
        title: langKeys().AlertDocumentRetrievedFailedTitle,
        description: langKeys().AlertDocumentRetrievedFailedDescription,
      },
      ALERT_TIMEOUT.SHORT,
    );

    return [];
  }

  return response.results.documents;
};

const getDocumentsFromIDB = async (): Promise<TIDBDocument[]> => {
  const accountOverview = getAccountOverview();

  const db = getIndexedDB();

  const allData = (await idb.getAllData(
    db,
    STORE_NAMES.DOCUMENTS,
  )) as TIDBDocument[];

  var filteredData: TIDBDocument[] = [];
  for (let i = 0; i < allData.length; i++) {
    if (allData[i].accountCode === accountOverview.code) {
      filteredData.push(allData[i]);
    }
  }

  return filteredData;
};

const extractDocumentDetailsFromAPIList = (
  documents: TResponseV1DocumentRetrieveListDocument[],
  id: string,
): TResponseV1DocumentRetrieveListDocument | undefined => {
  for (let i = 0; i < documents.length; i++) {
    if (documentCodeToKey(documents[i].document_code) === id) {
      return documents[i];
    }
  }

  return;
};

export {
  getDocumentsFromAPI,
  getDocumentsFromIDB,
  extractDocumentDetailsFromAPIList,
};
