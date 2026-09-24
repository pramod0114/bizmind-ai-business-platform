/**
 * BizMind – Dashboard Sidebar Navigation
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  TrendingUp,
  MapPin,
  GitCompare,
  Cpu,
  Sparkles,
  Bookmark,
  FileText,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { user, isAdmin } = useAuth();

  const mainNavItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Business Plans', path: '/business-plans', icon: FileText },
    { name: 'Planner Wizard', path: '/business-planner', icon: FileSpreadsheet },
    { name: 'Market & Competition', path: '/market-analysis', icon: TrendingUp, badge: 'Part 6' },
    { name: 'Location Intelligence', path: '/market-analysis', icon: MapPin },
    { name: 'Comparison', path: '/comparison', icon: GitCompare },
    { name: 'Predictions', path: '/predictions', icon: Cpu, badge: 'ML' },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
    { name: 'Saved Businesses', path: '/saved', icon: Bookmark },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-[#111113] border-r border-[#27272A] backdrop-blur-md transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#27272A]">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-8 h-8 rounded-lg bg-[#FFBF24] flex items-center justify-center text-[#0B0B0C] font-black text-base shrink-0 shadow-sm group-hover:bg-[#F59E0B] transition-colors">
            B
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold text-[#F8FAFC] tracking-tight whitespace-nowrap">
                BizMind
              </span>
              <span className="text-[10px] text-[#A1A1AA] font-medium">
                Decision Intelligence
              </span>
            </div>
          )}
        </NavLink>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] transition-colors cursor-pointer hidden md:block"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-6">
        <div>
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold text-[#71717A] uppercase tracking-wider mb-2">
              Decision Suite
            </p>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/30'
                        : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] border border-transparent'
                    }`
                  }
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0 text-current" />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.name}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1A1A1D] text-[#FFBF24] font-semibold border border-[#27272A]">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold text-[#71717A] uppercase tracking-wider mb-2">
              System & Management
            </p>
          )}
          <nav className="space-y-1">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/30'
                    : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] border border-transparent'
                }`
              }
              title={collapsed ? 'Settings' : undefined}
            >
              <Settings className="w-4 h-4 shrink-0 text-current" />
              {!collapsed && <span className="flex-1 truncate">Profile & Settings</span>}
            </NavLink>

            {/* Admin Console Route */}
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/30'
                    : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] border border-transparent'
                }`
              }
              title={collapsed ? 'Admin Console' : undefined}
            >
              <Shield className="w-4 h-4 shrink-0 text-current" />
              {!collapsed && <span className="flex-1 truncate">Admin Console</span>}
              {!collapsed && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold border ${
                    isAdmin
                      ? 'bg-[#FFBF24]/20 text-[#FFBF24] border-[#FFBF24]/40'
                      : 'bg-[#1A1A1D] text-[#71717A] border-[#27272A]'
                  }`}
                >
                  {isAdmin ? 'Admin' : 'Restricted'}
                </span>
              )}
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Authenticated User Status Footer */}
      {!collapsed && (
        <div className="p-3 mx-3 mb-3 rounded-lg bg-[#1A1A1D] border border-[#27272A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
              <span className="text-[11px] font-semibold text-[#F8FAFC] truncate">
                {user?.full_name || 'Authenticated'}
              </span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#111113] text-[#FFBF24] border border-[#27272A]">
              {user?.role || 'USER'}
            </span>
          </div>
          <p className="text-[10px] text-[#71717A] mt-1 truncate">
            {user?.email || 'Active Session'}
          </p>
        </div>
      )}
    </aside>
  );
};
