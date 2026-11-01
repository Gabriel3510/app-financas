import React from 'react';
import { useFinance } from '../../contexts/finance';
import { usePreferences } from '../../contexts/preferences';
import type { Page } from '../../types';

interface RecentTransactionsProps {
  onNavigate: (page: Page) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ onNavigate }) => {
  const { transactions, getCategory, currentMonth } = useFinance();
  const { t, money, date } = usePreferences();
  const recent = transactions
    .filter((tx) => tx.date.startsWith(currentMonth))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <div className="card p-4 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{t('recent.title')}</h2>
        <button onClick={() => onNavigate('transactions')} className="text-sm font-medium text-accent hover:underline py-1">
          {t('recent.viewAll')}
        </button>
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-subtle text-center py-4">{t('recent.empty')}</p>
      ) : (
        <div className="space-y-3">
          {recent.map((tx) => {
            const cat = getCategory(tx.categoryId);
            return (
              <div key={tx.id} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                  style={{ backgroundColor: cat.color + '20' }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.description}</p>
                  <p className="text-xs text-subtle">{date(tx.date)}</p>
                </div>
                <span className={`text-sm font-semibold tabular-nums whitespace-nowrap ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                  {tx.type === 'income' ? '+' : '-'}{money(tx.amount)}
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
