import React, { useRef, useState } from 'react';
import { Download, Eraser, GraduationCap, Plus, RefreshCw, Trash2, Upload } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import { CURRENCIES } from '../../types';
import type { Category, Currency } from '../../types';
import { normalizeAppData } from '../../utils/appData';
import ConfirmDialog from '../UI/ConfirmDialog';
import PreferencePickers from '../UI/PreferencePickers';

const COLORS = ['#EF4444','#F59E0B','#10B981','#3B82F6','#8B5CF6','#EC4899','#14B8A6','#F97316','#6B7280'];
const ICONS = ['📦','🌟','🔧','🏋️','🎯','🎪','🎸','🍕','🍺','💻','🎓','🏆'];

interface PendingConfirm {
  title: string;
  body: string;
  label?: string;
  run: () => void;
}

const SalaryForm: React.FC<{ initial: string; onSubmit: (value: number) => void }> = ({ initial, onSubmit }) => {
  const { t } = usePreferences();
  const [value, setValue] = useState(initial);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed > 0) onSubmit(parsed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="number"
        inputMode="decimal"
        aria-label={t('settings.salaryPlaceholder')}
        placeholder={t('settings.salaryPlaceholder')}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        step="0.01"
        min="0.01"
        className="input flex-1"
      />
      <button type="submit" className="btn-primary">{t('settings.salarySet')}</button>
    </form>
  );
};

