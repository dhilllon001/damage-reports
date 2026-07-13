import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Calculator,
  Camera,
  Clock3,
  FileText,
  GitMerge,
  ImageIcon,
  MapPin,
  Plus,
  Sparkles,
  UserRound,
  Wrench,
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Badge, severityTone, statusTone } from '@/components/ui/Badge'
import { Segment } from '@/components/ui/Segment'
import { EstimateDrawer } from '@/components/estimate/EstimateDrawer'
import { RepairActionModal } from '@/components/modals/RepairActionModal'
import { useStore } from '@/store/useStore'
import {
  buildDetailPhotos,
  buildInvestigationNotes,
  buildInvoices,
  buildRepairJobs,
  buildTimeline,
} from '@/data/reports'
import { formatCurrency, toUsd, cn } from '@/lib/cn'

type DetailTab = 'investigation' | 'finance' | 'photos' | 'repairs' | 'ai'

export function ReportDetailPage() {
  const { id } = useParams()
  const report = useStore((s) => s.reports.find((r) => r.id === id))
  const updateReport = useStore((s) => s.updateReport)
  const [tab, setTab] = useState<DetailTab>('finance')
  const [financeMode, setFinanceMode] = useState<'estimate' | 'invoice'>('estimate')
  const [estimateOpen, setEstimateOpen] = useState(false)
  const [repairOpen, setRepairOpen] = useState(false)
  const [mergeOpen, setMergeOpen] = useState(false)

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

  const events = useMemo(() => (report ? buildTimeline(report) : []), [report])
  const photos = useMemo(() => (report ? buildDetailPhotos(report) : []), [report])
  const notes = useMemo(() => (report ? buildInvestigationNotes(report) : []), [report])
  const invoices = useMemo(() => (report ? buildInvoices(report) : []), [report])
  const repairs = useMemo(() => (report ? buildRepairJobs(report) : []), [report])

  if (!report) {
    return (
      <AppShell>
        <div className="rounded-2xl bg-white p-10 text-center shadow-[var(--shadow-panel)]">
          <div className="text-[16px] font-bold text-black">Report not found</div>
          <Link to="/" className="mt-3 inline-block text-accent">
            Back to reports
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mb-4 rounded-2xl bg-white px-4 py-3.5 shadow-[var(--shadow-panel)] sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2.5 sm:gap-3">
            <Link
              to="/"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f4f7] text-black transition hover:bg-[#e8e9ed]"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-mono text-[17px] font-bold tracking-[-0.02em] text-black">
              #{report.id}
            </h1>
            <Badge tone={severityTone(report.severity)}>{report.severity}</Badge>
            <Badge tone={statusTone(report.status)}>{report.status}</Badge>
            {report.outOfService && <Badge tone="orange">Out of Service</Badge>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMergeOpen((v) => !v)}
              className={cn(mergeOpen && 'border-accent bg-accent-soft text-accent')}
            >
              <GitMerge size={14} /> Compare / Merge
            </Button>
            <Button variant="danger" size="sm">
              Decline Damage
            </Button>
            <Button variant="purple" size="sm" onClick={() => setEstimateOpen(true)}>
              <Calculator size={14} /> Estimate
            </Button>
          </div>
        </div>

        {mergeOpen && (
          <div className="mt-3 rounded-2xl border border-line bg-[#f7f8fa] p-4">
            <div className="mb-2 text-[13px] font-bold text-black">Compare & Merge</div>
            <p className="mb-3 text-[12.5px] text-ink-3">
              Select another report for {report.unitNo} to compare photos, notes, and estimate lines before merging.
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-xl border border-line bg-white px-3 py-2 text-left text-[12.5px] shadow-[var(--shadow-rest)]">
                <div className="font-semibold text-black">#{String(Number(report.id) + 1).slice(-8)}</div>
                <div className="text-ink-3">Same unit · Draft</div>
              </button>
              <button className="rounded-xl border border-line bg-white px-3 py-2 text-left text-[12.5px] shadow-[var(--shadow-rest)]">
                <div className="font-semibold text-black">#{String(Number(report.id) + 2).slice(-8)}</div>
                <div className="text-ink-3">Nearby location · Initial</div>
              </button>
              <Button size="sm" variant="primary" className="ml-auto">
                Merge selected
              </Button>
            </div>
          </div>
        )}
      </div>

      <section className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-6">
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
              'rounded-2xl bg-white px-4 py-3.5 shadow-[var(--shadow-rest)]',
              item.highlight && 'bg-amber-soft/70 ring-1 ring-amber/15'
            )}
          >
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-3">
              {item.label}
            </div>
            <div className="mt-1 line-clamp-2 text-[13.5px] font-semibold text-black">
              {item.value}
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1fr]">
        <section className="rounded-2xl bg-white p-4 shadow-[var(--shadow-panel)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock3 size={18} className="text-accent" />
              <h2 className="text-[16px] font-bold tracking-[-0.02em] text-black">
                Damage Timeline
              </h2>
            </div>
            <span className="text-[12px] font-semibold text-ink-3">
              {report.unitType} {report.unitNo}
            </span>
          </div>

          <div className="relative space-y-4 pl-5 before:absolute before:bottom-3 before:left-[9px] before:top-3 before:w-px before:bg-line">
            {events.map((ev) => (
              <div key={ev.id} className="relative">
                <div className="absolute -left-5 top-2 h-3.5 w-3.5 rounded-full border-2 border-accent bg-white shadow-[var(--shadow-rest)]" />
                <article className="rounded-2xl border border-line bg-[#f7f8fa] p-4 shadow-[var(--shadow-rest)]">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-semibold text-ink-3">
                      {format(new Date(ev.date), 'dd MMM · h:mm a')}
                    </span>
                    <Badge>{ev.type}</Badge>
                  </div>
                  <div className="text-[14px] font-bold text-black">{ev.title}</div>
                  <p className="mt-1 text-[13px] text-ink-2">{ev.description}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-ink-3">
                    {ev.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} /> {ev.location}
                      </span>
                    )}
                    {ev.actor && (
                      <span className="inline-flex items-center gap-1">
                        <UserRound size={13} /> {ev.actor}
                      </span>
                    )}
                  </div>
                  {ev.images && ev.images.length > 0 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {ev.images.map((src) => (
                        <img
                          key={src}
                          src={src}
                          alt={ev.title}
                          className="h-24 w-36 shrink-0 rounded-xl object-cover shadow-[var(--shadow-rest)]"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
                </article>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-panel)]">
          <div className="flex flex-wrap gap-1 border-b border-line bg-[#f3f4f7] p-2">
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
                    ? 'bg-black !text-white shadow-[var(--shadow-rest)]'
                    : 'text-ink-3 hover:bg-white hover:text-black'
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
                  <Button size="sm" variant="purple" onClick={() => setEstimateOpen(true)}>
                    <Plus size={14} /> Add Estimate Item
                  </Button>
                </div>

                {financeMode === 'estimate' ? (
                  report.estimateItems.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line-strong bg-[#f7f8fa] py-14 text-center">
                      <Calculator className="mx-auto mb-2 text-purple" size={24} />
                      <div className="text-[15px] font-bold text-ink-2">No estimate items added yet</div>
                      <div className="mt-1 text-[13px] text-ink-3">
                        Add your first estimate item to get started
                      </div>
                      <Button className="mt-4" size="sm" variant="purple" onClick={() => setEstimateOpen(true)}>
                        Open Estimate
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-line shadow-[var(--shadow-rest)]">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px]">
                          <thead className="bg-[#eef0f4] text-left text-[11px] font-bold uppercase tracking-[0.05em] text-black">
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
                                <td className="px-4 py-3 text-[13px] font-medium text-black">{item.description}</td>
                                <td className="px-4 py-3 text-[13px] text-black">{item.quantity}</td>
                                <td className="px-4 py-3 text-[13px] text-black">
                                  {formatCurrency(item.unitCost, item.currency)}
                                </td>
                                <td className="px-4 py-3 text-[13px] font-semibold text-black">
                                  {formatCurrency(item.quantity * item.unitCost, item.currency)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-center justify-between border-t border-line bg-[#f3f4f7] px-4 py-3 text-[13px]">
                        <span className="text-ink-3">
                          Currency: {totals.cur} · Rates USD/CAD 1.41 · USD/MXN 17.49
                        </span>
                        <span className="font-bold text-black">
                          {formatCurrency(totals.local, totals.cur)} · {formatCurrency(totals.usd, 'USD')}
                        </span>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    {invoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-[#f7f8fa] px-4 py-3"
                      >
                        <div>
                          <div className="text-[13px] font-bold text-black">{inv.number}</div>
                          <div className="text-[12px] text-ink-3">
                            {format(new Date(inv.date), 'dd MMM yyyy')} · {inv.status}
                          </div>
                        </div>
                        <div className="text-[14px] font-bold text-black">
                          {formatCurrency(inv.amount, inv.currency)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'investigation' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#f7f8fa] px-4 py-3">
                  <div>
                    <div className="text-[13px] font-bold text-black">
                      {report.assignedTo ? `Assigned to ${report.assignedTo}` : 'Assignment required'}
                    </div>
                    <div className="text-[12px] text-ink-3">
                      Liable party: {report.liableParty ?? 'Pending'} · Source: {report.source}
                    </div>
                  </div>
                  {!report.assignedTo && (
                    <Button
                      size="sm"
                      onClick={() => updateReport(report.id, { assignedTo: 'Aditika Verma' })}
                    >
                      Assign Report
                    </Button>
                  )}
                </div>
                {notes.map((n) => (
                  <div key={n.id} className="rounded-2xl border border-line p-4 shadow-[var(--shadow-rest)]">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-bold text-black">{n.author}</span>
                      <Badge tone="blue">{n.status}</Badge>
                      <span className="text-[12px] text-ink-3">
                        {format(new Date(n.date), 'dd MMM · h:mm a')}
                      </span>
                    </div>
                    <p className="text-[13px] text-ink-2">{n.note}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'photos' && (
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-[13px] font-semibold text-black">
                    {photos.length} photos · {report.documents.length} documents
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setEstimateOpen(true)}>
                    <Camera size={14} /> Upload
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((p) => (
                    <figure key={p.id} className="overflow-hidden rounded-2xl bg-[#f3f4f7] shadow-[var(--shadow-rest)]">
                      <img src={p.url} alt={p.caption} className="h-36 w-full object-cover" loading="lazy" />
                      <figcaption className="px-3 py-2">
                        <div className="text-[12.5px] font-semibold text-black">{p.caption}</div>
                        <div className="text-[11px] text-ink-3">
                          {format(new Date(p.takenAt), 'dd MMM yyyy')}
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-dashed border-line-strong bg-[#f7f8fa] px-4 py-6 text-center">
                  <FileText className="mx-auto mb-2 text-ink-3" size={20} />
                  <div className="text-[13px] font-semibold text-black">Documents</div>
                  <div className="mt-1 text-[12px] text-ink-3">
                    Estimate PDFs, workorders, and liability forms appear here.
                  </div>
                </div>
              </div>
            )}

            {tab === 'repairs' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[13px] font-bold text-black">Repair jobs</div>
                  <Button size="sm" onClick={() => setRepairOpen(true)}>
                    <Wrench size={14} /> New Repair Action
                  </Button>
                </div>
                {repairs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3 shadow-[var(--shadow-rest)]"
                  >
                    <div>
                      <div className="text-[13px] font-bold text-black">{job.action}</div>
                      <div className="text-[12px] text-ink-3">
                        {job.vendor} · {job.scheduled}
                      </div>
                    </div>
                    <Badge tone="amber">{job.status}</Badge>
                  </div>
                ))}
              </div>
            )}

            {tab === 'ai' && (
              <div className="space-y-3">
                <div className="rounded-2xl bg-gradient-to-br from-[#f3e8ff] to-[#eef0f4] p-5 shadow-[var(--shadow-rest)]">
                  <div className="mb-2 flex items-center gap-2 text-[14px] font-bold text-black">
                    <Sparkles size={16} className="text-purple" /> AI Analyzer
                  </div>
                  <p className="text-[13px] text-ink-2">
                    Suggested liable party: <strong>{report.liableParty ?? 'CUSTOMER'}</strong>. Likely repair scope
                    matches “{report.notes ?? report.description ?? 'panel damage'}” with an estimated range of{' '}
                    {formatCurrency(report.amount ?? 4500, report.currency ?? 'CAD')}.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl border border-line p-4">
                    <ImageIcon size={16} className="mb-2 text-ink-3" />
                    <div className="text-[13px] font-bold text-black">Photo summary</div>
                    <div className="mt-1 text-[12.5px] text-ink-3">
                      {photos.length} images reviewed · impact concentrated on rear assembly
                    </div>
                  </div>
                  <div className="rounded-2xl border border-line p-4">
                    <Calculator size={16} className="mb-2 text-ink-3" />
                    <div className="text-[13px] font-bold text-black">Estimate draft</div>
                    <div className="mt-1 text-[12.5px] text-ink-3">
                      Suggested 1–2 line items for labor and replacement panels
                    </div>
                  </div>
                </div>
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
