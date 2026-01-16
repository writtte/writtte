import {
  type TEditorAPI,
  type TExtensionOptions,
  WrittteEditor,
} from '@writtte-editor/editor';
import {
  Button,
  ButtonAction,
  ButtonColor,
  ButtonSize,
  type TButtonOptions,
} from './Button';

type TOptions = {
  options: TExtensionOptions;
  content: string;
  restoreButton: Pick<TButtonOptions, 'id' | 'text' | 'onClick'>;
};

type TReturnVersionModalContent = {
  element: HTMLDivElement;
  editorElement: HTMLDivElement;
  editorAPI: TEditorAPI;
};

const VersionModalContent = (opts: TOptions): TReturnVersionModalContent => {
  const versionEditorDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const buttonDiv = document.createElement('div');

  versionEditorDiv.classList.add('version-modal-content', 'v-scrollbar');
  buttonDiv.classList.add('version-modal-content__button');

  containerDiv.classList.add(
    'version-modal-content__container',
    'writtte-editor',
    'v-scrollbar',
  );

  var temporaryVersionEditor: TEditorAPI = WrittteEditor({
    element: containerDiv,
    options: opts.options,
  });

  temporaryVersionEditor.setReadable();

  const contentInSchema = temporaryVersionEditor.stringToSchema(opts.content);
  temporaryVersionEditor.setContent(contentInSchema);

  const buttonElement = Button({
    loadingText: undefined,
    leftIcon: undefined,
    rightIcon: undefined,
    action: ButtonAction.BUTTON,
    color: ButtonColor.PRIMARY,
    size: ButtonSize.MEDIUM,
    isFullWidth: false,
    ...opts.restoreButton,
  });

  buttonDiv.appendChild(buttonElement.element);
  versionEditorDiv.append(containerDiv, buttonDiv);

  return {
    element: versionEditorDiv,
    editorElement: containerDiv,
    editorAPI: temporaryVersionEditor,
  };
};

export type {
  TOptions as TVersionModalContentOptions,
  TReturnVersionModalContent,
};

export { VersionModalContent };
