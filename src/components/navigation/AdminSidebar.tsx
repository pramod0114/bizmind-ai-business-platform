/**
 * BizMind – Dedicated Administrator Console Sidebar
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Database,
  TrendingUp,
  Cpu,
  BarChart3,
  ScrollText,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { user } = useAuth();

  const adminNavItems = [
    { name: 'System Overview', path: '/admin', icon: LayoutGrid, exact: true },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Business Data', path: '/admin/businesses', icon: Database },
    { name: 'Market Data', path: '/admin/market-data', icon: TrendingUp },
    { name: 'ML Management', path: '/admin/ml-models', icon: Cpu, badge: 'Ensembles' },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: ScrollText },
    { name: 'System Settings', path: '/admin/settings', icon: Sliders },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-[#0F0F12] border-r border-[#FFBF24]/20 backdrop-blur-md transition-all duration-300 shadow-xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header with Elevated Admin Styling */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#27272A] bg-[#141418]">
        <NavLink to="/admin" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-8 h-8 rounded-lg bg-[#FFBF24] flex items-center justify-center text-[#0B0B0C] font-black text-base shrink-0 shadow-md shadow-[#FFBF24]/20">
            B
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#F8FAFC] tracking-tight flex items-center gap-1.5">
                BizMind <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FFBF24] text-[#0B0B0C] font-bold">ADMIN</span>
              </span>
              <span className="text-[10px] text-[#A1A1AA] font-mono">
                Platform Console
              </span>
            </div>
          )}
        </NavLink>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#FFBF24] hover:bg-[#1A1A1D] transition-colors cursor-pointer hidden md:block"
          title={collapsed ? 'Expand admin sidebar' : 'Collapse admin sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Admin Navigation Links */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-6">
        <div>
          {!collapsed && (
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-semibold text-[#FFBF24] uppercase tracking-wider">
                Admin Control
              </span>
              <span className="text-[9px] font-mono text-[#71717A] px-1 py-0.2 rounded bg-[#1A1A1D] border border-[#27272A]">
                RBAC Level 1
              </span>
            </div>
          )}
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={Boolean(item.exact)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#FFBF24]/15 text-[#FFBF24] border border-[#FFBF24]/40 shadow-sm font-semibold'
                        : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] border border-transparent'
                    }`
                  }
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0 text-current" />
                  {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                  {!collapsed && item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1A1A1D] text-[#FFBF24] font-semibold border border-[#FFBF24]/20">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Quick Context Switch to User Space */}
        <div className="pt-2 border-t border-[#27272A]">
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold text-[#71717A] uppercase tracking-wider mb-2">
              User Workspace
            </p>
          )}
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-[#A1A1AA] hover:text-[#FFBF24] hover:bg-[#1A1A1D] border border-dashed border-[#27272A] hover:border-[#FFBF24]/40 transition-all group"
            title={collapsed ? 'Switch to User Dashboard' : undefined}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-[#FFBF24]" />
            {!collapsed && (
              <div className="flex-1 flex items-center justify-between">
                <span className="truncate">Entrepreneur Suite</span>
                <ExternalLink className="w-3 h-3 text-[#71717A] group-hover:text-[#FFBF24]" />
              </div>
            )}
          </NavLink>
        </div>
      </div>

      {/* Admin Identity Footer */}
      {!collapsed && (
        <div className="p-3 mx-3 mb-3 rounded-lg bg-[#141418] border border-[#FFBF24]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-2 h-2 rounded-full bg-[#FFBF24] animate-pulse shrink-0" />
              <span className="text-[11px] font-semibold text-[#F8FAFC] truncate">
                {user?.full_name || 'Administrator'}
              </span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FFBF24]/10 text-[#FFBF24] font-bold border border-[#FFBF24]/30">
              ADMIN
            </span>
          </div>
          <p className="text-[10px] text-[#71717A] mt-1 font-mono truncate">
            {user?.email || 'admin@bizmind.ai'}
          </p>
        </div>
      )}
    </aside>
  );
};
