import { Bell, Moon, Plus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { cn } from '@/lib/cn'

export function AppShell({
  children,
  search,
  onSearch,
  onNew,
  lockViewport = false,
}: {
  children: React.ReactNode
  search?: string
  onSearch?: (v: string) => void
  onNew?: () => void
  /** When true, page does not scroll — children manage their own scroll areas. */
  lockViewport?: boolean
}) {
  const location = useLocation()
  const isDetail = location.pathname.startsWith('/reports/')

  return (
    <div className={cn('bg-bg', lockViewport ? 'flex h-dvh flex-col overflow-hidden' : 'min-h-full')}>
      <header className="sticky top-0 z-40 shrink-0 bg-black shadow-[0_8px_24px_rgba(15,23,42,0.18)]">
        <div className="flex h-14 w-full items-center gap-3 px-3 sm:px-4">
          <Link to="/" className="shrink-0">
            <div className="text-[16px] font-bold tracking-[-0.03em] text-white">
              Damage Reports
            </div>
          </Link>

          {!isDetail && onSearch && (
            <div className="mx-auto hidden w-full max-w-2xl flex-1 md:block">
              <SearchInput
                value={search ?? ''}
                onChange={onSearch}
                placeholder="Search reports…"
                className="[&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder:text-white/45 [&_input]:focus:bg-white/14 [&_svg]:text-white/50"
              />
            </div>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            <button
              className="rounded-full p-2 text-white/75 transition hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={18} strokeWidth={1.7} />
            </button>
            {onNew && (
              <Button variant="secondary" size="sm" onClick={onNew} className="hidden sm:inline-flex">
                <Plus size={16} strokeWidth={2.2} />
                New Damage
              </Button>
            )}
            <button
              className="rounded-full p-2 text-white/75 transition hover:bg-white/10 hover:text-white"
              aria-label="Appearance"
            >
              <Moon size={17} strokeWidth={1.7} />
            </button>
            <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-green text-[12px] font-bold text-white shadow-[0_2px_8px_rgba(10,122,62,0.35)]">
              S
            </div>
          </div>
        </div>
      </header>
      <main
        className={cn(
          'w-full px-3 py-4 sm:px-4 sm:py-5',
          lockViewport ? 'flex min-h-0 flex-1 flex-col overflow-hidden' : isDetail && 'pb-10'
        )}
      >
        {children}
      </main>
    </div>
  )
}
