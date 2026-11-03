import React, { useState } from 'react';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import { getBudgetLevel, getBudgetUsage } from '../../utils/calculations';
import { shiftMonth } from '../../utils/formatters';
import type { Budget } from '../../types';
import BudgetForm from './BudgetForm';
import { CategoryBadge } from '../UI/AppIcon';
import { BUDGET_LEVEL_STYLES } from './budgetStyles';

const BudgetList: React.FC = () => {
  const { budgets, transactions, getCategory, deleteBudget, restoreBudget, copyBudgets, currentMonth } = useFinance();
  const { showToast } = useNotifications();
  const { t, money } = usePreferences();
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const monthBudgets = budgets.filter((b) => b.month === currentMonth);
  const previousMonth = shiftMonth(currentMonth, -1);
  const hasPrevious = budgets.some((b) => b.month === previousMonth);

  const handleDelete = (budget: Budget) => {
    deleteBudget(budget.id);
    showToast({
      kind: 'success',
      message: t('budget.deleted'),
      actionLabel: t('common.undo'),
      onAction: () => restoreBudget(budget),
    });
  };

  const handleCopy = () => {
    copyBudgets(previousMonth, currentMonth);
    showToast({ kind: 'success', message: t('budget.copied') });
  };

  return (
    <div className="space-y-3">
      {monthBudgets.length === 0 ? (
        <div className="card text-center py-10 px-4">
          <p className="text-subtle text-sm">{t('budget.empty')}</p>
          {hasPrevious && (
            <button onClick={handleCopy} className="btn-secondary mt-4">
              <Copy size={16} /> {t('budget.copyPrevious')}
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {monthBudgets.map((b) => {
            const spent = getBudgetUsage(transactions, b, currentMonth);
            const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0;
            const cat = getCategory(b.categoryId);
            const styles = BUDGET_LEVEL_STYLES[getBudgetLevel(pct)];

            return (
              <div key={b.id} className="card p-4 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryBadge icon={cat.icon} color={cat.color} />
                  <span className="flex-1 min-w-0 font-medium text-sm truncate">{cat.name}</span>
                  <span className={`text-sm font-semibold ${styles.text}`}>{pct.toFixed(0)}%</span>
                  <div className="flex -mr-2">
                    <button onClick={() => setEditingBudget(b)} aria-label={t('common.edit')} className="icon-btn"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(b)} aria-label={t('common.delete')} className="icon-btn hover:text-expense"><Trash2 size={15} /></button>
                  </div>
                </div>
                <div className="w-full bg-surface-2 rounded-full h-2 mb-2">
                  <div className={`h-2 rounded-full transition-all ${styles.bar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="flex justify-between gap-3 text-xs text-muted tabular-nums">
                  <span>{t('budget.spent', { value: money(spent) })}</span>
                  <span>{t('budget.limitValue', { value: money(b.limit) })}</span>
                </div>
                {spent > b.limit && (
                  <p className="text-xs text-expense mt-1.5 font-medium">
                    {t('budget.exceeded', { value: money(spent - b.limit) })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
      {editingBudget && (
        <BudgetForm onClose={() => setEditingBudget(null)} editingBudget={editingBudget} />
      )}
    </div>
  );
};

export default BudgetList;
