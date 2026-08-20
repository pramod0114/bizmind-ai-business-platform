/**
 * BizMind – Administrator User Management Page
 */
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import {
  Users,
  Search,
  UserPlus,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  AlertCircle,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Shield,
  Filter,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const AdminUsersPage: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');

  // New user modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newRole, setNewRole] = useState<'USER' | 'ADMIN'>('USER');
  const [newPhone, setNewPhone] = useState<string>('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to fetch user list.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const nextStatus = !Boolean(user.is_active);
      await adminService.updateUserStatus(user.id, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: nextStatus } : u))
      );
      showToast(`User ${user.email} marked as ${nextStatus ? 'ACTIVE' : 'SUSPENDED'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update user status.', 'error');
    }
  };

  const handleToggleRole = async (user: User) => {
    try {
      const nextRole: 'USER' | 'ADMIN' = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
      await adminService.updateUserRole(user.id, nextRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
      );
      showToast(`User ${user.email} role updated to ${nextRole}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update role.', 'error');
    }
  };

  const handleDeleteUser = async (userId: number | string, email: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${email}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast(`User ${email} deleted successfully.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user.', 'error');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!newFullName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setCreateError('Please complete all required fields.');
      return;
    }

    try {
      setIsCreating(true);
      const created = await adminService.createUser({
        full_name: newFullName.trim(),
        email: newEmail.trim(),
        password: newPassword,
        role: newRole,
        phone: newPhone.trim() || undefined,
      });

      setUsers((prev) => [created, ...prev]);
      setShowCreateModal(false);
      setNewFullName('');
      setNewEmail('');
      setNewPassword('');
      setNewPhone('');
      showToast(`User account created for ${created.email}.`);
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create user account.');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      u.full_name?.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.phone && u.phone.toLowerCase().includes(query));

    const matchesRole =
      roleFilter === 'ALL' ||
      u.role.toUpperCase() === roleFilter;

    const isActive = Boolean(u.is_active);
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && isActive) ||
      (statusFilter === 'SUSPENDED' && !isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Add User button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="User Account Management"
          description="View, filter, manage RBAC permissions, create accounts, and enforce access control policies."
          badge="Admin Console"
          badgeVariant="primary"
        />
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          >
            Provision User
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
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

      {/* Search and Filters Bar */}
      <Card className="border-[#27272A] bg-[#111113]">
        <div className="p-4 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder="Filter by name, email, or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1D] border border-[#27272A] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:border-[#FFBF24]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-[#1A1A1D] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24]"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admins Only</option>
              <option value="USER">Standard Users Only</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#1A1A1D] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="SUSPENDED">Suspended Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="border-[#27272A] bg-[#111113]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FFBF24]" />
              <span>User Registry ({filteredUsers.length})</span>
            </CardTitle>
            <Badge variant="outline" size="sm">
              Backend Verified (RBAC)
            </Badge>
          </div>
          <CardDescription className="text-xs text-[#A1A1AA]">
            Real-time accounts authenticated via bcrypt and JWT. Administrators can toggle roles, suspend sessions, or remove accounts.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#A1A1AA] uppercase border-b border-[#27272A] bg-[#1A1A1D]/60 text-[11px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#71717A]">
                      Loading user accounts from database...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#71717A]">
                      No user accounts match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item) => {
                    const isSelf = currentAdmin?.id === item.id;
                    const isActive = Boolean(item.is_active);

                    return (
                      <tr key={item.id} className="hover:bg-[#1A1A1D]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#FFBF24] text-[#0B0B0C] font-bold flex items-center justify-center text-xs shrink-0">
                              {item.full_name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-[#F8FAFC]">
                                {item.full_name} {isSelf && <span className="text-[10px] text-[#FFBF24] font-normal">(You)</span>}
                              </span>
                              {item.phone && <span className="text-[10px] text-[#71717A]">{item.phone}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#A1A1AA] font-mono text-[11px]">
                          {item.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleRole(item)}
                            disabled={isSelf}
                            title={isSelf ? 'Cannot modify self role' : 'Click to toggle role'}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                              item.role === 'ADMIN'
                                ? 'bg-[#FFBF24]/15 text-[#FFBF24] border-[#FFBF24]/30 hover:bg-[#FFBF24]/25'
                                : 'bg-[#27272A] text-[#F8FAFC] border-[#3F3F46] hover:bg-[#3F3F46]'
                            } ${isSelf ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                          >
                            <Shield className="w-3 h-3" />
                            <span>{item.role}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-[#71717A] text-[11px]">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleStatus(item)}
                            disabled={isSelf}
                            title={isSelf ? 'Cannot suspend self account' : 'Click to toggle status'}
                            className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${
                              isActive ? 'text-[#22C55E]' : 'text-[#EF4444]'
                            } ${isSelf ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                          >
                            {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span>{isActive ? 'Active' : 'Suspended'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDeleteUser(item.id, item.email)}
                              disabled={isSelf}
                              className={`p-1.5 rounded hover:bg-[#EF4444]/15 text-[#71717A] hover:text-[#EF4444] transition-colors ${
                                isSelf ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                              title={isSelf ? 'Cannot delete your own account' : 'Delete user account'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Provision User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0C]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <h3 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#FFBF24]" />
                <span>Provision User Account</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#71717A] hover:text-[#F8FAFC] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <Input
                label="Full Name *"
                type="text"
                placeholder="e.g. Eleanor Vance"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                leftIcon={<UserIcon className="w-4 h-4 text-[#71717A]" />}
                required
              />

              <Input
                label="Email Address *"
                type="email"
                placeholder="e.g. eleanor@company.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-[#71717A]" />}
                required
              />

              <Input
                label="Temporary Password *"
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-[#71717A]" />}
                required
              />

              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-[#71717A]" />}
              />

              <div>
                <label className="block text-xs font-medium text-[#F8FAFC] mb-1.5">
                  Initial Role Assignment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRole('USER')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      newRole === 'USER'
                        ? 'bg-[#FFBF24]/15 text-[#FFBF24] border-[#FFBF24]'
                        : 'bg-[#1A1A1D] text-[#A1A1AA] border-[#27272A]'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>USER (Planner)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('ADMIN')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      newRole === 'ADMIN'
                        ? 'bg-[#FFBF24]/15 text-[#FFBF24] border-[#FFBF24]'
                        : 'bg-[#1A1A1D] text-[#A1A1AA] border-[#27272A]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ADMIN (Console)</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#27272A]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isCreating}
                >
                  {isCreating ? 'Provisioning...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
