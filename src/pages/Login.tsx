import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DASHBOARD } from '@/routes/paths';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Redirect to previous location if present, otherwise dashboard
      const from = (location.state as any)?.from?.pathname || DASHBOARD;
      navigate(from, { replace: true });
    } catch (error: any) {
      // Check if it's a network error due to placeholder credentials
      if (error.message.includes('fetch') || error.message.includes('network')) {
        setError('Authentication service not configured. Please contact the administrator.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-forge-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl"></div>
      </div>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl relative z-10">
        <CardHeader>
          <CardTitle className="text-forge-dark text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-forge-dark font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-forge-dark font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-forge-orange/20 focus:border-forge-orange focus:ring-forge-orange/20"
                />
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-forge-orange text-white hover:bg-forge-orange-light transition-all duration-200 shadow-lg hover:shadow-xl font-semibold py-3 rounded-xl"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>
              <div className="mt-4 text-center text-sm">
                <span className="text-forge-gray">Don't have an account?</span>{' '}
                <Link to="/signup" className="text-forge-orange hover:text-forge-orange-light font-medium underline transition-colors">
                  Sign up
                </Link>
              </div>
              <div className="text-center text-sm">
                <Link to="/forgot-password" className="text-forge-orange hover:text-forge-orange-light font-medium underline transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
