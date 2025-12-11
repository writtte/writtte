const setTestId = (el: HTMLElement, id: string): void => {
  el.setAttribute('data-testid', id.toLowerCase());
};

export { setTestId };
