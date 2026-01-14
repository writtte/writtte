import {
  Button,
  ButtonAction,
  ButtonColor,
  ButtonSize,
  type TButtonOptions,
} from '../components/Button';

type TOptions = {
  title: string;
  description: string;
  button: Pick<TButtonOptions, 'id' | 'text' | 'rightIcon' | 'onClick'>;
};

const NoDrafts = (opts: TOptions): HTMLElement => {
  const emptyStateDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const descriptionDiv = document.createElement('div');

  emptyStateDiv.classList.add('no-drafts-empty-state');
  containerDiv.classList.add('no-drafts-empty-state__container');
  contentDiv.classList.add('no-drafts-empty-state__content');
  titleDiv.classList.add('no-drafts-empty-state__title');
  descriptionDiv.classList.add('no-drafts-empty-state__description');

  titleDiv.textContent = opts.title;
  descriptionDiv.textContent = opts.description;

  const buttonElement = Button({
    loadingText: undefined,
    leftIcon: undefined,
    action: ButtonAction.BUTTON,
    color: ButtonColor.NEUTRAL,
    size: ButtonSize.MEDIUM,
    isFullWidth: false,
    ...opts.button,
  });

  contentDiv.append(titleDiv, descriptionDiv);
  containerDiv.append(contentDiv, buttonElement.element);
  emptyStateDiv.appendChild(containerDiv);

  return emptyStateDiv;
};

export type { TOptions as TNoDraftsOptions };

export { NoDrafts };
