import { idb } from '@writtte-internal/indexed-db';
import { ALERT_TIMEOUT } from '../../constants/timeouts';
import { AlertController } from '../../controller/alert';
import {
  type TResponseV1AIStyleRetrieveListItem,
  v1AIStyleRetrieveList,
} from '../../data/apis/aistyles/v1AIStyleRetrieveList';
import {
  STORE_NAMES,
  type TIDBStyles,
  getIndexedDB,
} from '../../data/stores/indexedDB';
import { getAccountOverview } from '../../data/stores/overview';
import { AccessToken } from '../../helpers/account/accessToken';
import { buildError } from '../../helpers/error/build';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

const getStylesFromAPI = async (): Promise<
  TResponseV1AIStyleRetrieveListItem[]
> => {
  const alertController = AlertController();

  const { getCurrentAccountData } = AccessToken();
  const accessToken = getCurrentAccountData()?.access_token;

  if (!accessToken) {
    throw new Error(buildError(`access token is undefined or null`));
  }

  const { status, response } = await v1AIStyleRetrieveList({
    accessToken,
    limit: 1000,
  });

  if (status !== HTTP_STATUS.OK || !response) {
    alertController.showAlert(
      {
        id: 'alert__stylesretrievefailed',
        title: langKeys().AlertStylesRetrievedFailedTitle,
        description: langKeys().AlertStylesRetrievedFailedDescription,
      },
      ALERT_TIMEOUT.SHORT,
    );

    return [];
  }

  return response.results.items;
};

const getStylesFromIDB = async (): Promise<TIDBStyles[]> => {
  const accountOverview = getAccountOverview();

  const db = getIndexedDB();

  const allData = (await idb.getAllData(
    db,
    STORE_NAMES.STYLES,
  )) as TIDBStyles[];

  var filteredData: TIDBStyles[] = [];
  for (let i = 0; i < allData.length; i++) {
    if (allData[i].accountCode === accountOverview.code) {
      filteredData.push(allData[i]);
    }
  }

  return filteredData;
};

const getStyleFromIDB = async (styleCode: string): Promise<TIDBStyles> => {
  const db = getIndexedDB();

  const style = await idb.getObject<TIDBStyles>(
    db,
    STORE_NAMES.STYLES,
    styleCode,
  );

  if (!style) {
    throw new Error(
      buildError('unable to retrieve style details from the IDB'),
    );
  }

  return style;
};

const extractStyleDetailsFromAPIList = (
  styles: TResponseV1AIStyleRetrieveListItem[],
  id: string,
): TResponseV1AIStyleRetrieveListItem | undefined => {
  for (let i = 0; i < styles.length; i++) {
    if (styles[i].style_code === id) {
      return styles[i];
    }
  }

  return;
};

export {
  getStylesFromAPI,
  getStylesFromIDB,
  getStyleFromIDB,
  extractStyleDetailsFromAPIList,
};
