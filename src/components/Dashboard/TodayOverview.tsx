import React, { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { usePreferences } from '../../contexts/preferences';
import type { TransactionType } from '../../types';
import { calculateMonthSummary, fixedType, getTodayPlan, isFixedActive } from '../../utils/calculations';
import { formatWeekday, getCurrentMonth } from '../../utils/formatters';
import { getMonthlyNeed, getSpendingProfile } from '../../utils/goalPlanner';

const TodayOverview: React.FC<{ onOpenTransactions: (type: TransactionType) => void }> = ({ onOpenTransactions }) => {
  const { transactions, goals, fixedExpenses, isFixedPaid } = useFinance();
  const { t, money, language } = usePreferences();
  const [now] = useState(() => new Date());
  const [thisMonth] = useState(getCurrentMonth);

  const plan = useMemo(() => {
    const goalsNeed = goals.reduce((sum, g) => sum + getMonthlyNeed(g, thisMonth), 0);
    const pending = fixedExpenses.filter((f) => isFixedActive(f, thisMonth) && !isFixedPaid(f.id, thisMonth));
    const pendingExpenses = pending.filter((f) => fixedType(f) === 'expense').reduce((sum, f) => sum + f.amount, 0);
    const pendingIncome = pending.filter((f) => fixedType(f) === 'income').reduce((sum, f) => sum + f.amount, 0);
    const { avgIncome } = getSpendingProfile(transactions, thisMonth, fixedExpenses);
    // Recurring income still to arrive this month counts as money the month will have
    const expectedIncome = Math.max(avgIncome, calculateMonthSummary(transactions, thisMonth).income + pendingIncome);
    return getTodayPlan(transactions, goalsNeed + pendingExpenses, expectedIncome, now);
  }, [transactions, goals, fixedExpenses, isFixedPaid, thisMonth, now]);

  const { dailyLimit, income, expenses, week } = plan;
  const balance = income - expenses;
  const pct = dailyLimit > 0 ? Math.min((expenses / dailyLimit) * 100, 100) : expenses > 0 ? 100 : 0;
  const over = expenses > dailyLimit;

  const rows = [
    { label: t('today.income'), value: `+ ${money(income)}`, tone: 'text-income', type: 'income' as const },
    { label: t('today.expenses'), value: `- ${money(expenses)}`, tone: 'text-expense', type: 'expense' as const },
    { label: t('today.balance'), value: money(balance), tone: balance >= 0 ? 'text-income' : 'text-expense' },
  ];

  return (
    <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
      <div data-tour="today" className="card p-4 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">{t('today.title')}</p>
        <p className="text-sm font-medium mb-1.5">{t('today.dailyTarget')}</p>
        <div className="w-full bg-primary-soft rounded-full h-2.5 mb-1">
          <div className={`h-2.5 rounded-full transition-all ${over ? 'bg-expense' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs font-medium text-muted tabular-nums mb-3">
          <span>{money(expenses)}</span>
          <span>{money(dailyLimit)}</span>
        </div>
        <div className="divide-y divide-line">
          {rows.map((row) => (
            <button
              key={row.label}
              disabled={!row.type}
              onClick={() => row.type && onOpenTransactions(row.type)}
              className="w-full flex justify-between gap-3 py-2 text-sm text-left enabled:hover:bg-surface-2"
            >
              <span className="text-muted">{row.label}</span>
              <span className={`font-semibold tabular-nums ${row.tone}`}>{row.value}</span>
            </button>
          ))}
        </div>
      </div>

      <div data-tour="week" className="card p-4 min-w-0 flex flex-col">
        <h2 className="font-semibold">{t('week.title')}</h2>
        <p className="text-xs text-subtle mb-3">{t('week.hint', { value: money(dailyLimit) })}</p>
        <div className="grid grid-cols-7 gap-1.5 flex-1">
          {week.map((day) => {
            const ratio = dailyLimit > 0 ? Math.min(day.spent / dailyLimit, 1) : day.spent > 0 ? 1 : 0;
            const overLimit = day.spent > dailyLimit;
            const bar = overLimit ? 'bg-expense' : day.isToday ? 'bg-primary' : 'bg-income';
            return (
              <div key={day.date.toISOString()} className="flex flex-col items-center gap-1 min-w-0">
                <span className="h-4 text-income">{!day.isFuture && !day.isToday && !overLimit && <Check size={14} strokeWidth={3} />}</span>
                <div className="w-full max-w-[28px] h-20 flex-1 min-h-[80px] rounded-md bg-primary-soft flex items-end overflow-hidden">
                  <div className={`w-full rounded-md transition-all ${bar}`} style={{ height: `${ratio * 100}%` }} />
                </div>
                <span className={`text-[11px] capitalize ${day.isToday ? 'font-bold text-ink' : 'text-subtle'}`}>
                  {formatWeekday(day.date, language).slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TodayOverview;
