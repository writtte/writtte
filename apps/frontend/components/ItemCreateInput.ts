import { setTestId } from '../utils/dom/testId';
import { AnimatedIcon, AnimatedIconName } from './AnimatedIcon';

type TOptions = {
  id: string;
  placeholderText: string;
  createButton: {
    id: string;
    icon: HTMLElement;
    onClick: () => void;
  };
  onSubmit: (value: string) => void;
};

type TReturnItemCreateInput = {
  element: HTMLDivElement;
  getValue: () => string;
  setLoadingState: (isLoading: boolean) => void;
};

const ItemCreateInput = (opts: TOptions): TReturnItemCreateInput => {
  const wrapperDiv = document.createElement('div');
  const inputDiv = document.createElement('div');
  const input = document.createElement('input');
  const createButton = document.createElement('button');

  wrapperDiv.classList.add('item-create-input__wrapper');
  inputDiv.classList.add('item-create-input');
  input.classList.add('item-create-input__input-element');
  createButton.classList.add('item-create-input__create-button');

  createButton.appendChild(opts.createButton.icon);
  inputDiv.append(input, createButton);
  wrapperDiv.appendChild(inputDiv);

  input.id = opts.id;
  input.placeholder = opts.placeholderText;

  setTestId(input, opts.id);
  setTestId(createButton, opts.createButton.id);

  createButton.disabled = true;
  createButton.dataset.hasValue = 'false';

  const updateButtonState = (): void => {
    const hasValue = input.value.trim() !== '';
    createButton.disabled = !hasValue;
    createButton.dataset.hasValue = hasValue ? 'true' : 'false';
  };

  input.addEventListener('input', updateButtonState);

  createButton.addEventListener('click', (e) => {
    if (input.value.trim() !== '') {
      e.preventDefault();
      opts.createButton.onClick();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && opts.onSubmit && input.value.trim() !== '') {
      e.preventDefault();
      opts.onSubmit(input.value);
    }
  });

  input.addEventListener('focus', () => {
    inputDiv.classList.add('active');
  });

  input.addEventListener('blur', () => {
    inputDiv.classList.remove('active');
  });

  const getValue = (): string => input.value;

  const setLoadingState = (isLoading: boolean): void => {
    if (isLoading) {
      input.classList.add('hide');

      createButton.replaceChildren(
        AnimatedIcon(AnimatedIconName._18_CIRCLE_SPINNER),
      );

      createButton.setAttribute('disabled', 'true');
      createButton.classList.add('item-create-input__create-button--loading');
    } else {
      input.classList.add('show');

      createButton.replaceChildren(opts.createButton.icon);

      updateButtonState();
      createButton.classList.remove(
        'item-create-input__create-button--loading',
      );
    }
  };

  return {
    element: wrapperDiv,
    getValue,
    setLoadingState,
  };
};

export type { TOptions as TItemCreateInputOptions, TReturnItemCreateInput };

export { ItemCreateInput };
