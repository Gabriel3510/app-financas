import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../contexts/finance';
import { usePreferences } from '../../contexts/preferences';
import ChartTooltip from './ChartTooltip';

const AXIS_TICK = { fontSize: 12, fill: 'var(--chart-text)' };
const LINE_COLOR = '#F5A800';

const BalanceLineChart: React.FC = () => {
  const { getMonthlyHistory } = useFinance();
  const { t, money, compactMoney, month } = usePreferences();

  const data = getMonthlyHistory(6).map((h) => ({
    month: month(h.month).split(' ')[0].replace('.', ''),
    fullMonth: month(h.month),
    balance: h.accumulated,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 12, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
        <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <YAxis width={74} tickFormatter={compactMoney} tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <Tooltip
          content={({ active, payload }) =>
            active && payload?.length ? (
              <ChartTooltip
                title={(payload[0].payload as { fullMonth: string }).fullMonth}
                rows={[{ label: t('summary.balance'), value: money(Number(payload[0].value)), color: LINE_COLOR }]}
              />
            ) : null
          }
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke={LINE_COLOR}
          strokeWidth={2.5}
          dot={{ r: 4, fill: LINE_COLOR }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceLineChart;
