import React from 'react';
import { usePreferences } from '../../contexts/preferences';
import type { Language, ThemeMode } from '../../types';
import Segmented from './Segmented';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'pt-PT', label: 'Português' },
  { value: 'en', label: 'English' },
];

const PreferencePickers: React.FC = () => {
  const { t, language, setLanguage, theme, setTheme } = usePreferences();

  const themes: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: t('theme.light') },
    { value: 'dark', label: t('theme.dark') },
    { value: 'system', label: t('theme.system') },
  ];

  return (
    <div className="space-y-4">
      <div>
        <span className="field-label">{t('language.label')}</span>
        <Segmented label={t('language.label')} value={language} options={LANGUAGES} onChange={setLanguage} />
      </div>
      <div>
        <span className="field-label">{t('theme.label')}</span>
        <Segmented label={t('theme.label')} value={theme} options={themes} onChange={setTheme} />
      </div>
    </div>
  );
};

export default PreferencePickers;
