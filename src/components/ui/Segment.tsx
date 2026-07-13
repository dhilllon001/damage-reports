import { cn } from '@/lib/cn'

export function Segment<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; count?: number }[]
  className?: string
}) {
  return (
    <div className={cn('inline-flex flex-wrap gap-0.5 rounded-[10px] bg-[#ebebed] p-0.5', className)}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold transition-all duration-200 ease-[var(--ease-apple)]',
              active
                ? 'bg-white text-black shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                : 'text-[#3a3a3c] hover:text-black'
            )}
          >
            {opt.label}
            {typeof opt.count === 'number' && (
              <span className={cn('ml-1.5 tabular-nums', active ? 'text-ink-3' : 'text-[#8e8e93]')}>
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
