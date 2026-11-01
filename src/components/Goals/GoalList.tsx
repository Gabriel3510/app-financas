import React, { useMemo, useState } from 'react';
import { Pencil, PiggyBank, Trash2 } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import type { TranslationKey } from '../../i18n/translations';
import type { SavingsGoal } from '../../types';
import { getCurrentMonth } from '../../utils/formatters';
import { getMonthlyNeed, getSpendingProfile, planGoal } from '../../utils/goalPlanner';
import type { GoalStatus } from '../../utils/goalPlanner';
import Modal from '../UI/Modal';
import GoalForm from './GoalForm';
import GoalInsight from './GoalInsight';

const STATUS_STYLES: Record<GoalStatus, string> = {
  done: 'bg-income-soft text-income',
  ok: 'bg-income-soft text-income',
  tight: 'bg-warning-soft text-warning',
  short: 'bg-expense-soft text-expense',
  estimate: 'bg-primary-soft text-accent',
  nodata: 'bg-surface-2 text-muted',
};

const GoalList: React.FC = () => {
  const { goals, transactions, fixedExpenses, deleteGoal, restoreGoal, contributeToGoal } = useFinance();
  const { showToast } = useNotifications();
  const { t, money, month } = usePreferences();
  const [thisMonth] = useState(getCurrentMonth);
  const [editing, setEditing] = useState<SavingsGoal | null>(null);
  const [contributing, setContributing] = useState<SavingsGoal | null>(null);
  const [amount, setAmount] = useState('');

  const profile = useMemo(() => getSpendingProfile(transactions, thisMonth, fixedExpenses), [transactions, thisMonth, fixedExpenses]);
  const totalNeed = goals.reduce((sum, g) => sum + getMonthlyNeed(g, thisMonth), 0);

  const handleDelete = (goal: SavingsGoal) => {
    deleteGoal(goal.id);
    showToast({
      kind: 'success',
      message: t('goals.deleted'),
      actionLabel: t('common.undo'),
      onAction: () => restoreGoal(goal),
    });
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!contributing || isNaN(value) || value <= 0) return;
    contributeToGoal(contributing.id, value);
    showToast({
      kind: 'success',
      message: contributing.saved + value >= contributing.target ? t('goals.reached') : t('goals.contributed'),
    });
    setContributing(null);
    setAmount('');
  };

  const profileItems = [
    { label: t('goals.profileIncome'), value: profile.avgIncome, tone: 'text-income' },
    { label: t('goals.profileExpenses'), value: profile.avgExpenses, tone: 'text-expense' },
    { label: t('goals.profileSavings'), value: profile.avgSavings, tone: profile.avgSavings >= 0 ? 'text-accent' : 'text-expense' },
  ];

  return (
    <div className="space-y-3">
      {profile.monthsUsed > 0 && (
        <div className="card p-4">
          <h2 className="font-semibold">{t('goals.profileTitle')}</h2>
          <p className="text-xs text-subtle mb-3">{t('goals.profileBasis', { count: profile.monthsUsed })}</p>
          <div className="grid grid-cols-3 gap-2">
            {profileItems.map((item) => (
              <div key={item.label} className="min-w-0">
                <p className="text-xs text-muted">{item.label}</p>
                <p className={`text-sm sm:text-base font-bold tabular-nums break-words ${item.tone}`}>{money(item.value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <p className="card text-center text-subtle text-sm py-10 px-4">{t('goals.empty')}</p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 items-start">
          {goals.map((goal) => {
            const own = getMonthlyNeed(goal, thisMonth);
            const plan = planGoal(goal, profile, thisMonth, totalNeed - own);
            const pct = goal.target > 0 ? Math.min((goal.saved / goal.target) * 100, 100) : 0;

            return (
              <div key={goal.id} className="card p-4 min-w-0 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{goal.name}</p>
                    <span className={`inline-block mt-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[plan.status]}`}>
                      {t(`goals.status.${plan.status}` as TranslationKey)}
                    </span>
                  </div>
                  <div className="flex -mr-2">
                    <button onClick={() => setEditing(goal)} aria-label={t('common.edit')} className="icon-btn"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(goal)} aria-label={t('common.delete')} className="icon-btn hover:text-expense"><Trash2 size={15} /></button>
                  </div>
                </div>
                <div>
                  <div className="w-full bg-surface-2 rounded-full h-2.5 mb-1.5">
                    <div className="h-2.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between gap-3 text-xs text-muted tabular-nums">
                    <span>{t('goals.progress', { saved: money(goal.saved), target: money(goal.target) })}</span>
                    {plan.needed !== null && plan.status !== 'done' && (
                      <span className="text-right">
                        {t('goals.perMonth', { value: money(plan.needed) })} {t('goals.until', { month: month(goal.deadline ?? '') })}
                      </span>
                    )}
                  </div>
                </div>
                <GoalInsight plan={plan} />
                {plan.status !== 'done' && (
                  <button onClick={() => setContributing(goal)} className="btn-secondary w-full">
                    <PiggyBank size={16} /> {t('goals.contribute')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editing && <GoalForm onClose={() => setEditing(null)} editing={editing} />}
      {contributing && (
        <Modal title={t('goals.contributeTitle', { name: contributing.name })} onClose={() => setContributing(null)}>
          <form onSubmit={handleContribute} className="p-5 space-y-4">
            <label className="block">
              <span className="field-label">{t('tx.amount')}</span>
              <input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" min="0.01" required className="input" />
            </label>
            <button type="submit" className="btn-primary w-full">{t('goals.contribute')}</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default GoalList;
