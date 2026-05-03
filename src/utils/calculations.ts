import type { Transaction, Budget, Category } from '../types';

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
  categories: Category[]
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
      category: categories.find((c) => c.id === categoryId) || {
        id: categoryId,
        name: 'Outros',
        icon: '📦',
        color: '#6B7280',
        type: 'expense' as const,
      },
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
  numMonths: number
): MonthlyHistory[] => {
  const now = new Date();
  const result: MonthlyHistory[] = [];
  for (let i = numMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const { income, expenses, balance } = calculateMonthSummary(transactions, month);
    result.push({ month, income, expenses, balance });
  }
  return result;
};
