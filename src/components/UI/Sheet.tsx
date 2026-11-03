import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';

interface SheetProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

// Bottom sheet on phones, centered panel on larger screens. Used by pickers that sit on top of forms.
const Sheet: React.FC<SheetProps> = ({ title, onClose, children }) => {
  const { t } = usePreferences();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    (panel?.querySelector<HTMLElement>('[data-autofocus]') ?? panel?.querySelector<HTMLElement>('button'))?.focus();

    // Captured on window so Escape closes only the sheet, not the form behind it
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      closeRef.current();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey, true);
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[80] bg-black/50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-surface text-ink border border-line rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-xl flex flex-col max-h-[75dvh] pb-safe animate-rise"
      >
        <div className="flex items-center justify-between pl-5 pr-3 py-2 border-b border-line">
          <h2 className="font-semibold truncate">{title}</h2>
          <button type="button" onClick={onClose} aria-label={t('common.close')} className="icon-btn"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Sheet;
