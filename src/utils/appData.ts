import type { AppData, Budget, Category, FixedExpense, MonthSalary, SavingsGoal, Transaction } from '../types';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isTransaction = (t: unknown): t is Transaction =>
  isObject(t) &&
  typeof t.id === 'string' &&
  typeof t.description === 'string' &&
  typeof t.amount === 'number' &&
  (t.type === 'income' || t.type === 'expense') &&
  typeof t.categoryId === 'string' &&
  typeof t.date === 'string' &&
  /^\d{4}-\d{2}-\d{2}/.test(t.date);

const isBudget = (b: unknown): b is Budget =>
  isObject(b) &&
  typeof b.id === 'string' &&
  typeof b.categoryId === 'string' &&
  typeof b.limit === 'number' &&
  typeof b.month === 'string';

const isSalary = (s: unknown): s is MonthSalary =>
  isObject(s) && typeof s.month === 'string' && typeof s.amount === 'number';

const isCategory = (c: unknown): c is Category =>
  isObject(c) &&
  typeof c.id === 'string' &&
  typeof c.name === 'string' &&
  typeof c.icon === 'string' &&
  typeof c.color === 'string' &&
  (c.type === 'income' || c.type === 'expense' || c.type === 'both');

const isGoal = (g: unknown): g is SavingsGoal =>
  isObject(g) &&
  typeof g.id === 'string' &&
  typeof g.name === 'string' &&
  typeof g.icon === 'string' &&
  typeof g.target === 'number' &&
  typeof g.saved === 'number';

const isFixedExpense = (f: unknown): f is FixedExpense =>
  isObject(f) &&
  typeof f.id === 'string' &&
  typeof f.name === 'string' &&
  typeof f.amount === 'number' &&
  typeof f.categoryId === 'string' &&
  typeof f.day === 'number';

const listOf = <T,>(value: unknown, guard: (item: unknown) => item is T): T[] =>
  Array.isArray(value) ? value.filter(guard) : [];

// Used for both localStorage and imported backups: anything that is not app data returns null.
// Older versions saved dates as full ISO strings, which are reduced here to the calendar day.
export const normalizeAppData = (raw: unknown): AppData | null => {
  if (!isObject(raw) || !Array.isArray(raw.transactions)) return null;
  return {
    transactions: listOf(raw.transactions, isTransaction).map((t) => ({ ...t, date: t.date.slice(0, 10) })),
    budgets: listOf(raw.budgets, isBudget),
    salaries: listOf(raw.salaries, isSalary),
    customCategories: listOf(raw.customCategories, isCategory),
    goals: listOf(raw.goals, isGoal),
    fixedExpenses: listOf(raw.fixedExpenses, isFixedExpense),
  };
};
