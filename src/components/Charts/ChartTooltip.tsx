import React from 'react';

interface ChartTooltipProps {
  title?: string;
  rows: { label: string; value: string; color?: string }[];
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ title, rows }) => (
  <div className="bg-surface border border-line rounded-xl p-3 shadow-lg">
    {title && <p className="text-sm font-semibold mb-1 capitalize">{title}</p>}
    {rows.map((row) => (
      <p key={row.label} className="text-sm tabular-nums" style={{ color: row.color }}>
        {row.label}: {row.value}
      </p>
    ))}
  </div>
);

export default ChartTooltip;
