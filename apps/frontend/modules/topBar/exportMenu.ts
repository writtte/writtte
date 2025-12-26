import { copyToClipboard } from '@writtte-internal/clipboard';
import {
  exportToMarkdown,
  exportToMedium,
  exportToSubstack,
  exportToWordpress,
  exportToXML,
} from '../../../../packages/@writtte-editor/export';
import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { Menu } from '../../components/Menu';
import { ALERT_TIMEOUT } from '../../constants/timeouts';
import { AlertController } from '../../controller/alert';
import { getEditorAPI } from '../../data/stores/mainEditor';
import { langKeys } from '../../translations/keys';

const buildExportMenu = async (e: PointerEvent): Promise<void> => {
  const editorAPI = getEditorAPI();
  const alertController = AlertController();

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
          const alertPrefix = 'Markdown ';

          const content = editorAPI.getContent();
          if (content === undefined) {
            alertController.showAlert(
              {
                id: 'alert__vefoupxouy',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          const mdContent = exportToMarkdown(content);
          const { isCopied, error } = await copyToClipboard(mdContent, {
            mimeType: 'text/plain',
          });

          if (!isCopied || error) {
            alertController.showAlert(
              {
                id: 'alert__edtifuossn',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: error
                  ? error
                  : langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          alertController.showAlert(
            {
              id: 'alert__jcaftsgzum',
              title: alertPrefix + langKeys().AlertDocumentCopiedTitle,
              description: langKeys().AlertDocumentCopiedDescription,
            },
            ALERT_TIMEOUT.SHORT,
          );
        },
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__ijguhtlhrm',
        text: langKeys().MenuItemDocumentExportMarkdownX,
        leftIcon: undefined,
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          const alertPrefix = 'Markdown eXtended ';

          const content = editorAPI.getContent();
          if (content === undefined) {
            alertController.showAlert(
              {
                id: 'alert__hjqbczbhlu',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          const mdContent = exportToMarkdown(content);
          const { isCopied, error } = await copyToClipboard(mdContent, {
            mimeType: 'text/plain',
          });

          if (!isCopied || error) {
            alertController.showAlert(
              {
                id: 'alert__kjmvkvhzvd',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: error
                  ? error
                  : langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          alertController.showAlert(
            {
              id: 'alert__hxtnejnkjz',
              title: alertPrefix + langKeys().AlertDocumentCopiedTitle,
              description: langKeys().AlertDocumentCopiedDescription,
            },
            ALERT_TIMEOUT.SHORT,
          );
        },
        hasTopDivider: false,
        hasBottomDivider: true,
      },
      {
        id: 'menu_item__knnagvxbau',
        text: langKeys().MenuItemDocumentExportXml,
        leftIcon: FlatIcon(FlatIconName._18_XML),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          const alertPrefix = 'XML ';

          const content = editorAPI.getContent();
          if (content === undefined) {
            alertController.showAlert(
              {
                id: 'alert__ylomdvanwa',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          const xmlContent = exportToXML(content);
          const { isCopied, error } = await copyToClipboard(xmlContent, {
            mimeType: 'text/plain',
          });

          if (!isCopied || error) {
            alertController.showAlert(
              {
                id: 'alert__cdhibpeyer',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: error
                  ? error
                  : langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          alertController.showAlert(
            {
              id: 'alert__xqmolqozww',
              title: alertPrefix + langKeys().AlertDocumentCopiedTitle,
              description: langKeys().AlertDocumentCopiedDescription,
            },
            ALERT_TIMEOUT.SHORT,
          );
        },
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
          const alertPrefix = 'Wordpress ';

          const content = editorAPI.getContent();
          if (content === undefined) {
            alertController.showAlert(
              {
                id: 'alert__fnkumixpyh',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          const wordpressContent = exportToWordpress(content);
          const { isCopied, error } = await copyToClipboard(wordpressContent, {
            mimeType: 'text/html',
          });

          if (!isCopied || error) {
            alertController.showAlert(
              {
                id: 'alert__vdjxhbiruc',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: error
                  ? error
                  : langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          alertController.showAlert(
            {
              id: 'alert__tflvnovsxk',
              title: alertPrefix + langKeys().AlertDocumentCopiedTitle,
              description: langKeys().AlertDocumentCopiedDescription,
            },
            ALERT_TIMEOUT.SHORT,
          );
        },
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
          const alertPrefix = 'Medium ';

          const content = editorAPI.getContent();
          if (content === undefined) {
            alertController.showAlert(
              {
                id: 'alert__xpvopfpqmi',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          const mediumContent = exportToMedium(content);
          const { isCopied, error } = await copyToClipboard(mediumContent, {
            mimeType: 'text/html',
          });

          if (!isCopied || error) {
            alertController.showAlert(
              {
                id: 'alert__ecbpmppnjp',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: error
                  ? error
                  : langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          alertController.showAlert(
            {
              id: 'alert__ondbbryded',
              title: alertPrefix + langKeys().AlertDocumentCopiedTitle,
              description: langKeys().AlertDocumentCopiedDescription,
            },
            ALERT_TIMEOUT.SHORT,
          );
        },
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
          const alertPrefix = 'Substack ';

          const content = editorAPI.getContent();
          if (content === undefined) {
            alertController.showAlert(
              {
                id: 'alert__wrpmrtfmsw',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          const substackContent = exportToSubstack(content);
          const { isCopied, error } = await copyToClipboard(substackContent, {
            mimeType: 'text/html',
          });

          if (!isCopied || error) {
            alertController.showAlert(
              {
                id: 'alert__voexwdtoxe',
                title: alertPrefix + langKeys().AlertDocumentCopyFailedTitle,
                description: error
                  ? error
                  : langKeys().AlertDocumentCopyFailedDescription,
              },
              ALERT_TIMEOUT.SHORT,
            );

            return;
          }

          alertController.showAlert(
            {
              id: 'alert__fbytdubhju',
              title: alertPrefix + langKeys().AlertDocumentCopiedTitle,
              description: langKeys().AlertDocumentCopiedDescription,
            },
            ALERT_TIMEOUT.SHORT,
          );
        },
        hasTopDivider: false,
        hasBottomDivider: false,
      },
      {
        id: 'menu_item__hnzhdaotoh',
        text: langKeys().MenuItemDocumentExportHelp,
        leftIcon: FlatIcon(FlatIconName._18_CIRCLE_HELP),
        rightIcon: undefined,
        isLeftIconVisible: true,
        onClick: async (): Promise<void> => {
          // complete later
        },
        hasTopDivider: true,
        hasBottomDivider: false,
      },
    ],
    menuWidth: 256,
    isRightSideMenu: true,
  });

  document.body.appendChild(menu.element);
};

export { buildExportMenu };
