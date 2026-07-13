import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Calculator,
  Clock3,
  GitMerge,
  MapPin,
  Plus,
  Wrench,
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Badge, severityTone, statusTone } from '@/components/ui/Badge'
import { Segment } from '@/components/ui/Segment'
import { EstimateDrawer } from '@/components/estimate/EstimateDrawer'
import { RepairActionModal } from '@/components/modals/RepairActionModal'
import { useStore } from '@/store/useStore'
import { TIMELINE } from '@/data/reports'
import { formatCurrency, toUsd } from '@/lib/cn'
import { cn } from '@/lib/cn'

type DetailTab = 'investigation' | 'finance' | 'photos' | 'repairs' | 'ai'

export function ReportDetailPage() {
  const { id } = useParams()
  const report = useStore((s) => s.reports.find((r) => r.id === id))
  const updateReport = useStore((s) => s.updateReport)
  const [tab, setTab] = useState<DetailTab>('finance')
  const [financeMode, setFinanceMode] = useState<'estimate' | 'invoice'>('estimate')
  const [estimateOpen, setEstimateOpen] = useState(false)
  const [repairOpen, setRepairOpen] = useState(false)

  const totals = useMemo(() => {
    if (!report) return { local: 0, usd: 0, cur: 'CAD' as const }
    const cur = report.estimateItems[0]?.currency ?? report.currency ?? 'CAD'
    const local = report.estimateItems.reduce((s, i) => s + i.quantity * i.unitCost, 0)
    const usd = report.estimateItems.reduce(
      (s, i) => s + toUsd(i.quantity * i.unitCost, i.currency),
      0
    )
    return { local, usd, cur }
  }, [report])

  if (!report) {
    return (
      <AppShell>
        <div className="rounded-[18px] bg-card p-10 text-center shadow-[var(--shadow-rest)]">
          <div className="text-[16px] font-bold">Report not found</div>
          <Link to="/" className="mt-3 inline-block text-accent">
            Back to reports
          </Link>
        </div>
      </AppShell>
    )
  }

  const events = TIMELINE[report.id] ?? [
    {
      id: 'fallback',
      date: report.date,
      title: 'Damage reported',
      description: report.description ?? 'Damage event recorded',
      type: 'damage' as const,
    },
  ]

  return (
    <AppShell>
      <div className="mb-5 flex flex-col gap-4 rounded-[20px] bg-[#1d1d1f] p-4 text-white shadow-[var(--shadow-hover)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <Link
            to="/"
            className="mt-0.5 rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="font-mono text-[15px] font-bold tracking-[-0.02em] text-white">
              #{report.id}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone={severityTone(report.severity)}>{report.severity}</Badge>
              <Badge tone={statusTone(report.status)}>{report.status}</Badge>
              {report.outOfService && <Badge tone="orange">Out of Service</Badge>}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" className="!border-white/20 !text-white hover:!bg-white/10">
            <GitMerge size={14} /> Compare / Merge
          </Button>
          <Button variant="danger" size="sm">
            Decline Damage
          </Button>
        </div>
      </div>

      <section className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-6">
        {[
          { label: 'Truck / Trailer', value: report.unitNo },
          { label: 'Driver', value: report.driver ?? '—' },
          { label: 'Reported by', value: report.reportedBy },
          { label: 'Location', value: report.location },
          {
            label: 'Estimated cost',
            value:
              totals.local > 0
                ? formatCurrency(totals.local, totals.cur)
                : report.amount != null
                  ? formatCurrency(report.amount, report.currency ?? 'CAD')
                  : '—',
            highlight: true,
          },
          { label: 'Assigned to', value: report.assignedTo ?? 'Unassigned' },
        ].map((item) => (
          <div
            key={item.label}
            className={cn(
              'rounded-[16px] bg-card px-4 py-3.5 shadow-[var(--shadow-rest)]',
              item.highlight && 'bg-amber-soft/60 ring-1 ring-amber/20'
            )}
          >
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-3">
              {item.label}
            </div>
            <div className="mt-1 line-clamp-2 text-[13.5px] font-semibold text-ink">
              {item.value}
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.05fr_1fr]">
        <section className="rounded-[20px] bg-card p-5 shadow-[var(--shadow-rest)]">
          <div className="mb-4 flex items-center gap-2">
            <Clock3 size={18} className="text-accent" />
            <h2 className="text-[16px] font-bold tracking-[-0.02em]">
              Damage Timeline for {report.unitType} {report.unitNo}
            </h2>
          </div>
          <div className="relative space-y-4 pl-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-line">
            {events.map((ev) => (
              <div key={ev.id} className="relative">
                <div className="absolute -left-4 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-accent bg-white" />
                <div className="rounded-[16px] border border-line p-4">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-semibold text-ink-3">
                      {format(new Date(ev.date), 'dd MMM · h:mm a')}
                    </span>
                    <Badge>{ev.type}</Badge>
                  </div>
                  <div className="text-[14px] font-bold text-ink">{ev.title}</div>
                  <div className="mt-1 flex items-start gap-1.5 text-[12.5px] text-ink-2">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-ink-3" />
                    {ev.description}
                  </div>
                  {report.description && (
                    <div className="mt-3 rounded-[12px] bg-[#f5f5f7] px-3 py-2 text-[13px] text-ink-2">
                      {report.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[20px] bg-card shadow-[var(--shadow-rest)]">
          <div className="flex flex-wrap gap-1 border-b border-line p-2">
            {(
              [
                ['investigation', 'Investigation'],
                ['finance', 'Finance'],
                ['photos', 'Photos & Docs'],
                ['repairs', 'Repairs'],
                ['ai', 'AI Analyzer'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  'rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition',
                  tab === key
                    ? 'bg-ink text-white'
                    : 'text-ink-3 hover:bg-black/[0.04] hover:text-ink-2'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {tab === 'finance' && (
              <div>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Segment
                    value={financeMode}
                    onChange={setFinanceMode}
                    options={[
                      { value: 'estimate', label: 'Estimate' },
                      { value: 'invoice', label: 'Invoice' },
                    ]}
                  />
                  <Button size="sm" onClick={() => setEstimateOpen(true)}>
                    <Plus size={14} /> Add Estimate Item
                  </Button>
                </div>

                {financeMode === 'estimate' ? (
                  report.estimateItems.length === 0 ? (
                    <div className="rounded-[16px] border border-dashed border-line-strong py-16 text-center">
                      <Calculator className="mx-auto mb-2 text-ink-3" size={24} />
                      <div className="text-[15px] font-bold text-ink-2">No estimate items added yet</div>
                      <div className="mt-1 text-[13px] text-ink-3">
                        Add your first estimate item to get started
                      </div>
                      <Button className="mt-4" size="sm" onClick={() => setEstimateOpen(true)}>
                        Open Estimate
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-[16px] border border-line">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px]">
                          <thead className="bg-[#fafafa] text-left text-[11px] uppercase tracking-[0.05em] text-ink-3">
                            <tr>
                              <th className="px-4 py-3">Description</th>
                              <th className="px-4 py-3">Qty</th>
                              <th className="px-4 py-3">Unit</th>
                              <th className="px-4 py-3">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.estimateItems.map((item) => (
                              <tr key={item.id} className="border-t border-line">
                                <td className="px-4 py-3 text-[13px] font-medium">{item.description}</td>
                                <td className="px-4 py-3 text-[13px]">{item.quantity}</td>
                                <td className="px-4 py-3 text-[13px]">
                                  {formatCurrency(item.unitCost, item.currency)}
                                </td>
                                <td className="px-4 py-3 text-[13px] font-semibold">
                                  {formatCurrency(item.quantity * item.unitCost, item.currency)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-center justify-between border-t border-line bg-[#fafafa] px-4 py-3 text-[13px]">
                        <span className="text-ink-3">
                          Currency: {totals.cur} · Rates USD/CAD 1.41 · USD/MXN 17.49
                        </span>
                        <span className="font-bold">
                          {formatCurrency(totals.local, totals.cur)} · {formatCurrency(totals.usd, 'USD')}
                        </span>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="rounded-[16px] border border-dashed border-line-strong py-16 text-center text-ink-3">
                    No invoices yet for this report.
                  </div>
                )}
              </div>
            )}

            {tab === 'investigation' && (
              <div className="rounded-[16px] border border-dashed border-line-strong py-14 text-center">
                <div className="text-[15px] font-bold text-ink-2">
                  {report.assignedTo ? 'Investigation ready' : 'Assignment required'}
                </div>
                <div className="mt-1 text-[13px] text-ink-3">
                  {report.assignedTo
                    ? `Assigned to ${report.assignedTo}`
                    : 'This report must be assigned before investigation can begin.'}
                </div>
                {!report.assignedTo && (
                  <Button
                    className="mt-4"
                    size="sm"
                    onClick={() => updateReport(report.id, { assignedTo: 'Aditika Verma' })}
                  >
                    Assign Report
                  </Button>
                )}
              </div>
            )}

            {tab === 'photos' && (
              <div>
                <div className="mb-3 text-[13px] text-ink-3">
                  {report.photos ?? 0} photo{(report.photos ?? 0) === 1 ? '' : 's'} · {report.documents.length} documents
                </div>
                <Button size="sm" onClick={() => setEstimateOpen(true)}>
                  Manage uploads in Estimate
                </Button>
              </div>
            )}

            {tab === 'repairs' && (
              <div className="text-center">
                <Wrench className="mx-auto mb-2 text-ink-3" size={24} />
                <div className="text-[15px] font-bold text-ink-2">Repair actions</div>
                <div className="mt-1 text-[13px] text-ink-3">
                  Move to terminal, vendor, tow, or schedule on-site repair.
                </div>
                <Button className="mt-4" size="sm" onClick={() => setRepairOpen(true)}>
                  Start Repair Action
                </Button>
              </div>
            )}

            {tab === 'ai' && (
              <div className="rounded-[16px] bg-[#f5f5f7] p-6 text-[13px] text-ink-2">
                AI Analyzer can summarize damage photos, suggest liable party, and draft estimate line items from uploaded documents.
              </div>
            )}
          </div>
        </section>
      </div>

      <EstimateDrawer
        report={report}
        open={estimateOpen}
        onClose={() => setEstimateOpen(false)}
      />
      <RepairActionModal open={repairOpen} onClose={() => setRepairOpen(false)} />
    </AppShell>
  )
}
