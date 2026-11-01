import type { TranslationKey } from '../../i18n/translations';
import type { Page } from '../../types';

export interface TourStep {
  page: Page;
  target: string;
  title: TranslationKey;
  body: TranslationKey;
}

export const TOUR_STEPS: TourStep[] = [
  { page: 'dashboard', target: 'summary', title: 'tour.summary.title', body: 'tour.summary.body' },
  { page: 'dashboard', target: 'add-transaction', title: 'tour.add.title', body: 'tour.add.body' },
  { page: 'dashboard', target: 'month-nav', title: 'tour.month.title', body: 'tour.month.body' },
  { page: 'transactions', target: 'filters', title: 'tour.filters.title', body: 'tour.filters.body' },
  { page: 'charts', target: 'charts', title: 'tour.charts.title', body: 'tour.charts.body' },
  { page: 'budget', target: 'budget-tabs', title: 'tour.budget.title', body: 'tour.budget.body' },
  { page: 'budget', target: 'notifications', title: 'tour.bell.title', body: 'tour.bell.body' },
  { page: 'budget', target: 'theme-toggle', title: 'tour.theme.title', body: 'tour.theme.body' },
];
