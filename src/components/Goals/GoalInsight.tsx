import React from 'react';
import { useFinance } from '../../contexts/finance';
import { useNotifications } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import { getCurrentMonth } from '../../utils/formatters';
import type { CategoryCut, GoalPlan } from '../../utils/goalPlanner';

interface GoalInsightProps {
  plan: GoalPlan;
  showActions?: boolean;
}

const GoalInsight: React.FC<GoalInsightProps> = ({ plan, showActions = true }) => {
  const { getCategory, setBudgetLimit } = useFinance();
  const { showToast } = useNotifications();
  const { t, money, month } = usePreferences();
  const { status, needed, capacity, gap, estimatedMonth, cuts } = plan;

  const message = () => {
    const values = { needed: money(needed ?? 0), capacity: money(capacity), gap: money(gap) };
    switch (status) {
      case 'done': return t('goals.reached');
      case 'nodata': return t('goals.insight.nodata');
      case 'ok': return t('goals.insight.ok', values);
      case 'tight': return t('goals.insight.tight', values);
      case 'estimate': return t('goals.insight.estimate', { ...values, month: month(estimatedMonth ?? '') });
      case 'short':
        return needed === null ? t('goals.insight.noCapacity') : t('goals.insight.short', values);
    }
  };

  const applyLimit = ({ categoryId, avg, cut }: CategoryCut) => {
    const limit = Math.max(1, Math.round(avg - cut));
    setBudgetLimit(categoryId, getCurrentMonth(), limit);
    showToast({ kind: 'success', message: t('goals.limitApplied', { value: money(limit), category: getCategory(categoryId).name }) });
  };

  return (
    <div className="text-sm text-muted space-y-2">
      <p>{message()}</p>
      {status === 'short' && needed !== null && estimatedMonth && (
        <p>{t('goals.insight.later', { month: month(estimatedMonth) })}</p>
      )}
      {cuts.length > 0 && (
        <div className="rounded-xl bg-surface-2 p-3">
          <p className="text-xs font-semibold text-ink mb-1.5">{t('goals.cutsTitle')}</p>
          <ul className="space-y-1.5">
            {cuts.map((item) => {
              const cat = getCategory(item.categoryId);
              return (
                <li key={item.categoryId} className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span className="flex-1 min-w-0 text-xs">
                    <span className="font-medium text-ink">{cat.name}.</span>{' '}
                    {t('goals.cutLine', { avg: money(item.avg), cut: money(item.cut) })}
                  </span>
                  {showActions && (
                    <button onClick={() => applyLimit(item)} className="text-xs font-semibold text-accent px-1.5 py-1 flex-shrink-0">
                      {t('goals.applyLimit')}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoalInsight;
