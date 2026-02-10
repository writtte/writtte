import { TOOL_TIP_TIMEOUT } from '../constants/timeouts';
import { setTestId } from '../utils/dom/testId';
import { ToolTip, ToolTipPosition } from './ToolTip';

type TOptions = {
  id: string;
  buttons: {
    id: string;
    icon: HTMLElement;
    toolTip: string;
    isDanger: boolean;
    isVisible: boolean;
    onClick: () => void;
  }[];
  isVisible: boolean;
};

const EditorBlockOptions = (opts: TOptions): HTMLDivElement | null => {
  if (opts.isVisible === false) {
    return null;
  }

  const optionsDiv = document.createElement('div');
  optionsDiv.classList.add('editor-block-options');

  optionsDiv.id = opts.id;
  setTestId(optionsDiv, opts.id);

  for (let i = 0; i < opts.buttons.length; i++) {
    if (opts.buttons[i].isVisible === false) {
      continue;
    }

    const button = document.createElement('button');
    button.classList.add('editor-block-options__button');

    if (opts.buttons[i].isDanger === true) {
      button.classList.add('editor-block-options__button--danger');
    }

    button.id = opts.buttons[i].id;
    setTestId(button, opts.buttons[i].id);

    button.replaceChildren(opts.buttons[i].icon);

    ToolTip({
      text: opts.buttons[i].toolTip,
      position: ToolTipPosition.TOP,
      delay: TOOL_TIP_TIMEOUT.SHORT,
      targetElement: button,
    });

    button.addEventListener('click', (e: MouseEvent): void => {
      e.preventDefault();

      opts.buttons[i].onClick();
    });

    optionsDiv.appendChild(button);
  }

  return optionsDiv;
};

export type { TOptions as TEditorBlockOptions };

export { EditorBlockOptions };
