interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string; title?: string }[];
  onChange: (value: T) => void;
}

const Segmented = <T extends string>({ label, value, options, onChange }: SegmentedProps<T>) => (
  <div role="radiogroup" aria-label={label} className="flex gap-1 p-1 rounded-xl bg-surface-2">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        role="radio"
        aria-checked={value === option.value}
        title={option.title}
        onClick={() => onChange(option.value)}
        className={`flex-1 min-h-[38px] px-2 rounded-lg text-sm font-medium transition-colors ${
          value === option.value ? 'bg-surface text-accent shadow-sm' : 'text-muted hover:text-ink'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default Segmented;
