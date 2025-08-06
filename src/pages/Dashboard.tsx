import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function Dashboard() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      // Save wallet address to Supabase
      const saveWallet = async () => {
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .update({ wallet_address: address })
            .eq('id', user.id);
          if (error) {
            console.error('Error saving wallet address:', error);
          }
        }
      };
      saveWallet();
    }
  }, [isConnected, address, user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    disconnect();
    navigate('/');
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <p>Welcome, {user.email}!</p>
            
            <div className="mt-4">
              <h3 className="font-bold">Your Web3 Wallet</h3>
              {walletAddress ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Connected: {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}</p>
                  <Button onClick={() => disconnect()} variant="outline">Disconnect Wallet</Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Connect your wallet to interact with the Forge College platform.</p>
                  <Button onClick={() => connect({ connector: injected() })}>Connect Wallet</Button>
                </div>
              )}
            </div>

            <Button onClick={handleLogout} variant="destructive" className="w-full mt-4">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}