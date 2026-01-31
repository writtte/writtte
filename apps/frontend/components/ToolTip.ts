const ToolTipPosition = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

type TTollTipPosition = (typeof ToolTipPosition)[keyof typeof ToolTipPosition];

type TOptions = {
  text: string;
  position: TTollTipPosition;
  delay: number;
  targetElement: HTMLElement;
};

type TReturnToolTip = {
  element: HTMLDivElement;
  setText: (text: string) => void;
  show: () => void;
  hide: () => void;
};

const ToolTip = (opts: TOptions): TReturnToolTip => {
  const position = opts.position;
  const delay = opts.delay;

  const tooltipDiv = document.createElement('div');

  tooltipDiv.classList.add('tool-tip');
  tooltipDiv.classList.add(`tool-tip--${position.toLowerCase()}`);

  opts.targetElement.classList.add('tool-tip-target');

  tooltipDiv.textContent = opts.text;

  opts.targetElement.appendChild(tooltipDiv);

  let timeoutId: number;

  opts.targetElement.addEventListener('mouseenter', () => {
    timeoutId = window.setTimeout(() => {
      tooltipDiv.classList.add('visible');
    }, delay);
  });

  opts.targetElement.addEventListener('mouseleave', () => {
    clearTimeout(timeoutId);
    tooltipDiv.classList.remove('visible');
  });

  opts.targetElement.addEventListener('focus', () => {
    timeoutId = window.setTimeout(() => {
      tooltipDiv.classList.add('visible');
    }, delay);
  });

  opts.targetElement.addEventListener('blur', () => {
    clearTimeout(timeoutId);
    tooltipDiv.classList.remove('visible');
  });

  const setText = (text: string): void => {
    tooltipDiv.textContent = text;
  };

  const show = (): void => {
    tooltipDiv.classList.add('visible');
  };

  const hide = (): void => {
    tooltipDiv.classList.remove('visible');
  };

  return {
    element: tooltipDiv,
    setText,
    show,
    hide,
  };
};

export type { TTollTipPosition, TOptions as TToolTipOptions, TReturnToolTip };

export { ToolTipPosition, ToolTip };
