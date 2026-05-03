import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import type { Budget } from '../../types';

interface BudgetFormProps {
  onClose: () => void;
  editingBudget?: Budget;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onClose, editingBudget }) => {
  const { addBudget, editBudget, categories, currentMonth } = useFinance();
  const [categoryId, setCategoryId] = useState(editingBudget?.categoryId || '');
  const [limit, setLimit] = useState(editingBudget ? String(editingBudget.limit) : '');

  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'both');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit.replace(',', '.'));
    if (!categoryId || isNaN(parsedLimit) || parsedLimit <= 0) return;

    const budgetData = { categoryId, limit: parsedLimit, month: currentMonth };
    if (editingBudget) editBudget(editingBudget.id, budgetData);
    else addBudget(budgetData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold">{editingBudget ? 'Editar' : 'Nova'} Meta</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecionar categoria</option>
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Limite (R$)"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            step="0.01"
            min="0.01"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">{editingBudget ? 'Salvar' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
