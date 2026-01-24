import type { TReturnInput } from '../../components/Input';
import type { TReturnTextArea } from '../../components/TextArea';
import { StatusTextType } from '../../components/StatusText';
import { langKeys } from '../../translations/keys';

const validateStyle = (
  nameInput: TReturnInput,
  styleTextArea: TReturnTextArea,
): boolean => {
  nameInput.setStatusText(undefined);
  styleTextArea.setStatusText(undefined);

  const styleName = nameInput.getValue();
  const styleContent = styleTextArea.getValue();

  if (styleName.trim().length === 0) {
    nameInput.setStatusText({
      id: 'status_text__vfzddscuqr',
      text: langKeys().ErrorStyleNameRequired,
      type: StatusTextType.ERROR,
      isIconVisible: false,
    });

    return false;
  }

  if (styleContent.trim().length === 0) {
    styleTextArea.setStatusText({
      id: 'status_text__cwxmynvhwj',
      text: langKeys().ErrorStyleContentRequired,
      type: StatusTextType.ERROR,
      isIconVisible: false,
    });

    return false;
  }

  return true;
};

export { validateStyle };
