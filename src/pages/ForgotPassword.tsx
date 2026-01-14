import { useState } from 'react';
import { createClientBrowser } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    setLoading(true);
    try {
      const supabase = createClientBrowser();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw new Error(error.message || 'Failed to send reset email');
      setMessage('Check your email for a password reset link.');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100svh] bg-forge-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl"></div>
      </div>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl relative z-10">
        <CardHeader>
          <CardTitle className="text-forge-dark text-2xl font-bold">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset}>
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
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
              {message && <p className="text-green-500 text-sm bg-green-50 p-3 rounded-lg border border-green-200">{message}</p>}
              <Button 
                type="submit" 
                className="w-full bg-forge-orange text-white hover:bg-forge-orange-light transition-all duration-200 shadow-lg hover:shadow-xl font-semibold py-3 rounded-xl"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <div className="mt-4 text-center text-sm">
                <span className="text-forge-gray">Remembered your password?</span>{' '}
                <Link to="/login" className="text-forge-orange hover:text-forge-orange-light font-medium underline transition-colors">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
