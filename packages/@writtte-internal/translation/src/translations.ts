type TTranslationObject = {
  [key: string]: string | TTranslationObject;
};

type TLanguageData = {
  [locale: string]: TTranslationObject;
};

type TTranslatorConfig = {
  defaultLocale: string;
  fallbackLocale: string;
  languages: TLanguageData;
  storageKey: string;
};

type TInterpolationParams = {
  [key: string]: string | number;
};

type TCreateTranslator = {
  t: (key: string, params?: TInterpolationParams) => string;
  setLocale: (locale: string) => boolean;
  getLocale: () => string;
  getAvailableLocales: () => string[];
  addLanguage: (locale: string, translations: TTranslationObject) => void;
  removeLanguage: (locale: string) => boolean;
  hasTranslation: (key: string, locale?: string) => boolean;
  subscribe: (callback: TSubscriberCallback) => () => void;
  clearStorage: () => void;
};

type TSubscriberCallback = (locale: string) => void;

const getNestedValue = (
  obj: TTranslationObject,
  path: string,
): string | null => {
  const keys = path.split('.');
  let current: string | TTranslationObject = obj;

  for (const key of keys) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }

  return typeof current === 'string' ? current : null;
};

const interpolate = (template: string, params: TInterpolationParams): string =>
  template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    key in params ? String(params[key]) : match,
  );

const createTranslator = (config: TTranslatorConfig): TCreateTranslator => {
  const { defaultLocale, fallbackLocale, languages, storageKey } = config;

  let currentLocale = defaultLocale;

  const subscribers: Set<TSubscriberCallback> = new Set();

  const getStoredLocale = (): string | null => {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(storageKey);
  };

  const setStoredLocale = (locale: string): void => {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(storageKey, locale);
  };

  const removeStoredLocale = (): void => {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(storageKey);
  };

  const storedLocale = getStoredLocale();

  if (storedLocale && storedLocale in languages) {
    currentLocale = storedLocale;
  } else {
    setStoredLocale(currentLocale);
  }

  const notifySubscribers = (): void => {
    for (const callback of subscribers) {
      callback(currentLocale);
    }
  };

  const t = (key: string, params?: TInterpolationParams): string => {
    let translation = getNestedValue(languages[currentLocale] || {}, key);

    if (translation === null && fallbackLocale !== currentLocale) {
      translation = getNestedValue(languages[fallbackLocale] || {}, key);
    }

    if (translation === null) {
      return key;
    }

    if (params !== undefined) {
      return interpolate(translation, params);
    }

    return translation;
  };

  const setLocale = (locale: string): boolean => {
    if (!(locale in languages)) {
      return false;
    }

    currentLocale = locale;
    setStoredLocale(locale);
    notifySubscribers();
    return true;
  };

  const getLocale = (): string => currentLocale;

  const getAvailableLocales = (): string[] => Object.keys(languages);

  const addLanguage = (
    locale: string,
    translations: TTranslationObject,
  ): void => {
    languages[locale] = translations;
  };

  const removeLanguage = (locale: string): boolean => {
    if (locale === currentLocale || locale === defaultLocale) {
      return false;
    }

    if (locale in languages) {
      delete languages[locale];
      return true;
    }

    return false;
  };

  const hasTranslation = (key: string, locale?: string): boolean => {
    const targetLocale = locale || currentLocale;
    return getNestedValue(languages[targetLocale] || {}, key) !== null;
  };

  const subscribe = (callback: TSubscriberCallback): (() => void) => {
    subscribers.add(callback);

    return () => {
      subscribers.delete(callback);
    };
  };

  const clearStorage = (): void => {
    removeStoredLocale();
  };

  return {
    t,
    setLocale,
    getLocale,
    getAvailableLocales,
    addLanguage,
    removeLanguage,
    hasTranslation,
    subscribe,
    clearStorage,
  };
};

type TTranslator = ReturnType<typeof createTranslator>;

export type {
  TTranslationObject,
  TLanguageData,
  TTranslatorConfig,
  TInterpolationParams,
  TCreateTranslator,
  TSubscriberCallback,
  TTranslator,
};

export { createTranslator };
