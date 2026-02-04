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
  const inputDiv = document.createElement('div');
  const input = document.createElement('input');
  const createButton = document.createElement('button');

  inputDiv.classList.add('item-create-input');
  input.classList.add('item-create-input__input-element');
  createButton.classList.add(
    'item-create-input__create-button',
    'hide-immediately',
  );

  createButton.appendChild(opts.createButton.icon);
  inputDiv.append(input, createButton);

  input.id = opts.id;
  input.placeholder = opts.placeholderText;

  setTestId(input, opts.id);
  setTestId(createButton, opts.createButton.id);

  createButton.disabled = true;
  createButton.dataset.hasValue = 'false';

  input.autocomplete = 'off';

  const updateButtonState = (): void => {
    createButton.classList.remove('hide-immediately');

    const hasValue = input.value.trim() !== '';
    createButton.disabled = !hasValue;
    createButton.dataset.hasValue = hasValue ? 'true' : 'false';

    if (hasValue) {
      createButton.classList.add('show');
      createButton.classList.remove('hide');
    } else {
      createButton.classList.add('hide');
      createButton.classList.remove('show');
    }
  };

  inputDiv.addEventListener('click', (): void => input.focus());

  input.addEventListener('input', updateButtonState);

  input.addEventListener('focus', () => {
    inputDiv.classList.add('active');
  });

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
    createButton.classList.remove('hide-immediately');

    if (isLoading) {
      inputDiv.classList.add('disable');
      input.classList.add('disable');

      createButton.replaceChildren(
        AnimatedIcon(AnimatedIconName._18_CIRCLE_SPINNER),
      );

      createButton.setAttribute('disabled', 'true');

      createButton.classList.add('show');
      createButton.classList.remove('hide');
    } else {
      inputDiv.classList.remove('disable');
      input.classList.remove('disable');

      createButton.replaceChildren(opts.createButton.icon);

      updateButtonState();

      if (input.value.length <= 0) {
        createButton.classList.add('hide');
        createButton.classList.remove('show');
      }
    }
  };

  setTimeout((): void => {
    input.focus();
  }, 0);

  return {
    element: inputDiv,
    getValue,
    setLoadingState,
  };
};

export type { TOptions as TItemCreateInputOptions, TReturnItemCreateInput };

export { ItemCreateInput };
