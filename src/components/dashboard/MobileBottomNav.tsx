import type { ComponentType } from 'react'
import { Award, BookOpen, FolderGit2, LayoutDashboard, User } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import * as R from '@/routes/paths'

type NavItem = {
  label: string
  to: string
  icon: ComponentType<{ className?: string }>
  isActive: (pathname: string) => boolean
}

export function MobileBottomNav() {
  const location = useLocation()
  const { t } = useTranslation()

  const items: NavItem[] = [
    {
      label: t('nav.dashboard'),
      to: R.DASHBOARD,
      icon: LayoutDashboard,
      isActive: (pathname) => pathname === R.DASHBOARD,
    },
    {
      label: t('nav.paths'),
      to: R.DASHBOARD_EXPLORE,
      icon: BookOpen,
      isActive: (pathname) =>
        pathname.startsWith(R.DASHBOARD_EXPLORE) ||
        pathname.startsWith('/dashboard/learn') ||
        pathname.startsWith(R.DASHBOARD_FORMATIONS),
    },
    {
      label: t('nav.achievements'),
      to: R.DASHBOARD_ACHIEVEMENTS,
      icon: Award,
      isActive: (pathname) => pathname.startsWith(R.DASHBOARD_ACHIEVEMENTS),
    },
    {
      label: t('nav.communityProjects'),
      to: R.DASHBOARD_COMMUNITY_PROJECTS,
      icon: FolderGit2,
      isActive: (pathname) => pathname.startsWith(R.DASHBOARD_COMMUNITY_PROJECTS),
    },
    {
      label: t('nav.myProfile'),
      to: `${R.DASHBOARD}/profile`,
      icon: User,
      isActive: (pathname) => pathname.startsWith(`${R.DASHBOARD}/profile`),
    },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-forge-cream/80 bg-white/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-2 px-3 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map((item) => {
          const active = item.isActive(location.pathname)
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-semibold transition-colors',
                active
                  ? 'bg-forge-orange/10 text-forge-orange'
                  : 'text-gray-500 hover:text-forge-dark'
              )}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
