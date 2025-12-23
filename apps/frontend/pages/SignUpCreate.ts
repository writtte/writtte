import { AuthenticationForm } from '../components/AuthenticationForm';
import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { InputSize, InputType } from '../components/Input';
import { ParseLinkInText } from '../components/ParseLinkInText';
import { LINKS } from '../constants/links';
import { createUserAccount } from '../modules/signUp/createAccount';
import { langKeys } from '../translations/keys';

const SignUpCreatePage = async (): Promise<HTMLElement> => {
  const { element, inputs, button } = AuthenticationForm({
    title: langKeys().PageSignUpCreateTextTitle,
    subtitle: langKeys().PageSignUpCreateTextSubtitle,
    inputs: [
      {
        id: 'input__yohpsetdar',
        text: undefined,
        placeholderText: langKeys().InputPlaceholderName,
        inlineButton: undefined,
        statusText: undefined,
        type: InputType.TEXT,
        size: InputSize.MEDIUM,
        isFullWidth: true,
        onChange: undefined,
        onSubmit: async (): Promise<void> => await submitForm(),
      },
      {
        id: 'input__thsdzupune',
        text: undefined,
        placeholderText: langKeys().InputPlaceholderPassword,
        inlineButton: {
          id: 'button__rsymixozeh',
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
      {
        id: 'input__lgitvucjxf',
        text: undefined,
        placeholderText: langKeys().InputPlaceholderPasswordConfirm,
        inlineButton: {
          id: 'button__mgxqcajcwa',
          icon: FlatIcon(FlatIconName._18_EYE),
          onClick: () => togglePasswordConfirmVisibility(),
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
      id: 'button__bjluxfstjv',
      text: langKeys().PageSignUpCreateButtonCreate,
      loadingText: langKeys().PageSignUpCreateButtonCreating,
      leftIcon: undefined,
      rightIcon: undefined,
      statusText: undefined,
      onClick: async (): Promise<void> => await submitForm(),
    },
    legalNote: ParseLinkInText({
      text: langKeys().PageSignUpCreateNoteLegal,
      links: {
        link: LINKS.LEGAL_TERMS,
        link1: LINKS.LEGAL_PRIVACY,
      },
      isExternal: true,
    }),
    links: undefined,
  });

  const submitForm = async (): Promise<void> =>
    await createUserAccount(
      inputs.input__yohpsetdar,
      inputs.input__thsdzupune,
      inputs.input__lgitvucjxf,
      button,
    );

  const togglePasswordVisibility = (): void => {
    const inputElement = inputs.input__thsdzupune;
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

  const togglePasswordConfirmVisibility = (): void => {
    const inputElement = inputs.input__lgitvucjxf;
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

export { SignUpCreatePage };
