import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';

const TransactionsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Transações</h2>
          <p className="text-sm text-gray-500">Gerencie receitas e despesas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Adicionar
        </button>
      </div>
      <TransactionList />
      {showForm && <TransactionForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default TransactionsPage;
