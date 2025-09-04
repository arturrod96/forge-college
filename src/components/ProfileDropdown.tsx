import { Button } from "./ui/button";
import { useAuth, useOAuth } from '@/hooks/useOAuth';

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
import { LogOut, User, Wallet } from "lucide-react";


export function ProfileDropdown() {
  const { user } = useAuth();
  const { signOut: oAuthSignOut, loading: signOutLoading } = useOAuth();
  

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
        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">
              {getUserDisplayName()}
            </span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <Wallet className="mr-2 h-4 w-4" />
          <span>Connect Wallet</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={signOutLoading}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{signOutLoading ? 'Signing out...' : 'Log Out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
