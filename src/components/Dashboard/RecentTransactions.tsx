import React from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface RecentTransactionsProps {
  onNavigate: (page: string) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ onNavigate }) => {
  const { transactions, categories, currentMonth } = useFinance();
  const recent = transactions
    .filter((t) => t.date.startsWith(currentMonth))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Transações Recentes</h3>
        <button
          onClick={() => onNavigate('transactions')}
          className="text-sm text-blue-600 hover:underline"
        >
          Ver todas
        </button>
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">Nenhuma transação neste mês</p>
      ) : (
        <div className="space-y-3">
          {recent.map((t) => {
            const cat = categories.find((c) => c.id === t.categoryId);
            return (
              <div key={t.id} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base"
                  style={{ backgroundColor: cat?.color + '20' }}
                >
                  {cat?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{t.description}</p>
                  <p className="text-xs text-gray-500">{formatDate(t.date)}</p>
                </div>
                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
