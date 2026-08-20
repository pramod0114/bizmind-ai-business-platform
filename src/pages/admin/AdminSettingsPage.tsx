/**
 * BizMind – Administrator Platform Settings & System Configuration Page
 */
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import {
  Sliders,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Shield,
  Bell,
  Lock,
  Globe,
  Database,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { adminService } from '../../services/adminService';
import { PlatformSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>({
    maintenanceMode: false,
    allowRegistration: true,
    rateLimitPerMinute: 120,
    sessionTimeoutMinutes: 1440,
    systemAlertBanner: '',
    defaultCurrency: 'USD',
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getSettings();
      setSettings(data);
    } catch (err: any) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await adminService.updateSettings(settings);
      setSettings(updated);
      showToast('Platform configurations updated and propagated to backend services.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update system settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Platform Configuration & System Policies"
          description="Global operational flags, security parameters, system-wide broadcast banners, and runtime rate-limiting."
          badge="Admin Console"
          badgeVariant="primary"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSettings}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="self-start sm:self-auto"
        >
          Reload Config
        </Button>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
              : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Platform Access Controls */}
        <Card className="border-[#27272A] bg-[#111113]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FFBF24]" />
              <span>Platform Access & Registration</span>
            </CardTitle>
            <CardDescription className="text-xs text-[#A1A1AA]">
              Control public self-registration and overall platform availability.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#16161B] border border-[#27272A]">
              <div>
                <p className="text-xs font-semibold text-[#F8FAFC]">Maintenance Mode</p>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                  Temporarily lock non-admin user sessions for database migration or server maintenance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  settings.maintenanceMode ? 'bg-[#EF4444]' : 'bg-[#27272A]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#16161B] border border-[#27272A]">
              <div>
                <p className="text-xs font-semibold text-[#F8FAFC]">Public Self-Registration</p>
                <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                  Allow new visitors on the landing page to register free entrepreneur accounts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, allowRegistration: !s.allowRegistration }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  settings.allowRegistration ? 'bg-[#22C55E]' : 'bg-[#27272A]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Throttling */}
        <Card className="border-[#27272A] bg-[#111113]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FFBF24]" />
              <span>Security & Throttling Parameters</span>
            </CardTitle>
            <CardDescription className="text-xs text-[#A1A1AA]">
              Set rate limiting, token expiration, and API abuse prevention thresholds.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="API Rate Limit (Requests / minute / IP)"
                type="number"
                value={settings.rateLimitPerMinute}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, rateLimitPerMinute: Number(e.target.value) }))
                }
                helperText="Standard default: 120 req/min"
              />

              <Input
                label="JWT Session Timeout (Minutes)"
                type="number"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, sessionTimeoutMinutes: Number(e.target.value) }))
                }
                helperText="1440 minutes = 24 hours"
              />
            </div>
          </CardContent>
        </Card>

        {/* Broadcast System Banner */}
        <Card className="border-[#27272A] bg-[#111113]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FFBF24]" />
              <span>System-Wide Broadcast Announcement</span>
            </CardTitle>
            <CardDescription className="text-xs text-[#A1A1AA]">
              Display an advisory banner across all active user dashboards.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              label="Banner Message (Optional)"
              type="text"
              placeholder="e.g. Scheduled ML ensemble maintenance on Sunday at 02:00 UTC."
              value={settings.systemAlertBanner || ''}
              onChange={(e) => setSettings((s) => ({ ...s, systemAlertBanner: e.target.value }))}
              helperText="Leave empty to hide broadcast banner"
            />
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSaving ? 'Saving Configurations...' : 'Save Configuration Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
