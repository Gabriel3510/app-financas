import React, { useState } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import type { FixedExpense, TransactionType } from '../../types';
import { getMonthlyIncomeBase } from '../../utils/goalPlanner';
import { fixedType, isFixedActive } from '../../utils/calculations';
import { CategoryBadge } from '../UI/AppIcon';
import FixedForm from './FixedForm';

const FixedList: React.FC = () => {
  const { fixedExpenses, isFixedPaid, payFixed, deleteFixed, restoreFixed, getCategory, currentMonth, transactions } = useFinance();
  const { showToast } = useNotifications();
  const { t, money, month } = usePreferences();
  const [editing, setEditing] = useState<FixedExpense | null>(null);

  const active = fixedExpenses.filter((f) => isFixedActive(f, currentMonth)).sort((a, b) => a.day - b.day);
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
    const key = fixedType(fixed) === 'income' ? 'fixed.markedReceived' : 'fixed.markedPaid';
    showToast({ kind: 'success', message: t(key, { name: fixed.name }) });
  };

  if (active.length === 0) {
    return <p data-tour="fixed-list" className="card text-center text-subtle text-sm py-10 px-4">{t('fixed.empty')}</p>;
  }

  const section = (type: TransactionType) => {
    const items = active.filter((f) => fixedType(f) === type);
    if (items.length === 0) return null;
    const isIncome = type === 'income';
    const total = items.reduce((sum, f) => sum + f.amount, 0);
    const done = items.filter((f) => isFixedPaid(f.id, currentMonth)).reduce((sum, f) => sum + f.amount, 0);

    return (
      <section className="space-y-2">
        <h2 className="font-semibold px-1">{t(isIncome ? 'fixed.incomeTitle' : 'fixed.expenseTitle')}</h2>
        <div className="card p-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: t('fixed.total'), value: money(total), tone: '' },
              { label: t(isIncome ? 'fixed.received' : 'fixed.paid'), value: money(done), tone: 'text-income' },
              { label: t(isIncome ? 'fixed.toReceive' : 'fixed.pending'), value: money(total - done), tone: isIncome ? 'text-accent' : 'text-expense' },
            ].map((item) => (
              <div key={item.label} className="min-w-0">
                <p className="text-xs text-muted">{item.label}</p>
                <p className={`text-sm sm:text-base font-bold tabular-nums break-words ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>
          {!isIncome && income > 0 && (
            <p className="text-xs text-subtle mt-2">{t('fixed.share', { pct: ((total / income) * 100).toFixed(0) })}</p>
          )}
        </div>
        <div className="card divide-y divide-line overflow-hidden">
          {items.map((fixed) => {
            const cat = getCategory(fixed.categoryId);
            const isDone = isFixedPaid(fixed.id, currentMonth);
            return (
              <div key={fixed.id} className="flex items-center gap-3 pl-3 pr-1.5 py-2.5">
                <CategoryBadge icon={cat.icon} color={cat.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fixed.name}</p>
                  <p className="text-xs text-subtle tabular-nums truncate">
                    {t('fixed.dueDay', { day: fixed.day })} · <span className={isIncome ? 'text-income' : ''}>{isIncome ? '+' : ''}{money(fixed.amount)}</span>
                    {fixed.startMonth && ` · ${t('fixed.since', { month: month(fixed.startMonth) })}`}
                  </p>
                </div>
                {isDone ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-income px-2">
                    <Check size={14} /> {t(isIncome ? 'fixed.received' : 'fixed.paid')}
                  </span>
                ) : (
                  <button onClick={() => handlePay(fixed)} className="btn-secondary !min-h-[36px] !px-3 !py-1">
                    {t(isIncome ? 'fixed.receive' : 'fixed.pay')}
                  </button>
                )}
                <div className="flex flex-shrink-0">
                  <button onClick={() => setEditing(fixed)} aria-label={t('common.edit')} className="icon-btn !w-9 !h-9"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(fixed)} aria-label={t('common.delete')} className="icon-btn !w-9 !h-9 hover:text-expense"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div data-tour="fixed-list" className="space-y-5">
      {section('income')}
      {section('expense')}
      {editing && <FixedForm onClose={() => setEditing(null)} editing={editing} />}
    </div>
  );
};

export default FixedList;
