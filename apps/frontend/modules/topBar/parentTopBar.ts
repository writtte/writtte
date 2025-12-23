import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { topBarInstance } from '../../controller/topBar';
import { buildError } from '../../helpers/error/build';
import { buildAccountMenu } from './accountMenu';

const setupParentTopBar = async (): Promise<void> => {
  if (topBarInstance === null) {
    throw new Error(buildError('the top bar instance still not initialized'));
  }

  topBarInstance.addButtonsToRight([
    {
      id: 'action_button__mctduiojnt',
      icon: FlatIcon(FlatIconName._18_USER),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        await buildAccountMenu(e);
      },
    },
  ]);
};

export { setupParentTopBar };
