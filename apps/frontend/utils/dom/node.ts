import { buildError } from '../../helpers/error/build';

const htmlToNode = (htmlStr: string): HTMLElement => {
  if (!htmlStr || htmlStr.trim().length <= 0) {
    throw new Error(buildError('invalid html string passed'));
  }

  const template = document.createElement('template');
  template.innerHTML = htmlStr.trim();

  const firstChild = template.content.firstElementChild;
  if (firstChild === null) {
    throw new Error(
      buildError('unable to parse imported html template string to an element'),
    );
  }

  return firstChild.cloneNode(true) as HTMLElement;
};

const gid = (id: string): HTMLElement | null => document.getElementById(id);

const gidr = (id: string): HTMLElement => {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(buildError(`unable to find element with id '${id}'`));
  }
  return el;
};

export { htmlToNode, gid, gidr };
