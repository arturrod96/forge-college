import { useState } from 'react';
import { createClientBrowser } from '../lib/supabase';
import { testSupabaseConnection } from '../lib/supabase-debug';
import { shouldUseMockAuth, mockAuth } from '../lib/supabase-simple';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DASHBOARD } from '@/routes/paths';
import { Github, Mail, Bug, AlertTriangle } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Check if we should use mock authentication
      if (shouldUseMockAuth()) {
        console.log('Using mock authentication for development...');
        const { data, error } = await mockAuth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) {
          throw new Error('Demo mode: use demo@example.com / demo123');
        }

        if (data?.user) {
          console.log('Mock login successful, redirecting...');
          // Store mock session in localStorage for RequireAuth to work
          localStorage.setItem('mock-auth-user', JSON.stringify(data.user));

          const from = (location.state as any)?.from?.pathname || DASHBOARD;
          navigate(from, { replace: true });
        }
        return;
      }

      // Try real Supabase authentication
      console.log('Attempting Supabase authentication...');

      const supabase = createClientBrowser();

      // Simple login without Promise.race to avoid complications
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      console.log('Login response:', { data: !!data, error: error?.message });

      if (error) {
        // Handle specific Supabase error types
        if (error.message?.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message?.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message?.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a moment before trying again.');
        } else if (error.message?.includes('body stream already read')) {
          // Fall back to mock auth if Supabase is having issues
          console.log('Supabase error detected, falling back to mock auth...');
          const { data: mockData, error: mockError } = await mockAuth.signInWithPassword({
            email: email.trim(),
            password
          });

          if (mockError) {
            throw new Error(mockError.message);
          }

          if (mockData?.user) {
            localStorage.setItem('mock-auth-user', JSON.stringify(mockData.user));
            const from = (location.state as any)?.from?.pathname || DASHBOARD;
            navigate(from, { replace: true });
          }
          return;
        } else {
          throw new Error(error.message || 'Login failed');
        }
      }

      if (data?.user) {
        console.log('Login successful, redirecting...');
        // Redirect to previous location if present, otherwise dashboard
        const from = (location.state as any)?.from?.pathname || DASHBOARD;
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Enhanced error handling with more specific messages
      if (error.message?.includes('body stream already read')) {
        setError('Authentication service configuration error. Using demo mode - try email: demo@example.com, password: demo123');
      } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
        setError('Network connection error. Please check your internet connection and try again.');
      } else if (error.message?.includes('Failed to execute')) {
        setError('Authentication service error. The Supabase instance may be misconfigured.');
      } else if (error.message?.includes('Supabase connection failed')) {
        setError('Cannot connect to authentication service. Please check if Supabase is properly configured.');
      } else {
        setError(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const supabase = createClientBrowser();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw new Error('Google sign-in failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const supabase = createClientBrowser();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('GitHub OAuth error:', error);
        throw new Error('GitHub sign-in failed. Please try again.');
      }
    } catch (error: any) {
      console.error('GitHub login error:', error);
      setError(error.message || 'GitHub sign-in failed. Please try again.');
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
          {shouldUseMockAuth() && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Demo Mode</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Use demo credentials: <strong>demo@example.com</strong> / <strong>demo123</strong>
              </p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-forge-dark font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={shouldUseMockAuth() ? "demo@example.com" : "m@example.com"}
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

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-forge-orange/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-forge-gray">Or continue with</span>
                </div>
              </div>

              {/* SSO Buttons */}
              <div className="grid gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  className="w-full border-forge-orange/20 hover:border-forge-orange hover:bg-forge-orange/5 transition-all duration-200 font-medium py-3 rounded-xl group"
                  disabled={loading}
                >
                  <svg className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGithubLogin}
                  className="w-full border-forge-orange/20 hover:border-forge-orange hover:bg-forge-orange/5 transition-all duration-200 font-medium py-3 rounded-xl group"
                  disabled={loading}
                >
                  <Github className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" />
                  Continue with GitHub
                </Button>
              </div>
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

              {/* Debug button - only show in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setTesting(true);
                      try {
                        const result = await testSupabaseConnection();
                        alert(`Connection test ${result.success ? 'passed' : 'failed'}: ${JSON.stringify(result, null, 2)}`);
                      } catch (err) {
                        alert(`Connection test error: ${err}`);
                      } finally {
                        setTesting(false);
                      }
                    }}
                    disabled={testing}
                    className="text-xs"
                  >
                    <Bug className="w-3 h-3 mr-1" />
                    {testing ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
