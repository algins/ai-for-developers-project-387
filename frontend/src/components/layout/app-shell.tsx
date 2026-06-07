import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    CalendarDays,
    LayoutDashboard,
    ListChecks,
    Menu,
    Settings,
    User,
    X,
} from 'lucide-react'

type AdminNavItem = {
  to: string
  labelKey: string
  icon: typeof LayoutDashboard
  end?: boolean
}

type AdminNavGroup = {
  labelKey: string
  items: AdminNavItem[]
}

const adminNavGroups: AdminNavGroup[] = [
  {
    labelKey: 'admin.shell.groups.overview',
    items: [
      { to: '/admin', labelKey: 'nav.adminOverview', icon: LayoutDashboard, end: true },
    ],
  },
  {
    labelKey: 'admin.shell.groups.management',
    items: [
      { to: '/admin/event-types', labelKey: 'nav.adminEventTypes', icon: CalendarDays },
      { to: '/admin/bookings', labelKey: 'nav.adminBookings', icon: ListChecks },
    ],
  },
]

function SharedHeader({
  showMenuToggle,
  onMenuToggle,
  title,
  showLogo = true,
  isPublicZone = false,
  isAdminZone = false,
}: {
  showMenuToggle?: boolean
  onMenuToggle?: () => void
  title?: string
  showLogo?: boolean
  isPublicZone?: boolean
  isAdminZone?: boolean
}) {
  const { t } = useTranslation()

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 lg:px-8">
      {showMenuToggle && onMenuToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {showLogo && (
        <Link className="flex items-center gap-2" to="/">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
            CB
          </span>
          <span className="text-sm font-semibold">{t('app.title')}</span>
        </Link>
      )}

      {title && (
        <h1 className="hidden text-xl font-semibold tracking-tight lg:block">
          {title}
        </h1>
      )}

      <nav className="ml-auto flex items-center gap-1">
        <Link
          to="/"
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            isPublicZone
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <CalendarDays className="h-4 w-4" />
          {t('nav.bookNow')}
        </Link>
        <Link
          to="/admin"
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            isAdminZone
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <Settings className="h-4 w-4" />
          {t('nav.adminCabinet')}
        </Link>
      </nav>
    </header>
  )
}

export function AppShell({ children }: PropsWithChildren) {
  const { t } = useTranslation()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdminZone =
    location.pathname.startsWith('/admin') || location.pathname.startsWith('/owner')

  if (!isAdminZone) {
    return (
      <div className="min-h-screen bg-muted/40">
        <div className="mx-auto flex min-h-screen w-full max-w-[1400px] items-start justify-center p-0 lg:p-6">
          <div className="flex w-full flex-1 overflow-hidden rounded-none border-0 bg-background shadow-none lg:rounded-xl lg:border lg:shadow-sm">
            <div className="flex flex-1 flex-col min-w-0">
              <SharedHeader isPublicZone />
              <main className="flex-1 p-4 lg:p-8">{children}</main>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] items-start justify-center p-0 lg:p-6">
        <div className="flex w-full flex-1 overflow-hidden rounded-none border-0 bg-background shadow-none lg:rounded-xl lg:border lg:shadow-sm">
          {/* Mobile sidebar drawer */}
          {mobileOpen && (
            <aside className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r bg-background lg:hidden">
              <div className="flex h-14 items-center justify-between border-b px-4">
                <Link className="flex items-center gap-2" to="/" onClick={() => setMobileOpen(false)}>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                    CB
                  </span>
                  <span className="text-sm font-semibold">{t('app.title')}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto py-4">
                <nav className="space-y-5 px-4">
                  {adminNavGroups.map((group) => (
                    <div key={group.labelKey} className="space-y-0.5">
                      <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                        {t(group.labelKey)}
                      </div>
                      {group.items.map((link) => {
                        const Icon = link.icon
                        return (
                          <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                              cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                  ? 'bg-muted text-foreground'
                                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                              )
                            }
                          >
                            <Icon className="h-4 w-4" />
                            {t(link.labelKey)}
                          </NavLink>
                        )
                      })}
                    </div>
                  ))}
                </nav>
              </div>

              <div className="border-t p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{t('admin.shell.profile.name')}</span>
                    <span className="text-xs text-muted-foreground">{t('admin.shell.profile.role')}</span>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Desktop sidebar */}
          <aside className="hidden w-[260px] shrink-0 flex-col border-r lg:flex">
            <div className="flex h-14 items-center border-b px-4 lg:px-8">
              <Link className="flex items-center gap-2" to="/">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                  CB
                </span>
                <span className="text-sm font-semibold">{t('app.title')}</span>
              </Link>
            </div>

            <div className="flex-1 overflow-auto py-4 lg:py-8">
              <nav className="space-y-5 px-4 lg:px-8">
                {adminNavGroups.map((group) => (
                  <div key={group.labelKey} className="space-y-0.5">
                    <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                      {t(group.labelKey)}
                    </div>
                    {group.items.map((link) => {
                      const Icon = link.icon
                      return (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          end={link.end}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-muted text-foreground'
                                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                            )
                          }
                        >
                          <Icon className="h-4 w-4" />
                          {t(link.labelKey)}
                        </NavLink>
                      )
                    })}
                  </div>
                ))}
              </nav>
            </div>

            <div className="border-t p-4 lg:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{t('admin.shell.profile.name')}</span>
                  <span className="text-xs text-muted-foreground">{t('admin.shell.profile.role')}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main area */}
          <div className="flex flex-1 flex-col min-w-0">
            <SharedHeader
              showMenuToggle
              onMenuToggle={() => setMobileOpen(true)}
              showLogo={false}
              isAdminZone={isAdminZone}
            />
            <main className="flex-1 p-4 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
