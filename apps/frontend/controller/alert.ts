import { Alert, type TAlertOptions } from '../components/Alert';

type TInternalAlert = {
  id: string;
  props: TAlertOptions;
  createdAt: number;
};

type TReturnAlertController = {
  showAlert: (props: TAlertOptions, autoDismissMs: number) => void;
  closeAlert: (id: string) => void;
  getAlerts: () => TInternalAlert[];
};

// This `alerts` variable holds all the alerts on the pages

var alerts: TInternalAlert[] = [];

var containerDiv: HTMLDivElement | null = null;

const AlertController = (): TReturnAlertController => {
  const ensureContainer = (): void => {
    if (!containerDiv) {
      containerDiv = document.createElement('div');
      containerDiv.id = 'alert-container';

      containerDiv.classList.add('alert-container');
      document.body.appendChild(containerDiv);
    }
  };

  const showAlert = (props: TAlertOptions, autoDismissMs: number): void => {
    ensureContainer();

    const alertObj: TInternalAlert = {
      id: props.id,
      createdAt: Date.now(),
      props: {
        ...props,
      },
    };

    alerts.push(alertObj);

    const alertNode: HTMLDivElement = Alert(alertObj.props).element;

    alertNode.addEventListener('alertRemove', () => {
      alertNode.remove();
    });

    if (containerDiv) {
      containerDiv.appendChild(alertNode);
    }

    if (autoDismissMs > 0) {
      setTimeout(() => {
        const stillExists = alerts.some((a) => a.id === props.id);
        if (stillExists) {
          closeAlert(props.id);
        }
      }, autoDismissMs);
    }
  };

  const closeAlert = (id: string): void => {
    alerts = alerts.filter((a) => a.id !== id);

    const alertElement = containerDiv?.querySelector<HTMLElement>(
      `[id="${id}"]`,
    );

    if (alertElement) {
      alertElement.dispatchEvent(new CustomEvent('alertRemove'));
    }
  };

  return {
    showAlert,
    closeAlert,
    getAlerts: () => [...alerts],
  };
};

export type { TInternalAlert, TReturnAlertController };

export { AlertController };
