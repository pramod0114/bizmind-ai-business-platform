/**
 * BizMind – User Login Page
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromPath = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const loggedInUser = await login({ email: trimmedEmail, password });
      if (loggedInUser.role === 'ADMIN' && fromPath === '/dashboard') {
        navigate('/admin', { replace: true });
      } else {
        navigate(fromPath, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (type: 'admin' | 'user') => {
    setError(null);
    if (type === 'admin') {
      setEmail('admin@bizmind.ai');
      setPassword('Admin@123456');
    } else {
      setEmail('user@bizmind.ai');
      setPassword('User@123456');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#FFBF24] flex items-center justify-center text-[#0B0B0C] font-black text-2xl mx-auto mb-3 shadow-lg shadow-[#FFBF24]/20">
          B
        </div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Sign In to BizMind</h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Access your AI Business Planning and Market Intelligence Suite
        </p>
      </div>

      <Card className="border-[#27272A] bg-[#111113] shadow-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-[#F8FAFC]">Account Credentials</CardTitle>
            <CardDescription className="text-xs text-[#A1A1AA]">
              Enter your registered email address and secure password.
            </CardDescription>

            {/* Error Message Box */}
            {error && (
              <div className="mt-3 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444] animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              leftIcon={<Mail className="w-4 h-4 text-[#71717A]" />}
              required
              disabled={isSubmitting}
              autoComplete="email"
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#F8FAFC]">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[#FFBF24] hover:text-[#F59E0B] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                leftIcon={<Lock className="w-4 h-4 text-[#71717A]" />}
                required
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            {/* Quick-Test Accounts Helper */}
            <div className="p-3 rounded-lg bg-[#1A1A1D] border border-[#27272A] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#A1A1AA]">
                <span className="font-semibold text-[#F8FAFC]">Quick Testing Accounts:</span>
                <span className="text-[10px] font-mono text-[#71717A]">Click to auto-fill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin')}
                  className="px-2.5 py-1.5 rounded bg-[#111113] hover:bg-[#27272A] border border-[#27272A] text-[11px] font-medium text-[#FFBF24] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Role</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('user')}
                  className="px-2.5 py-1.5 rounded bg-[#111113] hover:bg-[#27272A] border border-[#27272A] text-[11px] font-medium text-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>User Role</span>
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3 pt-2">
            <Button
              id="login-submit-btn"
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center text-xs text-[#A1A1AA]">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-[#FFBF24] hover:text-[#F59E0B] font-semibold">
                Create Account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
