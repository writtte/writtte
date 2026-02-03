import {
  Button,
  ButtonAction,
  ButtonColor,
  ButtonSize,
  type TButtonOptions,
  type TReturnButton,
} from './Button';
import { CloseButton } from './CloseButton';
import { FlatIcon, FlatIconName } from './FlatIcon';
import {
  type TReturnTextArea,
  type TTextAreaOptions,
  TextArea,
  TextAreaSize,
} from './TextArea';

type TOptions = {
  id: string;
  title: string;
  feedbackMessage: Pick<TTextAreaOptions, 'id' | 'placeholderText'>;
  submitButton: Pick<TButtonOptions, 'id' | 'text' | 'loadingText' | 'onClick'>;
};

type TReturnFeedbackModal = {
  element: HTMLElement;
  messageTextArea: TReturnTextArea;
  submitButton: TReturnButton;
};

const FeedbackModal = (opts: TOptions): TReturnFeedbackModal => {
  const modalDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const logoDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const messageDiv = document.createElement('div');
  const footerDiv = document.createElement('div');

  modalDiv.classList.add('feedback-modal');
  headerDiv.classList.add('feedback-modal__header');
  logoDiv.classList.add('feedback-modal__logo');
  titleDiv.classList.add('feedback-modal__title');
  contentDiv.classList.add('feedback-modal__content');
  messageDiv.classList.add('feedback-modal__message');
  footerDiv.classList.add('feedback-modal__footer');

  const closeButtonElement = CloseButton({
    id: `${opts.id}-close-button`,
    onClick: (): void => {
      modalDiv.dispatchEvent(new CustomEvent('modalClose'));
    },
  });

  logoDiv.appendChild(FlatIcon(FlatIconName._18_WRITTTE_LOGO));
  headerDiv.append(logoDiv, titleDiv, closeButtonElement.element);

  const messageTextAreaElement = TextArea({
    ...opts.feedbackMessage,
    text: undefined,
    size: TextAreaSize.MEDIUM,
    statusText: undefined,
    rows: 10,
    isFullWidth: true,
    isResizable: false,
    onChange: undefined,
    onSubmit: undefined,
  });

  const submitButtonElement = Button({
    ...opts.submitButton,
    leftIcon: undefined,
    rightIcon: undefined,
    action: ButtonAction.BUTTON,
    color: ButtonColor.NEUTRAL,
    size: ButtonSize.MEDIUM,
    isFullWidth: false,
  });

  footerDiv.appendChild(submitButtonElement.element);
  messageDiv.appendChild(messageTextAreaElement.element);
  contentDiv.append(messageDiv, footerDiv);
  modalDiv.append(headerDiv, contentDiv);

  modalDiv.dataset.testId = opts.id;
  titleDiv.textContent = opts.title;

  return {
    element: modalDiv,
    messageTextArea: messageTextAreaElement,
    submitButton: submitButtonElement,
  };
};

export type { TOptions as TFeedbackModalOptions, TReturnFeedbackModal };

export { FeedbackModal };
