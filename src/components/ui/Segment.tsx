import { cn } from '@/lib/cn'

export function Segment<T extends string>({
  value,
  onChange,
  options,
  className,
  size = 'md',
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; count?: number }[]
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex max-w-full flex-wrap items-center rounded-full bg-[#e8e8ed] p-[3px]',
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full font-semibold tracking-[-0.01em] transition-all duration-200 ease-[var(--ease-apple)]',
              size === 'sm' ? 'px-2.5 py-1 text-[12px]' : 'px-3.5 py-[7px] text-[13px]',
              active
                ? 'bg-white text-black shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.04)]'
                : 'text-[#3a3a3c] hover:text-black'
            )}
          >
            <span>{opt.label}</span>
            {typeof opt.count === 'number' && (
              <span
                className={cn(
                  'tabular-nums text-[11px] font-bold',
                  active
                    ? 'text-black/45'
                    : 'rounded-full bg-black/[0.06] px-1.5 py-0.5 text-black/55'
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function FilterGroup({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3', className)}>
      <div className="shrink-0 text-[12px] font-semibold tracking-[-0.01em] text-black/50 sm:w-[72px]">
        {label}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
