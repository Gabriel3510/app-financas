import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

const SummaryCards: React.FC = () => {
  const { getCurrentMonthData, getSalaryForMonth, currentMonth } = useFinance();
  const { income, expenses, balance, savingsRate } = getCurrentMonthData();
  const salary = getSalaryForMonth(currentMonth);

  const cards = [
    {
      label: 'Receitas',
      value: formatCurrency(income),
      icon: <TrendingUp size={22} />,
      color: 'bg-green-500',
      bg: 'bg-green-50',
      text: 'text-green-700',
    },
    {
      label: 'Despesas',
      value: formatCurrency(expenses),
      icon: <TrendingDown size={22} />,
      color: 'bg-red-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
    },
    {
      label: 'Saldo',
      value: formatCurrency(balance),
      icon: <Wallet size={22} />,
      color: balance >= 0 ? 'bg-blue-500' : 'bg-red-500',
      bg: balance >= 0 ? 'bg-blue-50' : 'bg-red-50',
      text: balance >= 0 ? 'text-blue-700' : 'text-red-700',
    },
    {
      label: '% Economizado',
      value: `${savingsRate.toFixed(1)}%`,
      sub: salary > 0 ? `Salário: ${formatCurrency(salary)}` : undefined,
      icon: <PiggyBank size={22} />,
      color: savingsRate >= 20 ? 'bg-emerald-500' : savingsRate >= 0 ? 'bg-yellow-500' : 'bg-red-500',
      bg: savingsRate >= 20 ? 'bg-emerald-50' : savingsRate >= 0 ? 'bg-yellow-50' : 'bg-red-50',
      text: savingsRate >= 20 ? 'text-emerald-700' : savingsRate >= 0 ? 'text-yellow-700' : 'text-red-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-xl p-4 ${card.bg} border border-white`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">{card.label}</span>
            <div className={`p-2 rounded-lg ${card.color} text-white`}>{card.icon}</div>
          </div>
          <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
          {card.sub && <p className="text-xs text-gray-500 mt-1">{card.sub}</p>}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
