import { initMiddleware } from '../utils/routes/routes';
import { dumpVelovraLog } from './setup/log';
import { setupTranslations } from './setup/translations';

let isFirstLoad: boolean | undefined = true;

const setupMiddleware = async (): Promise<void> => {
  initMiddleware(async (next, to) => {
    if (isFirstLoad === true) {
      dumpVelovraLog();
      isFirstLoad = false;
    }

    setupTranslations();

    const protectedPaths = ['/overview'];
    const publicOnlyPaths = ['/sign-up', '/sign-in'];

    if (protectedPaths.some((path) => to.path.startsWith(path))) {
      // TODO complete later...
    } else if (publicOnlyPaths.some((path) => to.path.startsWith(path))) {
      // TODO complete later...
    }
    await next();
  });
};

export { setupMiddleware };
