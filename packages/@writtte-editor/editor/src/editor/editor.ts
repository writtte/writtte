import type { TEditorAPI } from './api';
import type { TExtensionOptions } from './options';
import { type AnyExtension, Editor } from '@tiptap/core';
import { BoldExtension } from '../extensions/bold';
import { BulletListExtension } from '../extensions/bulletList';
import { DocumentExtension } from '../extensions/document';
import { HeadingExtension } from '../extensions/header';
import { HorizontalLineExtension } from '../extensions/horizontalRule';
import { ImageExtension, type TImageAttributes } from '../extensions/image';
import { InlineCodeExtension } from '../extensions/inlineCode';
import { ItalicExtension } from '../extensions/italic';
import { LinkExtension } from '../extensions/link';
import { ListItemExtension } from '../extensions/listItem';
import { NumberListExtension } from '../extensions/numberList';
import { ParagraphExtension } from '../extensions/paragraph';
import { PlaceholderExtension } from '../extensions/placeholder';
import { StrikethroughExtension } from '../extensions/strikethrough';
import { SubscriptExtension } from '../extensions/subscript';
import { SuperscriptExtension } from '../extensions/superscript';
import { TextExtension } from '../extensions/text';
import { UnderlineExtension } from '../extensions/underline';
import { UndoRedoExtension } from '../extensions/undoRedo';
import { type TEditorSchema, defaultEditorSchema } from './schema';
import { type TEditorState, getEditorState } from './state';

type TOptions = {
  element: HTMLDivElement;
  options: TExtensionOptions;
};

