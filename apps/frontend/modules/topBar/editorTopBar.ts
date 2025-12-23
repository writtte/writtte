import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { PATHS } from '../../constants/paths';
import { topBarInstance } from '../../controller/topBar';
import { buildError } from '../../helpers/error/build';
import { navigate } from '../../utils/routes/routes';
import { buildAccountMenu } from './accountMenu';

const setupEditorTopBar = async (): Promise<void> => {
  if (topBarInstance === null) {
    throw new Error(buildError('the top bar instance still not initialized'));
  }

  topBarInstance.addButtonsToLeft([
    {
      id: 'action_button__wzgexjekpk',
      icon: FlatIcon(FlatIconName._18_ARROW_LEFT),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();

        await navigate(PATHS.OVERVIEW);
      },
    },
  ]);

  topBarInstance.addButtonsToRight([
    {
      id: 'action_button__znkmokydeg',
      icon: FlatIcon(FlatIconName._18_USER),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        await buildAccountMenu(e);
      },
    },
  ]);
};

export { setupEditorTopBar };
