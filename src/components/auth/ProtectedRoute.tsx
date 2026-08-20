/**
 * Protected Route & Role Authorization Guard for BizMind
 */
import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Loader2, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center text-center p-4">
        <div className="w-12 h-12 rounded-xl bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24] mb-4 shadow-xl">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-[#F8FAFC]">Authenticating session...</p>
        <p className="text-xs text-[#71717A] mt-1">Verifying encrypted cryptographic credentials</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to login, preserving intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin access guard
  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-[#EF4444]/30 bg-[#111113] shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl text-[#F8FAFC]">Access Denied</CardTitle>
            <CardDescription className="text-xs text-[#A1A1AA] mt-1">
              You do not have the required administrator privileges to view or manage the BizMind Admin Console.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="p-3 rounded-lg bg-[#1A1A1D] border border-[#27272A] text-xs text-[#A1A1AA] space-y-1.5">
              <div className="flex justify-between">
                <span>Required Role:</span>
                <span className="font-mono text-[#FFBF24] font-semibold">ADMIN</span>
              </div>
              <div className="flex justify-between">
                <span>Current Account Role:</span>
                <span className="font-mono text-[#F8FAFC]">USER</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link to="/dashboard">
                <Button variant="primary" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Return to Dashboard
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View Account Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
