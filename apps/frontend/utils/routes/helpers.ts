const setPageTitle = (title: string): void => {
  document.title = title;
};

const navigateHard = (path: string): void => {
  window.location.href = path;
};

const navigateExternal = (path: string): void => {
  window.open(path, '_blank');
};

const checkRoute = (paths: string[]): boolean => {
  const currentPath = window.location.pathname.split('?')[0];
  const normalizedCurrentPath = `/${currentPath.replace(/^\/|\/$/g, '')}/`;

  return paths.some((path) => {
    const normalizedPath = `/${path.replace(/^\/|\/$/g, '')}/`;
    return normalizedCurrentPath === normalizedPath;
  });
};

const checkRouteStartsWith = (paths: string[]): boolean => {
  const currentPath = window.location.pathname.split('?')[0];
  const normalizedCurrentPath = `/${currentPath.replace(/^\/|\/$/g, '')}/`;

  return paths.some((path) => {
    const normalizedPath = `/${path.replace(/^\/|\/$/g, '')}/`;
    return normalizedCurrentPath.startsWith(normalizedPath);
  });
};

export {
  setPageTitle,
  navigateHard,
  navigateExternal,
  checkRoute,
  checkRouteStartsWith,
};
