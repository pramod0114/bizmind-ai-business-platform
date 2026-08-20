/**
 * BizMind – User Settings & Profile Management Page
 */
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import {
  User as UserIcon,
  Shield,
  KeyRound,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Server,
  Sliders,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, changePassword, isAdmin } = useAuth();

  // Profile Form State
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profile_image || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setProfileImage(user.profile_image || '');
    }
  }, [user]);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setProfileError('Full name cannot be empty.');
      return;
    }

    try {
      setIsUpdatingProfile(true);
      await updateProfile({
        full_name: trimmedName,
        phone: phone.trim() || null,
        profile_image: profileImage.trim() || null,
      });
      setProfileSuccess('Profile updated successfully.');
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      });
      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Not recorded';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account & Environment Settings"
        description="Manage your profile credentials, cryptographic password security, access roles, and platform parameters."
        badge="Account Settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Identity Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details & Form */}
          <Card className="border-[#27272A] bg-[#111113]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#FFBF24]" />
                  <span>Profile Information</span>
                </CardTitle>
                <Badge variant={isAdmin ? 'primary' : 'outline'} size="sm">
                  {isAdmin ? 'ADMINISTRATOR' : 'USER'}
                </Badge>
              </div>
              <CardDescription>
                View and update your personal details and contact preferences.
              </CardDescription>

              {profileSuccess && (
                <div className="mt-3 p-3 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-start gap-2.5 text-xs text-[#22C55E]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="mt-3 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{profileError}</span>
                </div>
              )}
            </CardHeader>

            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="profile-name"
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Full Name"
                    required
                    disabled={isUpdatingProfile}
                  />

                  <Input
                    id="profile-phone"
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    leftIcon={<Phone className="w-4 h-4 text-[#71717A]" />}
                    disabled={isUpdatingProfile}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#F8FAFC] mb-1.5">
                      Email Address (Permanent Identifier)
                    </label>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#1A1A1D] border border-[#27272A] text-xs text-[#A1A1AA]">
                      <Mail className="w-4 h-4 text-[#71717A] shrink-0" />
                      <span className="font-mono text-[#F8FAFC] truncate">{user?.email || 'N/A'}</span>
                      <span className="ml-auto px-1.5 py-0.5 text-[10px] rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 font-medium">
                        Verified
                      </span>
                    </div>
                  </div>

                  <Input
                    id="profile-image-url"
                    label="Profile Avatar URL (Optional)"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    disabled={isUpdatingProfile}
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    id="profile-save-btn"
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? 'Updating profile...' : 'Save Profile Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="border-[#27272A] bg-[#111113]">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#FFBF24]" />
                <span>Security & Password</span>
              </CardTitle>
              <CardDescription>
                Update your account password. All passwords are encrypted with bcrypt (10 rounds).
              </CardDescription>

              {passwordSuccess && (
                <div className="mt-3 p-3 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-start gap-2.5 text-xs text-[#22C55E]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="mt-3 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  id="settings-curr-password"
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  placeholder="••••••••••••"
                  required
                  disabled={isUpdatingPassword}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="settings-new-password"
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Min. 8 characters"
                    required
                    disabled={isUpdatingPassword}
                  />

                  <Input
                    id="settings-confirm-password"
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Repeat new password"
                    required
                    disabled={isUpdatingPassword}
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    id="password-save-btn"
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? 'Updating password...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Account Summary & Metadata */}
        <div className="space-y-6">
          {/* Identity & Metadata Card */}
          <Card className="border-[#27272A] bg-[#111113]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FFBF24]" />
                <span>Account Identity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1A1A1D] border border-[#27272A]">
                <div className="w-10 h-10 rounded-xl bg-[#FFBF24] flex items-center justify-center text-[#0B0B0C] font-bold text-base shrink-0 shadow-md">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[#F8FAFC] truncate">
                    {user?.full_name || 'Guest'}
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] truncate">{user?.email}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#1A1A1D] border border-[#27272A] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#FFBF24]" />
                    <span>Role Access:</span>
                  </span>
                  <span className="font-mono text-[#FFBF24] font-semibold">
                    {user?.role || 'USER'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#71717A]" />
                    <span>Member Since:</span>
                  </span>
                  <span className="text-[#F8FAFC] text-[11px]">
                    {formatDate(user?.created_at || user?.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#71717A]" />
                    <span>Last Login:</span>
                  </span>
                  <span className="text-[#F8FAFC] text-[11px]">
                    {formatDate(user?.last_login || user?.lastLogin)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Runtime Environment Card */}
          <Card className="border-[#27272A] bg-[#111113]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#FFBF24]" />
                  <span>Runtime Environment</span>
                </CardTitle>
                <Badge variant="primary" size="sm">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex justify-between items-center">
                <span className="text-[#A1A1AA]">Auth Token:</span>
                <span className="font-mono text-[#22C55E] text-[11px]">JWT (HS256)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex justify-between items-center">
                <span className="text-[#A1A1AA]">Database:</span>
                <span className="font-mono text-[#F8FAFC] text-[11px]">MySQL 8.0 Engine</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex justify-between items-center">
                <span className="text-[#A1A1AA]">API Gateway:</span>
                <span className="font-mono text-[#FFBF24] text-[11px]">/api (Port 3000)</span>
              </div>
            </CardContent>
          </Card>

          {/* Display & Regional Preferences */}
          <Card className="border-[#27272A] bg-[#111113]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FFBF24]" />
                <span>Regional Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                label="Primary Display Currency"
                defaultValue="USD"
                options={[
                  { value: 'USD', label: 'USD ($) - United States Dollar' },
                  { value: 'INR', label: 'INR (₹) - Indian Rupee' },
                  { value: 'EUR', label: 'EUR (€) - Euro' },
                  { value: 'GBP', label: 'GBP (£) - British Pound' },
                ]}
              />
              <Select
                label="Measurement Units"
                defaultValue="km"
                options={[
                  { value: 'km', label: 'Metric System (km, m)' },
                  { value: 'mi', label: 'Imperial System (miles, ft)' },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
