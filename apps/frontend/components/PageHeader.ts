import {
  Button,
  ButtonAction,
  ButtonColor,
  ButtonSize,
  type TButtonOptions,
  type TReturnButton,
} from './Button';

type TOptions = {
  title: string;
  subtitle: string;
  buttons: Pick<TButtonOptions, 'id' | 'text' | 'leftIcon' | 'onClick'>[];
};

type TReturnPageHeader = {
  element: HTMLElement;
  buttons: {
    [key: string]: TReturnButton;
  };
};

const PageHeader = (opts: TOptions): TReturnPageHeader => {
  const pageHeaderDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const buttonsDiv = document.createElement('div');
  const subtitleDiv = document.createElement('div');

  pageHeaderDiv.classList.add('page-header');
  containerDiv.classList.add('page-header__container');
  headerDiv.classList.add('page-header__header');
  titleDiv.classList.add('page-header__title');
  buttonsDiv.classList.add('page-header__buttons');
  subtitleDiv.classList.add('page-header__subtitle');

  titleDiv.textContent = opts.title;
  subtitleDiv.textContent = opts.subtitle;

  headerDiv.append(titleDiv, buttonsDiv);
  containerDiv.append(headerDiv, subtitleDiv);
  pageHeaderDiv.appendChild(containerDiv);

  const buttons: TReturnPageHeader['buttons'] = {};
  for (let i = 0; i < opts.buttons.length; i++) {
    const buttonElement = Button({
      ...opts.buttons[i],
      loadingText: undefined,
      rightIcon: undefined,
      action: ButtonAction.BUTTON,
      color: ButtonColor.NEUTRAL,
      size: ButtonSize.SMALL,
      isFullWidth: false,
    });

    buttons[opts.buttons[i].id] = buttonElement;

    buttonsDiv.appendChild(buttonElement.element);
  }

  return {
    element: pageHeaderDiv,
    buttons,
  };
};

export type { TOptions as TPageHeaderOptions, TReturnPageHeader };

export { PageHeader };
