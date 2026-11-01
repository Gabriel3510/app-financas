import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  const { t } = usePreferences();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-surface border border-line rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl flex flex-col max-h-[92dvh] animate-rise"
      >
        <div className="flex items-center justify-between pl-5 pr-3 py-3 border-b border-line">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label={t('common.close')} className="icon-btn"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto pb-safe">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
