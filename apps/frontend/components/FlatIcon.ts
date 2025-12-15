import { buildError } from '../helpers/error/build';
import { htmlToNode } from '../utils/dom/node';

const FlatIconName = {
  _SAMPLE_CIRCLE: 'SAMPLE_CIRCLE',
};

// biome-ignore format: ICONS array should not be formatted
const FlatIconSVG: Record<TFlatIconName, string> = {
  SAMPLE_CIRCLE: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="11.25" stroke="black" stroke-width="1.5"/></svg>`,
}

type TFlatIconName = (typeof FlatIconName)[keyof typeof FlatIconName];

const FlatIcon = (icon: TFlatIconName): HTMLElement => {
  const svgIcon = FlatIconSVG[icon];
  if (!svgIcon) {
    throw new Error(buildError('an invalid icon passed'));
  }

  const iconNode = htmlToNode(svgIcon);
  iconNode.classList.add('flat-icon');

  return iconNode;
};

export type { TFlatIconName };

export { FlatIconName, FlatIcon };
