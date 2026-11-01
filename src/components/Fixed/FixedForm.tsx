import React, { useState } from 'react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import type { FixedExpense } from '../../types';
import Modal from '../UI/Modal';
import Select from '../UI/Select';

interface FixedFormProps {
  onClose: () => void;
  editing?: FixedExpense;
}

const FixedForm: React.FC<FixedFormProps> = ({ onClose, editing }) => {
  const { addFixed, editFixed, categories } = useFinance();
  const { showToast } = useNotifications();
  const { t } = usePreferences();
  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'both');
  const [name, setName] = useState(editing?.name || '');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [categoryId, setCategoryId] = useState(editing?.categoryId || 'housing');
  const [day, setDay] = useState(editing ? String(editing.day) : '1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const trimmed = name.trim();
    if (!trimmed || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const data = { name: trimmed, amount: parsedAmount, categoryId, day: Number(day) };
    if (editing) editFixed(editing.id, data);
    else addFixed(data);
    showToast({ kind: 'success', message: t('fixed.saved') });
    onClose();
  };

  return (
    <Modal title={t(editing ? 'fixed.edit' : 'fixed.new')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <label className="block">
          <span className="field-label">{t('fixed.name')}</span>
          <input type="text" value={name} placeholder={t('fixed.namePlaceholder')} onChange={(e) => setName(e.target.value)} required className="input" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block min-w-0">
            <span className="field-label">{t('tx.amount')}</span>
            <input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" min="0.01" required className="input" />
          </label>
          <label className="block min-w-0">
            <span className="field-label">{t('fixed.day')}</span>
            <Select
              label={t('fixed.day')}
              value={day}
              onChange={setDay}
              options={Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
            />
          </label>
        </div>
        <label className="block">
          <span className="field-label">{t('tx.category')}</span>
          <Select
            label={t('tx.category')}
            value={categoryId}
            onChange={setCategoryId}
            options={expenseCategories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
          />
        </label>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">{t('common.cancel')}</button>
          <button type="submit" className="btn-primary flex-1">{t(editing ? 'common.save' : 'common.add')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default FixedForm;
