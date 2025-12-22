import type { TBulletListOptions } from '../extensions/bulletList';
import type { THeadingOptions } from '../extensions/header';
import type { TLinkOptions } from '../extensions/link';
import type { TListItemOptions } from '../extensions/listItem';
import type { TNumberListOptions } from '../extensions/numberList';
import type { TParagraphOptions } from '../extensions/paragraph';
import type { TUndoRedoOptions } from '../extensions/undoRedo';

type TExtensionOptions = {
  paragraph: Partial<TParagraphOptions> & { isEnabled: boolean };
  header: Partial<THeadingOptions> & { isEnabled: boolean };
  bulletList: Partial<TBulletListOptions> & { isEnabled: boolean };
  numberList: Partial<TNumberListOptions> & { isEnabled: boolean };
  listItem: Partial<TListItemOptions> & { isEnabled: boolean };
  undoRedo: Partial<TUndoRedoOptions> & { isEnabled: boolean };
  link: Partial<TLinkOptions> & { isEnabled: boolean };
};

export type { TExtensionOptions };
