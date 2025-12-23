import { AuthenticationForm } from '../components/AuthenticationForm';
import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { InputSize, InputType } from '../components/Input';
import { ParseLinkInText } from '../components/ParseLinkInText';
import { PATHS } from '../constants/paths';
import { getMagicSignInLink } from '../modules/signIn/getMagicSignInLink';
import { langKeys } from '../translations/keys';

const SignInEmailPage = async (): Promise<HTMLElement> => {
  const { element, inputs, button } = AuthenticationForm({
    title: langKeys().PageSignInEmailTextTitle,
    subtitle: langKeys().PageSignInEmailTextSubtitle,
    inputs: [
      {
        id: 'input__czgzkuxjfk',
        text: undefined,
        placeholderText: langKeys().InputPlaceholderEmailAddress,
        inlineButton: undefined,
        statusText: undefined,
        type: InputType.EMAIL,
        size: InputSize.MEDIUM,
        isFullWidth: true,
        onChange: undefined,
        onSubmit: async (): Promise<void> => await submitForm(),
      },
    ],
    button: {
      id: 'button__mdgmbkbpqr',
      text: langKeys().PageSignInEmailButtonSend,
      loadingText: langKeys().PageSignInEmailButtonSending,
      leftIcon: undefined,
      rightIcon: FlatIcon(FlatIconName._18_EMAIL_GET),
      statusText: undefined,
      onClick: async (): Promise<void> => await submitForm(),
    },
    legalNote: undefined,
    links: {
      left: undefined,
      middle: ParseLinkInText({
        text: langKeys().PageSignInEmailLinkSignIn,
        links: {
          link: PATHS.SIGN_IN,
        },
        isExternal: false,
      }),
      right: undefined,
    },
  });

  const submitForm = async (): Promise<void> =>
    await getMagicSignInLink(inputs.input__czgzkuxjfk, button);

  return element;
};

export { SignInEmailPage };
