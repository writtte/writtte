import {
  AuthenticationButton,
  type TAuthenticationButtonOptions,
  type TReturnAuthenticationButton,
} from './AuthenticationButton';
import { Input, type TInputOptions, type TReturnInput } from './Input';

type TOptions = {
  title: string;
  subtitle: string;
  inputs: TInputOptions[] | undefined;
  button: TAuthenticationButtonOptions;
  legalNote: DocumentFragment | undefined;
  links:
    | {
        left: DocumentFragment | undefined;
        middle: DocumentFragment | undefined;
        right: DocumentFragment | undefined;
      }
    | undefined;
};

type TReturnAuthenticationForm = {
  element: HTMLDivElement;
  inputs: {
    [key: string]: TReturnInput;
  };
  button: TReturnAuthenticationButton;
};

const AuthenticationForm = (opts: TOptions): TReturnAuthenticationForm => {
  const formDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const footerDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const subtitleDiv = document.createElement('div');
  const legalNoteDiv = document.createElement('div');
  const linksDiv = document.createElement('div');
  const leftLinkSpan = document.createElement('span');
  const middleLinkSpan = document.createElement('span');
  const rightLinkSpan = document.createElement('span');

  formDiv.classList.add('authentication-form');
  containerDiv.classList.add('authentication-form__container');
  headerDiv.classList.add('authentication-form__header');
  contentDiv.classList.add('authentication-form__content');
  footerDiv.classList.add('authentication-form__footer');
  titleDiv.classList.add('authentication-form__title');
  subtitleDiv.classList.add('authentication-form__subtitle');
  legalNoteDiv.classList.add('authentication-form__legal-note');
  linksDiv.classList.add('authentication-form__links');
  leftLinkSpan.classList.add(
    'authentication-form__link',
    'authentication-form__link--left',
  );
  middleLinkSpan.classList.add(
    'authentication-form__link',
    'authentication-form__link--middle',
  );
  rightLinkSpan.classList.add(
    'authentication-form__link',
    'authentication-form__link--right',
  );

  const button = AuthenticationButton(opts.button);

  linksDiv.append(leftLinkSpan, middleLinkSpan, rightLinkSpan);
  footerDiv.append(legalNoteDiv, button.element, linksDiv);
  headerDiv.append(titleDiv, subtitleDiv);
  containerDiv.append(headerDiv, contentDiv, footerDiv);
  formDiv.appendChild(containerDiv);

  titleDiv.textContent = opts.title;
  subtitleDiv.textContent = opts.subtitle;

  const inputs: TReturnAuthenticationForm['inputs'] = {};
  if (opts.inputs !== undefined && opts.inputs.length > 0) {
    for (let i = 0; i < opts.inputs.length; i++) {
      const inputElement = Input(opts.inputs[i]);

      contentDiv.appendChild(inputElement.element);
      inputs[opts.inputs[i].id] = inputElement;
    }
  } else {
    contentDiv.remove();
  }

  if (opts.legalNote !== undefined) {
    legalNoteDiv.appendChild(opts.legalNote);
  } else {
    legalNoteDiv.remove();
  }

  if (opts.links !== undefined) {
    const { left, middle, right } = opts.links;

    if (left !== undefined) {
      leftLinkSpan.appendChild(left);
    } else {
      leftLinkSpan.remove();
    }

    if (middle !== undefined) {
      middleLinkSpan.appendChild(middle);
    } else {
      middleLinkSpan.remove();
    }

    if (right !== undefined) {
      rightLinkSpan.appendChild(right);
    } else {
      rightLinkSpan.remove();
    }
  } else {
    linksDiv.remove();
  }

  return {
    element: formDiv,
    inputs,
    button,
  };
};

export type { TReturnAuthenticationForm };

export { AuthenticationForm };
