import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SummaryCards from '../components/Dashboard/SummaryCards';
import BudgetAlerts from '../components/Dashboard/BudgetAlerts';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import TransactionForm from '../components/Transactions/TransactionForm';
import ExpensesPieChart from '../components/Charts/ExpensesPieChart';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Visão Geral</h2>
          <p className="text-sm text-gray-500">Resumo do seu mês financeiro</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Nova Transação
        </button>
      </div>
      <SummaryCards />
      <BudgetAlerts />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Gastos por Categoria</h3>
          <ExpensesPieChart />
        </div>
        <RecentTransactions onNavigate={onNavigate} />
      </div>
      {showForm && <TransactionForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default DashboardPage;
