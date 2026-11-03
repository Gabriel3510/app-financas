import React, { useRef, useState } from 'react';
import {
  addDays, addMonths, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek,
} from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import { DATE_LOCALES } from '../../utils/formatters';
import Sheet from './Sheet';

interface DatePickerProps {
  label: string;
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange }) => {
  const { t, language, date } = usePreferences();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => startOfMonth(parseISO(value)));
  const [today] = useState(() => new Date());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const locale = DATE_LOCALES[language];
  const selected = parseISO(value);

  const openPicker = () => {
    setView(startOfMonth(selected));
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const pick = (day: Date) => {
    onChange(format(day, 'yyyy-MM-dd'));
    close();
  };

  const gridStart = startOfWeek(view, { locale });
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-label={`${label}: ${date(value)}`}
        onClick={openPicker}
        className="input flex items-center justify-between gap-2 text-left"
      >
        <span className="truncate tabular-nums">{date(value)}</span>
        <CalendarDays size={16} className="text-subtle flex-shrink-0" />
      </button>

      {open && (
        <Sheet title={label} onClose={close}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => setView(addMonths(view, -1))} aria-label={t('month.previous')} className="icon-btn">
                <ChevronLeft size={20} />
              </button>
              <span className="font-semibold capitalize">{format(view, 'LLLL yyyy', { locale })}</span>
              <button type="button" onClick={() => setView(addMonths(view, 1))} aria-label={t('month.next')} className="icon-btn">
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {days.slice(0, 7).map((day) => (
                <span key={day.toISOString()} className="text-xs font-medium text-subtle uppercase py-1">
                  {format(day, 'EEEEE', { locale })}
                </span>
              ))}
              {days.map((day) => {
                const isSelected = isSameDay(day, selected);
                const isToday = isSameDay(day, today);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    data-autofocus={isSelected || undefined}
                    aria-label={format(day, 'PPPP', { locale })}
                    aria-pressed={isSelected}
                    onClick={() => pick(day)}
                    className={`h-10 rounded-xl text-sm tabular-nums transition-colors ${
                      isSelected
                        ? 'bg-primary text-on-primary font-bold'
                        : `hover:bg-surface-2 ${isSameMonth(day, view) ? '' : 'text-subtle/60'} ${isToday ? 'ring-1 ring-inset ring-accent font-semibold' : ''}`
                    }`}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => pick(today)} className="btn-secondary w-full mt-3">{t('date.today')}</button>
          </div>
        </Sheet>
      )}
    </>
  );
};

export default DatePicker;
