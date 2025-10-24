import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Settings, Layers3, BookOpen, ListChecks, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const adminNav = [
  { to: '/dashboard/admin', label: 'Overview', icon: Settings, end: true },
  { to: '/dashboard/admin/paths', label: 'Learning Paths', icon: Layers3 },
  { to: '/dashboard/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/dashboard/admin/modules', label: 'Modules', icon: ListChecks },
  { to: '/dashboard/admin/lessons', label: 'Lessons', icon: FileText },
]

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-forge-orange">Admin</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-forge-dark">Content Management</h1>
            <p className="text-sm text-forge-gray">
              Create, organize, and publish learning experiences for the community.
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2 pt-2">
          {adminNav.map(({ to, label, icon: Icon, end }) => {
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
