import { addMonths, format, parseISO } from 'date-fns';
import { enUS, pt } from 'date-fns/locale';
import type { Currency, Language } from '../types';

export const DATE_LOCALES = { 'pt-PT': pt, en: enUS };

export const formatCurrency = (value: number, language: Language, currency: Currency): string =>
  new Intl.NumberFormat(language, { style: 'currency', currency }).format(value);

export const formatCompactCurrency = (value: number, language: Language, currency: Currency): string =>
  new Intl.NumberFormat(language, { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 }).format(value);

export const formatDate = (dateStr: string, language: Language): string => {
  try {
    return format(parseISO(dateStr.slice(0, 10)), 'P', { locale: DATE_LOCALES[language] });
  } catch {
    return dateStr;
  }
};

export const formatMonth = (monthStr: string, language: Language): string => {
  try {
    return format(parseISO(`${monthStr}-01`), 'LLL yyyy', { locale: DATE_LOCALES[language] });
  } catch {
    return monthStr;
  }
};

export const formatWeekday = (date: Date, language: Language): string =>
  format(date, 'EEE', { locale: DATE_LOCALES[language] }).replace('.', '');

export const getCurrentMonth = (): string => format(new Date(), 'yyyy-MM');

export const getToday = (): string => format(new Date(), 'yyyy-MM-dd');

export const shiftMonth = (month: string, delta: number): string =>
  format(addMonths(parseISO(`${month}-01`), delta), 'yyyy-MM');

// crypto.randomUUID only exists on HTTPS/localhost, so it breaks when the app is opened by LAN IP on a phone
export const createId = (): string =>
  crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
