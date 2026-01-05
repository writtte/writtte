import { buildError } from '../../helpers/error/build';
import { setPageTitle } from './helpers';

type TRoute = {
  path?: string;
  title: string | ((params: Record<string, string>) => string);
  view: (params?: Record<string, string>) => Promise<HTMLElement>;
  layoutId?: string;
  layout?: (props: { content: HTMLElement }) => Promise<HTMLElement>;
};

type TTo = {
  path: string;
};

type TNextFunction = (overridePath?: string) => Promise<void>;

type TMiddlewareFunction = (next: TNextFunction, to: TTo) => Promise<void>;

let root: HTMLElement | null = null;
let routes: TRoute[] = [];
let notFoundRoute: TRoute | null = null;

let currentLayoutId: string | null = null;
let currentLayoutElement: HTMLElement | null = null;

const middlewares: TMiddlewareFunction[] = [];

const defineRoutes = (routeList: TRoute[]): void => {
  routes = routeList;
};

const defineNotFoundRoute = (route: TRoute): void => {
  notFoundRoute = route;
};

const attachLinkHandlers = (): void => {
  document.querySelectorAll('a[data-link]').forEach((link) => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      await navigate((link as HTMLAnchorElement).getAttribute('href') || '/');
    });
  });
};

const matchRoute = (
  pathname: string,
  route: TRoute,
): Record<string, string> | null => {
  if (!route?.path) {
    return null;
  }

  const routeParts = route.path.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (routeParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      const paramName = routeParts[i].slice(1);
      params[paramName] = pathParts[i];
    } else if (routeParts[i] !== pathParts[i]) {
      return null;
    }
  }

  return params;
};

const renderRoute = async (
  matchedRoute: TRoute,
  params: Record<string, string>,
): Promise<void> => {
  if (!root) {
    throw new Error(buildError('router root element not set'));
  }

  setPageTitle(
    typeof matchedRoute.title === 'function'
      ? matchedRoute.title(params)
      : matchedRoute.title,
  );

  const pageContent = await matchedRoute.view(params);

  if (matchedRoute.layout !== undefined) {
    if (matchedRoute.layoutId !== currentLayoutId || !currentLayoutElement) {
      currentLayoutId = matchedRoute.layoutId || null;
      currentLayoutElement = await matchedRoute.layout({
        content: pageContent,
      });

      root.replaceChildren(currentLayoutElement);
    } else if (matchedRoute.layoutId === currentLayoutId) {
      const contentContainer = currentLayoutElement.querySelector(
        '[data-content-container]',
      );

      if (contentContainer) {
        contentContainer.replaceChildren(pageContent);
      } else {
        throw new Error(
          buildError('no [data-content-container] found in the layout'),
        );
      }
    }
  } else {
    currentLayoutId = null;
    currentLayoutElement = null;

    root.replaceChildren(pageContent);
  }

  attachLinkHandlers();
};

const runRouter = async (): Promise<void> => {
  const pathname = window.location.pathname;

  for (const route of routes) {
    const params = matchRoute(pathname, route);
    if (params) {
      // biome-ignore lint/performance/noAwaitInLoops: The await inside the loop is required here
      await renderRoute(route, params);
      return;
    }
  }

  if (notFoundRoute !== null) {
    await renderRoute(notFoundRoute, {});
  }
};

const navigate = async (path: string): Promise<void> => {
  const to: TTo = { path };

  await runMiddlewares(to, async () => {
    window.history.pushState({}, '', path);
    await runRouter();
  });
};

const runMiddlewares = async (
  to: TTo,
  finalCallback: () => Promise<void>,
): Promise<void> => {
  let index = 0;

  const next: TNextFunction = async (overridePath?: string) => {
    if (overridePath) {
      return navigate(overridePath);
    }

    if (index >= middlewares.length) {
      return finalCallback();
    }

    const fn = middlewares[index++];
    await fn(next, to);
  };

  await next();
};

const setRootElement = (element: HTMLElement | null): void => {
  if (element === null) {
    throw new Error(buildError('root element is null'));
  }

  root = element;
};

const initRouter = (): void => {
  window.addEventListener('popstate', async () => {
    const path = window.location.pathname;

    await runMiddlewares({ path }, async () => {
      await runRouter();
    });
  });

  document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;

    await runMiddlewares({ path }, async () => {
      await runRouter();
    });
  });
};

const initMiddleware = (fn: TMiddlewareFunction): void => {
  middlewares.push(fn);
};

export type { TRoute, TNextFunction, TMiddlewareFunction };

export {
  defineRoutes,
  defineNotFoundRoute,
  navigate,
  runMiddlewares,
  setRootElement,
  initRouter,
  initMiddleware,
};
