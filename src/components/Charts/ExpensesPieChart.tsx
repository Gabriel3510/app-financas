import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-sm text-gray-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const ExpensesPieChart: React.FC = () => {
  const { getExpensesByCategory, currentMonth } = useFinance();
  const data = getExpensesByCategory(currentMonth).slice(0, 8);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Nenhuma despesa neste mês
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: `${d.category.icon} ${d.category.name}`,
    value: d.total,
    color: d.category.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={({ percent }) => percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ''}
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensesPieChart;
