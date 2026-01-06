import { ErrorMessage } from '../components/ErrorMessage';
import { langKeys } from '../translations/keys';

const NotFoundPage = async (): Promise<HTMLElement> =>
  ErrorMessage({
    title: langKeys().ErrorMessageNotFoundTitle,
    description: langKeys().ErrorMessageNotFoundDescription,
  });

export { NotFoundPage };
