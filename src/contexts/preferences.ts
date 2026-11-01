import { createContext, useContext } from 'react';
import type { Currency, Language, ThemeMode } from '../types';
import type { TranslationKey } from '../i18n/translations';

export type TranslateFn = (key: TranslationKey, vars?: Record<string, string | number>) => string;

export interface PreferencesContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  tutorialDone: boolean;
  setTutorialDone: (done: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  t: TranslateFn;
  money: (value: number) => string;
  compactMoney: (value: number) => string;
  date: (dateStr: string) => string;
  month: (monthStr: string) => string;
}

export const PreferencesContext = createContext<PreferencesContextType | null>(null);

export const usePreferences = (): PreferencesContextType => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
};
