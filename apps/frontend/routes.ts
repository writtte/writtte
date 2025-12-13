import type { TRoute } from './utils/routes/routes';
import { PATHS } from './constants/paths';
import { AuthenticationLayout } from './layout/authentication';
import { AuthenticationSignInPage } from './pages/AuthenticationSignIn';
import { AuthenticationSignInEmailPage } from './pages/AuthenticationSignInEmail';
import { AuthenticationSignInEmailCheckPage } from './pages/AuthenticationSignInEmailCheck';
import { AuthenticationSignUpPage } from './pages/AuthenticationSignUp';
import { AuthenticationSignUpCreatePage } from './pages/AuthenticationSignUpCreate';
import { NotFoundPage } from './pages/NotFound';

const defaultRoutes: TRoute[] = [
  {
    path: PATHS.SIGN_UP,
    title: 'Sign Up | Velovra',
    layout: AuthenticationLayout,
    view: async () => await AuthenticationSignUpPage(),
  },
  {
    path: PATHS.SIGN_UP_CREATE,
    title: 'Create Your Account | Velovra',
    layout: AuthenticationLayout,
    view: async () => await AuthenticationSignUpCreatePage(),
  },
  {
    path: PATHS.SIGN_IN,
    title: 'Sign In | Velovra',
    layout: AuthenticationLayout,
    view: async () => await AuthenticationSignInPage(),
  },
  {
    path: PATHS.SIGN_IN_EMAIL,
    title: 'Sign In with Email | Velovra',
    layout: AuthenticationLayout,
    view: async () => await AuthenticationSignInEmailPage(),
  },
  {
    path: PATHS.SIGN_IN_CHECK,
    title: 'Checking Magic Link Access... | Velovra',
    layout: AuthenticationLayout,
    view: async () => await AuthenticationSignInEmailCheckPage(),
  },
];

const defaultNotFoundRoute: TRoute = {
  title: 'Not Found | Velovra',
  view: async () => await NotFoundPage(),
};

export { defaultRoutes, defaultNotFoundRoute };
