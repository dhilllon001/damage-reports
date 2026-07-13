import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Check,
  GitMerge,
  MapPin,
  Plus,
  Search,
  X,
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Badge, severityTone, statusTone } from '@/components/ui/Badge'
import { useStore } from '@/store/useStore'
import { buildDetailPhotos } from '@/data/reports'
import { formatCurrency, cn } from '@/lib/cn'
import type { DamageReport } from '@/types'

function ReportCompareCard({
  report,
  label,
  selected,
  onToggle,
  highlight,
}: {
  report: DamageReport
  label?: string
  selected?: boolean
  onToggle?: () => void
  highlight?: boolean
}) {
  const photos = buildDetailPhotos(report)
  return (
    <article
      className={cn(
        'overflow-hidden rounded-2xl border bg-white shadow-[var(--shadow-panel)] transition',
        highlight ? 'border-accent ring-2 ring-accent/20' : 'border-line',
        selected && 'border-purple ring-2 ring-purple/25'
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-line bg-[#f7f8fa] px-4 py-3">
        <div className="min-w-0">
          {label && (
            <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.05em] text-ink-3">
              {label}
            </div>
          )}
          <div className="font-mono text-[14px] font-bold text-black">#{report.id}</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge tone={severityTone(report.severity)}>{report.severity}</Badge>
            <Badge tone={statusTone(report.status)}>{report.status}</Badge>
          </div>
        </div>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold transition',
              selected
                ? 'bg-purple !text-white'
                : 'bg-white text-black shadow-[var(--shadow-rest)] hover:bg-[#f3f4f7]'
            )}
          >
            {selected ? <Check size={14} /> : <Plus size={14} />}
            {selected ? 'Added' : 'Add to compare'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1 bg-[#e8e9ed] p-1 sm:grid-cols-4">
        {photos.slice(0, 4).map((p) => (
          <img
            key={p.id}
            src={p.url}
            alt={p.caption}
            className="aspect-[4/3] w-full rounded-xl object-cover"
            loading="lazy"
          />
        ))}
      </div>

      <div className="space-y-2.5 p-4">
        <div className="text-[14px] font-bold text-black">
          {report.unitType} {report.unitNo}
        </div>
        <div className="flex items-start gap-1.5 text-[12.5px] text-ink-2">
          <MapPin size={14} className="mt-0.5 shrink-0 text-ink-3" />
          <span>{report.location}</span>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-[12.5px]">
          <div>
            <dt className="text-ink-3">Date</dt>
            <dd className="font-semibold text-black">
              {format(new Date(report.date), 'dd MMM yyyy')}
            </dd>
          </div>
          <div>
            <dt className="text-ink-3">Liable party</dt>
            <dd className="font-semibold text-black">{report.liableParty ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Driver</dt>
            <dd className="font-semibold text-black">{report.driver ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Amount</dt>
            <dd className="font-semibold text-black">
              {report.amount != null
                ? formatCurrency(report.amount, report.currency ?? 'CAD')
                : '—'}
            </dd>
          </div>
        </dl>
        <div className="rounded-xl bg-[#f3f4f7] px-3 py-2 text-[12.5px] text-ink-2">
          {report.description ?? report.notes ?? 'No description'}
        </div>
      </div>
    </article>
  )
}

export function CompareMergePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const reports = useStore((s) => s.reports)
  const current = reports.find((r) => r.id === id)

  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const candidates = useMemo(() => {
    if (!current) return []
    const q = query.trim().toLowerCase()
    return reports
      .filter((r) => r.id !== current.id)
      .filter((r) => {
        if (!q) return true
        return (
          r.id.includes(q) ||
          r.unitNo.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          (r.liableParty?.toLowerCase().includes(q) ?? false) ||
          (r.notes?.toLowerCase().includes(q) ?? false)
        )
      })
      .slice(0, 24)
  }, [reports, current, query])

  const selected = useMemo(
    () => selectedIds.map((sid) => reports.find((r) => r.id === sid)).filter(Boolean) as DamageReport[],
    [selectedIds, reports]
  )

  const toggle = (rid: string) => {
    setSelectedIds((prev) =>
      prev.includes(rid) ? prev.filter((x) => x !== rid) : [...prev, rid].slice(0, 3)
    )
  }

  if (!current) {
    return (
      <AppShell lockViewport>
        <div className="rounded-2xl bg-white p-10 text-center shadow-[var(--shadow-panel)]">
          <div className="text-[16px] font-bold">Report not found</div>
          <Link to="/" className="mt-3 inline-block text-accent">
            Back to reports
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell lockViewport>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <div className="shrink-0 rounded-2xl bg-white px-4 py-3.5 shadow-[var(--shadow-panel)] sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate(`/reports/${current.id}`)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f4f7] text-black transition hover:bg-[#e8e9ed]"
                aria-label="Back to detail"
              >
                <ArrowLeft size={18} />
              </button>
              <GitMerge size={18} className="text-accent" />
              <h1 className="text-[17px] font-bold tracking-[-0.02em] text-black">
                Compare & Merge
              </h1>
              <span className="font-mono text-[13px] font-semibold text-ink-3">
                Current #{current.id.slice(-8)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12.5px] font-semibold text-ink-3">
                {selected.length}/3 selected
              </span>
              <Button
                variant="purple"
                size="sm"
                disabled={selected.length === 0}
                onClick={() => navigate(`/reports/${current.id}`)}
              >
                Merge selected
              </Button>
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 overflow-hidden xl:grid-cols-[280px_1fr]">
          {/* Browse / add panel */}
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-panel)]">
            <div className="shrink-0 border-b border-line px-4 py-3">
              <div className="mb-2 text-[13px] font-bold text-black">Add damages to compare</div>
              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by ID, unit, location…"
                  className="h-9 w-full rounded-full border border-black/10 bg-[#f3f4f7] pl-9 pr-3 text-[13px] outline-none focus:border-accent focus:bg-white"
                />
              </div>
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
              {candidates.map((r) => {
                const active = selectedIds.includes(r.id)
                const thumb = buildDetailPhotos(r)[0]
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggle(r.id)}
                    className={cn(
                      'flex w-full gap-3 rounded-2xl border p-2.5 text-left transition',
                      active
                        ? 'border-purple bg-purple-soft/50'
                        : 'border-line bg-[#fafafb] hover:bg-[#f3f4f7]'
                    )}
                  >
                    <img
                      src={thumb.url}
                      alt=""
                      className="h-14 w-16 shrink-0 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[12px] font-bold text-black">
                        #{r.id.slice(-8)}
                      </div>
                      <div className="truncate text-[12px] font-semibold text-black">
                        {r.unitType} {r.unitNo}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Badge tone={severityTone(r.severity)}>{r.severity}</Badge>
                        <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                        active ? 'bg-purple text-white' : 'bg-white text-ink-3 shadow-[var(--shadow-rest)]'
                      )}
                    >
                      {active ? <Check size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                )
              })}
              {candidates.length === 0 && (
                <div className="px-2 py-8 text-center text-[13px] text-ink-3">
                  No matching damages found.
                </div>
              )}
            </div>
          </aside>

          {/* Comparison canvas */}
          <section className="min-h-0 overflow-y-auto rounded-2xl bg-[#f3f4f7] p-3 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] sm:p-4">
            <div
              className={cn(
                'grid gap-3',
                selected.length === 0 && 'grid-cols-1',
                selected.length === 1 && 'lg:grid-cols-2',
                selected.length >= 2 && 'lg:grid-cols-2 2xl:grid-cols-3'
              )}
            >
              <ReportCompareCard report={current} label="Current damage" highlight />

              {selected.map((r) => (
                <div key={r.id} className="relative">
                  <button
                    type="button"
                    onClick={() => toggle(r.id)}
                    className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-3 shadow-[var(--shadow-rest)] hover:text-black"
                    aria-label="Remove from compare"
                  >
                    <X size={14} />
                  </button>
                  <ReportCompareCard
                    report={r}
                    label="Comparing"
                    selected
                    onToggle={() => toggle(r.id)}
                  />
                </div>
              ))}

              {selected.length === 0 && (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-white px-6 text-center">
                  <Plus className="mb-2 text-ink-3" size={28} />
                  <div className="text-[15px] font-bold text-black">Add damages to compare</div>
                  <div className="mt-1 max-w-sm text-[13px] text-ink-3">
                    Pick reports from the left list. You can add up to 3 other damages and review photos, amounts, and details side by side.
                  </div>
                </div>
              )}
            </div>

            {selected.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-panel)]">
                <div className="border-b border-line bg-[#eef0f4] px-4 py-3 text-[13px] font-bold text-black">
                  Side-by-side summary
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-[12.5px]">
                    <thead>
                      <tr className="border-b border-line text-[11px] uppercase tracking-[0.04em] text-ink-3">
                        <th className="px-4 py-3">Field</th>
                        <th className="px-4 py-3">Current</th>
                        {selected.map((r) => (
                          <th key={r.id} className="px-4 py-3">
                            #{r.id.slice(-8)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        [
                          ['Unit', (r: DamageReport) => `${r.unitType} ${r.unitNo}`],
                          ['Severity', (r: DamageReport) => r.severity],
                          ['Status', (r: DamageReport) => r.status],
                          ['Liable party', (r: DamageReport) => r.liableParty ?? '—'],
                          [
                            'Amount',
                            (r: DamageReport) =>
                              r.amount != null
                                ? formatCurrency(r.amount, r.currency ?? 'CAD')
                                : '—',
                          ],
                          ['Location', (r: DamageReport) => r.location],
                          ['Notes', (r: DamageReport) => r.notes ?? r.description ?? '—'],
                        ] as const
                      ).map(([field, getter]) => (
                        <tr key={field} className="border-b border-line/70">
                          <td className="px-4 py-3 font-semibold text-ink-3">{field}</td>
                          <td className="px-4 py-3 font-medium text-black">{getter(current)}</td>
                          {selected.map((r) => (
                            <td key={r.id} className="px-4 py-3 font-medium text-black">
                              {getter(r)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  )
}
