const positionMenu = (
  x: number,
  y: number,
  menuWidth: number,
  menuHeight: number,
  padding: number,
): { x: number; y: number } => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let adjustedX = x;
  let adjustedY = y;

  if (x + menuWidth > viewportWidth - padding) {
    adjustedX = Math.max(padding, viewportWidth - menuWidth - padding);
  }

  if (y + menuHeight > viewportHeight - padding) {
    adjustedY = Math.max(padding, viewportHeight - menuHeight - padding);
  }

  return { x: adjustedX, y: adjustedY };
};

export { positionMenu };
