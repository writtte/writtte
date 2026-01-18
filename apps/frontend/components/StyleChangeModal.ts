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
  Input,
  InputSize,
  InputType,
  type TInputOptions,
  type TReturnInput,
} from './Input';
import {
  type TReturnTextArea,
  type TTextAreaOptions,
  TextArea,
  TextAreaSize,
} from './TextArea';

type TOptions = {
  id: string;
  title: string;
  styleTitle: {
    title: string;
    input: Pick<
      TInputOptions,
      'id' | 'text' | 'placeholderText' | 'statusText' | 'onChange' | 'onSubmit'
    >;
  };
  styleEditor: {
    title: string;
    textArea: Pick<
      TTextAreaOptions,
      'id' | 'text' | 'placeholderText' | 'statusText' | 'onChange' | 'onSubmit'
    >;
  };
  samples: {
    title: string;
    urlInput: Pick<
      TInputOptions,
      'id' | 'text' | 'placeholderText' | 'statusText' | 'onChange' | 'onSubmit'
    >;
    scrapeButton: Pick<
      TButtonOptions,
      'id' | 'text' | 'loadingText' | 'leftIcon' | 'onClick'
    >;
    uploadButton: Pick<
      TButtonOptions,
      'id' | 'text' | 'loadingText' | 'leftIcon' | 'onClick'
    >;
  };
  saveButton: Pick<TButtonOptions, 'id' | 'text' | 'loadingText' | 'onClick'>;
};

type TReturnStyleChangeModal = {
  element: HTMLElement;
  inputTitle: TReturnInput;
  stylesTextArea: TReturnTextArea;
  inputURL: TReturnInput;
  scrapeButton: TReturnButton;
  uploadButton: TReturnButton;
  footerButton: TReturnButton;
};

const StyleChangeModal = (opts: TOptions): TReturnStyleChangeModal => {
  const modalDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const logoDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const styleNameDiv = document.createElement('div');
  const styleNameTitleDiv = document.createElement('div');
  const styleDataDiv = document.createElement('div');
  const styleDataTitleDiv = document.createElement('div');
  const sampleDiv = document.createElement('div');
  const sampleContainerDiv = document.createElement('div');
  const sampleTitleDiv = document.createElement('div');
  const sampleURLDiv = document.createElement('div');
  const footerDiv = document.createElement('div');

  modalDiv.classList.add('style-change-modal');
  headerDiv.classList.add('style-change-modal__header');
  logoDiv.classList.add('style-change-modal__logo');
  titleDiv.classList.add('style-change-modal__title');
  contentDiv.classList.add('style-change-modal__content');
  styleNameDiv.classList.add('style-change-modal__style-name');
  styleNameTitleDiv.classList.add('style-change-modal__style-name-title');
  styleDataDiv.classList.add('style-change-modal__style-data');
  styleDataTitleDiv.classList.add('style-change-modal__style-data-title');
  sampleDiv.classList.add('style-change-modal__sample');
  sampleContainerDiv.classList.add('style-change-modal__sample-container');
  sampleTitleDiv.classList.add('style-change-modal__sample-title');
  sampleURLDiv.classList.add('style-change-modal__sample-url');
  footerDiv.classList.add('style-change-modal__footer');

  const closeButtonElement = CloseButton({
    id: `${opts.id}-close-button`,
    onClick: (): void => {
      modalDiv.dispatchEvent(new CustomEvent('modalClose'));
    },
  });

  logoDiv.appendChild(FlatIcon(FlatIconName._18_WRITTTE_LOGO));
  headerDiv.append(logoDiv, titleDiv, closeButtonElement.element);

  const inputElement = Input({
    ...opts.styleTitle.input,
    inlineButton: undefined,
    type: InputType.TEXT,
    size: InputSize.MEDIUM,
    isFullWidth: true,
  });

  const textAreaElement = TextArea({
    ...opts.styleEditor.textArea,
    size: TextAreaSize.MEDIUM,
    rows: 10,
    isFullWidth: true,
    isResizable: false,
  });

  const urlInputElement = Input({
    ...opts.samples.urlInput,
    inlineButton: undefined,
    type: InputType.URL,
    size: InputSize.MEDIUM,
    isFullWidth: true,
  });

  const scrapeButtonElement = Button({
    ...opts.samples.scrapeButton,
    rightIcon: undefined,
    action: ButtonAction.BUTTON,
    color: ButtonColor.NEUTRAL,
    size: ButtonSize.MEDIUM,
    isFullWidth: false,
  });

  const uploadButtonElement = Button({
    ...opts.samples.uploadButton,
    rightIcon: undefined,
    action: ButtonAction.BUTTON,
    color: ButtonColor.NEUTRAL,
    size: ButtonSize.MEDIUM,
    isFullWidth: false,
  });

  const footerButtonElement = Button({
    ...opts.saveButton,
    leftIcon: undefined,
    rightIcon: undefined,
    action: ButtonAction.BUTTON,
    color: ButtonColor.PRIMARY,
    size: ButtonSize.MEDIUM,
    isFullWidth: false,
  });

  footerDiv.appendChild(footerButtonElement.element);
  styleNameDiv.append(styleNameTitleDiv, inputElement.element);
  styleDataDiv.append(styleDataTitleDiv, textAreaElement.element);
  sampleURLDiv.append(urlInputElement.element, scrapeButtonElement.element);
  sampleContainerDiv.append(sampleURLDiv, uploadButtonElement.element);
  sampleDiv.append(sampleTitleDiv, sampleContainerDiv);
  contentDiv.append(styleNameDiv, styleDataDiv, sampleDiv, footerDiv);
  modalDiv.append(headerDiv, contentDiv);

  modalDiv.dataset.testId = opts.id;
  titleDiv.textContent = opts.title;

  styleNameTitleDiv.textContent = opts.styleTitle.title;
  styleDataTitleDiv.textContent = opts.styleEditor.title;
  sampleTitleDiv.textContent = opts.samples.title;

  return {
    element: modalDiv,
    inputTitle: inputElement,
    stylesTextArea: textAreaElement,
    inputURL: urlInputElement,
    scrapeButton: scrapeButtonElement,
    uploadButton: uploadButtonElement,
    footerButton: footerButtonElement,
  };
};

export type { TOptions as TStyleChangeModalOptions, TReturnStyleChangeModal };

export { StyleChangeModal };
