import React, { createContext, useContext, useCallback, useMemo } from 'react';
import type { Transaction, Budget, MonthSalary, Category, AppData } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ALL_DEFAULT_CATEGORIES, generateSampleData } from '../data/defaultData';
import { calculateMonthSummary, getExpensesByCategory as calcExpensesByCategory, getMonthlyHistory as calcMonthlyHistory } from '../utils/calculations';
import type { CategoryExpense, MonthlyHistory, MonthSummary } from '../utils/calculations';
import { getCurrentMonth } from '../utils/formatters';

const STORAGE_KEY = 'app-financas-data';

const getInitialData = (): AppData => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as AppData;
  } catch {
    // ignore
  }
  const sample = generateSampleData();
  return {
    transactions: sample.transactions,
    budgets: sample.budgets,
    salaries: sample.salaries,
    customCategories: [],
  };
};

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  salaries: MonthSalary[];
  categories: Category[];
  customCategories: Category[];
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editTransaction: (id: string, t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (b: Omit<Budget, 'id'>) => void;
  editBudget: (id: string, b: Omit<Budget, 'id'>) => void;
  deleteBudget: (id: string) => void;
  setSalary: (month: string, amount: number) => void;
  addCustomCategory: (c: Omit<Category, 'id'>) => void;
  deleteCustomCategory: (id: string) => void;
  getCurrentMonthData: () => MonthSummary;
  getExpensesByCategory: (month: string) => CategoryExpense[];
  getMonthlyHistory: (months: number) => MonthlyHistory[];
  getSalaryForMonth: (month: string) => number;
  exportData: () => void;
  importData: (data: AppData) => void;
  resetData: () => void;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useLocalStorage<AppData>(STORAGE_KEY, getInitialData());
  const [currentMonth, setCurrentMonth] = useLocalStorage<string>('app-financas-month', getCurrentMonth());

  const categories = useMemo(
    () => [...ALL_DEFAULT_CATEGORIES, ...data.customCategories],
    [data.customCategories]
  );

  const addTransaction = useCallback((t: Omit<Transaction, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newT: Transaction = { ...t, id: crypto.randomUUID(), createdAt: now };
    setData((prev) => ({ ...prev, transactions: [newT, ...prev.transactions] }));
  }, [setData]);

  const editTransaction = useCallback((id: string, t: Omit<Transaction, 'id' | 'createdAt'>) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...t } : tx
      ),
    }));
  }, [setData]);

  const deleteTransaction = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((tx) => tx.id !== id),
    }));
  }, [setData]);

  const addBudget = useCallback((b: Omit<Budget, 'id'>) => {
    const newB: Budget = { ...b, id: crypto.randomUUID() };
    setData((prev) => ({ ...prev, budgets: [...prev.budgets, newB] }));
  }, [setData]);

  const editBudget = useCallback((id: string, b: Omit<Budget, 'id'>) => {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.map((bu) => (bu.id === id ? { ...bu, ...b } : bu)),
    }));
  }, [setData]);

  const deleteBudget = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((bu) => bu.id !== id),
    }));
  }, [setData]);

  const setSalary = useCallback((month: string, amount: number) => {
    setData((prev) => {
      const exists = prev.salaries.find((s) => s.month === month);
      if (exists) {
        return {
          ...prev,
          salaries: prev.salaries.map((s) => (s.month === month ? { ...s, amount } : s)),
        };
      }
      return { ...prev, salaries: [...prev.salaries, { month, amount }] };
    });
  }, [setData]);

  const addCustomCategory = useCallback((c: Omit<Category, 'id'>) => {
    const newC: Category = { ...c, id: `custom_${crypto.randomUUID()}` };
    setData((prev) => ({ ...prev, customCategories: [...prev.customCategories, newC] }));
  }, [setData]);

  const deleteCustomCategory = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      customCategories: prev.customCategories.filter((c) => c.id !== id),
    }));
  }, [setData]);

  const getCurrentMonthData = useCallback((): MonthSummary => {
    return calculateMonthSummary(data.transactions, currentMonth);
  }, [data.transactions, currentMonth]);

  const getExpensesByCategory = useCallback((month: string): CategoryExpense[] => {
    return calcExpensesByCategory(data.transactions, month, categories);
  }, [data.transactions, categories]);

  const getMonthlyHistory = useCallback((months: number): MonthlyHistory[] => {
    return calcMonthlyHistory(data.transactions, months);
  }, [data.transactions]);

  const getSalaryForMonth = useCallback((month: string): number => {
    return data.salaries.find((s) => s.month === month)?.amount ?? 0;
  }, [data.salaries]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-financas-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((importedData: AppData) => {
    setData(importedData);
  }, [setData]);

  const resetData = useCallback(() => {
    const sample = generateSampleData();
    setData({
      transactions: sample.transactions,
      budgets: sample.budgets,
      salaries: sample.salaries,
      customCategories: [],
    });
  }, [setData]);

  const value = useMemo<FinanceContextType>(() => ({
    transactions: data.transactions,
    budgets: data.budgets,
    salaries: data.salaries,
    categories,
    customCategories: data.customCategories,
    currentMonth,
    setCurrentMonth,
    addTransaction,
    editTransaction,
    deleteTransaction,
    addBudget,
    editBudget,
    deleteBudget,
    setSalary,
    addCustomCategory,
    deleteCustomCategory,
    getCurrentMonthData,
    getExpensesByCategory,
    getMonthlyHistory,
    getSalaryForMonth,
    exportData,
    importData,
    resetData,
  }), [data, categories, currentMonth, setCurrentMonth, addTransaction, editTransaction, deleteTransaction, addBudget, editBudget, deleteBudget, setSalary, addCustomCategory, deleteCustomCategory, getCurrentMonthData, getExpensesByCategory, getMonthlyHistory, getSalaryForMonth, exportData, importData, resetData]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = (): FinanceContextType => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
};
