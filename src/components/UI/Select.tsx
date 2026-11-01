import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, X } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ label, value, options, onChange, placeholder, required, className = '' }) => {
  const { t } = usePreferences();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selected = options.find((option) => option.value === value);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const items = () => Array.from(listRef.current?.querySelectorAll('button') ?? []);
    const current = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"] button');
    (current ?? items()[0])?.focus();

    // Captured on window so Escape closes only this list, not the form behind it
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const list = items();
        const index = list.indexOf(document.activeElement as HTMLButtonElement);
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        list[(index + delta + list.length) % list.length]?.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  return (
    <div className={`relative min-w-0 ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${selected?.label ?? placeholder ?? ''}`}
        onClick={() => setOpen(true)}
        className="input flex items-center justify-between gap-2 text-left"
      >
        <span className={`truncate ${selected ? '' : 'text-subtle'}`}>{selected?.label ?? placeholder}</span>
        <ChevronDown size={16} className="text-subtle flex-shrink-0" />
      </button>
      {/* Keeps the browser's "required" validation, which a plain button does not have */}
      {required && (
        <input tabIndex={-1} aria-hidden="true" required value={value} onChange={() => undefined} className="absolute bottom-0 left-1/2 w-px h-px opacity-0" />
      )}

      {open && createPortal(
        <div
          className="fixed inset-0 z-[80] bg-black/50 flex items-end sm:items-center justify-center sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="bg-surface text-ink border border-line rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-xl flex flex-col max-h-[70dvh] pb-safe animate-rise">
            <div className="flex items-center justify-between pl-5 pr-3 py-2 border-b border-line">
              <h2 className="font-semibold truncate">{label}</h2>
              <button type="button" onClick={close} aria-label={t('common.close')} className="icon-btn"><X size={20} /></button>
            </div>
            <ul ref={listRef} role="listbox" aria-label={label} className="overflow-y-auto p-2">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li key={option.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => { onChange(option.value); close(); }}
                      className={`w-full min-h-[48px] flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                        isSelected ? 'bg-primary-soft font-semibold' : 'hover:bg-surface-2'
                      }`}
                    >
                      <span className="min-w-0">{option.label}</span>
                      {isSelected && <Check size={18} className="text-accent flex-shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};

export default Select;
