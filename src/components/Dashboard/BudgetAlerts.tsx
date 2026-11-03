import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { usePreferences } from '../../contexts/preferences';
import { getBudgetLevel, getBudgetUsage } from '../../utils/calculations';
import { BUDGET_LEVEL_STYLES } from '../Budget/budgetStyles';
import { CategoryBadge } from '../UI/AppIcon';

const BudgetAlerts: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { budgets, transactions, getCategory, currentMonth } = useFinance();
  const { t, money } = usePreferences();
  const monthBudgets = budgets.filter((b) => b.month === currentMonth);

  const alerts = monthBudgets
    .map((b) => {
      const spent = getBudgetUsage(transactions, b, currentMonth);
      const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0;
      return { budget: b, spent, pct, level: getBudgetLevel(pct), cat: getCategory(b.categoryId) };
    })
    .filter((a) => a.level !== 'ok')
    .sort((a, b) => b.pct - a.pct);

  if (alerts.length === 0) return null;

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} className="text-warning" />
        <h2 className="font-semibold flex-1 min-w-0 truncate">{t('alerts.title')}</h2>
        <button onClick={onOpen} className="text-sm font-medium text-accent hover:underline py-1 flex-shrink-0">{t('recent.viewAll')}</button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {alerts.map(({ budget, spent, pct, level, cat }) => (
          <div key={budget.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2 min-w-0">
            <CategoryBadge icon={cat.icon} color={cat.color} />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2 text-sm mb-1">
                <span className="font-medium truncate">{cat.name}</span>
                <span className={`font-semibold ${BUDGET_LEVEL_STYLES[level].text}`}>{pct.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-line rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${BUDGET_LEVEL_STYLES[level].bar}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted mt-1 tabular-nums">{money(spent)} / {money(budget.limit)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetAlerts;
