import type { TParagraphOptions } from '../extensions/paragraph';

type TExtensionOptions = {
  paragraph: TParagraphOptions & { isEnabled: boolean };
};

export type { TExtensionOptions };
