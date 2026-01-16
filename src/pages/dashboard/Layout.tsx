import { useAuth } from '@/hooks/useOAuth'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react'
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { LayoutDashboard, BookOpen, Shield, Trophy, Award, FolderGit2, Menu, ChevronDown, GraduationCap, Layers3, BookMarked, ListChecks, FileText, Users, Languages } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ProfileDropdown } from '@/components/ProfileDropdown'
import { useSidebar } from '@/components/ui/sidebar'
import {
  DASHBOARD as DASHBOARD_PATH,
  DASHBOARD_EXPLORE,
  DASHBOARD_FORMATIONS,
  DASHBOARD_COURSES,
  DASHBOARD_ADMIN,
  DASHBOARD_SCOREBOARD,
  DASHBOARD_ACHIEVEMENTS,
  DASHBOARD_AMBASSADORS,
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
import { BetaPromoBar } from '@/components/BetaPromoBar'
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const APP_LOCALE_STORAGE_KEY = 'forge:appLocale'

function MobileMenuButton() {
  const { toggleSidebar } = useSidebar()
  const { t } = useTranslation()
  return (
    <button
      className="md:hidden p-2 rounded-lg border border-forge-orange/20 bg-forge-cream/90 text-forge-dark hover:text-forge-orange shadow-sm"
      aria-label={t('dashboard.layout.openMenu')}
      onClick={toggleSidebar}
    >
      <Menu size={22} />
    </button>
  )
}

function EducationMenuItem({ location, educationOpen, setEducationOpen }: {
  location: any;
  educationOpen: boolean;
  setEducationOpen: (open: boolean) => void;
}) {
  const { state: sidebarState, toggleSidebar } = useSidebar()

  const handleEducationClick = (e: React.MouseEvent) => {
    if (sidebarState === 'collapsed') {
      e.preventDefault()
      e.stopPropagation()
      toggleSidebar()
    }
  }

  return (
    <SidebarMenuItem>
      <Collapsible open={educationOpen} onOpenChange={setEducationOpen} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip="Education"
            onClick={handleEducationClick}
          >
            <BookOpen />
            <span className="group-data-[collapsible=icon]:hidden">Education</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild isActive={location.pathname.startsWith(DASHBOARD_FORMATIONS)}>
                <Link to={DASHBOARD_FORMATIONS}>
                  <GraduationCap className="h-4 w-4" />
                  <span>Formations</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild isActive={location.pathname.startsWith(DASHBOARD_EXPLORE)}>
                <Link to={DASHBOARD_EXPLORE}>
                  <Layers3 className="h-4 w-4" />
                  <span>Learning Paths</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild isActive={location.pathname.startsWith(DASHBOARD_COURSES)}>
                <Link to={DASHBOARD_COURSES}>
                  <BookMarked className="h-4 w-4" />
                  <span>Courses</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

export function DashboardLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const { t, i18n } = useTranslation()

  const [sidebarLocale, setSidebarLocale] = useState<string>(i18n.language)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(APP_LOCALE_STORAGE_KEY)
    if (stored && stored !== i18n.language) {
      i18n.changeLanguage(stored)
      setSidebarLocale(stored)
    }
  }, [i18n])

  useEffect(() => {
    setSidebarLocale(i18n.language)
  }, [i18n.language])

  const localeOptions = useMemo(
    () => [
      { value: 'en-US', label: t('profile.languageOptions.enUS') },
      { value: 'pt-BR', label: t('profile.languageOptions.ptBR') },
    ],
    [t]
  )

  const handleSidebarLocaleChange = (value: string) => {
    setSidebarLocale(value)
    i18n.changeLanguage(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem(APP_LOCALE_STORAGE_KEY, value)
    }
  }

  const isDashboard = location.pathname === DASHBOARD_PATH
  const isExplore = location.pathname.startsWith(DASHBOARD_EXPLORE)
  const isAdminRoute = location.pathname.startsWith(DASHBOARD_ADMIN)
  const isScoreboard = location.pathname.startsWith(DASHBOARD_SCOREBOARD)
  const isAchievements = location.pathname.startsWith(DASHBOARD_ACHIEVEMENTS)
  const isAmbassadors = location.pathname.startsWith(DASHBOARD_AMBASSADORS)
  const isCommunityProjects = location.pathname.startsWith(DASHBOARD_COMMUNITY_PROJECTS)
  const isEducationRoute = location.pathname.startsWith(DASHBOARD_FORMATIONS) ||
    location.pathname.startsWith(DASHBOARD_EXPLORE) ||
    location.pathname.startsWith(DASHBOARD_COURSES)

  // DataCamp-style: Hide platform sidebar when viewing a course
  const isCourseView = /^\/dashboard\/learn\/course\/[^/]+/.test(location.pathname)

  const [headerBreadcrumb, setHeaderBreadcrumb] = useState<ReactNode | null>(null)
  const [educationOpen, setEducationOpen] = useState(isEducationRoute)

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
    } else if (second === 'ambassadors') {
      items.push({ label: t(ROUTE_LABELS[DASHBOARD_AMBASSADORS]) })
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
      <div className="min-h-[100svh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forge-orange mx-auto mb-4"></div>
          <p className="text-forge-gray">{t('dashboard.layout.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen={false}>
      {!isCourseView && (
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
                  <EducationMenuItem
                    location={location}
                    educationOpen={educationOpen}
                    setEducationOpen={setEducationOpen}
                  />
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
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isAmbassadors} tooltip={t('nav.ambassadors')}>
                      <Link to={DASHBOARD_AMBASSADORS}>
                        <Users />
                        <span className="group-data-[collapsible=icon]:hidden">{t('nav.ambassadors')}</span>
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

          <SidebarFooter className="p-2 space-y-3 group-data-[collapsible=icon]:space-y-2">
            <div className="rounded-lg border border-forge-cream/80 bg-white/90 p-3 shadow-sm group-data-[collapsible=icon]:hidden">
              <p className="flex items-center gap-2 text-sm font-semibold text-forge-dark">
                <Languages className="h-4 w-4 text-forge-orange" /> {t('dashboard.sidebar.localeTitle')}
              </p>
              <p className="mt-1 text-xs text-forge-gray">{t('dashboard.sidebar.localeDescription')}</p>
              <Select value={sidebarLocale} onValueChange={handleSidebarLocaleChange}>
                <SelectTrigger className="mt-3">
                  <SelectValue placeholder={t('dashboard.sidebar.localePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {localeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="hidden justify-center group-data-[collapsible=icon]:flex">
              <Select value={sidebarLocale} onValueChange={handleSidebarLocaleChange}>
                <SelectTrigger className="h-10 w-10 rounded-full border border-forge-cream bg-white/90 p-0 text-forge-dark focus:ring-forge-orange">
                  <Languages className="h-4 w-4 text-forge-orange" />
                  <span className="sr-only">{t('dashboard.sidebar.localePlaceholder')}</span>
                </SelectTrigger>
                <SelectContent side="top" align="center">
                  {localeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ProfileDropdown />
          </SidebarFooter>
        </Sidebar>
      )}

      <SidebarInset>
        <div className="relative">
          {!isCourseView && <BetaPromoBar />}
          <div className={isCourseView ? '' : 'pt-[30px]'}>
            <div className={isCourseView ? '' : 'px-4 sm:px-6 py-6 sm:py-8 relative pb-24 md:pb-8'}>
              {!isCourseView && (
                <div className="absolute inset-0 -z-10 pointer-events-none">
                  <div className="absolute -top-6 right-6 w-32 h-32 bg-forge-cream rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-10 w-24 h-24 bg-forge-orange/10 rounded-full blur-2xl"></div>
                </div>
              )}
              <Outlet context={{ setHeaderBreadcrumb }} />
            </div>
          </div>
        </div>
        {!isCourseView && <MobileBottomNav />}
      </SidebarInset>
    </SidebarProvider>
  )
}
export default DashboardLayout
