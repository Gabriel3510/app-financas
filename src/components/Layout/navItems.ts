import { LayoutDashboard, ArrowLeftRight, BarChart2, Target, Settings } from 'lucide-react';
import type { TranslationKey } from '../../i18n/translations';
import type { Page } from '../../types';

export const NAV_ITEMS: { id: Page; label: TranslationKey; shortLabel: TranslationKey; icon: typeof Settings }[] = [
  { id: 'dashboard', label: 'nav.dashboard', shortLabel: 'nav.dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'nav.transactions', shortLabel: 'nav.transactions', icon: ArrowLeftRight },
  { id: 'charts', label: 'nav.charts', shortLabel: 'nav.charts', icon: BarChart2 },
  { id: 'budget', label: 'nav.budget', shortLabel: 'nav.budget', icon: Target },
  { id: 'settings', label: 'nav.settings', shortLabel: 'nav.settingsShort', icon: Settings },
];
