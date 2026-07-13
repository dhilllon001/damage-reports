import { cn } from '@/lib/cn'

/** Light pastel pills for a clean table look; blue uses solid fill + white text. */
const tones = {
  neutral: 'bg-[#f0f0f3] text-black',
  black: 'bg-[#ebebed] text-black',
  blue: 'bg-accent text-white',
  green: 'bg-green-soft text-green',
  orange: 'bg-orange-soft text-orange',
  red: 'bg-red-soft text-red',
  amber: 'bg-amber-soft text-amber',
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
