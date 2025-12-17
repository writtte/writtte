import type { TRoute } from './utils/routes/routes';
import { PATHS } from './constants/paths';
import { AuthenticationLayout } from './layout/authentication';
import { DashboardLayout } from './layout/dashboard';
import { AuthenticationSignInPage } from './pages/AuthenticationSignIn';
import { AuthenticationSignInEmailPage } from './pages/AuthenticationSignInEmail';
import { AuthenticationSignInEmailCheckPage } from './pages/AuthenticationSignInEmailCheck';
import { AuthenticationSignUpPage } from './pages/AuthenticationSignUp';
import { AuthenticationSignUpCreatePage } from './pages/AuthenticationSignUpCreate';
import { EditorPage } from './pages/Editor';
import { NotFoundPage } from './pages/NotFound';
import { OverviewPage } from './pages/Overview';
import { ValidateEmailUpdatePage } from './pages/ValidateEmailUpdate';

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
  {
    path: PATHS.OVERVIEW,
    title: 'Overview | Velovra',
    layout: DashboardLayout,
    view: async () => await OverviewPage(),
  },
  {
    path: `${PATHS.DOCUMENT_EDIT}/:documentCode`,
    title: 'Document Editor | Velovra',
    layout: DashboardLayout,
    view: async (params: Record<string, string> | undefined) =>
      await EditorPage(params),
  },
  {
    path: PATHS.VALIDATE_EMAIL,
    title: 'Validate Email | Velovra',
    view: async () => await ValidateEmailUpdatePage(),
  },
];

const defaultNotFoundRoute: TRoute = {
  title: 'Not Found | Velovra',
  view: async () => await NotFoundPage(),
};

export { defaultRoutes, defaultNotFoundRoute };
