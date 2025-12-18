import { setupMiddleware } from './middleware/middleware';
import { defaultNotFoundRoute, defaultRoutes } from './routes';
import { monitorRendering } from './utils/dom/debug';
import {
  defineNotFoundRoute,
  defineRoutes,
  initRouter,
  setRootElement,
} from './utils/routes/routes';
import './styles/theme.css';
import '@fontsource-variable/ibm-plex-sans';
import '@fontsource-variable/jetbrains-mono';

const main = async (): Promise<void> => {
  const rootId = 'writtte-root';

  const rootElement = document.getElementById(rootId);
  setRootElement(rootElement);

  await setupMiddleware();

  defineRoutes(defaultRoutes);
  defineNotFoundRoute(defaultNotFoundRoute);

  initRouter();

  if (rootElement !== undefined) {
    monitorRendering(rootId, {
      color: '#DC143C',
      duration: 1000,
      opacity: '0.3',
      hidePanel: true,
    });
  }
};

// biome-ignore lint/nursery/noFloatingPromises: A floating promise is required here
(async () => await main())();
