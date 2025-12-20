import { AuthenticationForm } from '../components/AuthenticationForm';
import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { InputSize, InputType } from '../components/Input';
import { ParseLinkInText } from '../components/ParseLinkInText';
import { PATHS } from '../constants/paths';
import { signInToAccount } from '../modules/signIn/signInToAccount';
import { langKeys } from '../translations/keys';

const SignInPage = async (): Promise<HTMLElement> => {
  const { element, inputs, button } = AuthenticationForm({
    title: langKeys().PageSignInTextTitle,
    subtitle: langKeys().PageSignInTextSubtitle,
    inputs: [
      {
        id: 'input__fkxwpzsgxe',
        text: undefined,
        placeholderText: langKeys().InputPlaceholderEmailAddress,
        inlineButton: undefined,
        statusText: undefined,
        type: InputType.TEXT,
        size: InputSize.MEDIUM,
        isFullWidth: true,
        onChange: undefined,
        onSubmit: async (): Promise<void> => await submitForm(),
      },
      {
        id: 'input__jxdvdzvckn',
        text: undefined,
        placeholderText: langKeys().InputPlaceholderPassword,
        inlineButton: {
          id: 'button__bmhshgsavs',
          icon: FlatIcon(FlatIconName._18_EYE),
          onClick: () => togglePasswordVisibility(),
        },
        statusText: undefined,
        type: InputType.PASSWORD,
        size: InputSize.MEDIUM,
        isFullWidth: true,
        onChange: undefined,
        onSubmit: async (): Promise<void> => await submitForm(),
      },
    ],
    button: {
      id: 'button__fobmbfmdoi',
      text: langKeys().PageSignInButtonSignIn,
      loadingText: langKeys().PageSignInButtonSigning,
      leftIcon: undefined,
      rightIcon: undefined,
      statusText: undefined,
      onClick: async (): Promise<void> => await submitForm(),
    },
    legalNote: undefined,
    links: {
      left: ParseLinkInText({
        text: langKeys().PageSingInLinkSignUp,
        links: {
          link: PATHS.SIGN_UP,
        },
        isExternal: false,
      }),
      middle: undefined,
      right: ParseLinkInText({
        text: langKeys().PageSingInLinkPasswordReset,
        links: {
          link: PATHS.SIGN_IN_EMAIL,
        },
        isExternal: false,
      }),
    },
  });

  const submitForm = async (): Promise<void> =>
    await signInToAccount(
      inputs.input__fkxwpzsgxe,
      inputs.input__jxdvdzvckn,
      button,
    );

  const togglePasswordVisibility = (): void => {
    const inputElement = inputs.input__jxdvdzvckn;
    if (inputElement.getCurrentInputType() === InputType.PASSWORD) {
      inputElement.changeInlineButtonIcon(
        FlatIcon(FlatIconName._18_EYE_CLOSED),
      );

      inputElement.changeInputType(InputType.TEXT);
    } else {
      inputElement.changeInlineButtonIcon(FlatIcon(FlatIconName._18_EYE));
      inputElement.changeInputType(InputType.PASSWORD);
    }
  };

  return element;
};

export { SignInPage };
