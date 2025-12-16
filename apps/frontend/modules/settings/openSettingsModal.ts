import type { TSettingsItemOptions } from '../../components/SettingsItem';
import { ButtonColor } from '../../components/Button';
import { FlatIcon, FlatIconName } from '../../components/FlatIcon';
import { SettingsModalController } from '../../controller/settingsModal';
import { langKeys } from '../../translations/keys';
import { getAppearanceSettingsContent } from './contents/appearance';
import { getBetaFeaturesSettingsContent } from './contents/betaFeatures';
import { getEditorSettingsContent } from './contents/editor';
import { getHighRiskSettingsContent } from './contents/highRisk';
import { getLocalOptionsSettingsContent } from './contents/localOptions';
import { getOverviewSettingsContent } from './contents/overview';
import { getSecuritySettingsContent } from './contents/security';
import { getSubscriptionSettingsContent } from './contents/subscription';
import { getUsageSettingsContent } from './contents/usage';

const sectionIds = {
  overview: 'settings_section__pdfqqoturl',
  security: 'settings_section__xgyawjbhfi',
  appearance: 'settings_section__dafqkgbvug',
  editor: 'settings_section__ujqghjwlat',
  subscription: 'settings_section__kqxiqxtclz',
  usage: 'settings_section__wbhvhiqnuk',
  local: 'settings_section__oysiknlnay',
  beta: 'settings_section__npracqjrso',
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
        icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
        text: langKeys().SettingsModalSectionTextOverview,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.overview, getOverviewSettingsContent()),
      },
      {
        id: sectionIds.security,
        icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
        text: langKeys().SettingsModalSectionTextSecurity,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.security, getSecuritySettingsContent()),
      },
      {
        id: sectionIds.appearance,
        icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
        text: langKeys().SettingsModalSectionTextAppearance,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.appearance, getAppearanceSettingsContent()),
      },
      {
        id: sectionIds.editor,
        icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
        text: langKeys().SettingsModalSectionTextEditor,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.editor, getEditorSettingsContent()),
      },
      {
        id: sectionIds.subscription,
        icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
        text: langKeys().SettingsModalSectionTextSubscription,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.subscription, getSubscriptionSettingsContent()),
      },
      {
        id: sectionIds.usage,
        icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
        text: langKeys().SettingsModalSectionTextUsage,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.usage, getUsageSettingsContent()),
      },
      {
        id: sectionIds.local,
        icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
        text: langKeys().SettingsModalSectionTextLocal,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.local, getLocalOptionsSettingsContent()),
      },
      {
        id: sectionIds.beta,
        icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
        text: langKeys().SettingsModalSectionTextBeta,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.beta, getBetaFeaturesSettingsContent()),
      },
      {
        id: sectionIds.highRisk,
        icon: FlatIcon(FlatIconName._SAMPLE_CIRCLE),
        text: langKeys().SettingsModalSectionTextHighRisk,
        isSelected: false,
        onClick: (): void =>
          setSection(sectionIds.highRisk, getHighRiskSettingsContent()),
      },
    ],
    buttons: [
      {
        id: 'button__gettkserzv',
        text: langKeys().SettingsModalButtonOk,
        leftIcon: undefined,
        color: ButtonColor.PRIMARY,
        onClick: (): void => {
          settingsModalController.closeModal('settings_modal__hozbdlgaew');
        },
      },
    ],
  });

  const setSection = (
    sectionId: string,
    content: TSettingsItemOptions[],
  ): void => {
    const ids = Object.values(sectionIds);
    for (let i = 0; i < ids.length; i++) {
      modal.sections[ids[i]].setSelectedState(false);
    }

    modal.sections[sectionId].setSelectedState(true);
    modal.setSectionContent(content);
  };
};

export { openSettingsModal };
