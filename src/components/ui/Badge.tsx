import { cn } from '@/lib/cn'

const tones = {
  neutral: 'bg-[#e8e9ed] text-black shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]',
  black: 'bg-black text-white',
  blue: 'bg-accent text-white',
  green: 'bg-green text-white',
  orange: 'bg-orange text-white',
  red: 'bg-red text-white',
  amber: 'bg-amber text-white',
} as const

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[-0.01em]',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

export function severityTone(severity: string): keyof typeof tones {
  const s = severity.toLowerCase()
  if (s === 'critical' || s === 'high') return 'red'
  if (s === 'major') return 'orange'
  if (s === 'medium') return 'amber'
  return 'neutral'
}

export function statusTone(status: string): keyof typeof tones {
  if (status === 'Draft' || status === 'Initial') return 'black'
  if (status === 'Under Investigation') return 'blue'
  if (status === 'Under Repair') return 'orange'
  if (status === 'Invoiced' || status === 'Closed' || status === 'Profit') return 'green'
  if (status === 'Discarded') return 'red'
  if (status.includes('Pending')) return 'amber'
  return 'neutral'
}
