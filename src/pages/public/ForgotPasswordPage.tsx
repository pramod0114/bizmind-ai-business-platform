/**
 * BizMind – Forgot Password Page
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, ArrowLeft, Info, AlertCircle, Send } from 'lucide-react';
import { authService } from '../../services/authService';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiNotice, setApiNotice] = useState<string | null>(null);

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

    try {
      setIsSubmitting(true);
      const res = await authService.forgotPassword(trimmedEmail);
      setApiNotice(res.message || 'Password reset request acknowledged.');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Unable to process reset request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#FFBF24] flex items-center justify-center text-[#0B0B0C] font-black text-2xl mx-auto mb-3 shadow-lg shadow-[#FFBF24]/20">
          B
        </div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Reset Password</h1>
        <p className="text-xs text-[#A1A1AA] mt-1">
          Recover access to your BizMind workspace
        </p>
      </div>

      <Card className="border-[#27272A] bg-[#111113] shadow-2xl">
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-[#F8FAFC]">Password Recovery</CardTitle>
              <CardDescription className="text-xs text-[#A1A1AA]">
                Enter the email address associated with your account.
              </CardDescription>

              {error && (
                <div className="mt-3 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                id="forgot-email"
                label="Registered Email Address"
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

              <div className="p-3 rounded-lg bg-[#FFBF24]/10 border border-[#FFBF24]/30 text-xs text-[#A1A1AA] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#FFBF24]">
                  <Info className="w-3.5 h-3.5" />
                  <span>Email Delivery Configuration Notice</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA]">
                  Direct SMTP / SES transactional email delivery is slated for future configuration. In this version, requests are validated and recorded securely on the server.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-3 pt-2">
              <Button
                id="forgot-submit-btn"
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                {isSubmitting ? 'Submitting request...' : 'Send Reset Instructions'}
              </Button>

              <Link to="/login" className="text-center text-xs text-[#A1A1AA] hover:text-[#F8FAFC] flex items-center justify-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </CardFooter>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFBF24]/10 border border-[#FFBF24]/30 text-[#FFBF24] flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#F8FAFC]">Request Acknowledged</h2>
            <p className="text-xs text-[#A1A1AA]">
              A password reset request for <strong className="text-[#F8FAFC]">{email}</strong> has been received by the authentication engine.
            </p>
            {apiNotice && (
              <div className="p-3 rounded-lg bg-[#1A1A1D] border border-[#27272A] text-[11px] text-[#A1A1AA]">
                {apiNotice}
              </div>
            )}
            <div className="pt-2">
              <Link to="/login">
                <Button variant="primary" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
