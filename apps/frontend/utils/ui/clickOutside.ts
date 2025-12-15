type TEventType = MouseEvent | TouchEvent;

type THandler = (event: TEventType | KeyboardEvent) => void;

type TClickOutsideOptions = {
  enabled?: boolean;
  ignoreElements?: (HTMLElement | null)[];
  events?: ('mousedown' | 'mouseup' | 'touchstart' | 'touchend')[];
  capture?: boolean;
  oncePerClick?: boolean;
  listenForEscape?: boolean;
  ignoreMenus?: boolean;
};

type TClickOutsideInstance = {
  disable: () => void;
  enable: () => void;
  destroy: () => void;
  updateOptions: (newOptions: Partial<TClickOutsideOptions>) => void;
};

const defaultOptions: Required<TClickOutsideOptions> = {
  enabled: true,
  ignoreElements: [],
  events: ['mousedown', 'touchstart'],
  capture: true,
  oncePerClick: true,
  listenForEscape: true,
  ignoreMenus: true,
};

const clickOutside = (
  element: HTMLElement | HTMLElement[],
  handler: THandler,
  options: TClickOutsideOptions = {},
): TClickOutsideInstance => {
  let currentOptions: Required<TClickOutsideOptions> = {
    ...defaultOptions,
    ...options,
  };

  let isProcessingClick = false;
  let isEnabled = currentOptions.enabled;

  const createListener =
    (): ((event: TEventType) => void) =>
    (event: TEventType): void => {
      if (!isEnabled) {
        return;
      }

      if (currentOptions.oncePerClick) {
        if (isProcessingClick === true) {
          return;
        }

        isProcessingClick = true;
        requestAnimationFrame(() => {
          isProcessingClick = false;
        });
      }

      const elements = Array.isArray(element) ? element : [element];
      const allElements = [
        ...elements,
        ...(currentOptions.ignoreElements || []),
      ];

      const isInside = allElements.some((el) =>
        el?.contains(event.target as Node),
      );

      const target = event.target as Element;
      const isInsideMenu =
        currentOptions.ignoreMenus &&
        (target.closest('[role="menu"]') !== null ||
          target.closest('[class*="menu__"]') !== null ||
          target.closest('[class*="menu--"]') !== null ||
          target.closest('[class*="submenu"]') !== null ||
          target.closest('.menu') !== null);

      if (!isInside && !isInsideMenu) {
        handler(event);
      }
    };

  const createEscapeListener =
    (): ((event: Event) => void) =>
    (event: Event): void => {
      if (!isEnabled || !currentOptions.listenForEscape) {
        return;
      }

      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Escape') {
        handler(keyboardEvent);
      }
    };

  let listener = createListener();
  let escapeListener = createEscapeListener();

  const enable = (): void => {
    isEnabled = true;

    currentOptions.events.forEach((event) => {
      document.addEventListener(
        event,
        listener as EventListener,
        currentOptions.capture,
      );
    });

    if (currentOptions.listenForEscape) {
      document.addEventListener(
        'keydown',
        escapeListener as EventListener,
        currentOptions.capture,
      );
    }
  };

  const disable = (): void => {
    isEnabled = false;

    currentOptions.events.forEach((event) => {
      document.removeEventListener(
        event,
        listener as EventListener,
        currentOptions.capture,
      );
    });

    if (currentOptions.listenForEscape) {
      document.removeEventListener(
        'keydown',
        escapeListener as EventListener,
        currentOptions.capture,
      );
    }
  };

  const destroy = (): void => {
    disable();
  };

  const updateOptions = (newOptions: Partial<TClickOutsideOptions>): void => {
    const wasEnabled = isEnabled;

    if (wasEnabled) {
      disable();
    }

    currentOptions = { ...currentOptions, ...newOptions };

    listener = createListener();
    escapeListener = createEscapeListener();

    if (wasEnabled || newOptions.enabled) {
      enable();
    }
  };

  if (currentOptions.enabled) {
    enable();
  }

  return {
    disable,
    enable,
    destroy,
    updateOptions,
  };
};

export type {
  TEventType,
  THandler,
  TClickOutsideOptions,
  TClickOutsideInstance,
};

export { clickOutside };
