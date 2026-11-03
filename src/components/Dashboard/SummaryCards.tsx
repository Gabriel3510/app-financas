import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { usePreferences } from '../../contexts/preferences';
import type { TransactionType } from '../../types';

const TONES = {
  income: { chip: 'bg-income-soft text-income', value: 'text-income' },
  expense: { chip: 'bg-expense-soft text-expense', value: 'text-expense' },
  primary: { chip: 'bg-primary-soft text-accent', value: 'text-accent' },
  warning: { chip: 'bg-warning-soft text-warning', value: 'text-warning' },
};

interface SummaryCardsProps {
  onOpenTransactions: (type: TransactionType) => void;
  onOpenCharts: () => void;
  onOpenGoals: () => void;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ onOpenTransactions, onOpenCharts, onOpenGoals }) => {
  const { getCurrentMonthData, getSalaryForMonth, currentMonth } = useFinance();
  const { t, money, language } = usePreferences();
  const { income, expenses, totalBalance, carryOver, savingsRate } = getCurrentMonthData();
  const salary = getSalaryForMonth(currentMonth);

  const cards = [
    { label: t('summary.income'), value: money(income), icon: <TrendingUp size={18} />, tone: TONES.income, onClick: () => onOpenTransactions('income') },
    { label: t('summary.expenses'), value: money(expenses), icon: <TrendingDown size={18} />, tone: TONES.expense, onClick: () => onOpenTransactions('expense') },
    {
      label: t('summary.balance'),
      value: money(totalBalance),
      sub: carryOver !== 0 ? t('summary.carry', { value: money(carryOver) }) : undefined,
      icon: <Wallet size={18} />,
      tone: totalBalance >= 0 ? TONES.primary : TONES.expense,
      onClick: onOpenCharts,
    },
    {
      label: t('summary.savings'),
      value: `${savingsRate.toLocaleString(language, { maximumFractionDigits: 1 })}%`,
      sub: salary > 0 ? t('summary.salary', { value: money(salary) }) : undefined,
      icon: <PiggyBank size={18} />,
      tone: savingsRate >= 20 ? TONES.income : savingsRate >= 0 ? TONES.warning : TONES.expense,
      onClick: onOpenGoals,
    },
  ];

  return (
    <div data-tour="summary" className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card) => (
        <button key={card.label} onClick={card.onClick} className="card p-3.5 md:p-4 min-w-0 text-left hover:border-primary transition-colors">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs sm:text-sm font-medium text-muted truncate">{card.label}</span>
            <span className={`p-1.5 rounded-lg flex-shrink-0 ${card.tone.chip}`}>{card.icon}</span>
          </div>
          <p className={`text-base min-[380px]:text-lg sm:text-2xl font-bold tabular-nums break-words ${card.tone.value}`}>{card.value}</p>
          {card.sub && <p className="text-xs text-subtle mt-1">{card.sub}</p>}
        </button>
      ))}
    </div>
  );
};

export default SummaryCards;
