import { getLocalStorage } from '@writtte-internal/local-storage';

const checkAndSetColorTheme = (): void => {
  const currentTheme = getLocalStorage('color-theme');
  if (currentTheme === null) {
    document.documentElement.setAttribute('data-color-theme', 'light');
    return;
  }

  document.documentElement.setAttribute('data-color-theme', currentTheme);
};

const checkAndSetEditorTheme = (): void => {
  const currentTheme = getLocalStorage('editor-theme');
  if (currentTheme === null) {
    document.documentElement.setAttribute('data-editor-theme', 'default');
    return;
  }

  document.documentElement.setAttribute('data-editor-theme', currentTheme);
};

checkAndSetColorTheme();

checkAndSetEditorTheme();
