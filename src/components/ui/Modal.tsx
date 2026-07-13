import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  wide?: boolean
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'fixed left-1/2 top-[4vh] z-50 flex max-h-[92vh] w-[min(960px,calc(100vw-1.5rem))] -translate-x-1/2 flex-col overflow-hidden rounded-[var(--radius-modal)] bg-card shadow-[var(--shadow-overlay)]',
              wide && 'w-[min(1100px,calc(100vw-1.5rem))]',
              className
            )}
          >
            <div className="flex items-start justify-between border-b border-line px-6 py-5">
              <div>
                <h2 className="text-[18px] font-bold tracking-[-0.02em] text-ink">{title}</h2>
                {subtitle && <p className="mt-0.5 text-[13px] text-ink-3">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-ink-3 transition hover:bg-black/[0.05] hover:text-ink"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-[#fafafa] px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[560px] flex-col bg-card shadow-[var(--shadow-overlay)]"
          >
            <div className="flex items-start justify-between border-b border-line px-6 py-5">
              <div>
                <h2 className="text-[18px] font-bold tracking-[-0.02em] text-ink">{title}</h2>
                {subtitle && <p className="mt-0.5 text-[13px] text-ink-3">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-ink-3 transition hover:bg-black/[0.05]"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <div className="border-t border-line bg-[#fafafa] px-6 py-4">{footer}</div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
