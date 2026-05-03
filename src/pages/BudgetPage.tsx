import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import BudgetList from '../components/Budget/BudgetList';
import BudgetForm from '../components/Budget/BudgetForm';

const BudgetPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Orçamento</h2>
          <p className="text-sm text-gray-500">Metas de gastos por categoria</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Nova Meta
        </button>
      </div>
      <BudgetList />
      {showForm && <BudgetForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default BudgetPage;
