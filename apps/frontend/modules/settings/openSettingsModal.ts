import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { SettingsModalController } from '../../controller/settingsModal';
import { langKeys } from '../../translations/keys';
import { getHighRiskSettingsContent } from './contents/highRisk';
import { getOverviewSettingsContent } from './contents/overview';
import { getSecuritySettingsContent } from './contents/security';
import { getSubscriptionSettingsContent } from './contents/subscription';

const settingsPageSectionIDs = {
  overview: 'settings_section__pdfqqoturl',
  security: 'settings_section__xgyawjbhfi',
  subscription: 'settings_section__kqxiqxtclz',
  highRisk: 'settings_section__kzdzcgodsq',
};

const openSettingsModal = async (
  pageSectionIDToShow: string,
): Promise<void> => {
  const settingsModalController = SettingsModalController();

  const modal = settingsModalController.showModal({
    id: 'settings_modal__hozbdlgaew',
    title: langKeys().SettingsModalTextTitle,
    sections: [
      {
        id: settingsPageSectionIDs.overview,
        icon: FlatIcon(FlatIconName._18_USER),
        text: langKeys().SettingsModalSectionTextOverview,
        isSelected: false,
        onClick: (): void =>
          setSection(
            settingsPageSectionIDs.overview,
            getOverviewSettingsContent(),
          ),
        isVisible: true,
      },
      {
        id: settingsPageSectionIDs.security,
        icon: FlatIcon(FlatIconName._18_SHIELD),
        text: langKeys().SettingsModalSectionTextSecurity,
        isSelected: false,
        onClick: (): void =>
          setSection(
            settingsPageSectionIDs.security,
            getSecuritySettingsContent(),
          ),
        isVisible: true,
      },
      {
        id: settingsPageSectionIDs.subscription,
        icon: FlatIcon(FlatIconName._18_SUBSCRIPTION),
        text: langKeys().SettingsModalSectionTextSubscription,
        isSelected: false,
        onClick: (): void =>
          setSection(
            settingsPageSectionIDs.subscription,
            getSubscriptionSettingsContent(),
          ),
        isVisible: true,
      },
      {
        id: settingsPageSectionIDs.highRisk,
        icon: FlatIcon(FlatIconName._18_HIGH_RISK),
        text: langKeys().SettingsModalSectionTextHighRisk,
        isSelected: false,
        onClick: (): void =>
          setSection(
            settingsPageSectionIDs.highRisk,
            getHighRiskSettingsContent(),
          ),
        isVisible: true,
      },
    ],
  });

  const setSection = (sectionId: string, content: HTMLDivElement[]): void => {
    const ids = Object.values(settingsPageSectionIDs);
    for (let i = 0; i < ids.length; i++) {
      if (modal.sections[ids[i]]) {
        modal.sections[ids[i]].setSelectedState(false);
      }
    }

    modal.sections[sectionId].setSelectedState(true);
    modal.setSectionContent(content);
  };

  var sectionToShow: HTMLDivElement[] = getOverviewSettingsContent();
  switch (pageSectionIDToShow) {
    case settingsPageSectionIDs.subscription:
      sectionToShow = getSubscriptionSettingsContent();
      break;

    default:
      sectionToShow = getOverviewSettingsContent();
  }

  setSection(pageSectionIDToShow, sectionToShow);
};

export { settingsPageSectionIDs, openSettingsModal };
