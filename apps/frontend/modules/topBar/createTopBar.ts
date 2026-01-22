import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { PATHS } from '../../constants/paths';
import { topBarInstance } from '../../controller/topBar';
import { buildError } from '../../helpers/error/build';
import { navigate } from '../../utils/routes/routes';
import { buildAccountMenu } from './menus/accountMenu';

const setupCreateTopBar = async (): Promise<void> => {
  if (topBarInstance === null) {
    throw new Error(buildError('the top bar instance still not initialized'));
  }

  topBarInstance.addButtonsToLeft([
    {
      id: 'action_button__lmbzpeuska',
      icon: FlatIcon(FlatIconName._18_CHEVRON_LEFT),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();

        await navigate(PATHS.DOCUMENTS);
      },
    },
  ]);

  topBarInstance.addButtonsToRight([
    {
      id: 'action_button__sfzzxkjwng',
      icon: FlatIcon(FlatIconName._18_USER),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        await buildAccountMenu(e);
      },
    },
  ]);
};

export { setupCreateTopBar };
