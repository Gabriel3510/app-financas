import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFinance } from '../../contexts/finance';
import { usePreferences } from '../../contexts/preferences';
import { CURRENCIES } from '../../types';
import type { Currency } from '../../types';
import { getCurrentMonth, getToday } from '../../utils/formatters';
import Logo from '../UI/Logo';
import PreferencePickers from '../UI/PreferencePickers';

const STEP_COUNT = 4;

const Onboarding: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { t, language, userName, setUserName, currency, setCurrency } = usePreferences();
  const { clearData, addTransaction, setSalary } = useFinance();
  const [step, setStep] = useState(0);
  const [start, setStart] = useState<'mine' | 'sample'>('mine');
  const [income, setIncome] = useState('');
  const name = userName.trim();
  const currencyNames = new Intl.DisplayNames(language, { type: 'currency' });

  const finish = () => {
    if (start === 'mine') {
      clearData();
      const amount = parseFloat(income);
      if (amount > 0) {
        setSalary(getCurrentMonth(), amount);
        addTransaction({
          description: t('cat.salary'),
          amount,
          type: 'income',
          categoryId: 'salary',
          date: getToday(),
        });
      }
    }
    onDone();
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    if (step === 0) setUserName(name);
    if (step === STEP_COUNT - 1) finish();
    else setStep(step + 1);
  };

  const startOption = (value: 'mine' | 'sample', title: string, hint: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={start === value}
      onClick={() => setStart(value)}
      className={`w-full text-left p-3 rounded-xl border-2 transition-colors ${start === value ? 'border-primary bg-primary-soft' : 'border-line'}`}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className="block text-xs text-muted">{hint}</span>
    </button>
  );

  return createPortal(
    <div className="fixed inset-0 z-[60] bg-canvas flex items-center justify-center p-4 overflow-y-auto">
      <form onSubmit={handleNext} className="card w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <Logo size={48} />
          <span className="text-xs font-medium text-subtle">{t('onboarding.step', { current: step + 1, total: STEP_COUNT })}</span>
        </div>
        <div className="flex gap-1.5 mb-5" aria-hidden="true">
          {Array.from({ length: STEP_COUNT }, (_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-surface-2'}`} />
          ))}
        </div>

        <div key={step} className="animate-rise" role="dialog" aria-label={t('welcome.title')}>
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold mb-2">{t('welcome.title')}</h2>
              <p className="text-sm text-muted mb-5">{t('welcome.body')}</p>
              <label className="block">
                <span className="field-label">{t('onboarding.name')}</span>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} maxLength={30} required className="input" />
              </label>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold mb-2">{t('onboarding.look.title', { name })}</h2>
              <p className="text-sm text-muted mb-5">{t('onboarding.look.body')}</p>
              <PreferencePickers />
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold mb-2">{t('onboarding.currency.title')}</h2>
              <p className="text-sm text-muted mb-5">{t('onboarding.currency.body')}</p>
              <label className="block">
                <span className="field-label">{t('currency.label')}</span>
                <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="input">
                  {CURRENCIES.map((code) => <option key={code} value={code}>{code} — {currencyNames.of(code)}</option>)}
                </select>
              </label>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-xl font-bold mb-2">{t('onboarding.start.title')}</h2>
              <p className="text-sm text-muted mb-5">{t('onboarding.start.body')}</p>
              <div role="radiogroup" aria-label={t('onboarding.start.title')} className="space-y-2">
                {startOption('mine', t('onboarding.mine'), t('onboarding.mineHint'))}
                {startOption('sample', t('onboarding.sample'), t('onboarding.sampleHint'))}
              </div>
              {start === 'mine' && (
                <label className="block mt-4">
                  <span className="field-label">{t('onboarding.income')}</span>
                  <input type="number" inputMode="decimal" value={income} onChange={(e) => setIncome(e.target.value)} step="0.01" min="0" className="input" />
                </label>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary flex-1">{t('common.back')}</button>
          )}
          <button type="submit" disabled={!name} className="btn-primary flex-1">
            {t(step === STEP_COUNT - 1 ? 'welcome.start' : 'common.next')}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export default Onboarding;
