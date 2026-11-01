import React from 'react';
import { Search } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { usePreferences } from '../../contexts/preferences';
import type { TransactionType } from '../../types';
import Select from '../UI/Select';

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
  const { t } = usePreferences();
  const available = categories.filter((c) => filterType === 'all' || c.type === filterType || c.type === 'both');

  const changeType = (type: TransactionType | 'all') => {
    setFilterType(type);
    if (type !== 'all' && !categories.some((c) => c.id === filterCategory && (c.type === type || c.type === 'both'))) {
      setFilterCategory('');
    }
  };

  return (
    <div data-tour="filters" className="grid grid-cols-2 sm:grid-cols-[1fr_auto_auto] gap-2 sm:gap-3">
      <div className="relative col-span-2 sm:col-span-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          aria-label={t('tx.search')}
          placeholder={t('tx.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
        />
      </div>
      <Select
        label={t('tx.allTypes')}
        value={filterType}
        onChange={(value) => changeType(value as TransactionType | 'all')}
        className="sm:w-44"
        options={[
          { value: 'all', label: t('tx.allTypes') },
          { value: 'income', label: t('tx.incomes') },
          { value: 'expense', label: t('tx.expenses') },
        ]}
      />
      <Select
        label={t('tx.allCategories')}
        value={filterCategory}
        onChange={setFilterCategory}
        className="sm:w-48"
        options={[
          { value: '', label: t('tx.allCategories') },
          ...available.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` })),
        ]}
      />
    </div>
  );
};

export default TransactionFilters;
