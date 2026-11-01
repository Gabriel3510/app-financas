import { createContext, useContext } from 'react';
import type { Page } from '../types';

export type ToastKind = 'success' | 'error' | 'warning' | 'tip';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export type NotificationKind = 'alert' | 'info' | 'tip';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  page?: Page;
  read: boolean;
}

export interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

export const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const useNotifications = (): NotificationsContextType => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
