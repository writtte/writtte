import { setTestId } from '../utils/dom/testId';
import { FlatIcon, FlatIconName } from './FlatIcon';

type TOptions = {
  id: string;
  createButton: {
    id: string;
    onClick: () => void;
  };
};

type TReturnDocumentCreatePanel = {
  element: HTMLElement;
};

const DocumentCreatePanel = (opts: TOptions): TReturnDocumentCreatePanel => {
  const panelDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const createButton = document.createElement('button');

  panelDiv.classList.add('document-create-panel');
  containerDiv.classList.add('document-create-panel__container');
  createButton.classList.add('document-create-panel__create-button');

  createButton.appendChild(FlatIcon(FlatIconName._18_PLUS));
  containerDiv.appendChild(createButton);
  panelDiv.appendChild(containerDiv);

  panelDiv.id = opts.id;
  setTestId(panelDiv, opts.id);

  createButton.id = opts.createButton.id;
  setTestId(createButton, opts.createButton.id);

  createButton.addEventListener('click', (e: MouseEvent): void => {
    e.preventDefault();

    opts.createButton.onClick();
  });

  return {
    element: panelDiv,
  };
};

export type {
  TOptions as TDocumentCreatePanelOptions,
  TReturnDocumentCreatePanel,
};

export { DocumentCreatePanel };
