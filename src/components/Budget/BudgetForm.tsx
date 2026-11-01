import React, { useState } from 'react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import type { Budget } from '../../types';
import Modal from '../UI/Modal';
import Select from '../UI/Select';

interface BudgetFormProps {
  onClose: () => void;
  editingBudget?: Budget;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onClose, editingBudget }) => {
  const { addBudget, editBudget, budgets, categories, currentMonth } = useFinance();
  const { showToast } = useNotifications();
  const { t } = usePreferences();
  const [categoryId, setCategoryId] = useState(editingBudget?.categoryId || '');
  const [limit, setLimit] = useState(editingBudget ? String(editingBudget.limit) : '');

  const taken = new Set(
    budgets
      .filter((b) => b.month === currentMonth && b.id !== editingBudget?.id)
      .map((b) => b.categoryId)
  );
  const expenseCategories = categories.filter(
    (c) => (c.type === 'expense' || c.type === 'both') && !taken.has(c.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit);
    if (!categoryId || isNaN(parsedLimit) || parsedLimit <= 0) return;

    const budgetData = { categoryId, limit: parsedLimit, month: currentMonth };
    if (editingBudget) editBudget(editingBudget.id, budgetData);
    else addBudget(budgetData);
    showToast({ kind: 'success', message: t('budget.saved') });
    onClose();
  };

  return (
    <Modal title={t(editingBudget ? 'budget.edit' : 'budget.new')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <label className="block">
          <span className="field-label">{t('tx.category')}</span>
          <Select
            label={t('tx.category')}
            value={categoryId}
            onChange={setCategoryId}
            placeholder={t('budget.selectCategory')}
            required
            options={expenseCategories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
          />
        </label>
        <label className="block">
          <span className="field-label">{t('budget.limit')}</span>
          <input
            type="number"
            inputMode="decimal"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            step="0.01"
            min="0.01"
            required
            className="input"
          />
        </label>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">{t('common.cancel')}</button>
          <button type="submit" className="btn-primary flex-1">{t(editingBudget ? 'common.save' : 'common.add')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetForm;
