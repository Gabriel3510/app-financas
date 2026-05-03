import React from 'react';
import ExpensesPieChart from '../components/Charts/ExpensesPieChart';
import MonthlyBarChart from '../components/Charts/MonthlyBarChart';
import BalanceLineChart from '../components/Charts/BalanceLineChart';

const ChartsPage: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-gray-800">Gráficos</h2>
      <p className="text-sm text-gray-500">Análise visual das suas finanças</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">🍕 Gastos por Categoria</h3>
        <ExpensesPieChart />
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">📊 Histórico Mensal (6 meses)</h3>
        <MonthlyBarChart />
      </div>
    </div>
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">📈 Evolução do Saldo</h3>
      <BalanceLineChart />
    </div>
  </div>
);

export default ChartsPage;
