type TLinkMap = Record<string, string>;

type TProps = {
  text: string;
  links: TLinkMap;
  isExternal: boolean;
};

const parseLinksInText = (
  text: string,
  links: TLinkMap,
  isExternal: boolean,
): DocumentFragment => {
  const fragment = document.createDocumentFragment();

  if (!text) {
    fragment.appendChild(document.createTextNode(''));
    return fragment;
  }

  const regex = /\(\(link(\d*)\)\)(.*?)\(\(\/link\1\)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = regex.exec(text);

  while (match !== null) {
    if (match.index > lastIndex) {
      fragment.appendChild(
        document.createTextNode(text.substring(lastIndex, match.index)),
      );
    }

    const linkNumber = match[1] || '0';
    const linkText = match[2];
    const linkKey = `link${linkNumber}`;
    const linkUrl = links[linkKey] || links.link || '#';

    const a = document.createElement('a');
    a.textContent = linkText;
    a.href = linkUrl;

    if (isExternal) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    } else {
      a.dataset.link = '';
    }

    fragment.appendChild(a);

    lastIndex = regex.lastIndex;
    match = regex.exec(text);
  }

  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
  }

  return fragment;
};

const ParseLinkInText = (props: TProps): DocumentFragment =>
  parseLinksInText(props.text, props.links, props.isExternal);

export type { TLinkMap, TProps as TParseLinkProps };

export { ParseLinkInText };
