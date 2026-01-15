import type { TSharingItem } from '../../components/SharingModal';
import { copyToClipboard } from '@writtte-internal/clipboard';
import { ButtonColor, type TReturnButton } from '../../components/Button';
import {
  ModalContainerItemDirection,
  ModalContentItemType,
} from '../../components/Modal';
import {
  AnalyticsCardDeltaType,
  SharingModalAnalytics,
  type TAnalyticsCardDeltaType,
} from '../../components/SharingModalAnalytics';
import { FRONTEND_CONFIGS } from '../../configs/fe';
import { PATHS } from '../../constants/paths';
import { ALERT_TIMEOUT } from '../../constants/timeouts';
import { AlertController } from '../../controller/alert';
import { ModalController } from '../../controller/modal';
import { SharingModalController } from '../../controller/sharingModal';
import { v1DocumentSharingCreate } from '../../data/apis/documentSharing/v1DocumentSharingCreate';
import { v1DocumentSharingDelete } from '../../data/apis/documentSharing/v1DocumentSharingDelete';
import { v1DocumentSharingRetrieveList } from '../../data/apis/documentSharing/v1DocumentSharingRetrieveList';
import {
  type TResponseV1DocumentSharingViewRetrieveListAnalytics,
  v1DocumentSharingViewRetrieveList,
} from '../../data/apis/documentSharingView/v1SharingViewRetrieveList';
import { getMainEditor } from '../../data/stores/mainEditor';
import { CommonEmpty } from '../../emptyState/CommonEmpty';
import { AccessToken } from '../../helpers/account/accessToken';
import { langKeys } from '../../translations/keys';
import { HTTP_STATUS } from '../../utils/data/fetch';

var totalSharingLinks: number = 0;

var currentOpenedAnalyticsCode: string = '';

