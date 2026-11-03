import React, { useState } from 'react';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import type { Transaction, TransactionType } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { CategoryBadge } from '../UI/AppIcon';
import TransactionFilters from './TransactionFilters';
import TransactionForm from './TransactionForm';

const PAGE_SIZE = 10;

type SortField = 'date' | 'amount';

const TransactionList: React.FC<{ initialType?: TransactionType | 'all' }> = ({ initialType = 'all' }) => {
  const { transactions, getCategory, deleteTransaction, restoreTransaction, currentMonth } = useFinance();
  const { showToast } = useNotifications();
  const { t, money, date, language } = usePreferences();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>(initialType);
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage] = useState(1);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = transactions
    .filter((tx) => tx.date.startsWith(currentMonth))
    .filter((tx) => filterType === 'all' || tx.type === filterType)
    .filter((tx) => !filterCategory || tx.categoryId === filterCategory)
    .filter((tx) => !search || tx.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const diff = sortBy === 'date' ? a.date.localeCompare(b.date) : a.amount - b.amount;
      return sortDir === 'desc' ? -diff : diff;
    });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // Filters, deletions and month changes can shrink the list below the page being viewed
  const safePage = Math.min(page, pages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSort = (field: SortField) => {
    if (sortBy === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(field); setSortDir('desc'); }
  };

  const handleDelete = (tx: Transaction) => {
    deleteTransaction(tx.id);
    showToast({
      kind: 'success',
      message: t('tx.deleted'),
      actionLabel: t('common.undo'),
      onAction: () => restoreTransaction(tx),
    });
  };

  const sortButton = (field: SortField, label: string) => (
    <button
      onClick={() => toggleSort(field)}
      className={`px-2.5 py-1.5 rounded-lg transition-colors ${sortBy === field ? 'bg-primary-soft text-accent' : 'hover:text-ink'}`}
    >
      {label} {sortBy === field ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </button>
  );

  return (
    <div className="space-y-4">
      <TransactionFilters
        search={search} setSearch={setSearch}
        filterType={filterType} setFilterType={setFilterType}
        filterCategory={filterCategory} setFilterCategory={setFilterCategory}
      />
      <div data-tour="tx-list" className="card overflow-hidden">
        {paginated.length === 0 ? (
          <p className="text-center text-subtle text-sm py-10">{t('tx.empty')}</p>
        ) : (
          <>
            <div className="flex items-center justify-end gap-1 px-3 py-2 border-b border-line text-xs font-medium text-muted">
              <span className="mr-1">{t('tx.sortBy')}</span>
              {sortButton('date', t('tx.date'))}
              {sortButton('amount', t('tx.amount'))}
            </div>
            <div className="divide-y divide-line">
              {paginated.map((tx) => {
                const cat = getCategory(tx.categoryId);
                return (
                  <div key={tx.id} className="flex items-center gap-3 pl-3 pr-1.5 sm:px-4 py-2.5 hover:bg-surface-2 transition-colors">
                    <CategoryBadge icon={cat.icon} color={cat.color} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.description}</p>
                      <p className="text-xs text-subtle truncate">{cat.name} · {date(tx.date)}</p>
                      {(tx.installment || tx.original) && (
                        <p className="text-xs text-subtle truncate">
                          {tx.installment && (
                            <span className="inline-block mr-1.5 px-1.5 rounded bg-primary-soft text-accent font-medium">
                              {t('tx.installmentLabel', { index: tx.installment.index, total: tx.installment.total })}
                            </span>
                          )}
                          {tx.original && formatCurrency(tx.original.amount, language, tx.original.currency)}
                        </p>
                      )}
                      {tx.note && <p className="text-xs text-subtle truncate">{tx.note}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-0 sm:gap-3 flex-shrink-0">
                      <span className={`text-sm font-semibold tabular-nums whitespace-nowrap pr-2 sm:pr-0 ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {tx.type === 'income' ? '+' : '-'}{money(tx.amount)}
                      </span>
                      <div className="flex">
                        <button onClick={() => setEditingTx(tx)} aria-label={t('common.edit')} className="icon-btn !w-9 !h-9">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(tx)} aria-label={t('common.delete')} className="icon-btn !w-9 !h-9 hover:text-expense">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-line">
            <span className="text-xs text-muted">{t('tx.count', { count: total })}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage === 1} aria-label={t('tx.previousPage')} className="icon-btn">
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs text-muted tabular-nums">{safePage} / {pages}</span>
              <button onClick={() => setPage(Math.min(pages, safePage + 1))} disabled={safePage === pages} aria-label={t('tx.nextPage')} className="icon-btn">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
      {editingTx && (
        <TransactionForm
          onClose={() => setEditingTx(null)}
          editingTransaction={editingTx}
        />
      )}
    </div>
  );
};

export default TransactionList;
