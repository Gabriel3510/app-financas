import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePreferences } from '../contexts/preferences';
import type { TransactionType } from '../types';
import Fab from '../components/UI/Fab';
import PageHeader from '../components/Layout/PageHeader';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';

interface TransactionsPageProps {
  initialType: TransactionType | 'all';
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ initialType }) => {
  const { t } = usePreferences();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <PageHeader
        subtitle={t('page.transactions.sub')}
        action={
          <button onClick={() => setShowForm(true)} className="btn-primary flex-shrink-0 !hidden md:!inline-flex">
            <Plus size={16} /> {t('tx.newShort')}
          </button>
        }
      />
      <TransactionList key={initialType} initialType={initialType} />
      <Fab label={t('tx.new')} onClick={() => setShowForm(true)} />
      {showForm && <TransactionForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default TransactionsPage;
