import React from 'react';
import { usePreferences } from '../contexts/preferences';
import PageHeader from '../components/Layout/PageHeader';
import Settings from '../components/Settings/Settings';

interface SettingsPageProps {
  onStartTutorial: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onStartTutorial }) => {
  const { t } = usePreferences();

  return (
    <div className="space-y-4">
      <PageHeader subtitle={t('page.settings.sub')} />
      <Settings onStartTutorial={onStartTutorial} />
    </div>
  );
};

export default SettingsPage;
