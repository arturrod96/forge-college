import React from 'react';
import { useAuth } from '@/hooks/useOAuth';
import { Outlet, Link, useLocation } from 'react-router-dom';
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
import { LayoutDashboard, BookOpen, Lock, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { useSidebar } from '@/components/ui/sidebar';
import { DASHBOARD as DASHBOARD_PATH, DASHBOARD_EXPLORE, ROUTE_LABELS } from '@/routes/paths';

export function DashboardLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forge-orange mx-auto mb-4"></div>
          <p className="text-forge-gray">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const isDashboard = location.pathname === DASHBOARD_PATH;
  const isExplore = location.pathname.startsWith(DASHBOARD_EXPLORE);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarRail />
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo à esquerda - maior e mais proeminente */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800"
                alt="Forge College"
                className="h-10 w-auto"
              />
            </Link>
            
            {/* Ícone de encolher à direita - estilo mais sutil */}
            <SidebarTrigger className="h-8 w-8 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-800" />
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
                  <SidebarMenuButton asChild isActive={isExplore} tooltip="Paths">
                    <Link to={DASHBOARD_EXPLORE}>
                      <BookOpen />
                      <span className="group-data-[collapsible=icon]:hidden">Paths</span>
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
        {/* Header with mobile hamburger on the left */}
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 border-b bg-white border-forge-cream">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg border border-forge-orange/20 bg-forge-cream/90 text-forge-dark hover:text-forge-orange shadow-sm"
              aria-label="Open menu"
              onClick={toggleSidebar}
            >
              <Menu size={22} />
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-forge-dark">
              {isDashboard ? 'Dashboard' : isExplore ? 'Paths' : 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-4" />
        </div>
        
        {/* Main content area */}
        <div className="px-6 py-8 relative">
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

export default DashboardLayout;
