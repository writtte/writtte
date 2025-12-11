import { buildError } from '../helpers/error/build';
import { htmlToNode } from '../utils/dom/node';

const FlatIconName = {
  _14_CIRCLE_CHECK: 'ICON_14_CIRCLE_CHECK',
  _14_CIRCLE_ERROR: 'ICON_14_CIRCLE_ERROR',
  _14_CROSS: 'ICON_14_CROSS',
  _18_CROSS: 'ICON_18_CROSS',
  _18_EVE_CLOSED: 'ICON_18_EVE_CLOSED',
  _18_EYE: 'ICON_18_EYE',
  _18_PLUS: 'ICON_18_PLUS',
};

// biome-ignore format: ICONS array should not be formatted
const FlatIconSVG: Record<TFlatIconName, string> = {
  ICON_14_CIRCLE_CHECK: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.1816 5.23242L5.93945 9.47461L3.81836 7.35352L4.52539 6.64648L5.93945 8.06055L9.47461 4.52539L10.1816 5.23242Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 1C10.3137 1 13 3.68629 13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1ZM7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2Z" fill="black"/></svg>`,
  ICON_14_CIRCLE_ERROR: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 10H6.5V9H7.5V10Z" fill="black"/><path d="M7.5 8H6.5V4H7.5V8Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 1C10.3137 1 13 3.68629 13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1ZM7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2Z" fill="black"/></svg>`,
  ICON_14_CROSS: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.8892 3.81836L7.70654 7L10.8892 10.1816L10.1821 10.8887L6.99951 7.70605L3.81787 10.8887L3.11084 10.1816L6.29248 7L3.11084 3.81836L3.81787 3.11133L6.99951 6.29297L10.1821 3.11133L10.8892 3.81836Z" fill="black"/></svg>`,
  ICON_18_CROSS: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4805 4.58105L10.0615 9L14.4805 13.4189L13.4189 14.4805L9 10.0615L4.58105 14.4805L3.51953 13.4189L7.93848 9L3.51953 4.58105L4.58105 3.51953L9 7.93848L13.4189 3.51953L14.4805 4.58105Z" fill="black"/></svg>`,
  ICON_18_EVE_CLOSED: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.6016 2.45898L2.45898 16.6016L1.39844 15.541L15.541 1.39844L16.6016 2.45898Z" fill="black"/><path d="M14.6953 5.4248C15.6793 6.39746 16.4724 7.61696 17 9L16.8691 9.32812C15.4607 12.6833 12.4672 15 9 15L8.66602 14.9932C7.66109 14.9498 6.70041 14.7104 5.81055 14.3096L6.9668 13.1533C7.61793 13.3787 8.30097 13.5 9 13.5C11.6718 13.5 14.1199 11.7589 15.375 9C14.9306 8.02306 14.3363 7.17396 13.6357 6.48438L14.6953 5.4248Z" fill="black"/><path d="M9.33398 3.00684C10.3385 3.05015 11.2989 3.28896 12.1885 3.68945L11.0322 4.8457C10.3815 4.62053 9.69865 4.5 9 4.5C6.32808 4.5 3.87905 6.24091 2.62402 9C3.0683 9.97671 3.66283 10.8252 4.36328 11.5146L3.30371 12.5742C2.3202 11.6017 1.52745 10.3826 1 9C2.34717 5.46875 5.42098 3 9 3L9.33398 3.00684Z" fill="black"/><path d="M11.8955 8.22461C11.9616 8.4722 12 8.73157 12 9C12 10.6569 10.6569 12 9 12C8.73157 12 8.4722 11.9616 8.22461 11.8955L11.8955 8.22461Z" fill="black"/><path d="M9 6C9.26802 6 9.52717 6.03758 9.77441 6.10352L6.10352 9.77441C6.03758 9.52717 6 9.26802 6 9C6 7.34315 7.34315 6 9 6Z" fill="black"/></svg>`,
  ICON_18_EYE: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 6C10.6569 6 12 7.34315 12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9C6 7.34315 7.34315 6 9 6ZM9 7.5C8.17157 7.5 7.5 8.17157 7.5 9C7.5 9.82843 8.17157 10.5 9 10.5C9.82843 10.5 10.5 9.82843 10.5 9C10.5 8.17157 9.82843 7.5 9 7.5Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.33398 3.00684C12.7694 3.15496 15.6949 5.57909 17 9L16.8691 9.32812C15.4607 12.6833 12.4672 15 9 15L8.66602 14.9932C5.23057 14.845 2.30507 12.4209 1 9C2.34717 5.46875 5.42098 3 9 3L9.33398 3.00684ZM9 4.5C6.32808 4.5 3.87905 6.24091 2.62402 9C3.87905 11.7591 6.32808 13.5 9 13.5C11.6718 13.5 14.1199 11.7589 15.375 9C14.1199 6.24112 11.6718 4.5 9 4.5Z" fill="black"/></svg>`,
  ICON_18_PLUS: `<?xml version="1.0" encoding="UTF-8"?><svg fill="none" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M9.75 8.25H16V9.75H9.75V16H8.25V9.75H2V8.25H8.25V2H9.75V8.25Z" fill="#000"/></svg>`,
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
