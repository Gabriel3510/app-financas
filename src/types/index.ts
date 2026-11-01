export type TransactionType = 'income' | 'expense';

export type Page = 'dashboard' | 'transactions' | 'charts' | 'budget' | 'settings';

export type Language = 'pt-PT' | 'en';
export type ThemeMode = 'light' | 'dark' | 'system';
export const CURRENCIES = [
  'EUR', 'BRL', 'USD', 'GBP', 'CHF', 'CAD', 'AUD', 'JPY', 'CNY', 'INR',
  'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU', 'AOA', 'MZN', 'CVE', 'ZAR',
] as const;
export type Currency = (typeof CURRENCIES)[number];

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType | 'both';
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string; // "YYYY-MM-DD"
  note?: string;
  createdAt: string;
  sampleKey?: string; // sample rows keep following the app language until edited
  fixedId?: string; // set when the transaction is the monthly payment of a fixed expense
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  month: string; // "YYYY-MM"
}

export interface MonthSalary {
  month: string; // "YYYY-MM"
  amount: number;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  day: number; // day of the month it is due
  sampleKey?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  target: number;
  saved: number;
  deadline?: string; // "YYYY-MM"
  createdAt: string;
  sampleKey?: string;
}

export interface AppData {
  transactions: Transaction[];
  budgets: Budget[];
  salaries: MonthSalary[];
  customCategories: Category[];
  goals: SavingsGoal[];
  fixedExpenses: FixedExpense[];
}
