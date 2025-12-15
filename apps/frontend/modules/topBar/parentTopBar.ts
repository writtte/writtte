import { topBarInstance } from '../../controller/topBar';
import { buildError } from '../../helpers/error/build';

const parentTopBar = async (): Promise<void> => {
  if (topBarInstance === null) {
    throw new Error(buildError('the top bar instance still not initialized'));
  }

  // topBarInstance.addButtonsToLeft([
  //   {
  //     id: 'action_button__qgrwkpfqkz',
  //     icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
  //     onClick: (e: PointerEvent) => {

  //     },
  //   },
  // ]);

  // topBarInstance.addButtonsToRight([
  //   {
  //     id: 'action_button__cxhyyxssyc',
  //     icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
  //     onClick: (e: PointerEvent) => {
  //       console.log('right', e);
  //     },
  //   },
  // ]);
};

export { parentTopBar };
