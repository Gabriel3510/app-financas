import React, { useRef, useState } from 'react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import { CURRENCIES } from '../../types';
import type { Currency, Transaction, TransactionType } from '../../types';
import { shiftDate } from '../../utils/calculations';
import { getRate } from '../../utils/exchange';
import { getCurrentMonth, getToday } from '../../utils/formatters';
import { CategoryBadge } from '../UI/AppIcon';
import DatePicker from '../UI/DatePicker';
import Modal from '../UI/Modal';
import Segmented from '../UI/Segmented';
import Select from '../UI/Select';

type Repeat = 'once' | 'installments' | 'monthly';

const INSTALLMENT_OPTIONS = Array.from({ length: 47 }, (_, i) => String(i + 2));

interface TransactionFormProps {
  onClose: () => void;
  editingTransaction?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, editingTransaction: editing }) => {
  const { addTransaction, addInstallments, addFixed, editTransaction, categories, currentMonth } = useFinance();
  const { showToast } = useNotifications();
  const { t, money, month, currency, language } = usePreferences();
  const [type, setType] = useState<TransactionType>(editing?.type || 'expense');
  const categoriesFor = (txType: TransactionType) => categories.filter((c) => c.type === txType || c.type === 'both');
  const filteredCategories = categoriesFor(type);
  const [description, setDescription] = useState(editing?.description || '');
  const [txCurrency, setTxCurrency] = useState<Currency>(editing?.original?.currency ?? currency);
  const [amount, setAmount] = useState(editing ? String(editing.original?.amount ?? editing.amount) : '');
  const [rate, setRate] = useState(editing?.original ? String(editing.original.rate) : '1');
  const [rateStatus, setRateStatus] = useState<'idle' | 'loading' | 'offline'>('idle');
  const latestCurrency = useRef(txCurrency);
  const [categoryId, setCategoryId] = useState(() => {
    const id = editing?.categoryId;
    return filteredCategories.some((c) => c.id === id) ? id! : filteredCategories[0]?.id || '';
  });
  const [date, setDate] = useState(editing?.date ?? (currentMonth === getCurrentMonth() ? getToday() : `${currentMonth}-01`));
  const [note, setNote] = useState(editing?.note || '');
  const [repeat, setRepeat] = useState<Repeat>('once');
  const [installments, setInstallments] = useState('2');

  const currencyNames = new Intl.DisplayNames(language, { type: 'currency' });
  const isForeign = txCurrency !== currency;
  const parsedAmount = parseFloat(amount);
  const parsedRate = parseFloat(rate);
  const converted = Math.round(parsedAmount * (isForeign ? parsedRate : 1) * 100) / 100;
  const count = Number(installments);
  const canRepeat = !editing;

  const changeType = (next: TransactionType) => {
    setType(next);
    if (next === 'income' && repeat === 'installments') setRepeat('once');
    const options = categoriesFor(next);
    if (!options.some((c) => c.id === categoryId)) setCategoryId(options[0]?.id || '');
  };

  const changeCurrency = async (code: Currency) => {
    setTxCurrency(code);
    latestCurrency.current = code;
    if (code === currency) {
      setRate('1');
      setRateStatus('idle');
      return;
    }
    setRateStatus('loading');
    const fetched = await getRate(code, currency);
    if (latestCurrency.current !== code) return;
    if (fetched) {
      setRate(String(Number(fetched.toFixed(6))));
      setRateStatus('idle');
    } else {
      setRate('');
      setRateStatus('offline');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed || !(converted > 0) || !categoryId || !date) return;

    const base = {
      description: trimmed,
      amount: converted,
      type,
      categoryId,
      date,
      note: note.trim() || undefined,
      original: isForeign ? { amount: parsedAmount, currency: txCurrency, rate: parsedRate } : undefined,
    };

    if (editing) {
      editTransaction(editing.id, base);
      showToast({ kind: 'success', message: t('tx.updated') });
    } else if (canRepeat && repeat === 'installments' && type === 'expense') {
      addInstallments(base, count);
      showToast({ kind: 'success', message: t('tx.addedInstallments', { count }) });
    } else if (canRepeat && repeat === 'monthly') {
      const fixedId = addFixed({
        name: trimmed,
        amount: converted,
        categoryId,
        day: Number(date.slice(8, 10)),
        type,
        startMonth: date.slice(0, 7),
      });
      addTransaction({ ...base, fixedId });
      showToast({ kind: 'success', message: t(type === 'income' ? 'tx.addedFixedIncome' : 'tx.addedFixed') });
    } else {
      addTransaction(base);
      showToast({ kind: 'success', message: t('tx.added') });
    }
    onClose();
  };

  return (
    <Modal title={t(editing ? 'tx.edit' : 'tx.new')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="flex gap-1 p-1 rounded-xl bg-surface-2">
          {(['expense', 'income'] as TransactionType[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={type === option}
              onClick={() => changeType(option)}
              className={`flex-1 min-h-[40px] rounded-lg text-sm font-medium transition-colors ${
                type === option
                  ? option === 'expense' ? 'bg-expense-soft text-expense shadow-sm' : 'bg-income-soft text-income shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {t(option === 'expense' ? 'type.expense' : 'type.income')}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="field-label">{t('tx.description')}</span>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required className="input" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block min-w-0">
            <span className="field-label">{t('tx.amount')}</span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              required
              className="input"
            />
          </label>
          <label className="block min-w-0">
            <span className="field-label">{t('tx.currency')}</span>
            <Select
              label={t('tx.currency')}
              value={txCurrency}
              onChange={(value) => void changeCurrency(value as Currency)}
              options={CURRENCIES.map((code) => ({ value: code, label: code === txCurrency ? code : `${code} — ${currencyNames.of(code)}` }))}
            />
          </label>
        </div>

        {isForeign && (
          <div className="rounded-xl bg-surface-2 p-3 space-y-2">
            <label className="block">
              <span className="field-label">{t('tx.rate', { from: txCurrency, to: currency })}</span>
              <input
                type="number"
                inputMode="decimal"
                value={rate}
                onChange={(e) => { setRate(e.target.value); setRateStatus('idle'); }}
                step="any"
                min="0"
                required
                className="input"
              />
            </label>
            <p className="text-xs text-muted">
              {rateStatus === 'loading' && t('tx.rateLoading')}
              {rateStatus === 'offline' && t('tx.rateOffline')}
              {rateStatus === 'idle' && converted > 0 && t('tx.converted', { value: money(converted) })}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <label className="block min-w-0">
            <span className="field-label">{t('tx.date')}</span>
            <DatePicker label={t('tx.date')} value={date} onChange={setDate} />
          </label>
          <label className="block min-w-0">
            <span className="field-label">{t('tx.category')}</span>
            <Select
              label={t('tx.category')}
              value={categoryId}
              onChange={setCategoryId}
              required
              options={filteredCategories.map((c) => ({ value: c.id, label: c.name, icon: <CategoryBadge icon={c.icon} color={c.color} size="sm" /> }))}
            />
          </label>
        </div>

        {canRepeat && (
          <div className="space-y-2">
            <span className="field-label">{t('tx.repeat')}</span>
            <Segmented
              label={t('tx.repeat')}
              value={repeat}
              onChange={setRepeat}
              options={[
                { value: 'once' as const, label: t('tx.repeat.once') },
                ...(type === 'expense' ? [{ value: 'installments' as const, label: t('tx.repeat.installments') }] : []),
                { value: 'monthly' as const, label: t('tx.repeat.monthly') },
              ]}
            />
            {repeat === 'installments' && (
              <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                <Select
                  label={t('tx.installments')}
                  value={installments}
                  onChange={setInstallments}
                  className="w-24"
                  options={INSTALLMENT_OPTIONS.map((value) => ({ value, label: `${value}x` }))}
                />
                <p className="text-xs text-muted">
                  {converted > 0 && t('tx.installmentsHint', {
                    count,
                    value: money(converted / count),
                    from: month(date.slice(0, 7)),
                    to: month(shiftDate(date, count - 1).slice(0, 7)),
                  })}
                </p>
              </div>
            )}
            {repeat === 'monthly' && (
              <p className="text-xs text-muted">{t('tx.monthlyHint', { month: month(date.slice(0, 7)) })}</p>
            )}
          </div>
        )}

        <label className="block">
          <span className="field-label">{t('tx.note')}</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="input resize-none" />
        </label>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">{t('common.cancel')}</button>
          <button type="submit" className="btn-primary flex-1">{t(editing ? 'common.save' : 'common.add')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionForm;
