import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { TopBar } from '../components/TopBar';
import { PATHS } from '../constants/paths';
import { TopBarController } from '../controller/topBar';
import { setupEditorTopBar } from '../modules/topBar/editorTopBar';
import { setupParentTopBar } from '../modules/topBar/parentTopBar';
import { checkRouteStartsWith } from '../utils/routes/helpers';

const DashboardLayout = async ({
  content,
}: {
  content: HTMLElement;
}): Promise<HTMLElement> => {
  if (!(content instanceof HTMLElement)) {
    throw new Error('content should be a valid HTMLElement');
  }

  const layoutDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const pageDiv = document.createElement('div');

  layoutDiv.classList.add('dashboard-layout');
  containerDiv.classList.add('dashboard-layout__container');
  pageDiv.classList.add('dashboard-layout__page');

  pageDiv.appendChild(content);
  layoutDiv.appendChild(containerDiv);

  const topBarElement = TopBar({
    logo: FlatIcon(FlatIconName._26_WRITTTE_LOGO),
    badge: undefined,
    leftButtons: [],
    rightButtons: [],
  });

  const topBarController = TopBarController();
  topBarController.setTopBar(topBarElement);

  if (checkRouteStartsWith([PATHS.DOCUMENT_EDIT])) {
    await setupEditorTopBar();
  } else {
    await setupParentTopBar();
  }

  containerDiv.append(topBarElement.element, pageDiv);
  return layoutDiv;
};

export { DashboardLayout };
