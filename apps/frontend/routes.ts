import type { TRoute } from './utils/routes/routes';
import { PATHS } from './constants/paths';
import { AuthenticationLayout } from './layout/authentication';
import { DashboardLayout } from './layout/dashboard';
import { EditorPage } from './pages/Editor';
import { NotFoundPage } from './pages/NotFound';
import { OnboardingPage } from './pages/Onboarding';
import { OverviewPage } from './pages/Overview';
import { SharedDocumentPage } from './pages/SharedDocument';
import { SignInPage } from './pages/SignIn';
import { SignInEmailPage } from './pages/SignInEmail';
import { SignInEmailCheckPage } from './pages/SignInEmailCheck';
import { SignUpPage } from './pages/SignUp';
import { SignUpCreatePage } from './pages/SignUpCreate';
import { ValidateEmailUpdatePage } from './pages/ValidateEmailUpdate';

const defaultRoutes: TRoute[] = [
  {
    path: PATHS.SIGN_UP,
    title: 'Sign Up | Writtte',
    layout: AuthenticationLayout,
    view: async () => await SignUpPage(),
  },
  {
    path: PATHS.SIGN_UP_CREATE,
    title: 'Create Your Account | Writtte',
    layout: AuthenticationLayout,
    view: async () => await SignUpCreatePage(),
  },
  {
    path: PATHS.SIGN_IN,
    title: 'Sign In | Writtte',
    layout: AuthenticationLayout,
    view: async () => await SignInPage(),
  },
  {
    path: PATHS.SIGN_IN_EMAIL,
    title: 'Sign In with Email | Writtte',
    layout: AuthenticationLayout,
    view: async () => await SignInEmailPage(),
  },
  {
    path: PATHS.SIGN_IN_CHECK,
    title: 'Checking Magic Link Access... | Writtte',
    layout: AuthenticationLayout,
    view: async () => await SignInEmailCheckPage(),
  },
  {
    path: PATHS.ONBOARDING,
    title: 'Welcome | Writtte',
    view: async () => await OnboardingPage(),
  },
  {
    path: PATHS.OVERVIEW,
    title: 'Overview | Writtte',
    layout: DashboardLayout,
    view: async () => await OverviewPage(),
  },
  {
    path: `${PATHS.DOCUMENT_EDIT}/:documentCode`,
    title: 'Document Editor | Writtte',
    layout: DashboardLayout,
    view: async (params: Record<string, string> | undefined) =>
      await EditorPage(params),
  },
  {
    path: PATHS.VALIDATE_EMAIL,
    title: 'Validate Email | Writtte',
    view: async () => await ValidateEmailUpdatePage(),
  },
  {
    path: `${PATHS.SHARE_DOCUMENT}/:sharingCode`,
    title: 'Shared Document | Writtte',
    view: async (params: Record<string, string> | undefined) =>
      await SharedDocumentPage(params),
  },
];

const defaultNotFoundRoute: TRoute = {
  title: 'Not Found | Writtte',
  view: async () => await NotFoundPage(),
};

export { defaultRoutes, defaultNotFoundRoute };
