import type { TReturnButton } from '../../components/Button';
import type { TReturnInput } from '../../components/Input';
import type { TReturnTextArea } from '../../components/TextArea';
import { idb } from '@writtte-internal/indexed-db';
import { StatusTextType } from '../../components/StatusText';
import { v1AIStyleCreate } from '../../data/apis/aistyles/v1AIStyleCreate';
import {
  STORE_NAMES,
  type TIDBStyles,
  getIndexedDB,
} from '../../data/stores/indexedDB';
import { AccessToken } from '../../helpers/account/accessToken';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

const createStyle = async (
  nameInput: TReturnInput,
  styleTextArea: TReturnTextArea,
  saveButton: TReturnButton,
): Promise<
  | {
      styleCode: string;
      styleName: string;
    }
  | undefined
> => {
  saveButton.setLoading(true);

  const db = getIndexedDB();
  const { getCurrentAccountData } = AccessToken();

  const accessToken = getCurrentAccountData()?.access_token ?? '';
  const styleName = nameInput.getValue();
  const styleContent = styleTextArea.getValue();

  const { status, response } = await v1AIStyleCreate({
    accessToken,
    name: styleName,
    style: styleContent,
  });

  if (status !== HTTP_STATUS.CREATED || !response?.results) {
    nameInput.setStatusText({
      id: 'status_text__rromskoxyh',
      text: langKeys().ErrorApiInternalServerError,
      type: StatusTextType.ERROR,
      isIconVisible: false,
    });

    saveButton.setLoading(false);
    return;
  }

  const styleCode = response.results.style_code;

  const styleObject: TIDBStyles = {
    accountCode: accessToken,
    styleCode,
    styleName,
    styleContent,
  };

  await idb.addData(db, STORE_NAMES.STYLES, styleObject);

  return {
    styleName,
    styleCode,
  };
};

export { createStyle };
