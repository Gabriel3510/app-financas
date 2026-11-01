import React from 'react';
import { AlertTriangle, CheckCircle2, Lightbulb, X, XCircle } from 'lucide-react';
import type { Toast, ToastKind } from '../../contexts/notifications';
import { usePreferences } from '../../contexts/preferences';

const ICONS: Record<ToastKind, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-income" />,
  error: <XCircle size={18} className="text-expense" />,
  warning: <AlertTriangle size={18} className="text-warning" />,
  tip: <Lightbulb size={18} className="text-accent" />,
};

interface ToasterProps {
  toasts: Toast[];
  onClose: (id: number) => void;
}

const Toaster: React.FC<ToasterProps> = ({ toasts, onClose }) => {
  const { t } = usePreferences();

  return (
    <div
      aria-live="polite"
      className="fixed z-[70] left-4 right-4 bottom-above-nav md:left-auto md:right-6 md:bottom-6 md:w-96 flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="card shadow-lg pointer-events-auto flex items-center gap-3 pl-3.5 pr-1.5 py-1.5 animate-rise"
        >
          <span className="flex-shrink-0">{ICONS[toast.kind]}</span>
          <p className="flex-1 min-w-0 text-sm py-1.5">{toast.message}</p>
          {toast.actionLabel && (
            <button
              onClick={() => { toast.onAction?.(); onClose(toast.id); }}
              className="px-2.5 py-2 text-sm font-semibold text-accent rounded-lg hover:bg-primary-soft"
            >
              {toast.actionLabel}
            </button>
          )}
          <button onClick={() => onClose(toast.id)} aria-label={t('common.close')} className="p-2 text-subtle hover:text-ink rounded-lg">
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
