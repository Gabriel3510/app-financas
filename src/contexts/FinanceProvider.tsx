import React, { useCallback, useMemo, useState } from 'react';
import { getDaysInMonth, parseISO } from 'date-fns';
import type { Transaction, Budget, Category, AppData, FixedExpense, SavingsGoal } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ALL_DEFAULT_CATEGORIES, generateSampleData } from '../data/defaultData';
import { calculateMonthSummary, getExpensesByCategory as calcExpensesByCategory, getMonthlyHistory as calcMonthlyHistory } from '../utils/calculations';
import type { CategoryExpense, MonthlyHistory, MonthSummary } from '../utils/calculations';
import { normalizeAppData } from '../utils/appData';
import { saveTextFile } from '../utils/saveFile';
import { createId, getCurrentMonth, getToday } from '../utils/formatters';
import type { TranslationKey } from '../i18n/translations';
import { usePreferences } from './preferences';
import { FinanceContext } from './finance';
import type { FinanceContextType } from './finance';

const STORAGE_KEY = 'app-financas-data';

const createSampleAppData = (): AppData => ({ ...generateSampleData(), customCategories: [] });

const EMPTY_DATA: AppData = { transactions: [], budgets: [], salaries: [], customCategories: [], goals: [], fixedExpenses: [] };

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = usePreferences();
  const [data, setData] = useLocalStorage<AppData>(STORAGE_KEY, createSampleAppData, normalizeAppData);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth);

  const categories = useMemo(
    () => [
      ...ALL_DEFAULT_CATEGORIES.map((c) => ({ ...c, name: t(`cat.${c.id}` as TranslationKey) })),
      ...data.customCategories,
    ],
    [data.customCategories, t]
  );

  const transactions = useMemo(
    () => data.transactions.map((tx) =>
      tx.sampleKey ? { ...tx, description: t(`sample.${tx.sampleKey}` as TranslationKey) } : tx
    ),
    [data.transactions, t]
  );

  const goals = useMemo(
    () => data.goals.map((g) => (g.sampleKey ? { ...g, name: t(`sample.${g.sampleKey}` as TranslationKey) } : g)),
    [data.goals, t]
  );

  const fixedExpenses = useMemo(
    () => data.fixedExpenses.map((f) => (f.sampleKey ? { ...f, name: t(`sample.${f.sampleKey}` as TranslationKey) } : f)),
    [data.fixedExpenses, t]
  );

  const isFixedPaid = useCallback((id: string, month: string) => (
    data.transactions.some((tx) => tx.fixedId === id && tx.date.startsWith(month))
  ), [data.transactions]);

  const getCategory = useCallback((id: string): Category => (
    categories.find((c) => c.id === id) ?? {
      id,
      name: t('cat.others_exp'),
      icon: '📦',
      color: '#6B7280',
      type: 'both',
    }
  ), [categories, t]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newT: Transaction = { ...tx, id: createId(), createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, transactions: [newT, ...prev.transactions] }));
  }, [setData]);

  const editTransaction = useCallback((id: string, tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((item) =>
        item.id === id ? { ...item, ...tx, sampleKey: undefined } : item
      ),
    }));
  }, [setData]);

  const deleteTransaction = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((tx) => tx.id !== id),
    }));
  }, [setData]);

  const restoreTransaction = useCallback((tx: Transaction) => {
    setData((prev) => ({ ...prev, transactions: [tx, ...prev.transactions] }));
  }, [setData]);

  const addBudget = useCallback((b: Omit<Budget, 'id'>) => {
    const newB: Budget = { ...b, id: createId() };
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

  const restoreBudget = useCallback((b: Budget) => {
    setData((prev) => ({ ...prev, budgets: [...prev.budgets, b] }));
  }, [setData]);

  const copyBudgets = useCallback((fromMonth: string, toMonth: string) => {
    setData((prev) => {
      const taken = new Set(prev.budgets.filter((b) => b.month === toMonth).map((b) => b.categoryId));
      const copies = prev.budgets
        .filter((b) => b.month === fromMonth && !taken.has(b.categoryId))
        .map((b) => ({ ...b, id: createId(), month: toMonth }));
      return { ...prev, budgets: [...prev.budgets, ...copies] };
    });
  }, [setData]);

  const addFixed = useCallback((f: Omit<FixedExpense, 'id'>) => {
    setData((prev) => ({ ...prev, fixedExpenses: [...prev.fixedExpenses, { ...f, id: createId() }] }));
  }, [setData]);

  const editFixed = useCallback((id: string, f: Omit<FixedExpense, 'id'>) => {
    setData((prev) => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.map((item) => (item.id === id ? { ...item, ...f, sampleKey: undefined } : item)),
    }));
  }, [setData]);

  const deleteFixed = useCallback((id: string) => {
    setData((prev) => ({ ...prev, fixedExpenses: prev.fixedExpenses.filter((f) => f.id !== id) }));
  }, [setData]);

  const restoreFixed = useCallback((f: FixedExpense) => {
    setData((prev) => ({ ...prev, fixedExpenses: [...prev.fixedExpenses, f] }));
  }, [setData]);

  // Paying creates the month's transaction, so removing that transaction makes it pending again
  const payFixed = useCallback((f: FixedExpense, month: string) => {
    const day = Math.min(f.day, getDaysInMonth(parseISO(`${month}-01`)));
    const date = month === getCurrentMonth() ? getToday() : `${month}-${String(day).padStart(2, '0')}`;
    addTransaction({ description: f.name, amount: f.amount, type: 'expense', categoryId: f.categoryId, date, fixedId: f.id });
  }, [addTransaction]);

  const addGoal = useCallback((g: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newG: SavingsGoal = { ...g, id: createId(), createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, goals: [...prev.goals, newG] }));
  }, [setData]);

  const editGoal = useCallback((id: string, g: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((item) => (item.id === id ? { ...item, ...g, sampleKey: undefined } : item)),
    }));
  }, [setData]);

  const deleteGoal = useCallback((id: string) => {
    setData((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
  }, [setData]);

  const restoreGoal = useCallback((g: SavingsGoal) => {
    setData((prev) => ({ ...prev, goals: [...prev.goals, g] }));
  }, [setData]);

  const contributeToGoal = useCallback((id: string, amount: number) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, saved: g.saved + amount } : g)),
    }));
  }, [setData]);

  const setBudgetLimit = useCallback((categoryId: string, month: string, limit: number) => {
    setData((prev) => {
      const exists = prev.budgets.some((b) => b.categoryId === categoryId && b.month === month);
      return {
        ...prev,
        budgets: exists
          ? prev.budgets.map((b) => (b.categoryId === categoryId && b.month === month ? { ...b, limit } : b))
          : [...prev.budgets, { id: createId(), categoryId, month, limit }],
      };
    });
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
    const newC: Category = { ...c, id: `custom_${createId()}` };
    setData((prev) => ({ ...prev, customCategories: [...prev.customCategories, newC] }));
  }, [setData]);

  const deleteCustomCategory = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      customCategories: prev.customCategories.filter((c) => c.id !== id),
      budgets: prev.budgets.filter((b) => b.categoryId !== id),
      transactions: prev.transactions.map((tx) =>
        tx.categoryId === id
          ? { ...tx, categoryId: tx.type === 'income' ? 'others_inc' : 'others_exp' }
          : tx
      ),
    }));
  }, [setData]);

  const getCurrentMonthData = useCallback((): MonthSummary => {
    return calculateMonthSummary(transactions, currentMonth);
  }, [transactions, currentMonth]);

  const getExpensesByCategory = useCallback((month: string): CategoryExpense[] => {
    return calcExpensesByCategory(transactions, month, getCategory);
  }, [transactions, getCategory]);

  const getMonthlyHistory = useCallback((months: number): MonthlyHistory[] => {
    return calcMonthlyHistory(transactions, months, currentMonth);
  }, [transactions, currentMonth]);

  const getSalaryForMonth = useCallback((month: string): number => {
    return data.salaries.find((s) => s.month === month)?.amount ?? 0;
  }, [data.salaries]);

  const exportData = useCallback(() => {
    const fileName = `sobra-backup-${getToday()}.json`;
    return saveTextFile(fileName, JSON.stringify(data, null, 2));
  }, [data]);

  const importData = useCallback((raw: unknown): boolean => {
    const imported = normalizeAppData(raw);
    if (!imported) return false;
    setData(imported);
    return true;
  }, [setData]);

  const resetData = useCallback(() => {
    setData(createSampleAppData());
  }, [setData]);

  const clearData = useCallback(() => {
    setData(EMPTY_DATA);
  }, [setData]);

  const value = useMemo<FinanceContextType>(() => ({
    transactions,
    budgets: data.budgets,
    salaries: data.salaries,
    goals,
    fixedExpenses,
    isFixedPaid,
    categories,
    customCategories: data.customCategories,
    currentMonth,
    setCurrentMonth,
    getCategory,
    addTransaction,
    editTransaction,
    deleteTransaction,
    restoreTransaction,
    addBudget,
    editBudget,
    deleteBudget,
    restoreBudget,
    copyBudgets,
    addFixed,
    editFixed,
    deleteFixed,
    restoreFixed,
    payFixed,
    addGoal,
    editGoal,
    deleteGoal,
    restoreGoal,
    contributeToGoal,
    setBudgetLimit,
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
    clearData,
  }), [transactions, goals, fixedExpenses, isFixedPaid, data.budgets, data.salaries, data.customCategories, categories, currentMonth, getCategory, addTransaction, editTransaction, deleteTransaction, restoreTransaction, addBudget, editBudget, deleteBudget, restoreBudget, copyBudgets, addFixed, editFixed, deleteFixed, restoreFixed, payFixed, addGoal, editGoal, deleteGoal, restoreGoal, contributeToGoal, setBudgetLimit, setSalary, addCustomCategory, deleteCustomCategory, getCurrentMonthData, getExpensesByCategory, getMonthlyHistory, getSalaryForMonth, exportData, importData, resetData, clearData]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