const openSharingModal = async (): Promise<void> => {
  const mainEditor = getMainEditor();

  const { getCurrentAccountData } = AccessToken();

  const alertController = AlertController();
  const modalController = ModalController();
  const sharingModalController = SharingModalController();

  const modal = sharingModalController.showModal({
    id: 'sharing_modal__jxarrjwdzv',
    title: langKeys().SharingModalTextTitle,
    onLinkCreate: async (): Promise<void> => await createSharingLink(),
  });

  modal.setAnalyticsContent(
    CommonEmpty({
      title: langKeys().SharingModalEmptyStateSelectLinkTitle,
      description: langKeys().SharingModalEmptyStateSelectLinkDescription,
    }),
  );

  const loadExistingSharingLinks = async (): Promise<void> => {
    modal.setItemListLoading('loading_indicator__mtlsazpybl');

    const accessToken = getCurrentAccountData()?.access_token ?? '';

    const { status, response } = await v1DocumentSharingRetrieveList({
      accessToken,
      documentCode: mainEditor.documentCode ?? '',
    });

    if (status !== HTTP_STATUS.OK || !response) {
      modal.setItemListContent(
        CommonEmpty({
          title: langKeys().ErrorApiInternalServerError,
          description: langKeys().ErrorSharingLinksRetrievedFailed,
        }),
      );

      return;
    }

    if (response.results.sharing_list.length === 0) {
      modal.setItemListContent(
        CommonEmpty({
          title: langKeys().SharingModalEmptyStateNoLinksTitle,
          description: langKeys().SharingModalEmptyStateNoLinksDescription,
        }),
      );

      return;
    }

    var items: TSharingItem[] = [];

    if (
      response.results.sharing_list &&
      response.results.sharing_list.length > 0
    ) {
      for (let i = 0; i < response.results.sharing_list.length; i++) {
        totalSharingLinks++;

        items.push(
          constructItemToAdd(response.results.sharing_list[i].sharing_code),
        );
      }

      modal.addItems(items);
    }
  };

  const deleteSharingLink = async (
    button: TReturnButton,
    sharingCode: string,
  ): Promise<void> => {
    button.setLoading(true);

    if (currentOpenedAnalyticsCode === sharingCode) {
      // When the user deletes an opened shared link, close the analytics
      // view

      modal.setAnalyticsContent(
        CommonEmpty({
          title: langKeys().SharingModalEmptyStateSelectLinkTitle,
          description: langKeys().SharingModalEmptyStateSelectLinkDescription,
        }),
      );
    }

    const accessToken = getCurrentAccountData()?.access_token ?? '';

    const { status } = await v1DocumentSharingDelete({
      accessToken,
      documentCode: mainEditor.documentCode ?? '',
      sharingCode,
    });

    if (status !== HTTP_STATUS.OK) {
      alertController.showAlert(
        {
          id: 'alert__rufbwtebqn',
          title: langKeys().AlertSharingItemDeleteFailedTitle,
          description: langKeys().AlertSharingItemDeleteFailedDescription,
        },
        ALERT_TIMEOUT.SHORT,
      );

      button.setLoading(false);
      return;
    }

    totalSharingLinks--;

    if (totalSharingLinks <= 0) {
      modal.setItemListContent(
        CommonEmpty({
          title: langKeys().SharingModalEmptyStateNoLinksTitle,
          description: langKeys().SharingModalEmptyStateNoLinksDescription,
        }),
      );
    }

    modal.removeItem(`sharing_item__${sharingCode}`);
    button.setLoading(false);

    modalController.closeModal('modal__bqawzpjcab');
  };

  const createSharingLink = async (): Promise<void> => {
    modal.setLinkCreateButtonLoadingState(true);

    const { status, response } = await v1DocumentSharingCreate({
      accessToken: getCurrentAccountData()?.access_token ?? '',
      documentCode: mainEditor.documentCode ?? '',
    });

    if (status !== HTTP_STATUS.CREATED || !response) {
      modal.setLinkCreateButtonLoadingState(false);

      alertController.showAlert(
        {
          id: 'alert__wbizzimpeq',
          title: langKeys().AlertSharingItemCreateFailedTitle,
          description: langKeys().AlertSharingItemCreateFailedDescription,
        },
        ALERT_TIMEOUT.SHORT,
      );

      return;
    }

    if (totalSharingLinks === 0) {
      modal.removeItemListContent();
    }

    totalSharingLinks++;

    modal.addItem(constructItemToAdd(response.results.sharing_code));
    modal.setLinkCreateButtonLoadingState(false);
  };

  const calculateTotalUniqueViews = (
    versions: TResponseV1DocumentSharingViewRetrieveListAnalytics[],
  ): number =>
    versions.reduce((sum, item) => sum + (item.unique_views || 0), 0);

  const calculateTotalViews = (
    versions: TResponseV1DocumentSharingViewRetrieveListAnalytics[],
  ): number => versions.reduce((sum, item) => sum + (item.views || 0), 0);

  const calculateDelta = (
    currentValue: number,
    previousValue: number,
  ): { value: number; type: TAnalyticsCardDeltaType } => {
    if (previousValue === 0) {
      return {
        value: 0,
        type: AnalyticsCardDeltaType.NONE,
      };
    }

    const percentageChange =
      ((currentValue - previousValue) / previousValue) * 100;

    var type: TAnalyticsCardDeltaType = AnalyticsCardDeltaType.NONE;
    if (percentageChange > 0) {
      type = AnalyticsCardDeltaType.UP;
    } else if (percentageChange < 0) {
      type = AnalyticsCardDeltaType.DOWN;
    }

    return {
      value: Math.abs(percentageChange),
      type,
    };
  };

  const getDaysInCurrentMonth = (): number => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const setAnalytics = async (code: string): Promise<void> => {
    currentOpenedAnalyticsCode = code;

    modal.setAnalyticsContentLoading('loading_indicator__syxkwqmxji');

    const daysInMonth = getDaysInCurrentMonth();

    const { status, response } = await v1DocumentSharingViewRetrieveList({
      accessToken: getCurrentAccountData()?.access_token ?? '',
      pageCode: code,
      dateRange: daysInMonth.toString(),
    });

    if (status !== HTTP_STATUS.OK || !response?.results) {
      modal.setAnalyticsContent(
        CommonEmpty({
          title: langKeys().ErrorApiInternalServerError,
          description: langKeys().ErrorSharingLinksRetrievedFailed,
        }),
      );

      return;
    }

    const versions: TResponseV1DocumentSharingViewRetrieveListAnalytics[] =
      response.results.daily_analytics || [];

    const totalUniqueViews = calculateTotalUniqueViews(versions);
    const totalViews = calculateTotalViews(versions);

    const currentDateData =
      versions.length > 0 ? versions[versions.length - 1] : null;

    const previousDateData =
      versions.length > 1 ? versions[versions.length - 2] : null;

    const currentUniqueViews = currentDateData?.unique_views || 0;
    const previousUniqueViews = previousDateData?.unique_views || 0;
    const uniqueViewsDelta = calculateDelta(
      currentUniqueViews,
      previousUniqueViews,
    );

    const currentViews = currentDateData?.views || 0;
    const previousViews = previousDateData?.views || 0;
    const viewsDelta = calculateDelta(currentViews, previousViews);

    const chartDates = Array.from({ length: daysInMonth }, (_, i) =>
      (i + 1).toString(),
    );

    const viewsMap = new Map<number, number>();
    const uniqueViewsMap = new Map<number, number>();

    for (let i = 0; i < versions.length; i++) {
      const item = versions[i];
      const date = new Date(item.date);
      const day = date.getDate();
      viewsMap.set(day, item.views || 0);
      uniqueViewsMap.set(day, item.unique_views || 0);
    }

    const chartViews = chartDates.map(
      (day) => viewsMap.get(parseInt(day, 10)) || 0,
    );
    const chartUniqueViews = chartDates.map(
      (day) => uniqueViewsMap.get(parseInt(day, 10)) || 0,
    );

    const analyticsElement = SharingModalAnalytics({
      title: `${langKeys().SharingModalAnalyticsTitlePrefix} "${code}"`,
      cards: [
        {
          label: langKeys().SharingModalAnalyticsCardLabelTotalUniqueViews,
          value: totalUniqueViews,
          delta: undefined,
        },
        {
          label: langKeys().SharingModalAnalyticsCardLabelTotalViews,
          value: totalViews,
          delta: undefined,
        },
        {
          label:
            langKeys().SharingModalAnalyticsCardLabelTotalUniqueViewsPerDay,
          value: currentUniqueViews,
          delta: {
            value: uniqueViewsDelta.value,
            type: uniqueViewsDelta.type,
          },
        },
        {
          label: langKeys().SharingModalAnalyticsCardLabelTotalViewsPerDay,
          value: currentViews,
          delta: {
            value: viewsDelta.value,
            type: viewsDelta.type,
          },
        },
      ],
      chart: {
        dates: chartDates,
        views: {
          label: langKeys().SharingModalAnalyticsChartFieldViews,
          values: chartViews,
        },
        uniqueViews: {
          label: langKeys().SharingModalAnalyticsChartFieldUniqueViews,
          values: chartUniqueViews,
        },
      },
    });

    modal.setAnalyticsContent(analyticsElement.element);
  };

  const constructItemToAdd = (sharingCode: string): TSharingItem => ({
    id: `sharing_item__${sharingCode}`,
    text: generateSharingLinkToRender(sharingCode),
    onClick: async (): Promise<void> => await setAnalytics(sharingCode),
    onCopy: async (): Promise<void> => {
      await copyToClipboard(generateSharingLinkToCopy(sharingCode), {
        mimeType: 'text/plain',
      });
    },
    onDelete: (): void => {
      const confirmationModal = modalController.showModal({
        id: 'modal__bqawzpjcab',
        title: langKeys().ModalSharingLinkDeleteTextTitle,
        content: [
          {
            type: ModalContentItemType.TEXT,
            text: langKeys().ModalSharingLinkDeleteTextContent,
          },
          {
            type: ModalContentItemType.BUTTON,
            direction: ModalContainerItemDirection.ROW,
            buttons: [
              {
                id: 'button__eawwjbgdfn',
                text: langKeys().ModalSharingLinkDeleteButtonCancel,
                loadingText: undefined,
                leftIcon: undefined,
                color: ButtonColor.NEUTRAL,
                onClick: (): void => {
                  modalController.closeModal('modal__ivogbppdvg');
                },
              },
              {
                id: 'button__alpjgihotd',
                text: langKeys().ModalSharingLinkDeleteButtonDelete,
                loadingText: langKeys().ModalSharingLinkDeleteButtonDeleting,
                leftIcon: undefined,
                color: ButtonColor.DANGER,
                onClick: async (): Promise<void> =>
                  await deleteSharingLink(
                    confirmationModal.buttons.button__alpjgihotd,
                    sharingCode,
                  ),
              },
            ],
          },
        ],
        width: 384,
      });
    },
  });

  await loadExistingSharingLinks();
};

const generateSharingLinkToRender = (code: string): string =>
  `${PATHS.SHARE_DOCUMENT}/${code}`;

const generateSharingLinkToCopy = (code: string): string =>
  `${FRONTEND_CONFIGS.URL}${PATHS.SHARE_DOCUMENT}/${code}`;

export { openSharingModal };
