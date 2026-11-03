import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePreferences } from '../../contexts/preferences';
import { CURRENCIES } from '../../types';
import type { Currency } from '../../types';
import Logo from '../UI/Logo';
import { LanguagePicker, ThemePicker } from '../UI/PreferencePickers';
import Select from '../UI/Select';

const STEP_COUNT = 4;

const Onboarding: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { t, language, userName, setUserName, currency, setCurrency } = usePreferences();
  const [step, setStep] = useState(0);
  const name = userName.trim();
  const currencyNames = new Intl.DisplayNames(language, { type: 'currency' });
  const canContinue = step !== 1 || name.length > 0;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;
    if (step === 1) setUserName(name);
    if (step === STEP_COUNT - 1) onDone();
    else setStep(step + 1);
  };

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

        <div key={step} className="animate-rise" role="dialog" aria-label={t('onboarding.language.title')}>
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold mb-2">{t('onboarding.language.title')}</h2>
              <p className="text-sm text-muted mb-5">{t('welcome.body')}</p>
              <LanguagePicker />
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold mb-2">{t('onboarding.name.title')}</h2>
              <p className="text-sm text-muted mb-5">{t('onboarding.name.body')}</p>
              <label className="block">
                <span className="field-label">{t('onboarding.name')}</span>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} maxLength={30} required autoFocus className="input" />
              </label>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold mb-2">{t('onboarding.look.title', { name })}</h2>
              <p className="text-sm text-muted mb-5">{t('onboarding.look.body')}</p>
              <ThemePicker />
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-xl font-bold mb-2">{t('onboarding.currency.title')}</h2>
              <p className="text-sm text-muted mb-5">{t('onboarding.currency.body')}</p>
              <label className="block">
                <span className="field-label">{t('currency.label')}</span>
                <Select
                  label={t('currency.label')}
                  value={currency}
                  onChange={(value) => setCurrency(value as Currency)}
                  options={CURRENCIES.map((code) => ({ value: code, label: `${code} — ${currencyNames.of(code)}` }))}
                />
              </label>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary flex-1">{t('common.back')}</button>
          )}
          <button type="submit" disabled={!canContinue} className="btn-primary flex-1">
            {t(step === STEP_COUNT - 1 ? 'welcome.start' : 'common.next')}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export default Onboarding;
