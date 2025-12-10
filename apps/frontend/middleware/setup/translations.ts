// The `tr` variable is used to hold translations for the entire
// application

import {
  type TInterpolationParams,
  createTranslator,
} from '@velovra-internal/translations';
import { enMessages } from '../../translations/en-lang';
import { jaMessages } from '../../translations/ja-lang';

var tr: (key: string, params?: TInterpolationParams) => string;

const setupTranslations = (): void => {
  const translator = createTranslator({
    defaultLocale: 'en',
    fallbackLocale: 'en',
    languages: {
      en: enMessages,
      ja: jaMessages,
    },
    storageKey: 'velovra-locale',
  });

  tr = translator.t;
};

const getTr = (key: string): string => {
  if (tr === undefined) {
    throw new Error('translation (tr) is not set');
  }

  const value = tr(key);
  if (value === key) {
    throw new Error(`invalid translation key ${key} found`);
  }

  return value;
};

export { getTr, setupTranslations };
