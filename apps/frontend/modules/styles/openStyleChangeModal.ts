import type { TReturnItemList } from '../../components/ItemList';
import type { TIDBStyles } from '../../data/stores/indexedDB';
import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { StyleChangeModalController } from '../../controller/styleChangeModal';
import { langKeys } from '../../translations/keys';
import { createStyle } from './createStyle';
import { deleteStyle } from './deleteStyle';
import { getStyleFromIDB } from './getStyles';
import { updateStyle } from './updateStyle';

const openStyleChangeModal = async (
  itemListElement: TReturnItemList,
  styleCode: string | undefined,
): Promise<void> => {
  const styleChangeModalController = StyleChangeModalController();

  var styleDetails: TIDBStyles | undefined;
  if (styleCode !== undefined) {
    styleDetails = await getStyleFromIDB(styleCode);
  }

  const modal = styleChangeModalController.showModal({
    id: 'style_change_modal__xkrzzwqofh',
    title:
      styleDetails === undefined
        ? langKeys().StylesModalTextTitleCreate
        : langKeys().StylesModalTextTitleUpdate,
    styleTitle: {
      title: langKeys().StylesModalSectionTitleName,
      input: {
        id: 'input__luvogwgoeu',
        text: styleDetails?.styleName ?? undefined,
        placeholderText: langKeys().StylesModalInputPlaceholderName,
        statusText: undefined,
        onChange: undefined,
        onSubmit: undefined,
      },
    },
    styleEditor: {
      title: langKeys().StylesModalSectionTitleStyle,
      textArea: {
        id: 'text_area__yvuqhaerty',
        text: styleDetails?.styleContent ?? undefined,
        placeholderText: langKeys().StylesModalInputPlaceholderStyle,
        statusText: undefined,
        onChange: undefined,
        onSubmit: undefined,
      },
    },
    samples: {
      title: langKeys().StylesModalSectionTitleUpdate,
      urlInput: {
        id: 'input__qzagvatmaa',
        text: undefined,
        placeholderText: langKeys().StylesModalInputPlaceholderUrl,
        statusText: undefined,
        onChange: undefined,
        onSubmit: undefined,
      },
      scrapeButton: {
        id: 'button__gjzzlrsdtx',
        text: langKeys().StylesModalButtonScrape,
        loadingText: langKeys().StylesModalButtonScraping,
        leftIcon: FlatIcon(FlatIconName._18_HYPERLINK),
        onClick: (): void => {
          // Update this code later, check commit (feat: temporary disable samples feature in styles)
        },
      },
      uploadButton: {
        id: 'button__lfsbderxei',
        text: langKeys().StylesModalButtonUpload,
        loadingText: langKeys().StylesModalButtonUploading,
        leftIcon: FlatIcon(FlatIconName._18_EXPORT),
        onClick: (): void => {
          // Update this code later, check commit (feat: temporary disable samples feature in styles)
        },
      },
    },
    saveButton: {
      id: 'button__jaqabzjnre',
      text:
        styleDetails === undefined
          ? langKeys().StylesModalButtonCreate
          : langKeys().StylesModalButtonUpdate,
      loadingText:
        styleDetails === undefined
          ? langKeys().StylesModalButtonCreating
          : langKeys().StylesModalButtonUpdating,
      onClick: async (): Promise<void> => {
        if (styleDetails === undefined) {
          const createResponse = await createStyle(
            modal.inputTitle,
            modal.stylesTextArea,
            modal.footerButton,
          );

          if (createResponse === undefined) {
            return;
          }

          const { styleCode: styleCodeAfterCreate, styleName } = createResponse;

          itemListElement.addItemToList({
            id: styleCodeAfterCreate,
            text: styleName,
            optionButton: {
              id: `button__${styleCodeAfterCreate}`,
              icon: FlatIcon(FlatIconName._18_TRASH),
              onClick: async (): Promise<void> =>
                await deleteStyle(itemListElement, styleCodeAfterCreate),
            },
            onClick: async (): Promise<void> =>
              await openStyleChangeModal(itemListElement, styleCodeAfterCreate),
            metadata: undefined,
          });

          itemListElement.sortItemsAlphabetically();

          styleChangeModalController.closeModal(
            'style_change_modal__xkrzzwqofh',
          );
        } else {
          if (styleCode) {
            const updateResponse = await updateStyle(
              modal.inputTitle,
              modal.stylesTextArea,
              modal.footerButton,
              styleCode,
            );

            if (updateResponse === undefined) {
              return;
            }

            const { styleCode: styleCodeAfterUpdate, styleName } =
              updateResponse;

            itemListElement.removeItemFromList(styleCodeAfterUpdate);

            itemListElement.addItemToList({
              id: styleCodeAfterUpdate,
              text: styleName,
              optionButton: {
                id: `button__${styleCodeAfterUpdate}`,
                icon: FlatIcon(FlatIconName._18_TRASH),
                onClick: async (): Promise<void> =>
                  await deleteStyle(itemListElement, styleCodeAfterUpdate),
              },
              onClick: async (): Promise<void> =>
                await openStyleChangeModal(
                  itemListElement,
                  styleCodeAfterUpdate,
                ),
              metadata: undefined,
            });

            styleChangeModalController.closeModal(
              'style_change_modal__xkrzzwqofh',
            );
          }
        }
      },
    },
  });

  modal.inputTitle.focus();
};

export { openStyleChangeModal };
