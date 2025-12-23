import { AuthenticationForm } from '../components/AuthenticationForm';
import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { InputSize, InputType } from '../components/Input';
import { ParseLinkInText } from '../components/ParseLinkInText';
import { LINKS } from '../constants/links';
import { PATHS } from '../constants/paths';
import { getSignUpInvitation } from '../modules/signUp/getInvitation';
import { langKeys } from '../translations/keys';

const SignUpPage = async (): Promise<HTMLElement> => {
  const { element, inputs, button } = AuthenticationForm({
    title: langKeys().PageSignUpTextTitle,
    subtitle: langKeys().PageSignUpTextSubtitle,
    inputs: [
      {
        id: 'input__tyqxgbvugq',
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
      id: 'button__babbdbzhoh',
      text: langKeys().PageSignUpButtonSend,
      loadingText: langKeys().PageSignUpButtonSending,
      leftIcon: undefined,
      rightIcon: FlatIcon(FlatIconName._18_EMAIL_GET),
      statusText: undefined,
      onClick: async (): Promise<void> => await submitForm(),
    },
    legalNote: ParseLinkInText({
      text: langKeys().PageSignUpNoteLegal,
      links: {
        link: LINKS.LEGAL_TERMS,
        link1: LINKS.LEGAL_PRIVACY,
      },
      isExternal: true,
    }),
    links: {
      left: undefined,
      middle: ParseLinkInText({
        text: langKeys().PageSignUpLinkSignIn,
        links: {
          link: PATHS.SIGN_IN,
        },
        isExternal: false,
      }),
      right: undefined,
    },
  });

  const submitForm = async (): Promise<void> =>
    await getSignUpInvitation(inputs.input__tyqxgbvugq, button);

  return element;
};

export { SignUpPage };
