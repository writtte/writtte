import type { TReturnButton } from '../../components/Button';
import type { TReturnInput } from '../../components/Input';
import type { TReturnTextArea } from '../../components/TextArea';
import { idb } from '@writtte-internal/indexed-db';
import { StatusTextType } from '../../components/StatusText';
import { v1AIStyleUpdate } from '../../data/apis/aiStyles/v1AIStyleUpdate';
import {
  STORE_NAMES,
  type TIDBStyles,
  getIndexedDB,
} from '../../data/stores/indexedDB';
import { AccessToken } from '../../helpers/account/accessToken';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

const updateStyle = async (
  nameInput: TReturnInput,
  styleTextArea: TReturnTextArea,
  updateButton: TReturnButton,
  styleCode: string,
): Promise<
  | {
      styleCode: string;
      styleName: string;
    }
  | undefined
> => {
  const db = getIndexedDB();

  const { getCurrentAccountData, getCurrentAccount } = AccessToken();

  updateButton.setLoading(true);

  const accessToken = getCurrentAccountData()?.access_token ?? '';
  const styleName = nameInput.getValue();
  const styleContent = styleTextArea.getValue();

  const { status } = await v1AIStyleUpdate({
    accessToken,
    styleCode,
    name: styleName,
    style: styleContent,
  });

  if (status !== HTTP_STATUS.OK) {
    nameInput.setStatusText({
      id: 'status_text__aeoquzbbmy',
      text: langKeys().ErrorApiInternalServerError,
      type: StatusTextType.ERROR,
      isIconVisible: false,
    });

    updateButton.setLoading(false);
    return;
  }

  const newDataToUpdate: TIDBStyles = {
    accountCode: getCurrentAccount() ?? '',
    styleCode,
    styleName,
    styleContent,
  };

  await idb.updateData(db, STORE_NAMES.STYLES, newDataToUpdate);

  return {
    styleCode,
    styleName,
  };
};

export { updateStyle };