interface SettingsProps {
  onStartTutorial: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onStartTutorial }) => {
  const {
    setSalary, currentMonth, getSalaryForMonth,
    exportData, importData, resetData, clearData,
    customCategories, addCustomCategory, deleteCustomCategory,
  } = useFinance();
  const { showToast } = useNotifications();
  const { t, money, month, language, currency, setCurrency, userName, setUserName } = usePreferences();
  const currencyNames = new Intl.DisplayNames(language, { type: 'currency' });

  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [newCatColor, setNewCatColor] = useState('#F59E0B');
  const [newCatType, setNewCatType] = useState<Category['type']>('expense');
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentSalary = getSalaryForMonth(currentMonth);

  const handleSalary = (value: number) => {
    setSalary(currentMonth, value);
    showToast({ kind: 'success', message: t('settings.salarySaved') });
  };

  const handleExport = async () => {
    try {
      const result = await exportData();
      if (result === 'done') showToast({ kind: 'success', message: t('settings.exported') });
    } catch {
      showToast({ kind: 'error', message: t('settings.exportError') });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      parsed = null;
    }
    if (!normalizeAppData(parsed)) {
      showToast({ kind: 'error', message: t('settings.importError') });
      return;
    }
    setPending({
      title: t('settings.importTitle'),
      body: t('settings.importBody'),
      run: () => {
        importData(parsed);
        showToast({ kind: 'success', message: t('settings.imported') });
      },
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    addCustomCategory({ name, icon: newCatIcon, color: newCatColor, type: newCatType });
    setNewCatName('');
  };

  const dataAction = 'w-full flex items-center gap-3 p-3 border border-line rounded-xl text-sm font-medium text-left hover:bg-surface-2 transition-colors';

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-2 items-start">
      <div className="space-y-4 md:space-y-6 min-w-0">
        {/* Preferences */}
        <section className="card p-4 md:p-5">
          <h2 className="font-semibold mb-4">{t('settings.preferences')}</h2>
          <PreferencePickers />
          <label className="block mt-4">
            <span className="field-label">{t('settings.name')}</span>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} maxLength={30} className="input" />
          </label>
          <label className="block mt-4">
            <span className="field-label">{t('currency.label')}</span>
            <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="input">
              {CURRENCIES.map((code) => <option key={code} value={code}>{code} — {currencyNames.of(code)}</option>)}
            </select>
            <span className="block text-xs text-subtle mt-1.5">{t('currency.hint')}</span>
          </label>
        </section>

        {/* Salary */}
        <section className="card p-4 md:p-5">
          <h2 className="font-semibold mb-1">{t('settings.salary')}</h2>
          <p className="text-sm text-muted mb-3">
            {currentSalary > 0
              ? t('settings.salaryCurrent', { month: month(currentMonth), value: money(currentSalary) })
              : t('settings.salaryNone', { month: month(currentMonth) })}
          </p>
          <SalaryForm key={`${currentMonth}-${currentSalary}`} initial={currentSalary ? String(currentSalary) : ''} onSubmit={handleSalary} />
        </section>

        {/* Help */}
        <section className="card p-4 md:p-5">
          <h2 className="font-semibold mb-4">{t('settings.help')}</h2>
          <button onClick={onStartTutorial} className={dataAction}>
            <GraduationCap size={18} className="text-accent" />
            {t('settings.tutorial')}
          </button>
        </section>
      </div>

      <div className="space-y-4 md:space-y-6 min-w-0">
        {/* Custom Categories */}
        <section className="card p-4 md:p-5">
          <h2 className="font-semibold mb-4">{t('settings.categories')}</h2>
          <form onSubmit={handleAddCategory} className="space-y-3 mb-4">
            <input
              type="text"
              aria-label={t('settings.categoryName')}
              placeholder={t('settings.categoryName')}
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              required
              className="input"
            />
            <div className="grid grid-cols-2 gap-3">
              <label className="block min-w-0">
                <span className="field-label">{t('settings.categoryIcon')}</span>
                <select value={newCatIcon} onChange={(e) => setNewCatIcon(e.target.value)} className="input">
                  {ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </label>
              <label className="block min-w-0">
                <span className="field-label">{t('settings.categoryType')}</span>
                <select value={newCatType} onChange={(e) => setNewCatType(e.target.value as Category['type'])} className="input">
                  <option value="expense">{t('type.expense')}</option>
                  <option value="income">{t('type.income')}</option>
                  <option value="both">{t('type.both')}</option>
                </select>
              </label>
            </div>
            <div>
              <span className="field-label">{t('settings.categoryColor')}</span>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    aria-pressed={newCatColor === c}
                    onClick={() => setNewCatColor(c)}
                    className={`w-8 h-8 rounded-full ring-offset-2 ring-offset-surface ${newCatColor === c ? 'ring-2 ring-ink' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              <Plus size={16} /> {t('settings.categoryAdd')}
            </button>
          </form>
          {customCategories.length === 0 ? (
            <p className="text-sm text-subtle text-center py-2">{t('settings.categoryNone')}</p>
          ) : (
            <div className="space-y-2">
              {customCategories.map((c) => (
                <div key={c.id} className="flex items-center gap-3 pl-2 rounded-xl bg-surface-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: c.color + '30' }}>
                    {c.icon}
                  </div>
                  <span className="flex-1 min-w-0 truncate text-sm">{c.name}</span>
                  <button
                    onClick={() => setPending({
                      title: t('settings.categoryDeleteTitle'),
                      body: t('settings.categoryDeleteBody', { name: c.name }),
                      label: t('common.delete'),
                      run: () => deleteCustomCategory(c.id),
                    })}
                    aria-label={t('common.delete')}
                    className="icon-btn hover:text-expense"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Data management */}
        <section className="card p-4 md:p-5">
          <h2 className="font-semibold mb-4">{t('settings.data')}</h2>
          <div className="space-y-3">
            <button onClick={handleExport} className={dataAction}>
              <Download size={18} className="text-accent" />
              {t('settings.export')}
            </button>
            <button onClick={() => fileRef.current?.click()} className={dataAction}>
              <Upload size={18} className="text-income" />
              {t('settings.import')}
            </button>
            <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={handleImport} />
            <button
              onClick={() => setPending({
                title: t('settings.sampleTitle'),
                body: t('settings.sampleBody'),
                run: () => {
                  resetData();
                  showToast({ kind: 'success', message: t('settings.done') });
                },
              })}
              className={dataAction}
            >
              <RefreshCw size={18} className="text-warning" />
              {t('settings.sample')}
            </button>
            <button
              onClick={() => setPending({
                title: t('settings.clearTitle'),
                body: t('settings.clearBody'),
                label: t('common.delete'),
                run: () => {
                  clearData();
                  showToast({ kind: 'success', message: t('settings.done') });
                },
              })}
              className={`${dataAction} !border-expense/40 text-expense hover:bg-expense-soft`}
            >
              <Eraser size={18} />
              {t('settings.clear')}
            </button>
          </div>
        </section>
      </div>

      {pending && (
        <ConfirmDialog
          title={pending.title}
          body={pending.body}
          confirmLabel={pending.label}
          onConfirm={pending.run}
          onClose={() => setPending(null)}
        />
      )}
    </div>
  );
};

export default Settings;
