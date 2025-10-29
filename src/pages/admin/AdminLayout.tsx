import { useMemo } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Settings, Layers3, BookOpen, ListChecks, FileText, FolderGit2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export default function AdminLayout() {
  const location = useLocation()
  const { t } = useTranslation()

  const navItems = useMemo(
    () => [
      { to: '/dashboard/admin', label: t('admin.layout.nav.overview'), icon: Settings, end: true },
      { to: '/dashboard/admin/paths', label: t('admin.layout.nav.paths'), icon: Layers3 },
      { to: '/dashboard/admin/courses', label: t('admin.layout.nav.courses'), icon: BookOpen },
      { to: '/dashboard/admin/modules', label: t('admin.layout.nav.modules'), icon: ListChecks },
      { to: '/dashboard/admin/lessons', label: t('admin.layout.nav.lessons'), icon: FileText },
      { to: '/dashboard/admin/projects', label: t('admin.layout.nav.projects'), icon: FolderGit2 },
    ],
    [t]
  )

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-forge-orange">
          {t('admin.layout.kicker')}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-forge-dark">{t('admin.layout.title')}</h1>
            <p className="text-sm text-forge-gray">{t('admin.layout.subtitle')}</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2 pt-2">
          {navItems.map(({ to, label, icon: Icon, end }) => {
            const isActive = end ? location.pathname === to : location.pathname.startsWith(to)
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all',
                  isActive
                    ? 'border-forge-orange bg-forge-orange/10 text-forge-orange shadow-sm'
                    : 'border-transparent bg-white text-forge-gray hover:border-forge-cream hover:bg-forge-cream/40 hover:text-forge-dark'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            )
          })}
        </nav>
      </header>

      <main className="space-y-6">
        <Outlet />
      </main>
    </div>
  )
}
