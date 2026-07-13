import { cn } from '@/lib/cn'

const tones = {
  neutral: 'bg-[#e8e9ed] text-black shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]',
  blue: 'bg-accent-soft text-[#0058b0] shadow-[inset_0_0_0_1px_rgba(0,113,227,0.1)]',
  green: 'bg-green-soft text-[#0a7a3e] shadow-[inset_0_0_0_1px_rgba(10,122,62,0.1)]',
  orange: 'bg-orange-soft text-[#9a4d00] shadow-[inset_0_0_0_1px_rgba(184,92,0,0.1)]',
  red: 'bg-red-soft text-[#b80012] shadow-[inset_0_0_0_1px_rgba(215,0,21,0.1)]',
  amber: 'bg-amber-soft text-[#7a5200] shadow-[inset_0_0_0_1px_rgba(138,90,0,0.1)]',
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
  if (status === 'Draft' || status === 'Initial') return 'neutral'
  if (status === 'Under Investigation') return 'blue'
  if (status === 'Under Repair') return 'orange'
  if (status === 'Invoiced' || status === 'Closed' || status === 'Profit') return 'green'
  if (status === 'Discarded') return 'red'
  if (status.includes('Pending')) return 'amber'
  return 'neutral'
}
