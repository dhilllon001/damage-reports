import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search
        size={16}
        strokeWidth={1.8}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-full border border-transparent bg-[#ececef] pl-10 pr-4 text-[13.5px] text-ink outline-none transition placeholder:text-ink-3 focus:border-accent/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,113,227,0.12)]"
      />
    </div>
  )
}
