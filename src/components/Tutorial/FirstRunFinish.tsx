import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import { getCurrentMonth, getToday } from '../../utils/formatters';
import Logo from '../UI/Logo';

const FirstRunFinish: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { t, userName } = usePreferences();
  const { clearData, addTransaction, setSalary } = useFinance();
  const { showToast } = useNotifications();
  const [income, setIncome] = useState('');

  const startFresh = (e: React.FormEvent) => {
    e.preventDefault();
    clearData();
    const amount = parseFloat(income);
    if (amount > 0) {
      setSalary(getCurrentMonth(), amount);
      addTransaction({ description: t('cat.salary'), amount, type: 'income', categoryId: 'salary', date: getToday() });
    }
    showToast({ kind: 'success', message: t('finish.cleared') });
    onDone();
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <form onSubmit={startFresh} role="dialog" aria-modal="true" aria-label={t('finish.title', { name: userName })} className="card w-full max-w-md p-6 shadow-xl animate-rise">
        <Logo size={48} className="mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('finish.title', { name: userName.trim() })}</h2>
        <p className="text-sm text-muted mb-5">{t('finish.body')}</p>
        <label className="block">
          <span className="field-label">{t('onboarding.income')}</span>
          <input type="number" inputMode="decimal" value={income} onChange={(e) => setIncome(e.target.value)} step="0.01" min="0" className="input" />
        </label>
        <div className="flex flex-col gap-2 mt-6">
          <button type="submit" className="btn-primary w-full">{t('finish.clear')}</button>
          <button type="button" onClick={onDone} className="btn-secondary w-full">{t('finish.keep')}</button>
          <p className="text-xs text-subtle text-center">{t('finish.keepHint')}</p>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export default FirstRunFinish;
