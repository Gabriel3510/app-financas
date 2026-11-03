import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TIP_COUNT } from '../i18n/translations';
import type { TranslationKey } from '../i18n/translations';
import { calculateMonthSummary, getBudgetLevel, getBudgetUsage, fixedType, isFixedActive } from '../utils/calculations';
import { getCurrentMonth } from '../utils/formatters';
import Toaster from '../components/UI/Toaster';
import { useFinance } from './finance';
import { usePreferences } from './preferences';
import { NotificationsContext } from './notifications';
import type { AppNotification, NotificationsContextType, Toast } from './notifications';

interface NotificationState {
  installedAt: string;
  read: string[];
  dismissed: string[];
  lastTipDay: number;
}

const createState = (): NotificationState => ({
  installedAt: new Date().toISOString(),
  read: [],
  dismissed: [],
  lastTipDay: -1,
});

const VISIBLE_TIPS = 3;
const TOAST_DURATION = 5000;

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, tutorialDone } = usePreferences();
  const { transactions, budgets, getCategory, fixedExpenses, isFixedPaid } = useFinance();
  const [state, setState] = useLocalStorage<NotificationState>('app-financas-notifications', createState);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [today] = useState(() => new Date());
  const [realMonth] = useState(getCurrentMonth);
  const nextToastId = useRef(1);

  const dayIndex = differenceInCalendarDays(today, parseISO(state.installedAt));

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = nextToastId.current++;
    setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((item) => item.id !== id)), TOAST_DURATION);
  }, []);

  const closeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Notifications are derived from the data, so they follow the language and vanish when no longer true
  const notifications = useMemo<AppNotification[]>(() => {
    const items: Omit<AppNotification, 'read'>[] = [];
    const message = (prefix: string): { title: string; body: string } => ({
      title: t(`notif.${prefix}.title` as TranslationKey),
      body: t(`notif.${prefix}.body` as TranslationKey),
    });

    const monthBudgets = budgets.filter((b) => b.month === realMonth);
    monthBudgets.forEach((budget) => {
      const pct = budget.limit > 0 ? (getBudgetUsage(transactions, budget, realMonth) / budget.limit) * 100 : 0;
      const level = getBudgetLevel(pct);
      if (level !== 'over' && level !== 'danger') return;
      const key = level === 'over' ? 'notif.budgetOver' : 'notif.budgetNear';
      items.push({
        id: `${level}-${realMonth}-${budget.categoryId}`,
        kind: 'alert',
        title: t(`${key}.title` as TranslationKey),
        body: t(`${key}.body` as TranslationKey, { category: getCategory(budget.categoryId).name, pct: pct.toFixed(0) }),
        page: 'limits',
      });
    });

    const summary = calculateMonthSummary(transactions, realMonth);
    if (summary.totalBalance < 0) {
      items.push({ id: `negative-${realMonth}`, kind: 'alert', ...message('negative'), page: 'dashboard' });
    }

    fixedExpenses
      .filter((f) => isFixedActive(f, realMonth) && fixedType(f) === 'expense' && f.day >= today.getDate() && f.day - today.getDate() <= 3 && !isFixedPaid(f.id, realMonth))
      .forEach((f) => items.push({
        id: `fixed-${realMonth}-${f.id}`,
        kind: 'info',
        title: t('notif.fixedDue.title'),
        body: t('notif.fixedDue.body', { name: f.name, day: f.day }),
        page: 'fixed',
      }));

    if (transactions.some((tx) => tx.sampleKey)) {
      items.push({ id: 'sample-data', kind: 'info', ...message('sample'), page: 'settings' });
    }
    if (!transactions.some((tx) => tx.date.startsWith(realMonth))) {
      items.push({ id: `no-tx-${realMonth}`, kind: 'info', ...message('noTx'), page: 'transactions' });
    }
    if (monthBudgets.length === 0) {
      items.push({ id: `no-budget-${realMonth}`, kind: 'info', ...message('noBudget'), page: 'limits' });
    }
    if (transactions.length > 0 && dayIndex >= 7) {
      items.push({ id: `backup-${realMonth}`, kind: 'info', ...message('backup'), page: 'settings' });
    }
    items.push({ id: 'welcome', kind: 'info', ...message('welcome') });
    items.push({ id: 'privacy', kind: 'info', ...message('privacy'), page: 'settings' });

    for (let day = dayIndex; day >= Math.max(0, dayIndex - VISIBLE_TIPS + 1); day--) {
      items.push({
        id: `tip-${day}`,
        kind: 'tip',
        title: t('notif.tipTitle'),
        body: t(`tip.${day % TIP_COUNT}` as TranslationKey),
      });
    }

    return items
      .filter((item) => !state.dismissed.includes(item.id))
      .map((item) => ({ ...item, read: state.read.includes(item.id) }));
  }, [t, transactions, budgets, fixedExpenses, isFixedPaid, today, realMonth, dayIndex, getCategory, state.read, state.dismissed]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    setState((prev) => (prev.read.includes(id) ? prev : { ...prev, read: [...prev.read, id] }));
  }, [setState]);

  const dismiss = useCallback((id: string) => {
    setState((prev) => ({ ...prev, dismissed: [...prev.dismissed, id] }));
  }, [setState]);

  const notificationIds = notifications.map((n) => n.id).join('|');

  const markAllRead = useCallback(() => {
    const ids = notificationIds.split('|');
    setState((prev) => ({ ...prev, read: [...new Set([...prev.read, ...ids])] }));
  }, [notificationIds, setState]);

  const dismissAll = useCallback(() => {
    const ids = notificationIds.split('|');
    setState((prev) => ({ ...prev, dismissed: [...new Set([...prev.dismissed, ...ids])] }));
  }, [notificationIds, setState]);

  // Pops a toast the moment a budget alert appears, e.g. right after saving an expense
  const knownAlerts = useRef<Set<string> | null>(null);
  useEffect(() => {
    const alerts = notifications.filter((n) => n.kind === 'alert');
    const firstRun = knownAlerts.current === null;
    const known = (knownAlerts.current ??= new Set());
    alerts.filter((n) => !known.has(n.id)).forEach((n) => {
      known.add(n.id);
      if (!firstRun && !n.read) showToast({ kind: 'warning', message: n.body });
    });
  }, [notifications, showToast]);

  // Shows the daily tip once per day, never on top of the tutorial
  useEffect(() => {
    if (!tutorialDone || state.lastTipDay === dayIndex) return;
    const timer = setTimeout(() => {
      showToast({ kind: 'tip', message: t(`tip.${dayIndex % TIP_COUNT}` as TranslationKey) });
      setState((prev) => ({ ...prev, lastTipDay: dayIndex }));
    }, 2500);
    return () => clearTimeout(timer);
  }, [tutorialDone, state.lastTipDay, dayIndex, showToast, setState, t]);

  const value = useMemo<NotificationsContextType>(() => ({
    notifications, unreadCount, markRead, markAllRead, dismiss, dismissAll, showToast,
  }), [notifications, unreadCount, markRead, markAllRead, dismiss, dismissAll, showToast]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onClose={closeToast} />
    </NotificationsContext.Provider>
  );
};
