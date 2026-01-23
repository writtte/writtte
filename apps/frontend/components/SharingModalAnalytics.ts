import {
  Chart,
  type ChartData,
  type ChartTypeRegistry,
  type Color,
  type TooltipItem,
  registerables,
} from 'chart.js';
import { FlatIcon, FlatIconName } from './FlatIcon';

const AnalyticsCardDeltaType = {
  NONE: 'NONE',
  UP: 'UP',
  DOWN: 'DOWN',
} as const;

type TAnalyticsCardDeltaType =
  (typeof AnalyticsCardDeltaType)[keyof typeof AnalyticsCardDeltaType];

type TOptions = {
  title: string;
  cards: {
    label: string;
    value: number;
    delta:
      | {
          value: number;
          type: TAnalyticsCardDeltaType;
        }
      | undefined;
  }[];
  chart: {
    dates: string[];
    views: {
      label: string;
      values: number[];
    };
    uniqueViews: {
      label: string;
      values: number[];
    };
  };
};

type TReturnSharingModalAnalytics = {
  element: HTMLDivElement;
};

const SharingModalAnalytics = (
  opts: TOptions,
): TReturnSharingModalAnalytics => {
  Chart.register(...registerables);

  const analyticsDiv = document.createElement('div');
  const headerDiv = document.createElement('div');
  const titleDiv = document.createElement('div');
  const cardsDiv = document.createElement('div');
  const chartCanvas = document.createElement('canvas');

  analyticsDiv.classList.add('sharing-modal-analytics', 'v-scrollbar');
  headerDiv.classList.add('sharing-modal-analytics__header');
  titleDiv.classList.add('sharing-modal-analytics__title');
  cardsDiv.classList.add('sharing-modal-analytics__cards');
  chartCanvas.classList.add('sharing-modal-analytics__chart');

  // This root element is required to access the CSS variables
  // because Chart.js generates a canvas each time, so the colors
  // cannot be changed manually via styles.

  const rootElement = document.documentElement;
  const computedStyles = window.getComputedStyle(rootElement);

  const chartData: ChartData<'line'> = {
    labels: opts.chart.dates,
    datasets: [
      {
        label: opts.chart.views.label,
        data: opts.chart.views.values,
        fill: false,
        borderColor: computedStyles
          .getPropertyValue('--color--bg-primary-700')
          .trim(),
        tension: 0.1,
      },
      {
        label: opts.chart.uniqueViews.label,
        data: opts.chart.uniqueViews.values,
        fill: false,
        borderColor: computedStyles
          .getPropertyValue('--color--bg-yellow-700')
          .trim(),
        tension: 0.1,
      },
    ],
  };

  new Chart(chartCanvas, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        x: {
          min: 1,
          grid: {
            color: 'transparent',
          },
          ticks: {
            color: computedStyles
              .getPropertyValue('--color--text-gamma')
              .trim(),
          },
        },
        y: {
          min: 0,
          grid: {
            color: 'transparent',
          },
          ticks: {
            color: computedStyles
              .getPropertyValue('--color--text-gamma')
              .trim(),
          },
        },
      },
      plugins: {
        legend: {
          display: false,
          position: 'right',
        },
        title: {
          display: false,
        },
        tooltip: {
          titleColor: computedStyles
            .getPropertyValue('--color--text-alpha')
            .trim(),
          borderColor: computedStyles
            .getPropertyValue('--color--border-weak')
            .trim(),
          backgroundColor: computedStyles
            .getPropertyValue('--color--bg-neutral-200')
            .trim(),
          callbacks: {
            labelTextColor: (
              context: TooltipItem<keyof ChartTypeRegistry>,
            ): Color => {
              if (context.datasetIndex === 0) {
                return computedStyles
                  .getPropertyValue('--color--bg-primary-700')
                  .trim();
              } else {
                return computedStyles
                  .getPropertyValue('--color--bg-yellow-700')
                  .trim();
              }
            },
          },
        },
      },
    },
  });

  titleDiv.textContent = opts.title;

  for (let i = 0; i < opts.cards.length; i++) {
    const cardDiv = document.createElement('div');
    const labelDiv = document.createElement('div');
    const detailsDiv = document.createElement('div');
    const valueDiv = document.createElement('div');
    const deltaDiv = document.createElement('div');

    cardDiv.classList.add('sharing-modal-analytics__card');
    labelDiv.classList.add('sharing-modal-analytics__card-label');
    detailsDiv.classList.add('sharing-modal-analytics__card-details');
    valueDiv.classList.add('sharing-modal-analytics__card-value');
    deltaDiv.classList.add('sharing-modal-analytics__card-delta');

    labelDiv.textContent = opts.cards[i].label;
    valueDiv.textContent = opts.cards[i].value.toString();

    detailsDiv.append(valueDiv, deltaDiv);
    cardDiv.append(labelDiv, detailsDiv);

    const delta = opts.cards[i].delta;
    if (delta !== undefined) {
      const deltaTextSpan = document.createElement('div');
      const deltaIconSpan = document.createElement('div');

      deltaTextSpan.classList.add('sharing-modal-analytics__card-delta-text');

      deltaIconSpan.classList.add('sharing-modal-analytics__card-delta-icon');

      deltaTextSpan.textContent = delta.value.toString();

      if (delta.type === AnalyticsCardDeltaType.UP) {
        deltaTextSpan.classList.add(
          'sharing-modal-analytics__card-delta-text--up',
        );

        deltaIconSpan.classList.add(
          'sharing-modal-analytics__card-delta-icon--up',
        );

        deltaIconSpan.appendChild(FlatIcon(FlatIconName._18_ARROW_UP));
      } else if (delta.type === AnalyticsCardDeltaType.DOWN) {
        deltaTextSpan.classList.add(
          'sharing-modal-analytics__card-delta-text--down',
        );

        deltaIconSpan.classList.add(
          'sharing-modal-analytics__card-delta-icon--down',
        );

        deltaIconSpan.appendChild(FlatIcon(FlatIconName._18_ARROW_DOWN));
      }

      if (delta.type === AnalyticsCardDeltaType.NONE) {
        deltaIconSpan.remove();
      } else {
        deltaDiv.append(deltaIconSpan, deltaTextSpan);
      }
    } else {
      deltaDiv.remove();
    }

    cardsDiv.appendChild(cardDiv);
  }

  headerDiv.appendChild(titleDiv);
  analyticsDiv.append(headerDiv, chartCanvas, cardsDiv);

  return {
    element: analyticsDiv,
  };
};

export type {
  TAnalyticsCardDeltaType,
  TOptions as TReturnModalAnalyticsOptions,
  TReturnSharingModalAnalytics,
};

export { AnalyticsCardDeltaType, SharingModalAnalytics };
