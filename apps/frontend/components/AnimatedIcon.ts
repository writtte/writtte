import { buildError } from '../helpers/error/build';
import { htmlToNode } from '../utils/dom/node';

const AnimatedIconName = {
  _18_CIRCLE_SPINNER: 'ICON_18_CIRCLE_SPINNER',
};

const AnimatedIconSVG = {
  ICON_18_CIRCLE_SPINNER: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 2.5C5.41015 2.5 2.5 5.41015 2.5 9C2.5 12.5899 5.41015 15.5 9 15.5V17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1V2.5Z" fill="black"/></svg>`,
};

type TAnimatedIconName =
  (typeof AnimatedIconName)[keyof typeof AnimatedIconName];

const IconAnimatedCircleSpinner = (): HTMLElement => {
  const svgIcon = AnimatedIconSVG.ICON_18_CIRCLE_SPINNER;

  const iconNode = htmlToNode(svgIcon);
  return iconNode;
};

const AnimatedIcon = (icon: TAnimatedIconName): HTMLElement => {
  const animatedIconDiv = document.createElement('div');

  switch (icon) {
    case AnimatedIconName._18_CIRCLE_SPINNER:
      animatedIconDiv.appendChild(IconAnimatedCircleSpinner());
      animatedIconDiv.classList.add('animated-icon-circle-spinner');
      return animatedIconDiv;

    default:
      throw new Error(buildError('invalid animated icon'));
  }
};

export type { TAnimatedIconName };

export { AnimatedIconName, AnimatedIcon };
