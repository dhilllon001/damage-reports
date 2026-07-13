import { useState } from 'react'
import { Building2, MapPin, Truck, Wrench } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const ACTIONS = [
  {
    id: 'terminal',
    title: 'Move to Terminal',
    description: 'Equipment will be taken to a terminal for repair.',
    icon: Building2,
    tone: 'bg-accent-soft text-accent',
  },
  {
    id: 'vendor',
    title: 'Move to Vendor',
    description: 'Repair at an external vendor facility.',
    icon: MapPin,
    tone: 'bg-orange-soft text-orange',
  },
  {
    id: 'tow',
    title: 'Tow',
    description: 'Arrange towing service for the equipment.',
    icon: Truck,
    tone: 'bg-[#eef6ff] text-[#0066cc]',
  },
  {
    id: 'onsite',
    title: 'On Site Repair',
    description: 'Create a job for on-site repair.',
    icon: Wrench,
    tone: 'bg-green-soft text-green',
  },
] as const

export function RepairActionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [action, setAction] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const close = () => {
    onClose()
    setStep(1)
    setAction(null)
    setNotes('')
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Repair Action"
      subtitle={action ? `# ${ACTIONS.find((a) => a.id === action)?.title}` : 'Choose how this unit should be repaired'}
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <Button
            variant="ghost"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
          >
            Previous
          </Button>
          <span className="text-[12.5px] text-ink-3">Step {step} of 3</span>
          {step < 3 ? (
            <Button disabled={step === 1 && !action} onClick={() => setStep((s) => s + 1)}>
              {step === 1 ? 'Details' : 'Overview'}
            </Button>
          ) : (
            <Button variant="secondary" onClick={close}>
              Confirm Action
            </Button>
          )}
        </div>
      }
    >
      <div className="mb-5 flex gap-2">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={cn(
              'h-1 flex-1 rounded-full',
              n <= step ? 'bg-accent' : 'bg-line'
            )}
          />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h3 className="mb-1 text-[18px] font-bold tracking-[-0.02em]">Select Action</h3>
          <p className="mb-4 text-[13px] text-ink-3">Choose the appropriate repair action</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ACTIONS.map((a) => {
              const Icon = a.icon
              const active = action === a.id
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAction(a.id)}
                  className={cn(
                    'rounded-[18px] border p-4 text-left transition',
                    active
                      ? 'border-accent bg-accent-soft/40 shadow-[var(--shadow-rest)]'
                      : 'border-line hover:border-line-strong hover:bg-[#fafafa]'
                  )}
                >
                  <div className={cn('mb-3 inline-flex rounded-[12px] p-2.5', a.tone)}>
                    <Icon size={18} />
                  </div>
                  <div className="text-[14px] font-bold text-ink">{a.title}</div>
                  <div className="mt-1 text-[12.5px] text-ink-3">{a.description}</div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="mb-1 text-[18px] font-bold">Details</h3>
          <p className="mb-4 text-[13px] text-ink-3">
            Add scheduling notes for {ACTIONS.find((a) => a.id === action)?.title}
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Notes, preferred vendor, time window…"
            className="w-full rounded-[14px] border border-line px-3.5 py-3 text-[13px] outline-none focus:border-accent"
          />
        </div>
      )}

      {step === 3 && (
        <div className="rounded-[18px] bg-[#f5f5f7] p-5">
          <h3 className="mb-3 text-[18px] font-bold">Overview</h3>
          <dl className="space-y-2 text-[13px]">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-3">Action</dt>
              <dd className="font-semibold">{ACTIONS.find((a) => a.id === action)?.title}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-3">Notes</dt>
              <dd className="max-w-[60%] text-right font-semibold">{notes || '—'}</dd>
            </div>
          </dl>
        </div>
      )}
    </Modal>
  )
}
