import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Segment } from '@/components/ui/Segment'
import { DAMAGE_TYPES } from '@/data/reports'
import { useStore } from '@/store/useStore'
import type { DamageCategory, DamageReport, Severity, UnitType } from '@/types'
import { cn } from '@/lib/cn'

export function NewReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addReport = useStore((s) => s.addReport)
  const [unitType, setUnitType] = useState<UnitType | 'Both'>('Truck')
  const [unitNo, setUnitNo] = useState('')
  const [location, setLocation] = useState('')
  const [driver, setDriver] = useState('')
  const [severity, setSeverity] = useState<Severity>('Medium')
  const [category, setCategory] = useState<DamageCategory>('External')
  const [types, setTypes] = useState<string[]>([])
  const [comments, setComments] = useState('')
  const [outOfService, setOutOfService] = useState(false)

  const toggleType = (t: string) => {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  const submit = () => {
    if (!unitNo.trim()) return
    const report: DamageReport = {
      id: String(Date.now()),
      date: new Date().toISOString(),
      unitType: unitType === 'Both' ? 'Truck' : unitType,
      unitNo: unitNo.trim().toUpperCase(),
      source: 'Manual',
      severity,
      location: location || 'Location pending',
      status: 'Draft',
      category,
      reportedBy: 'S',
      driver: driver || undefined,
      description: comments || types.join(', ') || 'New damage report',
      notes: types.join(', '),
      outOfService,
      photos: 0,
      createdBy: 'Aditika Verma',
      currency: 'CAD',
      requestStatus: 'Open',
      estimateItems: [],
      documents: [],
      workorder: { estimateStatus: 'Pending' },
    }
    addReport(report)
    onClose()
    setUnitNo('')
    setLocation('')
    setDriver('')
    setTypes([])
    setComments('')
    setOutOfService(false)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Damage Report"
      subtitle="Capture unit details, severity, and damage types"
      wide
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={submit}>
            Add New Damage
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-line-strong bg-[#fafafa] transition hover:border-accent hover:bg-accent-soft/30">
            <Upload className="mb-2 text-ink-3" size={22} />
            <div className="text-[13px] font-semibold text-ink">Click to upload or drag and drop</div>
            <div className="mt-1 text-[12px] text-ink-3">PNG, JPG, GIF up to 10MB</div>
            <input type="file" accept="image/*" multiple className="hidden" />
          </label>

          <div className="rounded-[18px] border border-line p-4">
            <div className="mb-3 text-[13px] font-bold">Severity Level</div>
            <Segment
              value={severity}
              onChange={setSeverity}
              options={[
                { value: 'Critical', label: 'Critical' },
                { value: 'Major', label: 'Major' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Minor', label: 'Minor' },
              ]}
            />
          </div>

          <div className="rounded-[18px] border border-line p-4">
            <div className="mb-3 text-[13px] font-bold">Reporter Details</div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              placeholder="Comments"
              className="w-full rounded-[12px] border border-line px-3 py-2.5 text-[13px] outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[18px] border border-line p-4">
            <div className="mb-3 text-[13px] font-bold">Basic Information</div>
            <div className="mb-3">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-3">
                Unit Type
              </div>
              <Segment
                value={unitType}
                onChange={setUnitType}
                options={[
                  { value: 'Truck', label: 'Truck' },
                  { value: 'Trailer', label: 'Trailer' },
                  { value: 'Both', label: 'Both' },
                ]}
              />
            </div>
            <div className="space-y-2.5">
              <input
                value={unitNo}
                onChange={(e) => setUnitNo(e.target.value)}
                placeholder="Unit number"
                className="h-10 w-full rounded-[12px] border border-line px-3 text-[13px] outline-none focus:border-accent"
              />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location & address"
                className="h-10 w-full rounded-[12px] border border-line px-3 text-[13px] outline-none focus:border-accent"
              />
              <input
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                placeholder="Driver name"
                className="h-10 w-full rounded-[12px] border border-line px-3 text-[13px] outline-none focus:border-accent"
              />
              <label className="flex items-center gap-2 text-[13px] text-ink-2">
                <input
                  type="checkbox"
                  checked={outOfService}
                  onChange={(e) => setOutOfService(e.target.checked)}
                  className="rounded"
                />
                Out of service
              </label>
            </div>
          </div>

          <div className="rounded-[18px] border border-line p-4">
            <div className="mb-3 text-[13px] font-bold">Damage Details</div>
            <div className="mb-3">
              <Segment
                value={category}
                onChange={setCategory}
                options={[
                  { value: 'Internal', label: 'Internal' },
                  { value: 'External', label: 'External' },
                  { value: 'Mechanical', label: 'Mechanical' },
                  { value: 'Tires', label: 'Tires' },
                ]}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DAMAGE_TYPES.map((t) => {
                const active = types.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleType(t)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-[12px] font-semibold transition',
                      active
                        ? 'bg-ink text-white'
                        : 'bg-[#f2f2f7] text-ink-2 hover:bg-[#e8e8ed]'
                    )}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
