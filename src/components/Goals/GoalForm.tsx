import React, { useMemo, useState } from 'react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import type { SavingsGoal } from '../../types';
import { getCurrentMonth, shiftMonth } from '../../utils/formatters';
import { getMonthlyNeed, getSpendingProfile, monthsUntil, planGoal } from '../../utils/goalPlanner';
import Modal from '../UI/Modal';
import GoalInsight from './GoalInsight';

const ICONS = ['🎯', '🛟', '✈️', '🚗', '🏠', '💻', '🎓', '💍', '👶', '🏖️', '📱', '💰'];
const DEADLINES = [3, 6, 9, 12, 18, 24, 36, 48, 60];

interface GoalFormProps {
  onClose: () => void;
  editing?: SavingsGoal;
}

const GoalForm: React.FC<GoalFormProps> = ({ onClose, editing }) => {
  const { addGoal, editGoal, goals, transactions, fixedExpenses } = useFinance();
  const { showToast } = useNotifications();
  const { t } = usePreferences();
  const [thisMonth] = useState(getCurrentMonth);
  const [name, setName] = useState(editing?.name || '');
  const [icon, setIcon] = useState(editing?.icon || '🎯');
  const [target, setTarget] = useState(editing ? String(editing.target) : '');
  const [saved, setSaved] = useState(editing?.saved ? String(editing.saved) : '');
  const [months, setMonths] = useState(editing?.deadline ? String(monthsUntil(editing.deadline, thisMonth)) : '12');

  const deadlineOptions = [...new Set([...DEADLINES, ...(months ? [Number(months)] : [])])].sort((a, b) => a - b);
  const profile = useMemo(() => getSpendingProfile(transactions, thisMonth, fixedExpenses), [transactions, thisMonth, fixedExpenses]);

  const parsedTarget = parseFloat(target);
  const parsedSaved = parseFloat(saved) || 0;
  const deadline = months ? shiftMonth(thisMonth, Number(months)) : undefined;
  const reserved = goals
    .filter((g) => g.id !== editing?.id)
    .reduce((sum, g) => sum + getMonthlyNeed(g, thisMonth), 0);
  const preview = parsedTarget > 0
    ? planGoal({ target: parsedTarget, saved: parsedSaved, deadline }, profile, thisMonth, reserved)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || isNaN(parsedTarget) || parsedTarget <= 0) return;

    const data = { name: trimmed, icon, target: parsedTarget, saved: parsedSaved, deadline };
    if (editing) editGoal(editing.id, data);
    else addGoal(data);
    showToast({ kind: 'success', message: t('goals.created') });
    onClose();
  };

  return (
    <Modal title={t(editing ? 'goals.edit' : 'goals.new')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <label className="block min-w-0">
            <span className="field-label">{t('goals.name')}</span>
            <input type="text" value={name} placeholder={t('goals.namePlaceholder')} onChange={(e) => setName(e.target.value)} required className="input" />
          </label>
          <label className="block">
            <span className="field-label">{t('goals.icon')}</span>
            <select value={icon} onChange={(e) => setIcon(e.target.value)} className="input">
              {ICONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block min-w-0">
            <span className="field-label">{t('goals.target')}</span>
            <input type="number" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} step="0.01" min="0.01" required className="input" />
          </label>
          <label className="block min-w-0">
            <span className="field-label">{t('goals.saved')}</span>
            <input type="number" inputMode="decimal" value={saved} onChange={(e) => setSaved(e.target.value)} step="0.01" min="0" className="input" />
          </label>
        </div>
        <label className="block">
          <span className="field-label">{t('goals.deadline')}</span>
          <select value={months} onChange={(e) => setMonths(e.target.value)} className="input">
            <option value="">{t('goals.noDeadline')}</option>
            {deadlineOptions.map((count) => <option key={count} value={count}>{t('goals.months', { count })}</option>)}
          </select>
        </label>
        {preview && (
          <div className="rounded-xl border border-line p-3">
            <GoalInsight plan={preview} showActions={false} />
          </div>
        )}
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">{t('common.cancel')}</button>
          <button type="submit" className="btn-primary flex-1">{t(editing ? 'common.save' : 'common.add')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalForm;