const WrittteEditor = (opts: TOptions): TEditorAPI => {
  const extensions: AnyExtension[] = [];

  if (opts.options.paragraph.isEnabled) {
    extensions.push(
      ParagraphExtension.configure(opts.options.paragraph ?? undefined),
    );
  }

  if (opts.options.header.isEnabled) {
    extensions.push(
      HeadingExtension.configure(opts.options.header ?? undefined),
    );
  }

  if (opts.options.bulletList.isEnabled) {
    extensions.push(
      BulletListExtension.configure(opts.options.bulletList ?? undefined),
    );
  }

  if (opts.options.numberList.isEnabled) {
    extensions.push(
      NumberListExtension.configure(opts.options.numberList ?? undefined),
    );
  }

  if (opts.options.listItem.isEnabled) {
    extensions.push(
      ListItemExtension.configure(opts.options.listItem ?? undefined),
    );
  }

  if (opts.options.undoRedo.isEnabled) {
    extensions.push(
      UndoRedoExtension.configure(opts.options.undoRedo ?? undefined),
    );
  }

  if (opts.options.link.isEnabled) {
    extensions.push(LinkExtension.configure(opts.options.link ?? undefined));
  }

  if (opts.options.bold.isEnabled) {
    extensions.push(BoldExtension.configure(opts.options.bold ?? undefined));
  }

  if (opts.options.italic.isEnabled) {
    extensions.push(
      ItalicExtension.configure(opts.options.italic ?? undefined),
    );
  }

  if (opts.options.strikeThrough.isEnabled) {
    extensions.push(
      StrikethroughExtension.configure(opts.options.strikeThrough ?? undefined),
    );
  }

  if (opts.options.subscript.isEnabled) {
    extensions.push(
      SubscriptExtension.configure(opts.options.subscript ?? undefined),
    );
  }

  if (opts.options.superScript.isEnabled) {
    extensions.push(
      SuperscriptExtension.configure(opts.options.superScript ?? undefined),
    );
  }

  if (opts.options.underline.isEnabled) {
    extensions.push(
      UnderlineExtension.configure(opts.options.underline ?? undefined),
    );
  }

  if (opts.options.inlineCode.isEnabled) {
    extensions.push(
      InlineCodeExtension.configure(opts.options.inlineCode ?? undefined),
    );
  }

  if (opts.options.horizontalRule.isEnabled) {
    extensions.push(
      HorizontalLineExtension.configure(
        opts.options.horizontalRule ?? undefined,
      ),
    );
  }

  if (opts.options.placeholder.isEnabled) {
    extensions.push(
      PlaceholderExtension.configure(opts.options.placeholder ?? undefined),
    );
  }

  if (opts.options.image.isEnabled) {
    extensions.push(ImageExtension.configure(opts.options.image ?? undefined));
  }

  const _editor = new Editor({
    element: opts.element,
    extensions: [TextExtension, DocumentExtension, ...extensions],
  });

  const isEditable = (): boolean => _editor.isEditable;

  const setEditable = (): void => {
    _editor.setEditable(true);
  };

  const setReadable = (): void => {
    _editor.setEditable(false);
  };

  const getContent = (): TEditorSchema => _editor.getJSON();

  const setContent = (content: TEditorSchema): void => {
    _editor.commands.setContent(content);
  };

  const replaceContent = (content: TEditorSchema): TEditorSchema => {
    _editor.commands.setContent(content);
    return _editor.getJSON();
  };

  const stringToSchema = (content: string): TEditorSchema => {
    try {
      const jsonContent = JSON.parse(content);
      return jsonContent as TEditorSchema;
    } catch {
      return defaultEditorSchema;
    }
  };

  const schemaToString = (schema: TEditorSchema): string => {
    try {
      return JSON.stringify(schema);
    } catch {
      return '';
    }
  };

  const onChange = (callback: (content: TEditorSchema) => void): void => {
    _editor.on('update', ({ editor }: { editor: Editor }) => {
      const jsonContent = editor.getJSON();
      callback(jsonContent);
    });
  };

  const onSelectionUpdate = (callback: (state: TEditorState) => void): void => {
    _editor.on('selectionUpdate', ({ editor }: { editor: Editor }) => {
      const stateInfo = getEditorState(editor);
      callback(stateInfo);
    });
  };

  const onFocus = (callback: (state: TEditorState) => void): void => {
    _editor.on('focus', ({ editor }: { editor: Editor }) => {
      const stateInfo = getEditorState(editor);
      callback(stateInfo);
    });
  };

  const onBlur = (callback: (state: TEditorState) => void): void => {
    _editor.on('blur', ({ editor }: { editor: Editor }) => {
      const stateInfo = getEditorState(editor);
      callback(stateInfo);
    });
  };

  const onTransaction = (callback: (state: TEditorState) => void): void => {
    _editor.on('transaction', ({ editor }: { editor: Editor }) => {
      const stateInfo = getEditorState(editor);
      callback(stateInfo);
    });
  };

  const setParagraph = (): boolean =>
    _editor.chain().focus().setParagraph().run();

  const setHorizontalLine = (): boolean =>
    _editor.chain().focus().setHorizontalLine().run();

  const setLink = (href: string, target: string): boolean =>
    _editor
      .chain()
      .focus()
      .setLink({
        href,
        target,
      })
      .run();

  const getLink = ():
    | {
        href: string;
        target: string;
      }
    | undefined => {
    const attributes = _editor.getAttributes('link');
    if (!attributes.href || !attributes.target) {
      return;
    }

    return {
      href: attributes.href,
      target: attributes.target,
    };
  };

  const unsetLink = (): boolean => _editor.chain().focus().unsetLink().run();

  const setImage = (attributes: TImageAttributes): boolean =>
    _editor.chain().focus().setImage(attributes).run();

  const updateImage = (attributes: Partial<TImageAttributes>): boolean =>
    _editor.chain().focus().updateImage(attributes).run();

  const removeImage = (): boolean =>
    _editor.chain().focus().removeImage().run();

  const toggleHeader01 = (): boolean =>
    _editor
      .chain()
      .focus()
      .toggleHeading({
        level: 1,
      })
      .run();

  const toggleHeader02 = (): boolean =>
    _editor
      .chain()
      .focus()
      .toggleHeading({
        level: 2,
      })
      .run();

  const toggleHeader03 = (): boolean =>
    _editor
      .chain()
      .focus()
      .toggleHeading({
        level: 3,
      })
      .run();

  const toggleHeader04 = (): boolean =>
    _editor
      .chain()
      .focus()
      .toggleHeading({
        level: 4,
      })
      .run();

  const toggleHeader05 = (): boolean =>
    _editor
      .chain()
      .focus()
      .toggleHeading({
        level: 5,
      })
      .run();

  const toggleHeader06 = (): boolean =>
    _editor
      .chain()
      .focus()
      .toggleHeading({
        level: 6,
      })
      .run();

  const toggleBold = (): boolean => _editor.chain().focus().toggleBold().run();

  const toggleItalic = (): boolean =>
    _editor.chain().focus().toggleItalic().run();

  const toggleUnderline = (): boolean =>
    _editor.chain().focus().toggleUnderline().run();

  const toggleInlineCode = (): boolean =>
    _editor.chain().focus().toggleInlineCode().run();

  const toggleSuperscript = (): boolean =>
    _editor.chain().focus().toggleSuperscript().run();

  const toggleSubscript = (): boolean =>
    _editor.chain().focus().toggleSubscript().run();

  const toggleStrikethrough = (): boolean =>
    _editor.chain().focus().toggleStrikethrough().run();

  const toggleBulletList = (): boolean =>
    _editor.chain().focus().toggleBulletList().run();

  const toggleNumberList = (): boolean =>
    _editor.chain().focus().toggleNumberList().run();

  const isBoldActive = (): boolean => _editor.isActive('bold');

  const isItalicActive = (): boolean => _editor.isActive('italic');

  const isUnderlineActive = (): boolean => _editor.isActive('underline');

  const isInlineCodeActive = (): boolean => _editor.isActive('inlineCode');

  const isSuperscriptActive = (): boolean => _editor.isActive('superscript');

  const isSubscriptActive = (): boolean => _editor.isActive('subscript');

  const isStrikethroughActive = (): boolean =>
    _editor.isActive('strikethrough');

  const isLinkActive = (): boolean => _editor.isActive('link');

  const isBulletListActive = (): boolean => _editor.isActive('bulletList');

  const isNumberListActive = (): boolean => _editor.isActive('numberList');

  const isImageActive = (): boolean => _editor.isActive('image');

  return {
    isEditable,
    setEditable,
    setReadable,
    setContent,
    getContent,
    replaceContent,
    stringToSchema,
    schemaToString,
    onChange,
    onSelectionUpdate,
    onFocus,
    onBlur,
    onTransaction,
    setParagraph,
    setHorizontalLine,
    setLink,
    getLink,
    unsetLink,
    toggleHeader01,
    toggleHeader02,
    toggleHeader03,
    toggleHeader04,
    toggleHeader05,
    toggleHeader06,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleInlineCode,
    toggleSuperscript,
    toggleSubscript,
    toggleStrikethrough,
    toggleBulletList,
    toggleNumberList,
    isBoldActive,
    isItalicActive,
    isUnderlineActive,
    isInlineCodeActive,
    isSuperscriptActive,
    isSubscriptActive,
    isStrikethroughActive,
    isLinkActive,
    isBulletListActive,
    isNumberListActive,
    setImage,
    updateImage,
    removeImage,
    isImageActive,
  };
};

export type { TOptions as TWrittteEditorOptions };

export { WrittteEditor };
