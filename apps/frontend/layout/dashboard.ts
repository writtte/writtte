import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { TopBar } from '../components/TopBar';
import { TopBarController } from '../controller/topBar';
import { parentTopBar } from '../modules/topBar/parentTopBar';

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
    icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
    leftButtons: [],
    rightButtons: [],
  });

  const topBarController = TopBarController();
  topBarController.setTopBar(topBarElement);

  await parentTopBar();

  containerDiv.append(topBarElement.element, pageDiv);
  return layoutDiv;
};

export { DashboardLayout };
