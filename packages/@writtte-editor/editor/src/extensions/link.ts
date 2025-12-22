import type { MarkSpec } from 'prosemirror-model';
import {
  type AnyExtension,
  type Attributes,
  Mark,
  type PasteRule,
  type RawCommands,
  type SingleCommands,
  markPasteRule,
  mergeAttributes,
} from '@tiptap/core';

type TLinkOptions = {
  HTMLAttributes: Record<string, string | number | boolean>;
  openOnClick: boolean;
  autolink: boolean;
  linkOnPaste: boolean;
  protocols: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    link: {
      setLink: (attributes: { href: string; target?: string }) => ReturnType;
      toggleLink: (attributes: { href: string; target?: string }) => ReturnType;
      unsetLink: () => ReturnType;
    };
  }
}

type LinkMatch = {
  index: number;
  text: string;
  data: string[];
};

const findRegexps = {
  link: /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)/g,
};

const find = (text: string): LinkMatch[] | null => {
  const matches: LinkMatch[] = [];
  const regex = findRegexps.link;

  for (
    let result: RegExpExecArray | null = regex.exec(text);
    result !== null;
    result = regex.exec(text)
  ) {
    matches.push({
      index: result.index,
      text: result[0],
      data: [result[0]],
    });
  }

  return matches.length ? matches : null;
};

const LinkExtension: AnyExtension = Mark.create<TLinkOptions>({
  name: 'link',
  priority: 1000,
  inclusive: false,
  addOptions(): TLinkOptions {
    return {
      HTMLAttributes: {
        rel: 'noopener noreferrer nofollow',
      },
      openOnClick: true,
      autolink: true,
      linkOnPaste: true,
      protocols: ['http', 'https', 'mailto', 'tel'],
    };
  },
  addAttributes(): Attributes {
    return {
      href: {
        default: null,
      },
      target: {
        default: this.options.HTMLAttributes?.target,
      },
      class: {
        default: this.options.HTMLAttributes?.class,
      },
      rel: {
        default: this.options.HTMLAttributes?.rel,
      },
    };
  },
  parseHTML(): MarkSpec['parseDOM'] {
    return [{ tag: 'a[href]' }];
  },
  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, string | number | boolean>;
  }): [string, Record<string, string | number | boolean>, number] {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands(): Partial<RawCommands> {
    return {
      setLink:
        (attributes: { href: string; target?: string }) =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.setMark(this.name, attributes),

      toggleLink:
        (attributes: { href: string; target?: string }) =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.toggleMark(this.name, attributes),

      unsetLink:
        () =>
        ({ commands }: { commands: SingleCommands }) =>
          commands.unsetMark(this.name),
    };
  },
  addPasteRules(): PasteRule[] {
    if (!this.options.linkOnPaste) {
      return [];
    }

    return [
      markPasteRule({
        find,
        type: this.type,
        getAttributes: (match: LinkMatch) => {
          const [url] = match.data;
          return { href: url };
        },
      }),
    ];
  },
});

export type { TLinkOptions, LinkMatch };

export { LinkExtension, find, findRegexps };
