import React, { useState } from 'react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import type { Transaction, TransactionType } from '../../types';
import { getCurrentMonth, getToday } from '../../utils/formatters';
import Modal from '../UI/Modal';

interface TransactionFormProps {
  onClose: () => void;
  editingTransaction?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, editingTransaction }) => {
  const { addTransaction, editTransaction, categories, currentMonth } = useFinance();
  const { showToast } = useNotifications();
  const { t } = usePreferences();
  const [type, setType] = useState<TransactionType>(editingTransaction?.type || 'expense');
  const categoriesFor = (txType: TransactionType) => categories.filter((c) => c.type === txType || c.type === 'both');
  const filteredCategories = categoriesFor(type);
  const [description, setDescription] = useState(editingTransaction?.description || '');
  const [amount, setAmount] = useState(editingTransaction ? String(editingTransaction.amount) : '');
  const [categoryId, setCategoryId] = useState(() => {
    const id = editingTransaction?.categoryId;
    return filteredCategories.some((c) => c.id === id) ? id! : filteredCategories[0]?.id || '';
  });
  const [date, setDate] = useState(
    editingTransaction?.date ?? (currentMonth === getCurrentMonth() ? getToday() : `${currentMonth}-01`)
  );
  const [note, setNote] = useState(editingTransaction?.note || '');

  const changeType = (next: TransactionType) => {
    setType(next);
    const options = categoriesFor(next);
    if (!options.some((c) => c.id === categoryId)) setCategoryId(options[0]?.id || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const trimmed = description.trim();
    if (!trimmed || isNaN(parsedAmount) || parsedAmount <= 0 || !categoryId || !date) return;

    const txData = {
      description: trimmed,
      amount: parsedAmount,
      type,
      categoryId,
      date,
      note: note.trim() || undefined,
    };

    if (editingTransaction) {
      editTransaction(editingTransaction.id, txData);
    } else {
      addTransaction(txData);
    }
    showToast({ kind: 'success', message: t(editingTransaction ? 'tx.updated' : 'tx.added') });
    onClose();
  };

  return (
    <Modal title={t(editingTransaction ? 'tx.edit' : 'tx.new')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Type toggle */}
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
              {option === 'expense' ? `↓ ${t('type.expense')}` : `↑ ${t('type.income')}`}
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
            <span className="field-label">{t('tx.date')}</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input" />
          </label>
        </div>

        <label className="block">
          <span className="field-label">{t('tx.category')}</span>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="input">
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="field-label">{t('tx.note')}</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="input resize-none" />
        </label>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">{t('common.cancel')}</button>
          <button type="submit" className="btn-primary flex-1">{t(editingTransaction ? 'common.save' : 'common.add')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionForm;
