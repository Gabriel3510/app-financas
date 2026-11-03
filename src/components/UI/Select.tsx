import React, { useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import Sheet from './Sheet';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
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
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((option) => option.value === value);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onListKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = Array.from(e.currentTarget.querySelectorAll('button'));
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    items[(index + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
  };

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
        <span className={`flex items-center gap-2 min-w-0 ${selected ? '' : 'text-subtle'}`}>
          {selected?.icon}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown size={16} className="text-subtle flex-shrink-0" />
      </button>
      {/* Keeps the browser's "required" validation, which a plain button does not have */}
      {required && (
        <input tabIndex={-1} aria-hidden="true" required value={value} onChange={() => undefined} className="absolute bottom-0 left-1/2 w-px h-px opacity-0" />
      )}

      {open && (
        <Sheet title={label} onClose={close}>
          <ul role="listbox" aria-label={label} onKeyDown={onListKey} className="overflow-y-auto p-2">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    data-autofocus={isSelected || undefined}
                    onClick={() => { onChange(option.value); close(); }}
                    className={`w-full min-h-[48px] flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                      isSelected ? 'bg-primary-soft font-semibold' : 'hover:bg-surface-2'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      {option.icon}
                      <span className="min-w-0">{option.label}</span>
                    </span>
                    {isSelected && <Check size={18} className="text-accent flex-shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </Sheet>
      )}
    </div>
  );
};

export default Select;
