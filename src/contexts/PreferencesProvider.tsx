import React, { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { CURRENCIES } from '../types';
import type { Currency, Language, ThemeMode } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TRANSLATIONS } from '../i18n/translations';
import { formatCompactCurrency, formatCurrency, formatDate, formatMonth } from '../utils/formatters';
import { PreferencesContext } from './preferences';
import type { PreferencesContextType, TranslateFn } from './preferences';

interface Preferences {
  language: Language;
  theme: ThemeMode;
  currency: Currency;
  tutorialDone: boolean;
  userName: string;
}


const detectLanguage = (): Language => {
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'pt-PT';
};

const detectCurrency = (): Currency => {
  const browser = navigator.language.toLowerCase();
  if (browser === 'pt-br') return 'BRL';
  return browser.startsWith('en') ? 'USD' : 'EUR';
};

const createDefaults = (): Preferences => {
  return { language: detectLanguage(), theme: 'system', currency: detectCurrency(), tutorialDone: false, userName: '' };
};

const normalizePreferences = (raw: unknown): Preferences | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const stored = raw as Partial<Preferences>;
  const defaults = createDefaults();
  return {
    language: stored.language && stored.language in TRANSLATIONS ? stored.language : defaults.language,
    theme: stored.theme === 'light' || stored.theme === 'dark' ? stored.theme : 'system',
    currency: stored.currency && CURRENCIES.includes(stored.currency) ? stored.currency : defaults.currency,
    tutorialDone: stored.tutorialDone === true,
    userName: typeof stored.userName === 'string' ? stored.userName : '',
  };
};

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

const subscribeSystemTheme = (onChange: () => void) => {
  const query = darkQuery();
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useLocalStorage<Preferences>('app-financas-prefs', createDefaults, normalizePreferences);
  const systemDark = useSyncExternalStore(subscribeSystemTheme, () => darkQuery().matches);
  const { language, theme, currency, tutorialDone, userName } = prefs;
  const isDark = theme === 'dark' || (theme === 'system' && systemDark);

  const t = useCallback<TranslateFn>((key, vars) => {
    const text = TRANSLATIONS[language][key] ?? key;
    if (!vars) return text;
    return Object.entries(vars).reduce((acc, [name, value]) => acc.replace(`{${name}}`, String(value)), text);
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    const color = isDark ? '#2c240c' : '#ffc107';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
    if (Capacitor.isNativePlatform()) {
      // Style.Light means dark status bar icons, which is what the yellow header needs
      void StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
      if (Capacitor.getPlatform() === 'android') void StatusBar.setBackgroundColor({ color });
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('app.name');
  }, [language, t]);

  const value = useMemo<PreferencesContextType>(() => ({
    language,
    setLanguage: (next) => setPrefs((prev) => ({ ...prev, language: next })),
    theme,
    setTheme: (next) => setPrefs((prev) => ({ ...prev, theme: next })),
    isDark,
    currency,
    setCurrency: (next) => setPrefs((prev) => ({ ...prev, currency: next })),
    tutorialDone,
    setTutorialDone: (done) => setPrefs((prev) => ({ ...prev, tutorialDone: done })),
    userName,
    setUserName: (name) => setPrefs((prev) => ({ ...prev, userName: name })),
    t,
    money: (amount) => formatCurrency(amount, language, currency),
    compactMoney: (amount) => formatCompactCurrency(amount, language, currency),
    date: (dateStr) => formatDate(dateStr, language),
    month: (monthStr) => formatMonth(monthStr, language),
  }), [language, theme, isDark, currency, tutorialDone, userName, t, setPrefs]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};
