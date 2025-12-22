import {
  FixedMenuItemType,
  type TEditorFixedMenuItemOptions,
} from '../../components/EditorFixedMenuItem';
import { FlatIcon, FlatIconName } from '../../components/FlatIcon';

const setupEditorFixedMenuOptions = (): (TEditorFixedMenuItemOptions & {
  hasLeftDivider: boolean;
  hasRightDivider: boolean;
})[] => [
  {
    id: 'aa',
    item: {
      type: FixedMenuItemType.TEXT,
      text: 'Hello World',
    },
    hasLeftDivider: false,
    hasRightDivider: false,
  },
  {
    id: 'button',
    item: {
      type: FixedMenuItemType.BUTTON,
      icon: FlatIcon(FlatIconName._26_CROSS),
      isVisible: true,
      isSelected: false,
      onClick: (): void => {
        // TODO implement later
      },
    },
    hasLeftDivider: true,
    hasRightDivider: false,
  },
];

export { setupEditorFixedMenuOptions };
