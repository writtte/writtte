import { PATHS } from '../../constants/paths';
import { navigateHard } from '../../utils/routes/helpers';
import { AccessToken } from './accessToken';

const signOutCurrentAccount = async (): Promise<void> => {
  const accessToken = AccessToken();
  const currentAccount = accessToken.getCurrentAccount();

  if (currentAccount) {
    accessToken.removeAccount(currentAccount);
    navigateHard(PATHS.SIGN_IN);
  }
};

export { signOutCurrentAccount };
