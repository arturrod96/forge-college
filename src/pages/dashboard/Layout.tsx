import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
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
} from '@/components/ui/sidebar';
import { LayoutDashboard, BookOpen, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { DASHBOARD as DASHBOARD_PATH, DASHBOARD_EXPLORE, DASHBOARD_MY_PATHS, ROUTE_LABELS } from '@/routes/paths';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const breadcrumbItems = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const items: { label: string; to?: string }[] = [];

    items.push({ label: ROUTE_LABELS[DASHBOARD_PATH], to: DASHBOARD_PATH });
    if (segments.length <= 1) return items;

    const second = segments[1];
    if (second === 'explore') {
      items.push({ label: ROUTE_LABELS[DASHBOARD_EXPLORE] });
    } else if (second === 'my-paths') {
      items.push({ label: ROUTE_LABELS[DASHBOARD_MY_PATHS] });
    } else if (second === 'learn') {
      const third = segments[2];
      if (third === 'course') {
        items.push({ label: ROUTE_LABELS.LEARN, to: DASHBOARD_EXPLORE });
        items.push({ label: ROUTE_LABELS.COURSE });
      } else if (third === 'path') {
        items.push({ label: ROUTE_LABELS.LEARN, to: DASHBOARD_EXPLORE });
        items.push({ label: ROUTE_LABELS.PATH });
      }
    } else if (second === 'profile') {
      items.push({ label: ROUTE_LABELS.PROFILE });
    } else {
      items.push({ label: ROUTE_LABELS.PAGE });
    }

    return items;
  }, [location.pathname]);

  const isDashboard = location.pathname === DASHBOARD_PATH;
  const isExplore = location.pathname.startsWith(DASHBOARD_EXPLORE);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarRail />
        <SidebarHeader className="p-2">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <SidebarTrigger className="h-8 w-8" />
            <Link to="/dashboard" className="flex items-center gap-2">
              <img
                src="https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800"
                alt="Forge College"
                className="h-7 w-auto"
              />
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isDashboard} tooltip="Dashboard">
                    <Link to={DASHBOARD_PATH}>
                      <LayoutDashboard />
                      <span className="group-data-[collapsible=icon]:hidden">{ROUTE_LABELS[DASHBOARD_PATH]}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isExplore} tooltip="Explore">
                    <Link to={DASHBOARD_EXPLORE}>
                      <BookOpen />
                      <span className="group-data-[collapsible=icon]:hidden">{ROUTE_LABELS[DASHBOARD_EXPLORE]}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton disabled>
                        <Lock />
                        <span className="group-data-[collapsible=icon]:hidden">Real-World Project</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right">Coming soon!</TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <ProfileDropdown />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-14 items-center gap-3 border-b px-4 md:px-6 bg-gradient-to-r from-forge-cream to-white border-forge-cream">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                return (
                  <React.Fragment key={`${item.label}-${index}`}>
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
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4 py-6 md:px-8 relative">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute -top-6 right-6 w-32 h-32 bg-forge-cream rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-10 w-24 h-24 bg-forge-orange/10 rounded-full blur-2xl"></div>
          </div>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout


