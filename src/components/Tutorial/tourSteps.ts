import type { TranslationKey } from '../../i18n/translations';
import type { Page } from '../../types';

export interface TourStep {
  page: Page;
  target: string;
  title: TranslationKey;
  body: TranslationKey;
}

export const TOUR_STEPS: TourStep[] = [
  { page: 'dashboard', target: 'today', title: 'tour.today.title', body: 'tour.today.body' },
  { page: 'dashboard', target: 'week', title: 'tour.week.title', body: 'tour.week.body' },
  { page: 'dashboard', target: 'summary', title: 'tour.summary.title', body: 'tour.summary2.body' },
  { page: 'dashboard', target: 'add-transaction', title: 'tour.add2.title', body: 'tour.add2.body' },
  { page: 'dashboard', target: 'month-nav', title: 'tour.month.title', body: 'tour.month.body' },
  { page: 'transactions', target: 'filters', title: 'tour.filters.title', body: 'tour.filters.body' },
  { page: 'transactions', target: 'tx-list', title: 'tour.list.title', body: 'tour.list.body' },
  { page: 'fixed', target: 'fixed-list', title: 'tour.fixed.title', body: 'tour.fixed.body' },
  { page: 'goals', target: 'add-goal', title: 'tour.goals.title', body: 'tour.goals.body' },
  { page: 'limits', target: 'add-limit', title: 'tour.limits.title', body: 'tour.limits.body' },
  { page: 'charts', target: 'charts', title: 'tour.charts.title', body: 'tour.charts.body' },
  { page: 'settings', target: 'settings-data', title: 'tour.data.title', body: 'tour.data.body' },
  { page: 'dashboard', target: 'notifications', title: 'tour.bell.title', body: 'tour.bell.body' },
  { page: 'dashboard', target: 'logo-home', title: 'tour.home.title', body: 'tour.home.body' },
];
