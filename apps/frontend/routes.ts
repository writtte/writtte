import type { TRoute } from './utils/routes/routes';
import { PATHS } from './constants/paths';
import { AuthenticationLayout } from './layout/authentication';
import { AuthenticationSignUpPage } from './pages/AuthenticationSignUp';
import { NotFoundPage } from './pages/NotFound';

const defaultRoutes: TRoute[] = [
  {
    path: PATHS.SIGN_UP,
    title: 'Sign Up | Velovra',
    layout: AuthenticationLayout,
    view: async () => await AuthenticationSignUpPage(),
  },
];

const defaultNotFoundRoute: TRoute = {
  title: 'Not Found | Velovra',
  view: async () => await NotFoundPage(),
};

export { defaultRoutes, defaultNotFoundRoute };
