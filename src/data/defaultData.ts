import type { Category, Transaction, Budget, MonthSalary } from '../types';
import { format, subMonths } from 'date-fns';

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Alimentação', icon: '🍔', color: '#F59E0B', type: 'expense' },
  { id: 'transport', name: 'Transporte', icon: '🚗', color: '#3B82F6', type: 'expense' },
  { id: 'housing', name: 'Moradia', icon: '🏠', color: '#8B5CF6', type: 'expense' },
  { id: 'health', name: 'Saúde', icon: '💊', color: '#EF4444', type: 'expense' },
  { id: 'leisure', name: 'Lazer', icon: '🎮', color: '#EC4899', type: 'expense' },
  { id: 'education', name: 'Educação', icon: '📚', color: '#06B6D4', type: 'expense' },
  { id: 'clothing', name: 'Vestuário', icon: '👗', color: '#F97316', type: 'expense' },
  { id: 'utilities', name: 'Contas & Utilities', icon: '💡', color: '#6366F1', type: 'expense' },
  { id: 'debts', name: 'Dívidas & Parcelas', icon: '💳', color: '#DC2626', type: 'expense' },
  { id: 'shopping', name: 'Compras', icon: '🛒', color: '#0EA5E9', type: 'expense' },
  { id: 'travel', name: 'Viagem', icon: '✈️', color: '#14B8A6', type: 'expense' },
  { id: 'pets', name: 'Pets', icon: '🐾', color: '#A855F7', type: 'expense' },
  { id: 'gifts', name: 'Presentes', icon: '🎁', color: '#F43F5E', type: 'expense' },
  { id: 'others_exp', name: 'Outros', icon: '📦', color: '#6B7280', type: 'expense' },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salário', icon: '💼', color: '#10B981', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💰', color: '#22C55E', type: 'income' },
  { id: 'investments', name: 'Investimentos', icon: '📈', color: '#16A34A', type: 'income' },
  { id: 'gift_income', name: 'Presente', icon: '🎁', color: '#84CC16', type: 'income' },
  { id: 'others_inc', name: 'Outros', icon: '💵', color: '#65A30D', type: 'income' },
];

export const ALL_DEFAULT_CATEGORIES: Category[] = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];

const monthStr = (monthsAgo: number): string => {
  const d = subMonths(new Date(), monthsAgo);
  return format(d, 'yyyy-MM');
};

const dateInMonth = (monthsAgo: number, day: number): string => {
  const d = subMonths(new Date(), monthsAgo);
  return format(new Date(d.getFullYear(), d.getMonth(), day), "yyyy-MM-dd'T'00:00:00.000'Z'");
};

