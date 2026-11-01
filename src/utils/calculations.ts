import { differenceInCalendarDays, eachDayOfInterval, endOfMonth, endOfWeek, format, startOfWeek } from 'date-fns';
import type { Transaction, Budget, Category } from '../types';
import { shiftMonth } from './formatters';

export interface MonthSummary {
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;
}

export interface CategoryExpense {
  categoryId: string;
  category: Category;
  total: number;
  percentage: number;
}

export interface MonthlyHistory {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export type BudgetLevel = 'ok' | 'warning' | 'danger' | 'over';

export const getBudgetLevel = (pct: number): BudgetLevel => {
  if (pct > 100) return 'over';
  if (pct >= 90) return 'danger';
  if (pct >= 70) return 'warning';
  return 'ok';
};

export const getMonthTransactions = (transactions: Transaction[], month: string): Transaction[] =>
  transactions.filter((t) => t.date.startsWith(month));

export const calculateMonthSummary = (transactions: Transaction[], month: string): MonthSummary => {
  const monthTxs = getMonthTransactions(transactions, month);
  const income = monthTxs.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = monthTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((balance / income) * 100) : 0;
  return { income, expenses, balance, savingsRate };
};

export const getExpensesByCategory = (
  transactions: Transaction[],
  month: string,
  getCategory: (id: string) => Category
): CategoryExpense[] => {
  const monthExpenses = getMonthTransactions(transactions, month).filter((t) => t.type === 'expense');
  const totalExpenses = monthExpenses.reduce((sum, t) => sum + t.amount, 0);
  const byCategory: Record<string, number> = {};
  monthExpenses.forEach((t) => {
    byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount;
  });
  return Object.entries(byCategory)
    .map(([categoryId, total]) => ({
      categoryId,
      category: getCategory(categoryId),
      total,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

export const getBudgetUsage = (
  transactions: Transaction[],
  budget: Budget,
  month: string
): number => {
  const spent = getMonthTransactions(transactions, month)
    .filter((t) => t.type === 'expense' && t.categoryId === budget.categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
  return spent;
};

export const getMonthlyHistory = (
  transactions: Transaction[],
  numMonths: number,
  endMonth: string
): MonthlyHistory[] => {
  const result: MonthlyHistory[] = [];
  for (let i = numMonths - 1; i >= 0; i--) {
    const month = shiftMonth(endMonth, -i);
    const { income, expenses, balance } = calculateMonthSummary(transactions, month);
    result.push({ month, income, expenses, balance });
  }
  return result;
};

export interface DayPlan {
  date: Date;
  spent: number;
  isToday: boolean;
  isFuture: boolean;
}

export interface TodayPlan {
  dailyLimit: number;
  income: number;
  expenses: number;
  week: DayPlan[];
}

const toDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

// Splits what is left of the month's money, after goals, across the remaining days
export const getTodayPlan = (
  transactions: Transaction[],
  reserved: number,
  expectedIncome: number,
  now: Date,
): TodayPlan => {
  const today = toDateKey(now);
  const month = today.slice(0, 7);
  const monthTxs = getMonthTransactions(transactions, month);
  const sum = (items: Transaction[]) => items.reduce((total, t) => total + t.amount, 0);
  const expenses = monthTxs.filter((t) => t.type === 'expense');

  const monthIncome = sum(monthTxs.filter((t) => t.type === 'income'));
  const spentBefore = sum(expenses.filter((t) => t.date < today));
  const daysLeft = differenceInCalendarDays(endOfMonth(now), now) + 1;

  const week = eachDayOfInterval({ start: startOfWeek(now), end: endOfWeek(now) }).map((date) => {
    const key = toDateKey(date);
    return {
      date,
      spent: sum(transactions.filter((t) => t.type === 'expense' && t.date === key)),
      isToday: key === today,
      isFuture: key > today,
    };
  });

  return {
    dailyLimit: Math.max(0, (Math.max(monthIncome, expectedIncome) - reserved - spentBefore) / daysLeft),
    income: sum(monthTxs.filter((t) => t.type === 'income' && t.date === today)),
    expenses: sum(expenses.filter((t) => t.date === today)),
    week,
  };
};
