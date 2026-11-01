import { createContext, useContext } from 'react';
import type { Transaction, Budget, MonthSalary, Category, FixedExpense, SavingsGoal } from '../types';
import type { CategoryExpense, MonthlyHistory, MonthSummary } from '../utils/calculations';

export interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  salaries: MonthSalary[];
  goals: SavingsGoal[];
  fixedExpenses: FixedExpense[];
  isFixedPaid: (id: string, month: string) => boolean;
  categories: Category[];
  customCategories: Category[];
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  getCategory: (id: string) => Category;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editTransaction: (id: string, t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  restoreTransaction: (t: Transaction) => void;
  addBudget: (b: Omit<Budget, 'id'>) => void;
  editBudget: (id: string, b: Omit<Budget, 'id'>) => void;
  deleteBudget: (id: string) => void;
  restoreBudget: (b: Budget) => void;
  copyBudgets: (fromMonth: string, toMonth: string) => void;
  addFixed: (f: Omit<FixedExpense, 'id'>) => void;
  editFixed: (id: string, f: Omit<FixedExpense, 'id'>) => void;
  deleteFixed: (id: string) => void;
  restoreFixed: (f: FixedExpense) => void;
  payFixed: (f: FixedExpense, month: string) => void;
  addGoal: (g: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  editGoal: (id: string, g: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
  restoreGoal: (g: SavingsGoal) => void;
  contributeToGoal: (id: string, amount: number) => void;
  setBudgetLimit: (categoryId: string, month: string, limit: number) => void;
  setSalary: (month: string, amount: number) => void;
  addCustomCategory: (c: Omit<Category, 'id'>) => void;
  deleteCustomCategory: (id: string) => void;
  getCurrentMonthData: () => MonthSummary;
  getExpensesByCategory: (month: string) => CategoryExpense[];
  getMonthlyHistory: (months: number) => MonthlyHistory[];
  getSalaryForMonth: (month: string) => number;
  exportData: () => Promise<'done' | 'cancelled'>;
  importData: (raw: unknown) => boolean;
  resetData: () => void;
  clearData: () => void;
}

export const FinanceContext = createContext<FinanceContextType | null>(null);

export const useFinance = (): FinanceContextType => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
};
