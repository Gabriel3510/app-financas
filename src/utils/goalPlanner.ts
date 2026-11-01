import { differenceInCalendarMonths, parseISO } from 'date-fns';
import type { FixedExpense, SavingsGoal, Transaction } from '../types';
import { calculateMonthSummary, getMonthTransactions } from './calculations';
import { shiftMonth } from './formatters';

const LOOKBACK_MONTHS = 3;
const TIGHT_SHARE = 0.8;

// Share of a category's average that is realistic to cut; essentials are never suggested
const FLEXIBLE_CATEGORIES: Record<string, number> = {
  leisure: 0.3,
  shopping: 0.3,
  clothing: 0.3,
  travel: 0.3,
  gifts: 0.3,
  pets: 0.1,
  food: 0.1,
  transport: 0.1,
  others_exp: 0.15,
};

export interface SpendingProfile {
  monthsUsed: number;
  avgIncome: number;
  avgExpenses: number;
  avgSavings: number;
  fixedTotal: number;
  categories: { categoryId: string; avg: number }[];
}

export type GoalStatus = 'done' | 'ok' | 'tight' | 'short' | 'estimate' | 'nodata';

export interface CategoryCut {
  categoryId: string;
  avg: number;
  cut: number;
}

export interface GoalPlan {
  status: GoalStatus;
  remaining: number;
  needed: number | null;
  capacity: number;
  gap: number;
  estimatedMonth: string | null;
  cuts: CategoryCut[];
}

// Averages the completed months with entries, since the current month is still unfinished
export const getSpendingProfile = (
  transactions: Transaction[],
  month: string,
  fixedExpenses: FixedExpense[],
): SpendingProfile => {
  let months = Array.from({ length: LOOKBACK_MONTHS }, (_, i) => shiftMonth(month, -(i + 1)))
    .filter((m) => getMonthTransactions(transactions, m).length > 0);
  if (months.length === 0 && getMonthTransactions(transactions, month).length > 0) months = [month];

  const count = months.length || 1;
  let income = 0;
  let expenses = 0;
  const byCategory: Record<string, number> = {};
  months.forEach((m) => {
    const summary = calculateMonthSummary(transactions, m);
    income += summary.income;
    expenses += summary.expenses;
    getMonthTransactions(transactions, m)
      .filter((t) => t.type === 'expense')
      .forEach((t) => { byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount; });
  });

  // Fixed expenses with no payment in these months are not in the averages yet, so they are added on top
  const unseenFixed = fixedExpenses
    .filter((f) => !transactions.some((t) => t.fixedId === f.id && months.some((m) => t.date.startsWith(m))))
    .reduce((sum, f) => sum + f.amount, 0);

  return {
    monthsUsed: months.length,
    avgIncome: income / count,
    avgExpenses: expenses / count + unseenFixed,
    avgSavings: (income - expenses) / count - unseenFixed,
    fixedTotal: fixedExpenses.reduce((sum, f) => sum + f.amount, 0),
    categories: Object.entries(byCategory)
      .map(([categoryId, total]) => ({ categoryId, avg: total / count }))
      .sort((a, b) => b.avg - a.avg),
  };
};

export const monthsUntil = (deadline: string, month: string): number =>
  Math.max(1, differenceInCalendarMonths(parseISO(`${deadline}-01`), parseISO(`${month}-01`)));

export const getMonthlyNeed = (goal: Pick<SavingsGoal, 'target' | 'saved' | 'deadline'>, month: string): number => {
  const remaining = Math.max(0, goal.target - goal.saved);
  return goal.deadline ? remaining / monthsUntil(goal.deadline, month) : 0;
};

const suggestCuts = (profile: SpendingProfile, gap: number): CategoryCut[] => {
  const cuts: CategoryCut[] = [];
  let missing = gap;
  const candidates = profile.categories
    .map((c) => ({
      ...c,
      // Custom categories are the person's own extras, so they count as flexible too
      rate: FLEXIBLE_CATEGORIES[c.categoryId] ?? (c.categoryId.startsWith('custom_') ? 0.2 : 0),
    }))
    .filter((c) => c.rate > 0)
    .sort((a, b) => b.avg * b.rate - a.avg * a.rate);

  for (const { categoryId, avg, rate } of candidates) {
    if (missing <= 0) break;
    const cut = Math.min(Math.ceil(Math.min(missing, avg * rate) / 5) * 5, avg);
    cuts.push({ categoryId, avg, cut });
    missing -= cut;
  }
  return cuts;
};

export const planGoal = (
  goal: Pick<SavingsGoal, 'target' | 'saved' | 'deadline'>,
  profile: SpendingProfile,
  month: string,
  reservedByOtherGoals: number,
): GoalPlan => {
  const remaining = Math.max(0, goal.target - goal.saved);
  const capacity = Math.max(0, profile.avgSavings - reservedByOtherGoals);
  const needed = goal.deadline ? remaining / monthsUntil(goal.deadline, month) : null;
  const estimatedMonth = capacity > 0 ? shiftMonth(month, Math.ceil(remaining / capacity)) : null;
  const base = { remaining, needed, capacity, gap: 0, estimatedMonth, cuts: [] };

  if (remaining === 0) return { ...base, status: 'done' };
  if (profile.monthsUsed === 0) return { ...base, status: 'nodata' };
  if (needed === null) {
    return capacity > 0
      ? { ...base, status: 'estimate' }
      : { ...base, status: 'short', cuts: suggestCuts(profile, Math.max(remaining / 12, 50)) };
  }
  if (needed <= capacity * TIGHT_SHARE) return { ...base, status: 'ok' };
  if (needed <= capacity) return { ...base, status: 'tight' };
  const gap = needed - capacity;
  return { ...base, status: 'short', gap, cuts: suggestCuts(profile, gap) };
};

export const getMonthlyIncomeBase = (transactions: Transaction[], month: string): number => {
  const { income } = calculateMonthSummary(transactions, month);
  return Math.max(income, getSpendingProfile(transactions, month, []).avgIncome);
};
