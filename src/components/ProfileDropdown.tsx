import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { Button } from "./ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useNavigate, Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown, LogOut, User, Wallet } from "lucide-react";
import { shortAddress } from "@/lib/utils";

export function ProfileDropdown() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    disconnect();
    navigate('/login');
  };

  const getInitials = (email?: string) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };


  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
          </Avatar>
          <div className="hidden flex-col items-start text-left group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">{user?.user_metadata?.full_name ?? 'User'}</span>
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
        
        {isConnected ? (
          <DropdownMenuItem onClick={() => disconnect()}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>{shortAddress(address)}</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => connect({ connector: injected() })}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>Connect Wallet</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
