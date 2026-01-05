import { buildError } from '../../helpers/error/build';

type THighlightOptions = {
  color: string;
  duration: number;
  opacity: string;
  hidePanel: boolean;
};

type TRenderStats = {
  fps: number;
  fpsCurrent: number;
  fpsMin: number;
  fpsMax: number;
  fpms: number;
  totalRenders: number;
  lastRenderTime: number;
  recentRenders: Array<{
    timestamp: string;
    element: string;
    renderTime: number;
  }>;
};

const formatTime = (ms: number): string => {
  if (ms < 0.001) {
    return `${(ms * 1000000).toFixed(4)}ns`;
  }

  if (ms < 1) {
    return `${(ms * 1000).toFixed(4)}µs`;
  }

  if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  }

  return `${(ms / 1000).toFixed(2)}s`;
};

const getElementInfo = (element: HTMLElement): string => {
  let info = element.tagName.toLowerCase();
  if (element.id) {
    info += `#${element.id}`;
  }

  if (element.className) {
    const classes = element.className
      .split(' ')
      .filter((c) => c)
      .slice(0, 2);
    if (classes.length > 0) {
      info += `.${classes.join('.')}`;
    }
  }

  return info;
};

const highlightElement = (
  element: HTMLElement,
  options: THighlightOptions,
  renderTime: number,
): void => {
  const rect = element.getBoundingClientRect();

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = `${rect.top}px`;
  overlay.style.left = `${rect.left}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.style.backgroundColor = options.color;
  overlay.style.opacity = options.opacity;
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '9999';
  overlay.style.transition = `opacity ${options.duration / 2}ms ease-out`;
  overlay.style.border = `2px solid ${options.color}`;
  overlay.style.boxSizing = 'border-box';
  document.body.appendChild(overlay);

  const label = document.createElement('div');
  label.textContent = formatTime(renderTime);
  label.style.position = 'fixed';
  label.style.top = `${rect.top}px`;
  label.style.left = `${rect.left}px`;
  label.style.backgroundColor = options.color;
  label.style.color = '#fff';
  label.style.padding = '2px 6px';
  label.style.fontSize = '10px';
  label.style.fontFamily = 'monospace';
  label.style.fontWeight = 'bold';
  label.style.borderRadius = '3px';
  label.style.pointerEvents = 'none';
  label.style.zIndex = '10000';
  label.style.whiteSpace = 'nowrap';
  label.style.transition = `opacity ${options.duration / 2}ms ease-out`;
  document.body.appendChild(label);

  setTimeout(() => {
    overlay.style.opacity = '0';
    label.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(overlay);
      document.body.removeChild(label);
    }, options.duration / 2);
  }, options.duration / 2);
};

const createStatsPanel = (
  stats: TRenderStats,
): {
  panel: HTMLDivElement;
  statsContainer: HTMLDivElement;
} => {
  const panel = document.createElement('div');
  panel.id = 'render-stats-panel';
  panel.style.position = 'fixed';
  panel.style.top = '20px';
  panel.style.left = '20px';
  panel.style.width = '300px';
  panel.style.backgroundColor = 'rgba(0,0,0,0.9)';
  panel.style.color = '#fff';
  panel.style.padding = '10px';
  panel.style.fontFamily = 'monospace';
  panel.style.border = '1px solid #00ff00';
  panel.style.borderRadius = '6px';
  panel.style.zIndex = '2147483647';
  panel.style.cursor = 'default';
  panel.style.userSelect = 'none';
  panel.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
  panel.style.pointerEvents = 'auto';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '8px';
  header.style.borderBottom = '1px solid #00ff00';
  header.style.paddingBottom = '6px';
  header.style.cursor = 'move';

  const title = document.createElement('div');
  title.textContent = 'Writtte Rendering Monitor';
  title.style.fontSize = '10px';
  title.style.fontWeight = 'bold';
  title.style.color = '#00ff00';
  header.appendChild(title);

  panel.appendChild(header);

  const statsContainer = document.createElement('div');
  panel.appendChild(statsContainer);

  let offsetX = 0,
    offsetY = 0,
    dragging = false;

  header.addEventListener('mousedown', (e) => {
    dragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (dragging === true) {
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
    }
  });

  // biome-ignore lint/suspicious/noAssignInExpressions: The following expression is required here
  window.addEventListener('mouseup', () => (dragging = false));

  updateStatsContent(statsContainer, stats);
  return {
    panel,
    statsContainer,
  };
};

const updateStatsContent = (
  container: HTMLDivElement,
  stats: TRenderStats,
): void => {
  container.innerHTML = '';

  const addLine = (
    label: string,
    value: number | string,
    color: string,
  ): void => {
    const div = document.createElement('div');
    div.style.color = color;
    div.innerHTML = `<strong>${label}:</strong> ${value}`;
    container.appendChild(div);
  };

  addLine('FPS (avg)', stats.fps, '#ffff00');
  addLine('FPS (current)', stats.fpsCurrent, '#ffdd00');
  addLine('FPS Min', stats.fpsMin, '#ff8800');
  addLine('FPS Max', stats.fpsMax, '#ff8800');
  addLine('FPMS', stats.fpms.toFixed(4), '#00ccff');
  addLine('Total Renders', stats.totalRenders, '#00ccff');
  addLine('Last Render', formatTime(stats.lastRenderTime), '#00ccff');
};

const monitorRendering = (
  rootElementId: string,
  options: THighlightOptions,
): MutationObserver => {
  const rootElement = document.getElementById(rootElementId);
  if (!rootElement) {
    throw new Error(
      buildError(`root element with id "${rootElementId}" not found`),
    );
  }

  const stats: TRenderStats = {
    fps: 0,
    fpsCurrent: 0,
    fpsMin: Infinity,
    fpsMax: 0,
    fpms: 0,
    totalRenders: 0,
    lastRenderTime: 0,
    recentRenders: [],
  };

  const { panel, statsContainer } = createStatsPanel(stats);

  if (options.hidePanel === false) {
    document.body.appendChild(panel);
  }

  const frameTimes: number[] = [];

  let lastFrameTime = performance.now();

  const updateFPS = (): void => {
    const now = performance.now();
    const delta = now - lastFrameTime;
    stats.fpsCurrent = Math.round(1000 / delta);

    frameTimes.push(delta);
    if (frameTimes.length > 60) {
      frameTimes.shift();
    }

    const avgDelta = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    stats.fps = Math.round(1000 / avgDelta);
    stats.fpms = 1 / avgDelta;
    stats.fpsMin = Math.min(...frameTimes.map((t) => 1000 / t));
    stats.fpsMax = Math.max(...frameTimes.map((t) => 1000 / t));

    lastFrameTime = now;

    updateStatsContent(statsContainer, stats);
    requestAnimationFrame(updateFPS);
  };

  updateFPS();

  const observer = new MutationObserver((mutations) => {
    const startTime = performance.now();
    const changedElements = new Set<HTMLElement>();

    for (const mutation of mutations) {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        changedElements.add(mutation.target as HTMLElement);
      }
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    stats.totalRenders++;
    stats.lastRenderTime = renderTime;

    changedElements.forEach((el) => {
      highlightElement(el, options, renderTime);
      stats.recentRenders.unshift({
        timestamp: new Date().toLocaleTimeString(),
        element: getElementInfo(el),
        renderTime,
      });
      if (stats.recentRenders.length > 10) stats.recentRenders.pop();
    });
  });

  observer.observe(rootElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });
  return observer;
};

const stopMonitoringRendering = (observer: MutationObserver): void => {
  observer.disconnect();

  const panel = document.getElementById('render-stats-panel');
  if (panel) {
    document.body.removeChild(panel);
  }
};

export type { THighlightOptions };

export { monitorRendering, stopMonitoringRendering };
