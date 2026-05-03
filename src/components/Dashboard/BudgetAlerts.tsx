import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { getBudgetUsage } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

const BudgetAlerts: React.FC = () => {
  const { budgets, transactions, categories, currentMonth } = useFinance();
  const monthBudgets = budgets.filter((b) => b.month === currentMonth);

  const alerts = monthBudgets
    .map((b) => {
      const spent = getBudgetUsage(transactions, b, currentMonth);
      const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0;
      const cat = categories.find((c) => c.id === b.categoryId);
      return { budget: b, spent, pct, cat };
    })
    .filter((a) => a.pct >= 70)
    .sort((a, b) => b.pct - a.pct);

  if (alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} className="text-yellow-500" />
        <h3 className="font-semibold text-gray-800">Alertas de Orçamento</h3>
      </div>
      <div className="space-y-2">
        {alerts.map(({ budget, spent, pct, cat }) => (
          <div key={budget.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <span className="text-xl">{cat?.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 truncate">{cat?.name}</span>
                <span className={`font-semibold ${pct > 100 ? 'text-red-600' : pct > 90 ? 'text-red-500' : 'text-yellow-600'}`}>
                  {pct.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${pct > 100 ? 'bg-red-500' : pct > 90 ? 'bg-red-400' : 'bg-yellow-400'}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(spent)} / {formatCurrency(budget.limit)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetAlerts;
