import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  Calculator,
  MoreHorizontal,
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Badge, severityTone, statusTone } from '@/components/ui/Badge'
import { Segment } from '@/components/ui/Segment'
import { SearchInput } from '@/components/ui/SearchInput'
import { NewReportModal } from '@/components/modals/NewReportModal'
import { EstimateDrawer } from '@/components/estimate/EstimateDrawer'
import { useStore } from '@/store/useStore'
import { formatCurrency, cn } from '@/lib/cn'
import type { DamageCategory, DamageReport, ReportStatus, UnitType } from '@/types'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

export function ReportsPage() {
  const reports = useStore((s) => s.reports)
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [unitType, setUnitType] = useState<'All' | UnitType>('All')
  const [category, setCategory] = useState<'All' | DamageCategory>('All')
  const [severity, setSeverity] = useState<'All' | string>('All')
  const [status, setStatus] = useState<'All' | ReportStatus>('All')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [newOpen, setNewOpen] = useState(false)
  const [estimateReport, setEstimateReport] = useState<DamageReport | null>(null)

  const stats = useMemo(() => {
    const count = (status?: ReportStatus) =>
      status ? reports.filter((r) => r.status === status).length : reports.length
    return [
      { label: 'All Reports', value: count() },
      { label: 'Draft', value: count('Draft') },
      { label: 'Initial', value: count('Initial') },
      { label: 'Investigation', value: count('Under Investigation') },
      { label: 'Under Repair', value: count('Under Repair') },
      { label: 'Invoiced', value: count('Invoiced') },
      { label: 'Discarded', value: count('Discarded') },
      { label: 'Closed', value: count('Closed') },
    ]
  }, [reports])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return reports.filter((r) => {
      if (unitType !== 'All' && r.unitType !== unitType) return false
      if (category !== 'All' && r.category !== category) return false
      if (severity !== 'All' && r.severity !== severity) return false
      if (status !== 'All' && r.status !== status) return false
      if (!q) return true
      return (
        r.id.includes(q) ||
        r.unitNo.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.reportedBy.toLowerCase().includes(q) ||
        (r.liableParty?.toLowerCase().includes(q) ?? false) ||
        (r.notes?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [reports, search, unitType, category, severity, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const slice = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize)
  const from = filtered.length === 0 ? 0 : safePage * pageSize + 1
  const to = Math.min((safePage + 1) * pageSize, filtered.length)

  const categoryCounts = useMemo(() => {
    const c = { Internal: 0, External: 0, Mechanical: 0, Tires: 0 }
    reports.forEach((r) => {
      c[r.category]++
    })
    return c
  }, [reports])

  const severityCounts = useMemo(() => {
    const c: Record<string, number> = { Critical: 0, Major: 0, Medium: 0, Minor: 0, High: 0, Low: 0 }
    reports.forEach((r) => {
      c[r.severity] = (c[r.severity] ?? 0) + 1
    })
    return c
  }, [reports])

  return (
    <AppShell search={search} onSearch={(v) => { setSearch(v); setPage(0) }} onNew={() => setNewOpen(true)}>
      <div className="mb-4 md:hidden">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(0) }} placeholder="Search reports…" />
      </div>

      <section className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
        {stats.map((s) => {
          const active =
            (s.label === 'All Reports' && status === 'All') ||
            (s.label === 'Investigation' && status === 'Under Investigation') ||
            s.label === status
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                if (s.label === 'All Reports') setStatus('All')
                else if (s.label === 'Investigation') setStatus('Under Investigation')
                else setStatus(s.label as ReportStatus)
                setPage(0)
              }}
              className={cn(
                'rounded-[14px] bg-white px-4 py-4 text-left transition duration-200',
                active
                  ? 'ring-2 ring-black shadow-[var(--shadow-rest)]'
                  : 'shadow-[var(--shadow-rest)] hover:shadow-[var(--shadow-hover)]'
              )}
            >
              <div className="text-[26px] font-extrabold leading-none tracking-[-0.05em] text-black">
                {s.value}
              </div>
              <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-3">
                {s.label}
              </div>
            </button>
          )
        })}
      </section>

      <section className="mb-4 rounded-[14px] bg-white p-4 shadow-[var(--shadow-rest)] lg:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-start lg:gap-x-8 lg:gap-y-4">
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-black">Unit Type</div>
              <Segment
                value={unitType}
                onChange={(v) => { setUnitType(v); setPage(0) }}
                options={[
                  { value: 'All', label: 'All' },
                  { value: 'Truck', label: 'Truck' },
                  { value: 'Trailer', label: 'Trailer' },
                ]}
              />
            </div>
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-black">Category</div>
              <Segment
                value={category}
                onChange={(v) => { setCategory(v); setPage(0) }}
                options={[
                  { value: 'All', label: 'All' },
                  { value: 'Internal', label: 'Internal', count: categoryCounts.Internal },
                  { value: 'External', label: 'External', count: categoryCounts.External },
                  { value: 'Mechanical', label: 'Mechanical', count: categoryCounts.Mechanical },
                  { value: 'Tires', label: 'Tires', count: categoryCounts.Tires },
                ]}
              />
            </div>
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-black">Severity</div>
              <Segment
                value={severity}
                onChange={(v) => { setSeverity(v); setPage(0) }}
                options={[
                  { value: 'All', label: 'All' },
                  { value: 'Critical', label: 'Critical', count: severityCounts.Critical },
                  { value: 'Major', label: 'Major', count: severityCounts.Major },
                  { value: 'High', label: 'High', count: severityCounts.High },
                  { value: 'Medium', label: 'Medium', count: severityCounts.Medium },
                  { value: 'Minor', label: 'Minor', count: severityCounts.Minor },
                ]}
              />
            </div>
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as 'All' | ReportStatus); setPage(0) }}
            className="h-9 shrink-0 rounded-[10px] border border-line bg-white px-3.5 text-[13px] font-semibold text-black outline-none focus:border-black"
          >
            <option value="All">Status: All</option>
            {(['Draft', 'Initial', 'Under Investigation', 'Under Repair', 'Invoiced', 'Closed'] as ReportStatus[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="hidden overflow-hidden rounded-[14px] bg-white shadow-[var(--shadow-rest)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px]">
            <thead>
              <tr className="border-b border-line">
                {[
                  'Damage ID',
                  'Date',
                  'Unit',
                  'Liable Party',
                  'Severity',
                  'Location',
                  'Status',
                  'Amount',
                  'Estimate Status',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="bg-[#fafafa] px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.04em] text-black"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-line/70 transition hover:bg-[#f7f7f8]"
                >
                  <td className="px-5 py-4">
                    <button
                      onClick={() => navigate(`/reports/${r.id}`)}
                      className="font-mono text-[13px] font-bold text-accent hover:underline"
                    >
                      #{r.id.slice(-8)}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[13px] font-medium text-black">
                    {format(new Date(r.date), 'dd MMM yy, h:mm a')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[13px] font-bold text-black">{r.unitType} {r.unitNo}</div>
                    <div className="mt-0.5 text-[12px] text-ink-3">{r.source}</div>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-medium text-black">{r.liableParty ?? '—'}</td>
                  <td className="px-5 py-4">
                    <Badge tone={severityTone(r.severity)}>{r.severity}</Badge>
                  </td>
                  <td className="max-w-[240px] px-5 py-4 text-[13px] font-medium text-black">
                    <span className="line-clamp-2">{r.location}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[13px] font-bold text-black">
                    {r.amount != null
                      ? formatCurrency(r.amount, r.currency ?? 'CAD')
                      : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={statusTone(r.workorder?.estimateStatus ?? 'Pending')}>
                      {r.workorder?.estimateStatus ?? 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => setEstimateReport(r)}
                      >
                        <Calculator size={14} strokeWidth={2} />
                        Estimate
                      </Button>
                      <button
                        onClick={() => navigate(`/reports/${r.id}`)}
                        className="rounded-full p-2 text-ink-3 hover:bg-black/[0.05] hover:text-black"
                        aria-label="More"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {slice.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-16 text-center text-[14px] font-medium text-ink-3">
                    No reports match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          from={from}
          to={to}
          total={filtered.length}
          page={safePage}
          pageCount={pageCount}
          pageSize={pageSize}
          onPage={setPage}
          onPageSize={(n) => { setPageSize(n); setPage(0) }}
        />
      </section>

      <section className="space-y-3 md:hidden">
        {slice.map((r) => (
          <article
            key={r.id}
            className="rounded-[14px] bg-white p-4 shadow-[var(--shadow-rest)]"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <button
                  onClick={() => navigate(`/reports/${r.id}`)}
                  className="font-mono text-[13px] font-bold text-accent"
                >
                  #{r.id.slice(-8)}
                </button>
                <div className="mt-1 text-[15px] font-bold text-black">
                  {r.unitType} {r.unitNo}
                </div>
              </div>
              <Badge tone={severityTone(r.severity)}>{r.severity}</Badge>
            </div>
            <div className="mb-3 space-y-1 text-[13px] font-medium text-black">
              <div>{format(new Date(r.date), 'dd MMM yyyy · h:mm a')}</div>
              <div className="line-clamp-2 text-ink-2">{r.location}</div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                <Badge tone={statusTone(r.workorder?.estimateStatus ?? 'Pending')}>
                  {r.workorder?.estimateStatus ?? 'Pending'}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="soft" className="flex-1" onClick={() => setEstimateReport(r)}>
                <Calculator size={14} /> Estimate
              </Button>
              <Button size="sm" variant="ghost" className="flex-1" onClick={() => navigate(`/reports/${r.id}`)}>
                Details
              </Button>
            </div>
          </article>
        ))}
        <div className="rounded-[14px] bg-white shadow-[var(--shadow-rest)]">
          <Pagination
            from={from}
            to={to}
            total={filtered.length}
            page={safePage}
            pageCount={pageCount}
            pageSize={pageSize}
            onPage={setPage}
            onPageSize={(n) => { setPageSize(n); setPage(0) }}
          />
        </div>
      </section>

      <NewReportModal open={newOpen} onClose={() => setNewOpen(false)} />
      <EstimateDrawer
        report={estimateReport}
        open={!!estimateReport}
        onClose={() => setEstimateReport(null)}
      />
    </AppShell>
  )
}

function Pagination({
  from,
  to,
  total,
  page,
  pageCount,
  pageSize,
  onPage,
  onPageSize,
}: {
  from: number
  to: number
  total: number
  page: number
  pageCount: number
  pageSize: number
  onPage: (p: number) => void
  onPageSize: (n: number) => void
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-[13px] font-medium text-black">
        {total.toLocaleString()} reports · showing {from}–{to}
      </div>
      <div className="flex items-center gap-3">
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          className="h-9 rounded-[10px] border border-line bg-white px-3 text-[13px] font-semibold text-black outline-none"
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          <button
            disabled={page <= 0}
            onClick={() => onPage(page - 1)}
            className="rounded-full p-2 text-black hover:bg-black/[0.05] disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[72px] text-center text-[13px] font-bold text-black">
            {page + 1} / {pageCount}
          </span>
          <button
            disabled={page >= pageCount - 1}
            onClick={() => onPage(page + 1)}
            className="rounded-full p-2 text-black hover:bg-black/[0.05] disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
