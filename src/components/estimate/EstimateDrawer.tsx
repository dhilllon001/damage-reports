import { useMemo, useState } from 'react'
import {
  Calculator,
  FileText,
  Paperclip,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge, statusTone } from '@/components/ui/Badge'
import { Drawer } from '@/components/ui/Modal'
import { useStore } from '@/store/useStore'
import { formatBytes, formatCurrency, toUsd } from '@/lib/cn'
import type { DamageReport, EstimateItem } from '@/types'

export function EstimateDrawer({
  report,
  open,
  onClose,
}: {
  report: DamageReport | null
  open: boolean
  onClose: () => void
}) {
  const addEstimateItem = useStore((s) => s.addEstimateItem)
  const removeEstimateItem = useStore((s) => s.removeEstimateItem)
  const addDocument = useStore((s) => s.addDocument)
  const removeDocument = useStore((s) => s.removeDocument)
  const live = useStore((s) => s.reports.find((r) => r.id === report?.id)) ?? report

  const [tab, setTab] = useState<'items' | 'docs'>('items')
  const [desc, setDesc] = useState('')
  const [qty, setQty] = useState(1)
  const [unitCost, setUnitCost] = useState('')
  const [currency, setCurrency] = useState<'USD' | 'CAD' | 'MXN'>('CAD')

  const totals = useMemo(() => {
    if (!live) return { local: 0, usd: 0, cur: 'CAD' as const }
    const cur = live.estimateItems[0]?.currency ?? live.currency ?? 'CAD'
    const local = live.estimateItems.reduce((s, i) => s + i.quantity * i.unitCost, 0)
    const usd = live.estimateItems.reduce(
      (s, i) => s + toUsd(i.quantity * i.unitCost, i.currency),
      0
    )
    return { local, usd, cur }
  }, [live])

  if (!live) return null

  const addItem = () => {
    const cost = Number(unitCost)
    if (!desc.trim() || !cost || cost <= 0) return
    const item: EstimateItem = {
      id: `ei-${Date.now()}`,
      description: desc.trim(),
      quantity: qty,
      unitCost: cost,
      currency,
    }
    addEstimateItem(live.id, item)
    setDesc('')
    setQty(1)
    setUnitCost('')
  }

  const onUpload = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      addDocument(live.id, {
        id: `doc-${Date.now()}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type || 'file',
        uploadedAt: new Date().toISOString(),
      })
    })
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Damage Estimate"
      subtitle={`${live.unitType} ${live.unitNo} · #${live.id.slice(-8)}`}
      footer={
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-3">
              Estimate total
            </div>
            <div className="text-[18px] font-extrabold tracking-[-0.03em] text-ink">
              {formatCurrency(totals.local, totals.cur)}
            </div>
            <div className="text-[12px] text-ink-3">
              ≈ {formatCurrency(totals.usd, 'USD')} USD
            </div>
          </div>
          <Button onClick={onClose}>Done</Button>
        </div>
      }
    >
      <div className="mb-5 rounded-[16px] bg-[#f5f5f7] p-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge tone={statusTone(live.status)}>{live.status}</Badge>
          <Badge tone={statusTone(live.workorder?.estimateStatus ?? 'Pending')}>
            {live.workorder?.estimateStatus ?? 'Pending'}
          </Badge>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-[12.5px]">
          <div>
            <dt className="text-ink-3">Liable party</dt>
            <dd className="font-semibold text-ink">{live.liableParty ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Requested by</dt>
            <dd className="font-semibold text-ink">{live.requestedBy ?? live.reportedBy}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Notes</dt>
            <dd className="font-semibold text-ink">{live.notes ?? live.description ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Location</dt>
            <dd className="font-semibold text-ink line-clamp-2">{live.location}</dd>
          </div>
        </dl>
      </div>

      <div className="mb-4 inline-flex rounded-full bg-[#ececef] p-1">
        <button
          onClick={() => setTab('items')}
          className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${
            tab === 'items' ? 'bg-white text-ink shadow-[var(--shadow-rest)]' : 'text-ink-3'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <Calculator size={14} /> Line items
          </span>
        </button>
        <button
          onClick={() => setTab('docs')}
          className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${
            tab === 'docs' ? 'bg-white text-ink shadow-[var(--shadow-rest)]' : 'text-ink-3'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <Paperclip size={14} /> Documents
          </span>
        </button>
      </div>

      {tab === 'items' ? (
        <div className="space-y-4">
          <div className="rounded-[16px] border border-line p-4">
            <div className="mb-3 text-[13px] font-bold text-ink">Add estimate item</div>
            <div className="space-y-2.5">
              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description (e.g. 25 Panel and 25 Post)"
                className="h-10 w-full rounded-[12px] border border-line bg-white px-3 text-[13px] outline-none focus:border-accent"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value) || 1)}
                  className="h-10 rounded-[12px] border border-line px-3 text-[13px] outline-none focus:border-accent"
                  placeholder="Qty"
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                  className="h-10 rounded-[12px] border border-line px-3 text-[13px] outline-none focus:border-accent"
                  placeholder="Unit cost"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'USD' | 'CAD' | 'MXN')}
                  className="h-10 rounded-[12px] border border-line px-3 text-[13px] outline-none focus:border-accent"
                >
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>
              <Button size="sm" onClick={addItem} className="w-full">
                <Plus size={15} /> Add listing
              </Button>
            </div>
          </div>

          {live.estimateItems.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-line-strong py-12 text-center">
              <Calculator className="mx-auto mb-2 text-ink-3" size={22} />
              <div className="font-semibold text-ink-2">No estimate items yet</div>
              <div className="mt-1 text-[12.5px] text-ink-3">
                Add your first line item to start the estimate
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {live.estimateItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-[14px] border border-line px-3.5 py-3"
                >
                  <div>
                    <div className="text-[13px] font-semibold text-ink">{item.description}</div>
                    <div className="text-[12px] text-ink-3">
                      {item.quantity} × {formatCurrency(item.unitCost, item.currency)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[13px] font-bold text-ink">
                      {formatCurrency(item.quantity * item.unitCost, item.currency)}
                    </div>
                    <button
                      onClick={() => removeEstimateItem(live.id, item.id)}
                      className="rounded-full p-1.5 text-ink-3 hover:bg-red-soft hover:text-red"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {live.workorder && (
            <div className="rounded-[16px] border border-line p-4">
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.05em] text-ink-3">
                Workorder info
              </div>
              <div className="grid grid-cols-2 gap-2 text-[12.5px]">
                <div>
                  <div className="text-ink-3">Workorder</div>
                  <div className="font-semibold">{live.workorder.workorder ?? '—'}</div>
                </div>
                <div>
                  <div className="text-ink-3">Cost</div>
                  <div className="font-semibold">
                    {live.workorder.cost != null
                      ? formatCurrency(live.workorder.cost, live.workorder.currency ?? 'CAD')
                      : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-ink-3">Potential revenue (USD)</div>
                  <div className="font-semibold">
                    {live.workorder.potentialRevenueUsd != null
                      ? formatCurrency(live.workorder.potentialRevenueUsd, 'USD')
                      : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-ink-3">Estimate status</div>
                  <Badge tone={statusTone(live.workorder.estimateStatus)}>
                    {live.workorder.estimateStatus}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-line-strong bg-[#fafafa] px-4 py-10 transition hover:border-accent hover:bg-accent-soft/40">
            <Upload className="mb-2 text-accent" size={22} />
            <div className="text-[13px] font-semibold text-ink">Click to upload or drag documents</div>
            <div className="mt-1 text-[12px] text-ink-3">PDF, PNG, JPG, XLSX up to 10MB</div>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => onUpload(e.target.files)}
            />
          </label>

          {live.documents.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-ink-3">No documents uploaded yet</div>
          ) : (
            <ul className="space-y-2">
              {live.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-3 rounded-[14px] border border-line px-3.5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent-soft text-accent">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-ink">{doc.name}</div>
                      <div className="text-[11.5px] text-ink-3">{formatBytes(doc.size)}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDocument(live.id, doc.id)}
                    className="rounded-full p-1.5 text-ink-3 hover:bg-red-soft hover:text-red"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Drawer>
  )
}
