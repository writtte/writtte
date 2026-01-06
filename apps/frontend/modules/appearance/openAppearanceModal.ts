import { setLocalStorage } from '@writtte-internal/local-storage';
import { AppearanceModalController } from '../../controller/appearanceModal';
import { langKeys } from '../../translations/keys';

const openAppearanceModal = (): void => {
  const appearanceModalController = AppearanceModalController();

  appearanceModalController.showModal({
    id: 'appearance_modal__rpiwioyzhk',
    title: langKeys().AppearanceModalTextTitle,
    leftPanel: {
      id: 'appearance_modal_panel__mrixncrnak',
      title: langKeys().AppearanceModalPanelThemeTextTitle,
      buttons: [
        {
          id: 'button__qyzpaelqxs',
          text: 'Light (Default)',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_light'),
        },
        {
          id: 'button__tykfnjvxdr',
          text: 'Light Blue',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_light_blue'),
        },
        {
          id: 'button__axwbfanuox',
          text: 'Light Catppuccin',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_light_catppuccin'),
        },
        {
          id: 'button__kejgremygx',
          text: 'Light Cherry',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_light_cherry'),
        },
        {
          id: 'button__izblvzhfmf',
          text: 'Light Forest',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_light_forest'),
        },
        {
          id: 'button__efyxvxcedd',
          text: 'Light Sepia',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_light_sepia'),
        },
        {
          id: 'button__xekhsmlnvp',
          text: 'Light Solarized',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_light_solarized'),
        },
        {
          id: 'button__oaembuthio',
          text: 'Light Typewriter',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_light_typewriter'),
        },
        {
          id: 'button__hhqmtniiqk',
          text: 'Dark Gray',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_dark_gray'),
        },
        {
          id: 'button__lceluudzwq',
          text: 'Dark Blue',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_dark_blue'),
        },
        {
          id: 'button__xuuwymmrnl',
          text: 'Dark Catppuccin',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_dark_catppuccin'),
        },
        {
          id: 'button__fommuotykh',
          text: 'Dark Cherry',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_dark_cherry'),
        },
        {
          id: 'button__pdutoyzwnq',
          text: 'Dark Forest',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_dark_forest'),
        },
        {
          id: 'button__tpipyivrur',
          text: 'Dark Sepia',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_dark_sepia'),
        },
        {
          id: 'button__vjjdqmyrjs',
          text: 'Dark Solarized',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_dark_solarized'),
        },
        {
          id: 'button__dvagyeyamb',
          text: 'Dark Typewriter',
          isSelected: false,
          onClick: (): void => selectColorTheme('theme_dark_typewriter'),
        },
      ],
    },
    rightPanel: {
      id: 'appearance_modal_panel__ucilntnxkd',
      title: langKeys().AppearanceModalPanelEditorTextTitle,
      buttons: [
        {
          id: 'button__aaddngunfl',
          text: 'Sans (Default)',
          isSelected: false,
          onClick: (): void => selectEditorTheme('editor_sans'),
        },
        {
          id: 'button__djshqmnoqu',
          text: 'Serif',
          isSelected: false,
          onClick: (): void => selectEditorTheme('editor_serif'),
        },
        {
          id: 'button__zsslxxdudy',
          text: 'Mono',
          isSelected: false,
          onClick: (): void => selectEditorTheme('editor_mono'),
        },
        {
          id: 'button__mzeukehspt',
          text: 'Typewriter',
          isSelected: false,
          onClick: (): void => selectEditorTheme('editor_typewriter'),
        },
      ],
    },
  });
};

const selectColorTheme = (theme: string): void => {
  setLocalStorage('color-theme', theme);
  document.documentElement.setAttribute('data-color-theme', theme);
};

const selectEditorTheme = (theme: string): void => {
  setLocalStorage('editor-theme', theme);
  document.documentElement.setAttribute('data-editor-theme', theme);
};

export { openAppearanceModal };
