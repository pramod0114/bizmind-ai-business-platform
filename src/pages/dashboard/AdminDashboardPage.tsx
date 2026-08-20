/**
 * BizMind – Administrator Console & Oversight Center
 */
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Shield, Users, Activity, CheckCircle2, UserCheck, ShieldCheck, Mail, Calendar, Phone, RefreshCw } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { User } from '../../types';

interface AdminStats {
  totalUsers: number;
  adminUsers: number;
  standardUsers: number;
  activeUsers: number;
  totalPredictions: number;
  totalPlans: number;
  systemLoad: string;
  uptimeSeconds: number;
  dbStatus?: {
    connected: boolean;
    mode: string;
  };
}

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchAdminData = async () => {
    try {
      setIsRefreshing(true);
      const [statsRes, usersRes] = await Promise.all([
        api.get<AdminStats>('/admin/stats'),
        api.get<User[]>('/admin/users'),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch admin telemetry:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Never';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Administrator Control Center"
          description="Administrative oversight, user registry management, role-based permissions, and telemetry."
          badge="Admin Console"
          badgeVariant="primary"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAdminData}
          isLoading={isRefreshing}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="self-start sm:self-auto"
        >
          Refresh Data
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#27272A] bg-[#111113]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#A1A1AA]">Total Registered Users</p>
              <p className="text-2xl font-bold text-[#F8FAFC] mt-1">
                {isLoading ? '...' : stats?.totalUsers ?? users.length}
              </p>
              <p className="text-[10px] text-[#22C55E] mt-0.5 font-medium">
                {stats?.activeUsers ?? users.length} Active Accounts
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-[#27272A] bg-[#111113]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#A1A1AA]">Administrators</p>
              <p className="text-2xl font-bold text-[#FFBF24] mt-1">
                {isLoading ? '...' : stats?.adminUsers ?? users.filter((u) => u.role === 'ADMIN').length}
              </p>
              <p className="text-[10px] text-[#A1A1AA] mt-0.5">Elevated Privileges</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-[#27272A] bg-[#111113]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#A1A1AA]">Standard Users</p>
              <p className="text-2xl font-bold text-[#F8FAFC] mt-1">
                {isLoading ? '...' : stats?.standardUsers ?? users.filter((u) => u.role === 'USER').length}
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5">Planner Workspace</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#38BDF8]">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-[#27272A] bg-[#111113]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#A1A1AA]">Authentication Engine</p>
              <p className="text-2xl font-bold text-[#22C55E] mt-1">Secure</p>
              <p className="text-[10px] text-[#A1A1AA] mt-0.5">JWT (HS256) + bcrypt</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#22C55E]">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* User Directory Table */}
      <Card className="border-[#27272A] bg-[#111113]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FFBF24]" />
                <span>User Directory Registry</span>
              </CardTitle>
              <CardDescription className="text-xs text-[#A1A1AA]">
                Live listing of registered accounts in the BizMind database. Password hashes are strictly omitted.
              </CardDescription>
            </div>
            <Badge variant="outline" size="sm">
              {users.length} {users.length === 1 ? 'User' : 'Users'} Registered
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#A1A1AA] uppercase border-b border-[#27272A] bg-[#1A1A1D]/50 text-[11px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#71717A]">
                      {isLoading ? 'Loading user registry...' : 'No registered users found.'}
                    </td>
                  </tr>
                ) : (
                  users.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1A1A1D]/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#FFBF24] text-[#0B0B0C] font-bold flex items-center justify-center text-xs">
                            {item.full_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="font-semibold text-[#F8FAFC]">{item.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#A1A1AA] font-mono text-[11px]">
                        {item.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            item.role === 'ADMIN'
                              ? 'bg-[#FFBF24]/10 text-[#FFBF24] border-[#FFBF24]/30'
                              : 'bg-[#27272A] text-[#F8FAFC] border-[#3F3F46]'
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#71717A]">
                        {item.phone || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-[#A1A1AA]">
                        {formatDate(item.created_at || item.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-[#A1A1AA]">
                        {formatDate(item.last_login || item.lastLogin)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#22C55E] font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
