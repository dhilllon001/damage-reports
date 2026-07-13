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
    <div className={cn('inline-flex flex-wrap gap-1 rounded-full bg-[#ececef] p-1', className)}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-200 ease-[var(--ease-apple)]',
              active
                ? 'bg-white text-ink shadow-[var(--shadow-rest)]'
                : 'text-ink-3 hover:text-ink-2'
            )}
          >
            {opt.label}
            {typeof opt.count === 'number' && (
              <span className={cn('ml-1.5', active ? 'text-ink-3' : 'text-ink-3/80')}>
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
