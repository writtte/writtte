type TRemoveWhenRouteChangeOptions = {
  enabled?: boolean;
  onBeforeRemove?: (element: HTMLElement) => void;
  onAfterRemove?: (element: HTMLElement) => void;
  animationDuration?: number;
};

type TRemoveWhenRouteChangeInstance = {
  disable: () => void;
  enable: () => void;
  destroy: () => void;
  updateOptions: (newOptions: Partial<TRemoveWhenRouteChangeOptions>) => void;
};

const defaultOptions: Required<TRemoveWhenRouteChangeOptions> = {
  enabled: true,
  onBeforeRemove: () => {
    // No-op by default
  },
  onAfterRemove: () => {
    // No-op by default
  },
  animationDuration: 0,
};

const removeWhenRouteChange = (
  element: HTMLElement | HTMLElement[],
  options: TRemoveWhenRouteChangeOptions = {},
): TRemoveWhenRouteChangeInstance => {
  let currentOptions: Required<TRemoveWhenRouteChangeOptions> = {
    ...defaultOptions,
    ...options,
  };

  let isEnabled = currentOptions.enabled;

  const removeElements = (): void => {
    if (!isEnabled) {
      return;
    }

    const elements = Array.isArray(element) ? element : [element];

    for (const el of elements) {
      if (!el || !el.parentNode) {
        continue;
      }

      if (currentOptions.onBeforeRemove) {
        currentOptions.onBeforeRemove(el);
      }

      if (currentOptions.animationDuration > 0) {
        // Wait for animation to complete before
        // removing

        setTimeout(() => {
          if (el.parentNode) {
            el.remove();

            if (currentOptions.onAfterRemove) {
              currentOptions.onAfterRemove(el);
            }
          }
        }, currentOptions.animationDuration);
      } else {
        el.remove();

        if (currentOptions.onAfterRemove) {
          currentOptions.onAfterRemove(el);
        }
      }
    }
  };

  const handlePopState = (): void => {
    removeElements();
  };

  const handleNavigate = (): void => {
    removeElements();
  };

  const enable = (): void => {
    isEnabled = true;

    // Listen for browser back/forward navigation

    window.addEventListener('popstate', handlePopState);

    // Listen for programmatic navigation and this uses a custom event
    // that should be dispatched by the navigate function

    document.addEventListener('route:change', handleNavigate as EventListener);
  };

  const disable = (): void => {
    isEnabled = false;

    window.removeEventListener('popstate', handlePopState);
    document.removeEventListener(
      'route:change',
      handleNavigate as EventListener,
    );
  };

  const destroy = (): void => {
    disable();
  };

  const updateOptions = (
    newOptions: Partial<TRemoveWhenRouteChangeOptions>,
  ): void => {
    const wasEnabled = isEnabled;

    if (wasEnabled) {
      disable();
    }

    currentOptions = { ...currentOptions, ...newOptions };

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

export type { TRemoveWhenRouteChangeOptions, TRemoveWhenRouteChangeInstance };

export { removeWhenRouteChange };