export const generateSampleData = (): {
  transactions: Transaction[];
  budgets: Budget[];
  salaries: MonthSalary[];
} => {
  const transactions: Transaction[] = [
    // 2 months ago
    { id: 's2', description: 'Salário', amount: 5000, type: 'income', categoryId: 'salary', date: dateInMonth(2, 5), createdAt: dateInMonth(2, 5) },
    { id: 'f2a', description: 'Supermercado', amount: 450, type: 'expense', categoryId: 'food', date: dateInMonth(2, 8), createdAt: dateInMonth(2, 8) },
    { id: 'f2b', description: 'Restaurante', amount: 120, type: 'expense', categoryId: 'food', date: dateInMonth(2, 15), createdAt: dateInMonth(2, 15) },
    { id: 't2', description: 'Combustível', amount: 200, type: 'expense', categoryId: 'transport', date: dateInMonth(2, 10), createdAt: dateInMonth(2, 10) },
    { id: 'h2', description: 'Aluguel', amount: 1200, type: 'expense', categoryId: 'housing', date: dateInMonth(2, 5), createdAt: dateInMonth(2, 5) },
    { id: 'u2', description: 'Energia Elétrica', amount: 150, type: 'expense', categoryId: 'utilities', date: dateInMonth(2, 12), createdAt: dateInMonth(2, 12) },
    { id: 'l2', description: 'Cinema', amount: 80, type: 'expense', categoryId: 'leisure', date: dateInMonth(2, 20), createdAt: dateInMonth(2, 20) },
    { id: 'hea2', description: 'Farmácia', amount: 60, type: 'expense', categoryId: 'health', date: dateInMonth(2, 18), createdAt: dateInMonth(2, 18) },
    // 1 month ago
    { id: 's1', description: 'Salário', amount: 5000, type: 'income', categoryId: 'salary', date: dateInMonth(1, 5), createdAt: dateInMonth(1, 5) },
    { id: 'fr1', description: 'Projeto Freelance', amount: 800, type: 'income', categoryId: 'freelance', date: dateInMonth(1, 15), createdAt: dateInMonth(1, 15) },
    { id: 'f1a', description: 'Supermercado', amount: 520, type: 'expense', categoryId: 'food', date: dateInMonth(1, 7), createdAt: dateInMonth(1, 7) },
    { id: 'f1b', description: 'iFood', amount: 90, type: 'expense', categoryId: 'food', date: dateInMonth(1, 20), createdAt: dateInMonth(1, 20) },
    { id: 't1', description: 'Uber / Transporte', amount: 180, type: 'expense', categoryId: 'transport', date: dateInMonth(1, 12), createdAt: dateInMonth(1, 12) },
    { id: 'h1', description: 'Aluguel', amount: 1200, type: 'expense', categoryId: 'housing', date: dateInMonth(1, 5), createdAt: dateInMonth(1, 5) },
    { id: 'u1', description: 'Internet + Energia', amount: 200, type: 'expense', categoryId: 'utilities', date: dateInMonth(1, 10), createdAt: dateInMonth(1, 10) },
    { id: 'e1', description: 'Curso Online', amount: 150, type: 'expense', categoryId: 'education', date: dateInMonth(1, 8), createdAt: dateInMonth(1, 8) },
    { id: 'sh1', description: 'Amazon', amount: 250, type: 'expense', categoryId: 'shopping', date: dateInMonth(1, 25), createdAt: dateInMonth(1, 25) },
    // current month
    { id: 's0', description: 'Salário', amount: 5000, type: 'income', categoryId: 'salary', date: dateInMonth(0, 5), createdAt: dateInMonth(0, 5) },
    { id: 'f0a', description: 'Supermercado', amount: 480, type: 'expense', categoryId: 'food', date: dateInMonth(0, 7), createdAt: dateInMonth(0, 7) },
    { id: 'f0b', description: 'Restaurante', amount: 75, type: 'expense', categoryId: 'food', date: dateInMonth(0, 14), createdAt: dateInMonth(0, 14) },
    { id: 't0', description: 'Combustível', amount: 190, type: 'expense', categoryId: 'transport', date: dateInMonth(0, 9), createdAt: dateInMonth(0, 9) },
    { id: 'h0', description: 'Aluguel', amount: 1200, type: 'expense', categoryId: 'housing', date: dateInMonth(0, 5), createdAt: dateInMonth(0, 5) },
    { id: 'u0', description: 'Energia Elétrica', amount: 140, type: 'expense', categoryId: 'utilities', date: dateInMonth(0, 11), createdAt: dateInMonth(0, 11) },
    { id: 'hea0', description: 'Plano de Saúde', amount: 300, type: 'expense', categoryId: 'health', date: dateInMonth(0, 6), createdAt: dateInMonth(0, 6) },
    { id: 'l0', description: 'Streaming', amount: 55, type: 'expense', categoryId: 'leisure', date: dateInMonth(0, 10), createdAt: dateInMonth(0, 10) },
  ];

  const currentMonth = monthStr(0);
  const budgets: Budget[] = [
    { id: 'b1', categoryId: 'food', limit: 600, month: currentMonth },
    { id: 'b2', categoryId: 'transport', limit: 300, month: currentMonth },
    { id: 'b3', categoryId: 'leisure', limit: 200, month: currentMonth },
    { id: 'b4', categoryId: 'health', limit: 400, month: currentMonth },
    { id: 'b5', categoryId: 'housing', limit: 1200, month: currentMonth },
    { id: 'b6', categoryId: 'utilities', limit: 250, month: currentMonth },
  ];

  const salaries: MonthSalary[] = [
    { month: monthStr(2), amount: 5000 },
    { month: monthStr(1), amount: 5000 },
    { month: currentMonth, amount: 5000 },
  ];

  return { transactions, budgets, salaries };
};
