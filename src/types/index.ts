export type TransactionType = 'income' | 'expense';

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
  date: string; // ISO string
  note?: string;
  createdAt: string;
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

export interface AppData {
  transactions: Transaction[];
  budgets: Budget[];
  salaries: MonthSalary[];
  customCategories: Category[];
}
