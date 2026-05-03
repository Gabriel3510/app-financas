import React, { useState } from 'react';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import type { Transaction, TransactionType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import TransactionFilters from './TransactionFilters';
import TransactionForm from './TransactionForm';

const PAGE_SIZE = 10;

interface TransactionListProps {
  showFilters?: boolean;
  monthFilter?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ showFilters = true, monthFilter }) => {
  const { transactions, categories, deleteTransaction, currentMonth } = useFinance();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage] = useState(1);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const month = monthFilter ?? currentMonth;

  const filtered = transactions
    .filter((t) => t.date.startsWith(month))
    .filter((t) => filterType === 'all' || t.type === filterType)
    .filter((t) => !filterCategory || t.categoryId === filterCategory)
    .filter((t) => !search || t.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let diff = 0;
      if (sortBy === 'date') diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      else diff = a.amount - b.amount;
      return sortDir === 'desc' ? -diff : diff;
    });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(field); setSortDir('desc'); }
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <TransactionFilters
          search={search} setSearch={setSearch}
          filterType={filterType} setFilterType={setFilterType}
          filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        />
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {paginated.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">Nenhuma transação encontrada</p>
        ) : (
          <>
            {/* Sort header */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500">
              <span className="w-9" />
              <span className="flex-1">Descrição</span>
              <button onClick={() => toggleSort('date')} className="w-24 text-left hover:text-gray-800 transition-colors">
                Data {sortBy === 'date' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
              </button>
              <button onClick={() => toggleSort('amount')} className="w-24 text-right hover:text-gray-800 transition-colors">
                Valor {sortBy === 'amount' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
              </button>
              <span className="w-16" />
            </div>
            <div className="divide-y divide-gray-100">
              {paginated.map((t) => {
                const cat = categories.find((c) => c.id === t.categoryId);
                return (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                      style={{ backgroundColor: (cat?.color || '#6B7280') + '20' }}
                    >
                      {cat?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{t.description}</p>
                      <p className="text-xs text-gray-500">{cat?.name} · {formatDate(t.date)}</p>
                    </div>
                    <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => setEditingTx(t)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">{total} transações</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-gray-600">{page} / {pages}</span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight size={16} />
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
