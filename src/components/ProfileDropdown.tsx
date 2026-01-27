import { useContext } from "react";
import { Button } from "./ui/button";
import { useAuth, useOAuth } from '@/hooks/useOAuth';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Wallet, Shield } from "lucide-react";
import { shouldUseMockAuth } from '@/lib/supabase-simple';
import { SidebarContext } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";


export function ProfileDropdown() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { signOut: oAuthSignOut, loading: signOutLoading } = useOAuth();
  const sidebarContext = useContext(SidebarContext);
  const isCollapsed = sidebarContext?.state === 'collapsed';
  const isMock = shouldUseMockAuth();
  const mockUserRaw = isMock ? localStorage.getItem('mock-auth-user') : null;
  let mockUser: { is_admin?: boolean } | null = null;

  if (mockUserRaw) {
    try {
      mockUser = JSON.parse(mockUserRaw);
    } catch (error) {
      console.warn('Failed to parse mock admin user payload', error);
    }
  }

  const isAdmin = Boolean(user?.app_metadata?.is_admin || mockUser?.is_admin);
  

  const handleLogout = async () => {
    try {
      // Sign out from OAuth
      await oAuthSignOut();
      
      // The oAuthSignOut function will handle the redirect
      // No need to navigate here as it's handled in the hook
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect to home on error
      window.location.href = '/';
    }
  };

  const getInitials = (email?: string) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    // Prioridade: full_name > name > email > User
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Primeira parte do email
    }
    return 'User';
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full gap-2 px-2",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">
                {getUserDisplayName()}
              </span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('profileDropdown.myAccount')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard/profile">
            <User className="mr-2 h-4 w-4" />
            <span>{t('profileDropdown.profile')}</span>
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/dashboard/admin">
              <Shield className="mr-2 h-4 w-4" />
              <span>{t('profileDropdown.admin')}</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem>
          <Wallet className="mr-2 h-4 w-4" />
          <span>{t('profileDropdown.connectWallet')}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={signOutLoading}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{signOutLoading ? t('auth.logout.signingOut') : t('auth.logout.button')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
