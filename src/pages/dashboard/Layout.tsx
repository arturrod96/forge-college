import { useAuth } from '@/hooks/useOAuth'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useMemo, useState, type ReactNode } from 'react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { LayoutDashboard, BookOpen, Shield, Trophy, Award, FolderGit2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ProfileDropdown } from '@/components/ProfileDropdown'
import { useSidebar } from '@/components/ui/sidebar'
import {
  DASHBOARD as DASHBOARD_PATH,
  DASHBOARD_EXPLORE,
  DASHBOARD_ADMIN,
  DASHBOARD_SCOREBOARD,
  DASHBOARD_ACHIEVEMENTS,
  DASHBOARD_COMMUNITY_PROJECTS,
  ROUTE_LABELS,
} from '@/routes/paths'
import { shouldUseMockAuth } from '@/lib/supabase-simple'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useTranslation } from 'react-i18next'

function MobileMenuButton() {
  const { toggleSidebar } = useSidebar()
  const { t } = useTranslation()
  return (
    <button
      className="md:hidden p-2 rounded-lg border border-forge-orange/20 bg-forge-cream/90 text-forge-dark hover:text-forge-orange shadow-sm"
      aria-label={t('dashboard.layout.openMenu')}
      onClick={toggleSidebar}
    >
      <MenuIcon />
    </button>
  )
}

function MenuIcon() {
  return <svg viewBox="0 0 24 24" width={22} height={22} stroke="currentColor" strokeWidth={1.5} fill="none"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /></svg>
}

export function DashboardLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const { t } = useTranslation()

  const isDashboard = location.pathname === DASHBOARD_PATH
  const isExplore = location.pathname.startsWith(DASHBOARD_EXPLORE)
  const isAdminRoute = location.pathname.startsWith(DASHBOARD_ADMIN)
  const isScoreboard = location.pathname.startsWith(DASHBOARD_SCOREBOARD)
  const isAchievements = location.pathname.startsWith(DASHBOARD_ACHIEVEMENTS)
  const isCommunityProjects = location.pathname.startsWith(DASHBOARD_COMMUNITY_PROJECTS)

  const [headerBreadcrumb, setHeaderBreadcrumb] = useState<ReactNode | null>(null)

  const isMock = shouldUseMockAuth()
  const mockUserRaw = isMock ? localStorage.getItem('mock-auth-user') : null
  let mockUser: { is_admin?: boolean } | null = null

  if (mockUserRaw) {
    try {
      mockUser = JSON.parse(mockUserRaw)
    } catch (error) {
      console.warn('Failed to parse mock user payload', error)
    }
  }

  const isAdmin = Boolean(user?.app_metadata?.is_admin || mockUser?.is_admin)

  const defaultBreadcrumbItems = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    const items: { label: string; to?: string }[] = []

    items.push({ label: t(ROUTE_LABELS[DASHBOARD_PATH]), to: DASHBOARD_PATH })

    if (segments.length <= 1) return items

    const second = segments[1]
    if (second === 'explore') {
      items.push({ label: t(ROUTE_LABELS[DASHBOARD_EXPLORE]) })
    } else if (second === 'profile') {
      items.push({ label: t(ROUTE_LABELS.PROFILE) })
    } else if (second === 'scoreboard') {
      items.push({ label: t(ROUTE_LABELS[DASHBOARD_SCOREBOARD]) })
    } else if (second === 'achievements') {
      items.push({ label: t(ROUTE_LABELS[DASHBOARD_ACHIEVEMENTS]) })
    } else if (second === 'community-projects') {
      items.push({ label: t(ROUTE_LABELS[DASHBOARD_COMMUNITY_PROJECTS]) })
    } else if (second === 'admin') {
      items.push({ label: t(ROUTE_LABELS[DASHBOARD_ADMIN]) })
      const third = segments[2]
      if (third) {
        const labelMap: Record<string, string> = {
          paths: t('admin.layout.nav.paths'),
          courses: t('admin.layout.nav.courses'),
          modules: t('admin.layout.nav.modules'),
          lessons: t('admin.layout.nav.lessons'),
          projects: t('admin.layout.nav.projects'),
        }
        const label = labelMap[third]
        if (label) {
          items.push({ label })
        }
      }
    } else if (second === 'learn') {
      const third = segments[2]
      if (third === 'course') {
        items.push({ label: t(ROUTE_LABELS.LEARN), to: DASHBOARD_EXPLORE })
        items.push({ label: t(ROUTE_LABELS.COURSE) })
      } else if (third === 'path') {
        items.push({ label: t(ROUTE_LABELS.LEARN), to: DASHBOARD_EXPLORE })
        items.push({ label: t(ROUTE_LABELS.PATH) })
      }
    }

    return items
  }, [location.pathname, t])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forge-orange mx-auto mb-4"></div>
          <p className="text-forge-gray">{t('dashboard.layout.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarRail />
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between w-full">
            <Link to="/dashboard" className="flex items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800"
                alt="Forge College"
                className="h-10 w-auto"
              />
            </Link>
            <SidebarTrigger className="h-8 w-8 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-800" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isDashboard} tooltip={t('nav.dashboard')}>
                    <Link to={DASHBOARD_PATH}>
                      <LayoutDashboard />
                      <span className="group-data-[collapsible=icon]:hidden">{t('nav.dashboard')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isExplore} tooltip={t('nav.paths')}>
                    <Link to={DASHBOARD_EXPLORE}>
                      <BookOpen />
                      <span className="group-data-[collapsible=icon]:hidden">{t('nav.paths')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isCommunityProjects}
                    tooltip={t('nav.communityProjects')}
                  >
                    <Link to={DASHBOARD_COMMUNITY_PROJECTS}>
                      <FolderGit2 />
                      <span className="group-data-[collapsible=icon]:hidden">{t('nav.communityProjects')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isScoreboard} tooltip={t('nav.scoreboard')}>
                    <Link to={DASHBOARD_SCOREBOARD}>
                      <Trophy />
                      <span className="group-data-[collapsible=icon]:hidden">{t('nav.scoreboard')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isAchievements} tooltip={t('nav.achievements')}>
                    <Link to={DASHBOARD_ACHIEVEMENTS}>
                      <Award />
                      <span className="group-data-[collapsible=icon]:hidden">{t('nav.achievements')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isAdminRoute} tooltip={t('nav.admin')}>
                      <Link to={DASHBOARD_ADMIN}>
                        <Shield />
                        <span className="group-data-[collapsible=icon]:hidden">{t('nav.admin')}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2">
          <ProfileDropdown />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 border-b bg-white border-forge-cream">
          <div className="flex items-center gap-3">
            <MobileMenuButton />
            {headerBreadcrumb ? (
              <div className="hidden md:block">{headerBreadcrumb}</div>
            ) : (
              <div className="hidden md:block">
                <Breadcrumb>
                  <BreadcrumbList>
                    {defaultBreadcrumbItems.map((item, index) => {
                      const isLast = index === defaultBreadcrumbItems.length - 1
                      return (
                        <span key={`${item.label}-${index}`} className="flex items-center">
                          <BreadcrumbItem>
                            {isLast || !item.to ? (
                              <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link to={item.to}>{item.label}</Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!isLast && <BreadcrumbSeparator />}
                        </span>
                      )
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4" />
        </div>

        <div className="px-6 py-8 relative">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute -top-6 right-6 w-32 h-32 bg-forge-cream rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-10 w-24 h-24 bg-forge-orange/10 rounded-full blur-2xl"></div>
          </div>
          <Outlet context={{ setHeaderBreadcrumb }} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
