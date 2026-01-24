import { setTestId } from '../utils/dom/testId';

type TOptions = {
  id: string;
  text: string;
  suggestions: {
    text: string;
    onClick: () => void;
  }[];
  ignoreButton: {
    text: string;
    onClick: () => void;
  };
  location: {
    x: number;
    y: number;
  };
};

type TReturnEditorLangToolPopup = {
  element: HTMLDivElement;
};

const EditorLanguageToolPopup = (
  opts: TOptions,
): TReturnEditorLangToolPopup => {
  const popupDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const textDiv = document.createElement('div');
  const suggestionsDiv = document.createElement('div');
  const actionsDiv = document.createElement('div');
  const ignoreButton = document.createElement('button');

  popupDiv.classList.add('editor-language-tool-popup-menu');
  containerDiv.classList.add('editor-language-tool-popup-menu__container');
  textDiv.classList.add('editor-language-tool-popup-menu__text');
  suggestionsDiv.classList.add(
    'editor-language-tool-popup-menu__suggestions',
    'v-scrollbar',
  );

  actionsDiv.classList.add('editor-language-tool-popup-menu__actions');
  ignoreButton.classList.add('editor-language-tool-popup-menu__ignore-button');

  for (let i = 0; i < opts.suggestions.length; i++) {
    const suggestion = opts.suggestions[i];
    const suggestionButton = document.createElement('button');
    suggestionButton.classList.add(
      'editor-language-tool-popup-menu__suggestion-button',
    );

    suggestionButton.textContent = suggestion.text;
    suggestionButton.id = `button__${opts.id}-suggestion-${i}`;
    setTestId(suggestionButton, `button__${opts.id}-suggestion-${i}`);

    suggestionButton.addEventListener('click', (e: MouseEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      suggestion.onClick();
    });

    suggestionsDiv.appendChild(suggestionButton);
  }

  actionsDiv.appendChild(ignoreButton);
  containerDiv.append(textDiv, suggestionsDiv, actionsDiv);
  popupDiv.appendChild(containerDiv);

  if (opts.suggestions.length === 0) {
    suggestionsDiv.remove();
  }

  popupDiv.style.left = `${opts.location.x}px`;
  popupDiv.style.top = `${opts.location.y}px`;

  popupDiv.id = opts.id;
  setTestId(popupDiv, opts.id);

  ignoreButton.id = `button__${opts.id}-ignore`;
  setTestId(ignoreButton, `button__${opts.id}-ignore`);

  textDiv.textContent = opts.text;
  ignoreButton.textContent = opts.ignoreButton.text;

  ignoreButton.addEventListener('click', (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    opts.ignoreButton.onClick();
  });

  return {
    element: popupDiv,
  };
};

export type {
  TOptions as TEditorLanguageToolPopup,
  TReturnEditorLangToolPopup,
};

export { EditorLanguageToolPopup };
