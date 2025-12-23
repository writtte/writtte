import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { SettingsModalController } from '../../controller/settingsModal';
import { langKeys } from '../../translations/keys';
import { getHighRiskSettingsContent } from './contents/highRisk';
import { getOverviewSettingsContent } from './contents/overview';
import { getSecuritySettingsContent } from './contents/security';
import { getSubscriptionSettingsContent } from './contents/subscription';

const sectionIds = {
  overview: 'settings_section__pdfqqoturl',
  security: 'settings_section__xgyawjbhfi',
  subscription: 'settings_section__kqxiqxtclz',
  highRisk: 'settings_section__kzdzcgodsq',
};

const openSettingsModal = async (): Promise<void> => {
  const settingsModalController = SettingsModalController();

  const modal = settingsModalController.showModal({
    id: 'settings_modal__hozbdlgaew',
    title: langKeys().SettingsModalTextTitle,
    sections: [
      {
        id: sectionIds.overview,
        icon: FlatIcon(FlatIconName._18_USER),
        text: langKeys().SettingsModalSectionTextOverview,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.overview, getOverviewSettingsContent()),
        isVisible: true,
      },
      {
        id: sectionIds.security,
        icon: FlatIcon(FlatIconName._18_SECURITY),
        text: langKeys().SettingsModalSectionTextSecurity,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.security, getSecuritySettingsContent()),
        isVisible: true,
      },
      {
        id: sectionIds.subscription,
        icon: FlatIcon(FlatIconName._18_SUBSCRIPTION),
        text: langKeys().SettingsModalSectionTextSubscription,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.subscription, getSubscriptionSettingsContent()),
        isVisible: true,
      },
      {
        id: sectionIds.highRisk,
        icon: FlatIcon(FlatIconName._18_HIGH_RISK),
        text: langKeys().SettingsModalSectionTextHighRisk,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.highRisk, getHighRiskSettingsContent()),
        isVisible: true,
      },
    ],
  });

  const setSection = (sectionId: string, content: HTMLDivElement[]): void => {
    const ids = Object.values(sectionIds);
    for (let i = 0; i < ids.length; i++) {
      if (modal.sections[ids[i]]) {
        modal.sections[ids[i]].setSelectedState(false);
      }
    }

    modal.sections[sectionId].setSelectedState(true);
    modal.setSectionContent(content);
  };

  // When opening the modal, the overview settings should be shown as
  // the default

  setSection(sectionIds.overview, getOverviewSettingsContent());
};

export { openSettingsModal };
