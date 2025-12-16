type TOptions = {
  id: string;
  icon: HTMLElement;
  text: string;
  isSelected: boolean;
  onClick: () => void;
};

type TReturnSettingsSection = {
  element: HTMLButtonElement;
  setSelectedState: (isSelected: boolean) => void;
};

const SettingsSection = (opts: TOptions): TReturnSettingsSection => {
  const button = document.createElement('button');
  const iconSpan = document.createElement('span');
  const textSpan = document.createElement('span');

  button.classList.add('settings-section');
  if (opts.isSelected) {
    button.classList.add('settings-section--selected');
  }

  iconSpan.classList.add('settings-section__icon');
  textSpan.classList.add('settings-section__text');

  textSpan.textContent = opts.text;
  iconSpan.appendChild(opts.icon);
  button.append(iconSpan, textSpan);

  button.dataset.testId = opts.id;

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    opts.onClick();
  });

  const setSelectedState = (isSelected: boolean): void => {
    if (isSelected) {
      button.classList.add('settings-section--selected');
    } else {
      button.classList.remove('settings-section--selected');
    }
  };

  return {
    element: button,
    setSelectedState,
  };
};

export type { TOptions as TSettingsSectionOptions, TReturnSettingsSection };

export { SettingsSection };
