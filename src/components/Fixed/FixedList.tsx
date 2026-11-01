import React, { useState } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import type { FixedExpense } from '../../types';
import { getMonthlyIncomeBase } from '../../utils/goalPlanner';
import FixedForm from './FixedForm';

const FixedList: React.FC = () => {
  const { fixedExpenses, isFixedPaid, payFixed, deleteFixed, restoreFixed, getCategory, currentMonth, transactions } = useFinance();
  const { showToast } = useNotifications();
  const { t, money } = usePreferences();
  const [editing, setEditing] = useState<FixedExpense | null>(null);

  const sorted = [...fixedExpenses].sort((a, b) => a.day - b.day);
  const total = sorted.reduce((sum, f) => sum + f.amount, 0);
  const paid = sorted.filter((f) => isFixedPaid(f.id, currentMonth)).reduce((sum, f) => sum + f.amount, 0);
  const income = getMonthlyIncomeBase(transactions, currentMonth);

  const handleDelete = (fixed: FixedExpense) => {
    deleteFixed(fixed.id);
    showToast({
      kind: 'success',
      message: t('fixed.deleted'),
      actionLabel: t('common.undo'),
      onAction: () => restoreFixed(fixed),
    });
  };

  const handlePay = (fixed: FixedExpense) => {
    payFixed(fixed, currentMonth);
    showToast({ kind: 'success', message: t('fixed.markedPaid', { name: fixed.name }) });
  };

  if (sorted.length === 0) {
    return <p className="card text-center text-subtle text-sm py-10 px-4">{t('fixed.empty')}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t('fixed.total'), value: money(total), tone: '' },
            { label: t('fixed.paid'), value: money(paid), tone: 'text-income' },
            { label: t('fixed.pending'), value: money(total - paid), tone: 'text-expense' },
          ].map((item) => (
            <div key={item.label} className="min-w-0">
              <p className="text-xs text-muted">{item.label}</p>
              <p className={`text-sm sm:text-base font-bold tabular-nums break-words ${item.tone}`}>{item.value}</p>
            </div>
          ))}
        </div>
        {income > 0 && (
          <p className="text-xs text-subtle mt-2">{t('fixed.share', { pct: ((total / income) * 100).toFixed(0) })}</p>
        )}
      </div>
      <div className="card divide-y divide-line overflow-hidden">
        {sorted.map((fixed) => {
          const cat = getCategory(fixed.categoryId);
          const isPaid = isFixedPaid(fixed.id, currentMonth);
          return (
            <div key={fixed.id} className="flex items-center gap-3 pl-3 pr-1.5 py-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{ backgroundColor: cat.color + '20' }}>
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fixed.name}</p>
                <p className="text-xs text-subtle tabular-nums truncate">{t('fixed.dueDay', { day: fixed.day })} · {money(fixed.amount)}</p>
              </div>
              {isPaid ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-income px-2"><Check size={14} /> {t('fixed.paid')}</span>
              ) : (
                <button onClick={() => handlePay(fixed)} className="btn-secondary !min-h-[36px] !px-3 !py-1">{t('fixed.pay')}</button>
              )}
              <div className="flex flex-shrink-0">
                <button onClick={() => setEditing(fixed)} aria-label={t('common.edit')} className="icon-btn !w-9 !h-9"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(fixed)} aria-label={t('common.delete')} className="icon-btn !w-9 !h-9 hover:text-expense"><Trash2 size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>
      {editing && <FixedForm onClose={() => setEditing(null)} editing={editing} />}
    </div>
  );
};

export default FixedList;
