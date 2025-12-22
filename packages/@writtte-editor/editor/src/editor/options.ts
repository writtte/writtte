import type { TBoldOptions } from '../extensions/bold';
import type { TBulletListOptions } from '../extensions/bulletList';
import type { THeadingOptions } from '../extensions/header';
import type { TItalicOptions } from '../extensions/italic';
import type { TLinkOptions } from '../extensions/link';
import type { TListItemOptions } from '../extensions/listItem';
import type { TNumberListOptions } from '../extensions/numberList';
import type { TParagraphOptions } from '../extensions/paragraph';
import type { TStrikethroughOptions } from '../extensions/strikethrough';
import type { TSubscriptOptions } from '../extensions/subscript';
import type { TSuperscriptOptions } from '../extensions/superscript';
import type { TUnderlineOptions } from '../extensions/underline';
import type { TUndoRedoOptions } from '../extensions/undoRedo';

type TExtensionOptions = {
  paragraph: Partial<TParagraphOptions> & { isEnabled: boolean };
  header: Partial<THeadingOptions> & { isEnabled: boolean };
  bulletList: Partial<TBulletListOptions> & { isEnabled: boolean };
  numberList: Partial<TNumberListOptions> & { isEnabled: boolean };
  listItem: Partial<TListItemOptions> & { isEnabled: boolean };
  undoRedo: Partial<TUndoRedoOptions> & { isEnabled: boolean };
  link: Partial<TLinkOptions> & { isEnabled: boolean };
  bold: Partial<TBoldOptions> & { isEnabled: boolean };
  italic: Partial<TItalicOptions> & { isEnabled: boolean };
  strikeThrough: Partial<TStrikethroughOptions> & { isEnabled: boolean };
  subscript: Partial<TSubscriptOptions> & { isEnabled: boolean };
  superScript: Partial<TSuperscriptOptions> & { isEnabled: boolean };
  underline: Partial<TUnderlineOptions> & { isEnabled: boolean };
};

export type { TExtensionOptions };
