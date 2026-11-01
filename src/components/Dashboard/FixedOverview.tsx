import React from 'react';
import { CalendarClock, Check } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { usePreferences } from '../../contexts/preferences';

const FixedOverview: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { fixedExpenses, isFixedPaid, payFixed, currentMonth } = useFinance();
  const { t, money } = usePreferences();

  if (fixedExpenses.length === 0) return null;

  const total = fixedExpenses.reduce((sum, f) => sum + f.amount, 0);
  const pending = fixedExpenses
    .filter((f) => !isFixedPaid(f.id, currentMonth))
    .sort((a, b) => a.day - b.day);
  const pendingTotal = pending.reduce((sum, f) => sum + f.amount, 0);
  const pct = total > 0 ? ((total - pendingTotal) / total) * 100 : 0;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <CalendarClock size={18} className="text-accent flex-shrink-0" />
          <h2 className="font-semibold truncate">{t('fixed.title')}</h2>
        </div>
        <button onClick={onOpen} className="text-sm font-medium text-accent hover:underline py-1 flex-shrink-0">{t('recent.viewAll')}</button>
      </div>
      <div className="w-full bg-surface-2 rounded-full h-2 mb-1.5">
        <div className="h-2 rounded-full bg-income transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between gap-3 text-xs text-muted tabular-nums mb-2">
        <span>{t('fixed.pending')}: {money(pendingTotal)}</span>
        <span>{t('fixed.total')}: {money(total)}</span>
      </div>
      {pending.length === 0 ? (
        <p className="flex items-center gap-1.5 text-sm font-medium text-income pt-1"><Check size={16} /> {t('fixed.allPaid')}</p>
      ) : (
        <ul className="divide-y divide-line">
          {pending.slice(0, 3).map((fixed) => (
            <li key={fixed.id} className="flex items-center gap-3 py-1.5">
              <span className="flex-1 min-w-0 text-sm truncate">{fixed.name}</span>
              <span className="text-xs text-subtle whitespace-nowrap">{t('fixed.dueDay', { day: fixed.day })}</span>
              <span className="text-sm font-semibold tabular-nums whitespace-nowrap">{money(fixed.amount)}</span>
              <button onClick={() => payFixed(fixed, currentMonth)} className="btn-secondary !min-h-[34px] !px-3 !py-1">{t('fixed.pay')}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FixedOverview;
