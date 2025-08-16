import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
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

export function Dashboard() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/dashboard/explore')) return 'Explore';
    if (path.startsWith('/dashboard/profile')) return 'My Profile';
    return 'Logged Area';
  }, [location.pathname]);

  if (!user) {
    return null; // Or a loading spinner
  }

  const isDashboard = location.pathname === '/dashboard';
  const isLearn = location.pathname.startsWith('/dashboard/explore');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarRail />
        <SidebarHeader className="p-2">
          <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1.5">
            <img
              src="https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/forgecollege-2c35f0?format=webp&width=800"
              alt="Forge College"
              className="h-7 w-auto"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isDashboard} tooltip="Dashboard">
                    <Link to="/dashboard">
                      <LayoutDashboard />
                      <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isLearn} tooltip="Learn">
                    <Link to="/dashboard/explore">
                      <BookOpen />
                      <span className="group-data-[collapsible=icon]:hidden">Learn</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton disabled>
                        <Lock />
                        <span className="group-data-[collapsible=icon]:hidden">Real World Project</span>
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
          <SidebarTrigger />
          <div className="text-base md:text-lg font-semibold text-forge-dark tracking-tight">{pageTitle}</div>
        </div>
        <div className="px-4 py-6 md:px-8 relative">
          {/* Decorative background similar to landing */}
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
