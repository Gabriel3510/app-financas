import type { BudgetLevel } from '../../utils/calculations';

export const BUDGET_LEVEL_STYLES: Record<BudgetLevel, { bar: string; text: string }> = {
  ok: { bar: 'bg-income', text: 'text-income' },
  warning: { bar: 'bg-warning', text: 'text-warning' },
  danger: { bar: 'bg-expense', text: 'text-expense' },
  over: { bar: 'bg-expense', text: 'text-expense' },
};
