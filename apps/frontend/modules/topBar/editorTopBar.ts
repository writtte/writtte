import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { topBarInstance } from '../../controller/topBar';
import { buildError } from '../../helpers/error/build';
import { openSettingsModal } from '../settings/openSettingsModal';

const setupEditorTopBar = async (): Promise<void> => {
  if (topBarInstance === null) {
    throw new Error(buildError('the top bar instance still not initialized'));
  }

  topBarInstance.addButtonsToLeft([
    {
      id: 'action_button__wzgexjekpk',
      icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
      onClick: (e: PointerEvent) => {
        e.preventDefault();
      },
    },
  ]);

  topBarInstance.addButtonsToRight([
    {
      id: 'action_button__byqscebarg',
      icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        await openSettingsModal();
      },
    },
    {
      id: 'action_button__rwnqfhimth',
      icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        await openSettingsModal();
      },
    },
    {
      id: 'action_button__znkmokydeg',
      icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
      onClick: async (e: PointerEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();

        await openSettingsModal();
      },
    },
  ]);
};

export { setupEditorTopBar };
