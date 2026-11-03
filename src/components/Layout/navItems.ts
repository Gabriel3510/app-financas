import { ArrowLeftRight, BarChart2, CalendarClock, Gauge, LayoutDashboard, Settings, Target } from 'lucide-react';
import type { TranslationKey } from '../../i18n/translations';
import type { Page } from '../../types';

export const NAV_ITEMS: { id: Page; label: TranslationKey; hint?: TranslationKey; icon: typeof Settings }[] = [
  { id: 'dashboard', label: 'nav.dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'nav.transactions', icon: ArrowLeftRight },
  { id: 'fixed', label: 'nav.fixed', icon: CalendarClock },
  { id: 'goals', label: 'nav.goals', icon: Target },
  { id: 'limits', label: 'nav.limits', hint: 'more.limits', icon: Gauge },
  { id: 'charts', label: 'nav.charts', hint: 'more.charts', icon: BarChart2 },
  { id: 'settings', label: 'nav.settings', hint: 'more.settings', icon: Settings },
];

// The phone bar has room for four pages; the rest live behind "More"
export const PRIMARY_COUNT = 4;
