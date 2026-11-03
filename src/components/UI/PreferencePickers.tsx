import React from 'react';
import { usePreferences } from '../../contexts/preferences';
import type { Language, ThemeMode } from '../../types';
import Segmented from './Segmented';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'pt-PT', label: 'Português' },
  { value: 'en', label: 'English' },
];

export const LanguagePicker: React.FC = () => {
  const { t, language, setLanguage } = usePreferences();
  return (
    <div>
      <span className="field-label">{t('language.label')}</span>
      <Segmented label={t('language.label')} value={language} options={LANGUAGES} onChange={setLanguage} />
    </div>
  );
};

export const ThemePicker: React.FC = () => {
  const { t, theme, setTheme } = usePreferences();
  const themes: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: t('theme.light') },
    { value: 'dark', label: t('theme.dark') },
    { value: 'system', label: t('theme.system') },
  ];
  return (
    <div>
      <span className="field-label">{t('theme.label')}</span>
      <Segmented label={t('theme.label')} value={theme} options={themes} onChange={setTheme} />
    </div>
  );
};

const PreferencePickers: React.FC = () => (
  <div className="space-y-4">
    <LanguagePicker />
    <ThemePicker />
  </div>
);

export default PreferencePickers;
