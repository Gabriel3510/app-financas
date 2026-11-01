import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bell, Info, Lightbulb, X } from 'lucide-react';
import { useNotifications } from '../../contexts/notifications';
import type { AppNotification, NotificationKind } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';
import type { Page } from '../../types';

const KIND_STYLES: Record<NotificationKind, { icon: React.ReactNode; className: string }> = {
  alert: { icon: <AlertTriangle size={17} />, className: 'bg-warning-soft text-warning' },
  info: { icon: <Info size={17} />, className: 'bg-primary-soft text-accent' },
  tip: { icon: <Lightbulb size={17} />, className: 'bg-income-soft text-income' },
};

interface NotificationCenterProps {
  onNavigate: (page: Page) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onNavigate }) => {
  const { t } = usePreferences();
  const { notifications, unreadCount, markRead, markAllRead, dismiss, dismissAll } = useNotifications();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const openItem = (item: AppNotification) => {
    markRead(item.id);
    if (item.page) {
      onNavigate(item.page);
      setOpen(false);
    }
  };

  return (
    <div className="sm:relative">
      <button
        data-tour="notifications"
        onClick={() => setOpen((value) => !value)}
        aria-label={t('notif.open')}
        aria-expanded={open}
        className="hero-btn relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-expense text-white dark:text-canvas text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="card text-ink shadow-xl fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-[calc(3.25rem+env(safe-area-inset-top))] sm:top-12 sm:w-96 max-h-[calc(100dvh-10rem)] sm:max-h-[70dvh] flex flex-col animate-rise">
            <div className="px-4 py-3 border-b border-line flex items-center justify-between gap-2">
              <div>
                <h2 className="font-semibold">{t('notif.title')}</h2>
                {unreadCount > 0 && <p className="text-xs text-subtle">{t('notif.unread', { count: unreadCount })}</p>}
              </div>
              {notifications.length > 0 && (
                <button onClick={dismissAll} className="text-sm text-muted hover:text-ink px-2 py-1 rounded-lg">{t('notif.clear')}</button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="px-4 py-10 text-sm text-center text-subtle">{t('notif.empty')}</p>
            ) : (
              <ul className="overflow-y-auto divide-y divide-line">
                {notifications.map((item) => (
                  <li key={item.id} className={`flex items-start ${item.read ? '' : 'bg-primary-soft/50'}`}>
                    <button onClick={() => openItem(item)} className="flex-1 min-w-0 flex items-start gap-3 pl-4 pr-1 py-3 text-left">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${KIND_STYLES[item.kind].className}`}>
                        {KIND_STYLES[item.kind].icon}
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm ${item.read ? 'font-medium' : 'font-semibold'}`}>{item.title}</span>
                        <span className="block text-sm text-muted">{item.body}</span>
                      </span>
                    </button>
                    <button onClick={() => dismiss(item.id)} aria-label={t('notif.dismiss')} className="p-3 text-subtle hover:text-ink">
                      <X size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {unreadCount > 0 && (
              <button onClick={markAllRead} className="px-4 py-3 border-t border-line text-sm font-medium text-accent hover:bg-surface-2 rounded-b-2xl">
                {t('notif.markAll')}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
