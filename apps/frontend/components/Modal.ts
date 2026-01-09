import { setTestId } from '../utils/dom/testId';
import {
  Button,
  ButtonAction,
  ButtonSize,
  type TButtonOptions,
  type TReturnButton,
} from './Button';
import { CloseButton } from './CloseButton';
import {
  Input,
  InputSize,
  type TInputOptions,
  type TReturnInput,
} from './Input';

const ModalContainerItemDirection = {
  ROW: 'ROW',
  COLUMN: 'COLUMN',
} as const;

const ModalContentItemType = {
  ELEMENT: 'ELEMENT',
  TEXT: 'TEXT',
  INPUT: 'INPUT',
  BUTTON: 'BUTTON',
} as const;

type TModalContentItemDirection =
  (typeof ModalContainerItemDirection)[keyof typeof ModalContainerItemDirection];

type TModalContentItemType =
  (typeof ModalContentItemType)[keyof typeof ModalContentItemType];

type TModalContent =
  | {
      type: typeof ModalContentItemType.ELEMENT;
      element: HTMLElement;
    }
  | {
      type: typeof ModalContentItemType.TEXT;
      text: string;
    }
  | {
      type: typeof ModalContentItemType.INPUT;
      direction: TModalContentItemDirection;
      inputs: {
        title: string | undefined;
        input: Pick<
          TInputOptions,
          | 'id'
          | 'text'
          | 'placeholderText'
          | 'inlineButton'
          | 'statusText'
          | 'type'
          | 'onSubmit'
        >;
      }[];
    }
  | {
      type: typeof ModalContentItemType.BUTTON;
      direction: TModalContentItemDirection;
      buttons: Pick<
        TButtonOptions,
        'id' | 'text' | 'loadingText' | 'leftIcon' | 'color' | 'onClick'
      >[];
    };

type TOptions = {
  id: string;
  title: string;
  content: TModalContent[];
  width: number;
};

type TReturnModal = {
  element: HTMLDivElement;
  inputs: {
    [key: string]: TReturnInput;
  };
  buttons: {
    [key: string]: TReturnButton;
  };
  addInput: (
    contentItemIndex: number,
    input: {
      title: string | undefined;
      input: Pick<
        TInputOptions,
        | 'id'
        | 'text'
        | 'placeholderText'
        | 'inlineButton'
        | 'statusText'
        | 'type'
        | 'onSubmit'
      >;
    },
  ) => void;
  removeInput: (contentItemIndex: number, inputId: string) => void;
};

const Modal = (opts: TOptions): TReturnModal => {
  const modalDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const contentDiv = document.createElement('div');

  modalDiv.classList.add('modal');
  containerDiv.classList.add('modal__container');
  headerDiv.classList.add('modal__header');
  titleDiv.classList.add('modal__title');
  contentDiv.classList.add('modal__content');

  const closeButtonElement = CloseButton({
    id: `${opts.id}-close-button`,
    onClick: () => {
      const closeEvent = new CustomEvent('modal:close', {
        detail: {
          id: opts.id,
        },
      });

      document.dispatchEvent(closeEvent);
    },
  });

  titleDiv.textContent = opts.title;
  headerDiv.append(titleDiv, closeButtonElement.element);
  containerDiv.append(headerDiv, contentDiv);
  modalDiv.appendChild(containerDiv);

  modalDiv.style.width = `${opts.width}px`;

  setTestId(modalDiv, opts.id);

  const inputs: TReturnModal['inputs'] = {};
  const buttons: TReturnModal['buttons'] = {};

  for (let i = 0; i < opts.content.length; i++) {
    const item = opts.content[i];
    const contentItem = document.createElement('div');
    contentItem.classList.add('modal__content-item');

    switch (item.type) {
      case ModalContentItemType.ELEMENT:
        contentItem.appendChild(item.element);
        break;

      case ModalContentItemType.TEXT:
        contentItem.textContent = item.text;
        contentItem.classList.add('modal__content-item--text');
        break;

      case ModalContentItemType.INPUT:
        contentItem.classList.add(
          `modal__content-item--${item.direction.toLowerCase()}`,
        );

        for (let j = 0; j < item.inputs.length; j++) {
          const input = item.inputs[j];
          if (input.title) {
            const title = document.createElement('div');
            title.classList.add('modal__input-title');
            title.textContent = input.title;
            contentItem.appendChild(title);
          }

          const inputComponent = Input({
            ...input.input,
            size: InputSize.MEDIUM,
            isFullWidth: true,
            onChange: undefined,
          });

          contentItem.appendChild(inputComponent.element);
          inputs[input.input.id] = inputComponent;
        }

        break;

      case ModalContentItemType.BUTTON:
        contentItem.classList.add(
          'modal__content-item--buttons',
          `modal__content-item--${item.direction.toLowerCase()}`,
        );

        for (let j = 0; j < item.buttons.length; j++) {
          const button = item.buttons[j];
          const buttonComponent = Button({
            ...button,
            rightIcon: undefined,
            action: ButtonAction.BUTTON,
            size: ButtonSize.MEDIUM,
            isFullWidth: false,
          });

          contentItem.appendChild(buttonComponent.element);
          buttons[button.id] = buttonComponent;
        }

        break;
    }

    contentDiv.appendChild(contentItem);
  }

  const addInput = (
    contentItemIndex: number,
    inputConfig: {
      title: string | undefined;
      input: Pick<
        TInputOptions,
        | 'id'
        | 'text'
        | 'placeholderText'
        | 'inlineButton'
        | 'statusText'
        | 'type'
        | 'onSubmit'
      >;
    },
  ): void => {
    const contentItem = contentDiv.children[contentItemIndex] as HTMLElement;
    if (!contentItem) return;

    if (inputConfig.title) {
      const title = document.createElement('div');
      title.classList.add('modal__input-title');
      title.textContent = inputConfig.title;
      contentItem.appendChild(title);
    }

    const inputComponent = Input({
      ...inputConfig.input,
      size: InputSize.MEDIUM,
      isFullWidth: true,
      onChange: undefined,
    });

    contentItem.appendChild(inputComponent.element);
    inputs[inputConfig.input.id] = inputComponent;
  };

  const removeInput = (contentItemIndex: number, inputId: string): void => {
    const contentItem = contentDiv.children[contentItemIndex] as HTMLElement;
    if (!contentItem) return;

    const inputComponent = inputs[inputId];
    if (!inputComponent) return;

    // Find and remove the title if it exists (it's the previous sibling)
    const inputElement = inputComponent.element;
    const previousSibling = inputElement.previousElementSibling;
    if (previousSibling?.classList.contains('modal__input-title')) {
      previousSibling.remove();
    }

    inputElement.remove();
    delete inputs[inputId];
  };

  return {
    element: modalDiv,
    inputs,
    buttons,
    addInput,
    removeInput,
  };
};

export type {
  TModalContentItemDirection,
  TModalContentItemType,
  TModalContent,
  TOptions as TModalOptions,
  TReturnModal,
};

export { ModalContainerItemDirection, ModalContentItemType, Modal };
