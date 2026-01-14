import type { TReturnItemCreateInput } from '../../components/ItemCreateInput';
import { idb } from '@writtte-internal/indexed-db';
import { PATHS } from '../../constants/paths';
import { ALERT_TIMEOUT } from '../../constants/timeouts';
import { AlertController } from '../../controller/alert';
import { v1DocumentCreate } from '../../data/apis/document/v1DocumentCreate';
import {
  DocumentLifecycleState,
  DocumentWorkflowState,
} from '../../data/apis/document/v1DocumentUpdate';
import {
  STORE_NAMES,
  type TIDBDocument,
  getIndexedDB,
} from '../../data/stores/indexedDB';
import { getAccountOverview } from '../../data/stores/overview';
import { AccessToken } from '../../helpers/account/accessToken';
import { buildError } from '../../helpers/error/build';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';
import { navigate } from '../../utils/routes/routes';

const createDocument = async (input: TReturnItemCreateInput): Promise<void> => {
  input.setLoadingState(true);

  const { getCurrentAccountData } = AccessToken();
  const accessToken = getCurrentAccountData()?.access_token;

  if (!accessToken) {
    throw new Error(buildError('access token is undefined'));
  }

  const accountOverview = getAccountOverview();

  const alertController = AlertController();

  const { status, response } = await v1DocumentCreate({
    accessToken,
    title: input.getValue(),
  });

  if (status !== HTTP_STATUS.CREATED || !response) {
    alertController.showAlert(
      {
        id: 'alert__qrlcayosmg',
        title: langKeys().AlertDocumentCreateFailedTitle,
        description: langKeys().AlertDocumentCreateFailedDescription,
      },
      ALERT_TIMEOUT.SHORT,
    );

    input.setLoadingState(false);
    return;
  }

  await addDocumentToIDB({
    accountCode: accountOverview.code,
    documentCode: response.results.document_code,
    title: input.getValue(),

    // For newly created items, the lifecycle state and workflow
    // state are set in the backend, so the same values should be
    // set for the indexed DB object. If this needs to be changed,
    // update the backend as well.

    lifecycleState: DocumentLifecycleState.ACTIVE,
    workflowState: DocumentWorkflowState.PUBLISHED,
  });

  await navigate(`${PATHS.DOCUMENT_EDIT}/${response.results.document_code}`);
};

const addDocumentToIDB = async (data: TIDBDocument): Promise<void> => {
  const db = getIndexedDB();

  const checkData = await idb.checkKeyExists(
    db,
    STORE_NAMES.DOCUMENTS,
    data.documentCode,
  );

  if (checkData === true) {
    return;
  }

  await idb.addData(db, STORE_NAMES.DOCUMENTS, data);
};

export { createDocument, addDocumentToIDB };
