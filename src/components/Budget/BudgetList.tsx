import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { getBudgetUsage } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import type { Budget } from '../../types';
import BudgetForm from './BudgetForm';

const BudgetList: React.FC = () => {
  const { budgets, transactions, categories, deleteBudget, currentMonth } = useFinance();
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const monthBudgets = budgets.filter((b) => b.month === currentMonth);

  return (
    <div className="space-y-3">
      {monthBudgets.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">Nenhuma meta para este mês</p>
      ) : (
        monthBudgets.map((b) => {
          const spent = getBudgetUsage(transactions, b, currentMonth);
          const pct = b.limit > 0 ? Math.min((spent / b.limit) * 100, 100) : 0;
          const cat = categories.find((c) => c.id === b.categoryId);
          const color = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-400' : 'bg-green-500';
          const textColor = pct > 90 ? 'text-red-600' : pct > 70 ? 'text-yellow-600' : 'text-green-600';

          return (
            <div key={b.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{cat?.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 text-sm">{cat?.name}</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-semibold ${textColor}`}>{pct.toFixed(0)}%</span>
                      <button onClick={() => setEditingBudget(b)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={13} /></button>
                      <button onClick={() => deleteBudget(b.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Gasto: {formatCurrency(spent)}</span>
                <span>Limite: {formatCurrency(b.limit)}</span>
              </div>
              {spent > b.limit && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  ⚠️ Orçamento ultrapassado em {formatCurrency(spent - b.limit)}
                </p>
              )}
            </div>
          );
        })
      )}
      {editingBudget && (
        <BudgetForm onClose={() => setEditingBudget(null)} editingBudget={editingBudget} />
      )}
    </div>
  );
};

export default BudgetList;
