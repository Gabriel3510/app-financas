import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../contexts/finance';
import { usePreferences } from '../../contexts/preferences';
import ChartTooltip from './ChartTooltip';

const MAX_SLICES = 7;

const ExpensesPieChart: React.FC = () => {
  const { getExpensesByCategory, currentMonth } = useFinance();
  const { t, money, compactMoney } = usePreferences();
  const expenses = getExpensesByCategory(currentMonth);

  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-subtle text-sm">
        {t('charts.noExpenses')}
      </div>
    );
  }

  // Everything past the top slices is grouped, so the percentages always add up to the month's total
  const slices = expenses.slice(0, MAX_SLICES).map((d) => ({
    id: d.categoryId,
    name: d.category.name,
    value: d.total,
    percentage: d.percentage,
    color: d.category.color,
  }));
  const rest = expenses.slice(MAX_SLICES);
  if (rest.length > 0) {
    slices.push({
      id: 'rest',
      name: t('charts.others'),
      value: rest.reduce((sum, d) => sum + d.total, 0),
      percentage: rest.reduce((sum, d) => sum + d.percentage, 0),
      color: '#6B7280',
    });
  }
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={slices}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              stroke="none"
            >
              {slices.map((slice) => (
                <Cell key={slice.id} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <ChartTooltip rows={[{ label: String(payload[0].name), value: money(Number(payload[0].value)) }]} />
                ) : null
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-subtle">{t('charts.total')}</span>
          <span className="font-bold tabular-nums">{compactMoney(total)}</span>
        </div>
      </div>
      <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
        {slices.map((slice) => (
          <li key={slice.id} className="flex items-center gap-2 text-sm min-w-0">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
            <span className="flex-1 min-w-0 truncate text-muted">{slice.name}</span>
            <span className="font-medium tabular-nums">{slice.percentage.toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesPieChart;
