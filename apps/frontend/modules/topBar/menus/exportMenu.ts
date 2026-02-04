import { copyToClipboard } from '@writtte-internal/clipboard';
import {
  exportToMarkdown,
  exportToMedium,
  exportToSubstack,
  exportToWordpress,
  exportToXML,
} from '../../../../../packages/@writtte-editor/export/dist';
import { FlatIcon, FlatIconName } from '../../../components/FlatIcon';
import { Menu } from '../../../components/Menu';
import { ToastType } from '../../../components/Toast';
import { TOAST_TIMEOUT } from '../../../constants/timeouts';
import { ToastController } from '../../../controller/toast';
import { getEditorAPI } from '../../../data/stores/mainEditor';
import { logFatalToSentry } from '../../../helpers/error/sentry';
import { langKeys } from '../../../translations/keys';
import { downloadStringAsFile } from '../../../utils/file/downloadStringAsFile';

const buildExportMenu = async (e: PointerEvent): Promise<void> => {
  const editorAPI = getEditorAPI();
  const toastController = ToastController();

  const rect = (e.target as HTMLButtonElement).getBoundingClientRect();

  const location = {
    x: rect.x + 24,
    y: rect.y + rect.height + 12,
  };

  const menu = Menu({
    id: 'menu__kitjfiudfe',
    location,
    items: [
      {
        id: 'menu_item__jwfoepxugv',
        text: langKeys().MenuItemDocumentExportMarkdown,
        leftIcon: FlatIcon(FlatIconName._18_MARKDOWN),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          const content = editorAPI.getContent();
          if (content === undefined) {
            toastController.showToast(
              {
                id: 'toast__xycmyfwmzp',
                text: langKeys().ToastDocumentCopyContentMdFailed,
                type: ToastType.ERROR,
              },
              TOAST_TIMEOUT.SHORT,
            );

            return;
          }

          const mdContent = exportToMarkdown(content);
          const { isCopied, error } = await copyToClipboard(mdContent, {
            mimeType: 'text/plain',
          });

          if (!isCopied || error) {
            toastController.showToast(
              {
                id: 'toast__lhlsfptvnc',
                text: langKeys().ToastDocumentCopyContentMdFailed,
                type: ToastType.ERROR,
              },
              TOAST_TIMEOUT.SHORT,
            );

            if (error) {
              logFatalToSentry(error);
            }

            return;
          }

          toastController.showToast(
            {
              id: 'toast__hzaubjxvol',
              text: langKeys().ToastDocumentCopyContentMdSuccessful,
              type: ToastType.SUCCESS,
            },
            TOAST_TIMEOUT.LONG,
          );
        },
        sectionTitle: langKeys().MenuSectionCopy,
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__knnagvxbau',
        text: langKeys().MenuItemDocumentExportXml,
        leftIcon: FlatIcon(FlatIconName._18_XML),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          const content = editorAPI.getContent();
          if (content === undefined) {
            toastController.showToast(
              {
                id: 'toast__toszevlyxs',
                text: langKeys().ToastDocumentCopyContentXmlFailed,
                type: ToastType.ERROR,
              },
              TOAST_TIMEOUT.SHORT,
            );

            return;
          }

          const xmlContent = exportToXML(content);
          const { isCopied, error } = await copyToClipboard(xmlContent, {
            mimeType: 'text/plain',
          });

          if (!isCopied || error) {
            toastController.showToast(
              {
                id: 'toast__bymeyywgge',
                text: langKeys().ToastDocumentCopyContentXmlFailed,
                type: ToastType.ERROR,
              },
              TOAST_TIMEOUT.SHORT,
            );

            if (error) {
              logFatalToSentry(error);
            }

            return;
          }

          toastController.showToast(
            {
              id: 'toast__lqeftkmbur',
              text: langKeys().ToastDocumentCopyContentXmlSuccessful,
              type: ToastType.SUCCESS,
            },
            TOAST_TIMEOUT.LONG,
          );
        },
        sectionTitle: undefined,
        hasTopDivider: false,
        hasBottomDivider: true,
      },
      {
        id: 'menu_item__tsruhzbbkp',
        text: langKeys().MenuItemDocumentExportPlatformWordpress,
        leftIcon: FlatIcon(FlatIconName._18_WORDPRESS),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          const content = editorAPI.getContent();
          if (content === undefined) {
            toastController.showToast(
              {
                id: 'toast__gkxkrjoexz',
                text: langKeys().ToastDocumentCopyContentWordpressFailed,
                type: ToastType.ERROR,
              },
              TOAST_TIMEOUT.SHORT,
            );

            return;
          }

          const wordpressContent = exportToWordpress(content);
          const { isCopied, error } = await copyToClipboard(wordpressContent, {
            mimeType: 'text/html',
          });

          if (!isCopied || error) {
            toastController.showToast(
              {
                id: 'toast__xmcvjhkstk',
                text: langKeys().ToastDocumentCopyContentWordpressFailed,
                type: ToastType.ERROR,
              },
              TOAST_TIMEOUT.SHORT,
            );

            if (error) {
              logFatalToSentry(error);
            }

            return;
          }

          toastController.showToast(
            {
              id: 'toast__gmpkdtjmhn',
              text: langKeys().ToastDocumentCopyContentWordpressSuccessful,
              type: ToastType.SUCCESS,
            },
            TOAST_TIMEOUT.LONG,
          );
        },
        sectionTitle: undefined,
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__hljiwhjewh',
        text: langKeys().MenuItemDocumentExportPlatformMedium,
        leftIcon: FlatIcon(FlatIconName._18_MEDIUM),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          const content = editorAPI.getContent();
          if (content === undefined) {
            toastController.showToast(
              {
                id: 'toast__ychdhufxrq',
                text: langKeys().ToastDocumentCopyContentMediumFailed,
                type: ToastType.ERROR,
              },
              TOAST_TIMEOUT.SHORT,
            );

            return;
          }

          const mediumContent = exportToMedium(content);
          const { isCopied, error } = await copyToClipboard(mediumContent, {
            mimeType: 'text/html',
          });

          if (!isCopied || error) {
            toastController.showToast(
              {
                id: 'toast__nfmzcuxwlj',
                text: langKeys().ToastDocumentCopyContentMediumFailed,
                type: ToastType.ERROR,
              },
              TOAST_TIMEOUT.SHORT,
            );

            if (error) {
              logFatalToSentry(error);
            }

            return;
          }

          toastController.showToast(
            {
              id: 'toast__jgumaebzro',
              text: langKeys().ToastDocumentCopyContentMediumSuccessful,
              type: ToastType.SUCCESS,
            },
            TOAST_TIMEOUT.LONG,
          );
        },
        sectionTitle: undefined,
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__jrphotxfzj',
        text: langKeys().MenuItemDocumentExportPlatformSubstack,
        leftIcon: FlatIcon(FlatIconName._18_SUBSTACK),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          const content = editorAPI.getContent();
          if (content === undefined) {
            toastController.showToast(
              {
                id: 'toast__urkrqxidsc',
                text: langKeys().ToastDocumentCopyContentSubstackFailed,
                type: ToastType.ERROR,
              },
              TOAST_TIMEOUT.SHORT,
            );

            return;
          }

          const substackContent = exportToSubstack(content);
          const { isCopied, error } = await copyToClipboard(substackContent, {
            mimeType: 'text/html',
          });

          if (!isCopied || error) {
            toastController.showToast(
              {
                id: 'toast__pwrhnprwml',
                text: langKeys().ToastDocumentCopyContentSubstackFailed,
                type: ToastType.ERROR,
              },
              TOAST_TIMEOUT.SHORT,
            );

            if (error) {
              logFatalToSentry(error);
            }

            return;
          }

          toastController.showToast(
            {
              id: 'toast__exearxhffh',
              text: langKeys().ToastDocumentCopyContentSubstackSuccessful,
              type: ToastType.SUCCESS,
            },
            TOAST_TIMEOUT.LONG,
          );
        },
        sectionTitle: undefined,
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__hfnhqkhylz',
        text: langKeys().MenuItemDownloadMarkdown,
        leftIcon: FlatIcon(FlatIconName._18_MARKDOWN),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: (): void => {
          const content = editorAPI.getContent();
          if (!content) {
            return;
          }

          const title = `${document.title}.md`;
          const mdContent = exportToMarkdown(content);

          downloadStringAsFile(title, mdContent);

          toastController.showToast(
            {
              id: 'toast__mphtseijfe',
              text: langKeys().ToastDocumentDownloadContentMdSuccessful,
              type: ToastType.SUCCESS,
            },
            TOAST_TIMEOUT.LONG,
          );
        },
        sectionTitle: langKeys().MenuSectionDownload,
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__duaolnzwgt',
        text: langKeys().MenuItemDownloadXml,
        leftIcon: FlatIcon(FlatIconName._18_XML),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: (): void => {
          const content = editorAPI.getContent();
          if (!content) {
            return;
          }

          const title = `${document.title}.xml`;
          const mdContent = exportToXML(content);

          downloadStringAsFile(title, mdContent);

          toastController.showToast(
            {
              id: 'toast__qnfndamfin',
              text: langKeys().ToastDocumentDownloadContentXmlSuccessful,
              type: ToastType.SUCCESS,
            },
            TOAST_TIMEOUT.LONG,
          );
        },
        sectionTitle: undefined,
        hasTopDivider: false,
        hasBottomDivider: false,
      },
    ],
    menuWidth: 256,
    isRightSideMenu: true,
  });

  document.body.appendChild(menu.element);
};

export { buildExportMenu };
