/**
 * BizMind – User Registration Page
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, Mail, Lock, Phone, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    // 1. Full name validation
    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    // 2. Email validation
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // 3. Password validation
    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // 4. Confirm password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        full_name: trimmedName,
        email: trimmedEmail,
        password,
        confirm_password: confirmPassword,
        phone: trimmedPhone || undefined,
      });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#FFBF24] flex items-center justify-center text-[#0B0B0C] font-black text-2xl mx-auto mb-3 shadow-lg shadow-[#FFBF24]/20">
          B
        </div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Create BizMind Account</h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Start evaluating business ventures, market risks, and location insights
        </p>
      </div>

      <Card className="border-[#27272A] bg-[#111113] shadow-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-[#F8FAFC]">Account Registration</CardTitle>
            <CardDescription className="text-xs text-[#A1A1AA]">
              Enter your details to generate your verified BizMind profile.
            </CardDescription>

            {/* Error Alert Box */}
            {error && (
              <div className="mt-3 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444] animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              id="register-name"
              label="Full Name"
              placeholder="e.g. Sarah Jenkins"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (error) setError(null);
              }}
              leftIcon={<User className="w-4 h-4 text-[#71717A]" />}
              required
              disabled={isSubmitting}
              autoComplete="name"
            />

            <Input
              id="register-email"
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

            <Input
              id="register-phone"
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4 text-[#71717A]" />}
              disabled={isSubmitting}
              autoComplete="tel"
            />

            <Input
              id="register-password"
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              leftIcon={<Lock className="w-4 h-4 text-[#71717A]" />}
              required
              disabled={isSubmitting}
              autoComplete="new-password"
            />

            <Input
              id="register-confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              leftIcon={<Lock className="w-4 h-4 text-[#71717A]" />}
              required
              disabled={isSubmitting}
              autoComplete="new-password"
            />

            {/* Password security guideline */}
            <div className="p-3 rounded-lg bg-[#1A1A1D] border border-[#27272A] space-y-1 text-[11px] text-[#A1A1AA]">
              <div className="flex items-center gap-1.5 text-[#F8FAFC] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFBF24]" />
                <span>Security Guidelines</span>
              </div>
              <p className="text-[#71717A]">
                Passwords are cryptographically hashed via bcrypt (10 rounds) before storage in MySQL.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3 pt-2">
            <Button
              id="register-submit-btn"
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting ? 'Creating account...' : 'Complete Registration & Enter'}
            </Button>

            <div className="text-center text-xs text-[#A1A1AA]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FFBF24] hover:text-[#F59E0B] font-semibold">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
