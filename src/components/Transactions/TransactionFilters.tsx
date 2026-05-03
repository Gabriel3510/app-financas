import React from 'react';
import { Search } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import type { TransactionType } from '../../types';

interface TransactionFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  filterType: TransactionType | 'all';
  setFilterType: (v: TransactionType | 'all') => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  search, setSearch, filterType, setFilterType, filterCategory, setFilterCategory,
}) => {
  const { categories } = useFinance();

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[180px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">Todos os tipos</option>
        <option value="income">Receitas</option>
        <option value="expense">Despesas</option>
      </select>
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icon} {c.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TransactionFilters;
