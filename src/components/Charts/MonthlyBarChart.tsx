import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../contexts/finance';
import { usePreferences } from '../../contexts/preferences';
import ChartTooltip from './ChartTooltip';

const AXIS_TICK = { fontSize: 12, fill: 'var(--chart-text)' };

const MonthlyBarChart: React.FC = () => {
  const { getMonthlyHistory } = useFinance();
  const { t, money, compactMoney, month } = usePreferences();

  const data = getMonthlyHistory(6).map((h) => ({
    month: month(h.month).split(' ')[0].replace('.', ''),
    fullMonth: month(h.month),
    income: h.income,
    expenses: h.expenses,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 4, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
        <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <YAxis width={74} tickFormatter={compactMoney} tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'var(--chart-grid)', opacity: 0.4 }}
          content={({ active, payload }) =>
            active && payload?.length ? (
              <ChartTooltip
                title={(payload[0].payload as { fullMonth: string }).fullMonth}
                rows={payload.map((p) => ({ label: String(p.name), value: money(Number(p.value)), color: p.color }))}
              />
            ) : null
          }
        />
        <Legend wrapperStyle={{ fontSize: 13, color: 'var(--chart-text)' }} />
        <Bar dataKey="income" name={t('summary.income')} fill="#10B981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name={t('summary.expenses')} fill="#EF4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyBarChart;
