import { PATHS } from '../constants/paths';
import { ALERT_TIMEOUT } from '../constants/timeouts';
import { AlertController } from '../controller/alert';
import { initializeIDB } from '../data/stores/indexedDB';
import { AccessToken } from '../helpers/account/accessToken';
import { langKeys } from '../translations/keys';
import { initMiddleware } from '../utils/routes/routes';
import { dumpVelovraLog } from './setup/log';
import { ensureAccountOverviewLoaded } from './setup/overview';
import { setupTranslations } from './setup/translations';

let isFirstLoad: boolean | undefined = true;

const setupMiddleware = async (): Promise<void> => {
  initMiddleware(async (next, to) => {
    const { getCurrentAccount, getAccountByCode } = AccessToken();

    const alertController = AlertController();

    if (isFirstLoad === true) {
      dumpVelovraLog();
      isFirstLoad = false;
    }

    await initializeIDB();

    setupTranslations();

    const protectedPaths = ['/overview'];
    const publicOnlyPaths = ['/sign-up', '/sign-in'];

    const isLogged = (): boolean => {
      const currentLoggedAccountCode = getCurrentAccount();
      if (!currentLoggedAccountCode) {
        return false;
      }

      const tokens = getAccountByCode(currentLoggedAccountCode);
      return tokens !== null;
    };

    if (protectedPaths.some((path) => to.path.startsWith(path))) {
      if (!isLogged()) {
        alertController.showAlert(
          {
            id: 'alert__maiipbhofd',
            title: langKeys().AlertMiddlewareSignInRequiredTitle,
            description: langKeys().AlertMiddlewareSignInRequiredDescription,
          },
          ALERT_TIMEOUT.SHORT,
        );

        return next(PATHS.SIGN_IN);
      }

      // Fetch account overview for protected paths

      await ensureAccountOverviewLoaded();
    } else if (publicOnlyPaths.some((path) => to.path.startsWith(path))) {
      if (isLogged()) {
        alertController.showAlert(
          {
            id: 'alert__gchsirikpj',
            title: langKeys().AlertMiddlewareNeedSignInDescription,
            description: langKeys().AlertMiddlewareNeedSignInTitle,
          },
          ALERT_TIMEOUT.SHORT,
        );

        return next(PATHS.OVERVIEW);
      }
    } else {
      if (to.path === '/') {
        if (isLogged()) {
          return next(PATHS.OVERVIEW);
        } else {
          return next(PATHS.SIGN_IN);
        }
      }
    }

    await next();
  });
};

export { setupMiddleware };
