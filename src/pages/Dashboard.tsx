import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
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
import { LayoutDashboard, BookOpen, Lock, LogOut, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/lib/supabaseClient';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ProfileDropdown } from '@/components/ProfileDropdown';

export function Dashboard() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  if (!user) {
    return null; // Or a loading spinner
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    disconnect();
    navigate('/login');
  };

  const isDashboard = location.pathname === '/dashboard';
  const isLearn = location.pathname.startsWith('/dashboard/explore');

  const shortAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarRail />
        <SidebarHeader className="px-3 py-4">
          <Link to="/dashboard" className="flex items-center gap-2 px-2">
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
                  <SidebarMenuButton asChild isActive={isDashboard}>
                    <Link to="/dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isLearn}>
                    <Link to="/dashboard/explore">
                      <BookOpen />
                      <span>Learn</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton onClick={(e) => e.preventDefault()}>
                        <Lock />
                        <span>Real World Project</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right">Coming soon!</TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-2">
            {isConnected ? (
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => disconnect()}
              >
                <Wallet />
                <span>{shortAddress(address)}</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => connect({ connector: injected() })}
              >
                <Wallet />
                <span>Connect Wallet</span>
              </Button>
            )}
            <div className="flex">
              <ProfileDropdown />
            </div>
            <Button variant="ghost" className="justify-start" onClick={handleLogout}>
              <LogOut />
              <span>Log Out</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="text-sm text-muted-foreground">Logged Area</div>
        </div>
        <div className="px-4 py-6 md:px-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
