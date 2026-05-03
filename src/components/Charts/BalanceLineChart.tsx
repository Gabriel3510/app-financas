import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency, formatMonth } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold mb-1 capitalize">{label}</p>
        <p className={`text-sm font-medium ${payload[0].value >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
          Saldo: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const BalanceLineChart: React.FC = () => {
  const { getMonthlyHistory } = useFinance();
  const history = getMonthlyHistory(6);

  const data = history.map((h) => ({
    month: formatMonth(h.month),
    Saldo: h.balance,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`} tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="Saldo"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ r: 4, fill: '#3B82F6' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceLineChart;
