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
}: {
  children: React.ReactNode
  search?: string
  onSearch?: (v: string) => void
  onNew?: () => void
}) {
  const location = useLocation()
  const isDetail = location.pathname.startsWith('/reports/')

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1d1d1f]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[58px] max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="shrink-0">
            <div className="text-[17px] font-bold tracking-[-0.03em] text-white">
              Damage Reports
            </div>
          </Link>

          {!isDetail && onSearch && (
            <div className="mx-auto hidden w-full max-w-md md:block">
              <SearchInput
                value={search ?? ''}
                onChange={onSearch}
                placeholder="Search reports…"
                className="[&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder:text-white/45 [&_input]:focus:bg-white/15 [&_svg]:text-white/50"
              />
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
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
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Appearance"
            >
              <Moon size={17} strokeWidth={1.7} />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green text-[12px] font-bold text-white">
              S
            </div>
          </div>
        </div>
      </header>
      <main className={cn('mx-auto max-w-[1400px] px-4 py-6 sm:px-6', isDetail && 'pb-10')}>
        {children}
      </main>
    </div>
  )
}
