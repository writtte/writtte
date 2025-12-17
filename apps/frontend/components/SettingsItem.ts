import {
  Button,
  ButtonAction,
  ButtonSize,
  type TButtonOptions,
  type TReturnButton,
} from './Button';
import {
  Input,
  InputSize,
  type TInputOptions,
  type TReturnInput,
} from './Input';

const SettingsItemType = {
  TEXT: 'TEXT',
  BUTTON: 'BUTTON',
  INPUT: 'INPUT',
  DOUBLE_INPUT: 'DOUBLE_INPUT',
} as const;

type TSettingsItemType =
  (typeof SettingsItemType)[keyof typeof SettingsItemType];

type TOptions = {
  title: string;
  description: string | undefined;
  item:
    | {
        type: typeof SettingsItemType.TEXT;
        title: string;
        description: string | undefined;
      }
    | {
        type: typeof SettingsItemType.BUTTON;
        button: Pick<
          TButtonOptions,
          | 'id'
          | 'text'
          | 'loadingText'
          | 'leftIcon'
          | 'rightIcon'
          | 'color'
          | 'onClick'
        >;
      }
    | {
        type: typeof SettingsItemType.INPUT;
        input: Pick<
          TInputOptions,
          | 'id'
          | 'text'
          | 'placeholderText'
          | 'inlineButton'
          | 'statusText'
          | 'type'
          | 'onChange'
          | 'onSubmit'
        > & {
          title: string | undefined;
        };
      }
    | {
        type: typeof SettingsItemType.DOUBLE_INPUT;
        inputs: (Pick<
          TInputOptions,
          | 'id'
          | 'text'
          | 'placeholderText'
          | 'inlineButton'
          | 'statusText'
          | 'type'
          | 'onChange'
          | 'onSubmit'
        > & {
          title: string | undefined;
        })[];
      };
};

type TReturnSettingsItem = {
  element: HTMLDivElement;
  inputs:
    | {
        [key: string]: TReturnInput;
      }
    | undefined;
  button: TReturnButton | undefined;
};

const SettingsItem = (opts: TOptions): TReturnSettingsItem => {
  const itemDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const descriptionDiv = document.createElement('div');
  const contentDiv = document.createElement('div');

  itemDiv.classList.add('settings-item');
  headerDiv.classList.add('settings-item__header');
  contentDiv.classList.add('settings-item');

  headerDiv.append(titleDiv, descriptionDiv);
  itemDiv.append(headerDiv, contentDiv);

  titleDiv.textContent = opts.title;
  if (opts.description) {
    descriptionDiv.textContent = opts.description;
  } else {
    descriptionDiv.remove();
  }

  if (opts.item.type === SettingsItemType.DOUBLE_INPUT) {
    // In double inputs, the full width header should be applied
    itemDiv.classList.add('settings-item--full');
  } else {
    itemDiv.classList.add('settings-item--half');
  }

  const result: TReturnSettingsItem = {
    element: itemDiv,
    inputs: undefined,
    button: undefined,
  };

  switch (opts.item.type) {
    case SettingsItemType.TEXT: {
      const contentTitleDiv = document.createElement('div');
      const contentDescriptionDiv = document.createElement('div');

      contentTitleDiv.classList.add('settings-item__content-title');
      contentDescriptionDiv.classList.add('settings-item__content-description');

      contentDiv.append(contentTitleDiv, contentDescriptionDiv);

      contentTitleDiv.textContent = opts.item.title;
      if (opts.item.description) {
        contentDescriptionDiv.textContent = opts.item.description;
      } else {
        contentDescriptionDiv.remove();
      }

      break;
    }

    case SettingsItemType.BUTTON: {
      const buttonElement = Button({
        ...opts.item.button,
        action: ButtonAction.BUTTON,
        size: ButtonSize.SMALL,
        isFullWidth: false,
      });

      contentDiv.appendChild(buttonElement.element);

      result.button = buttonElement;
      break;
    }

    case SettingsItemType.INPUT: {
      const inputElement = Input({
        ...opts.item.input,
        size: InputSize.SMALL,
        isFullWidth: false,
      });

      contentDiv.appendChild(inputElement.element);
      result.inputs = {
        [opts.item.input.id]: inputElement,
      };

      break;
    }

    case SettingsItemType.DOUBLE_INPUT: {
      result.inputs = {};
      for (let i = 0; i < opts.item.inputs.length; i++) {
        const inputProp = opts.item.inputs[i];
        const inputElement = Input({
          ...inputProp,
          size: InputSize.SMALL,
          isFullWidth: false,
        });

        contentDiv.appendChild(inputElement.element);
        result.inputs[inputProp.id] = inputElement;
      }

      break;
    }
  }

  return result;
};

export type {
  TOptions as TSettingsItemOptions,
  TSettingsItemType,
  TReturnSettingsItem,
};

export { SettingsItemType, SettingsItem };
