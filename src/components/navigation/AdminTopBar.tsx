/**
 * BizMind – Dedicated Administrator Console TopBar
 */
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ExternalLink, LogOut, Shield, ChevronDown, Sparkles, Activity, Database, Sliders } from 'lucide-react';
import { healthService } from '../../services/healthService';
import { SystemHealth } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export interface AdminTopBarProps {
  collapsed: boolean;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    healthService
      .getSystemHealth()
      .then((data) => {
        setHealth(data);
        setHealthLoading(false);
      })
      .catch((err) => {
        console.warn('API Health check:', err);
        setHealthLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 bg-[#0F0F12]/95 backdrop-blur-md border-b border-[#27272A] transition-all duration-300 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Admin Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
          <input
            type="text"
            placeholder="Search users by email, datasets, audit events, models..."
            className="w-full bg-[#16161B] border border-[#27272A] rounded-lg pl-9 pr-4 py-1.5 text-xs md:text-sm text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:border-[#FFBF24] focus:ring-1 focus:ring-[#FFBF24]/40"
          />
        </div>

        {/* Right Admin Topbar Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Admin Role Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFBF24]/10 border border-[#FFBF24]/30 text-xs text-[#FFBF24] font-semibold">
            <Shield className="w-3.5 h-3.5 text-[#FFBF24]" />
            <span className="text-[11px] font-mono">ADMIN PRIVILEGES ACTIVE</span>
          </div>

          {/* Database Connectivity Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#16161B] border border-[#27272A] text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                health?.services.database.connected ? 'bg-[#22C55E] animate-pulse' : 'bg-[#22C55E]'
              }`}
            />
            <span className="text-[11px] font-mono text-[#A1A1AA]">
              DB: <span className="text-[#F8FAFC] font-semibold">MySQL (ACID)</span>
            </span>
          </div>

          {/* Switch to User Space Button */}
          <Link
            to="/dashboard"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#FFBF24] bg-[#16161B] hover:bg-[#202026] border border-[#FFBF24]/25 transition-all"
            title="Open Entrepreneur/User Dashboard"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFBF24]" />
            <span>User View</span>
          </Link>

          {/* Audit Alert Notifications */}
          <Link
            to="/admin/audit-logs"
            className="relative p-2 rounded-lg text-[#A1A1AA] hover:text-[#FFBF24] hover:bg-[#16161B] border border-[#27272A] transition-colors"
            title="View Security & Audit Logs"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFBF24] rounded-full animate-ping" />
          </Link>

          {/* Admin Profile Dropdown */}
          <div className="relative pl-2 border-l border-[#27272A]" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#16161B] transition-colors text-left cursor-pointer group"
              id="admin-profile-menu-button"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FFBF24] text-[#0B0B0C] font-black text-xs flex items-center justify-center shadow-md shadow-[#FFBF24]/20">
                A
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#FFBF24] transition-colors leading-tight">
                  {user?.full_name || 'System Administrator'}
                </span>
                <span className="text-[10px] text-[#FFBF24] font-mono font-semibold">
                  SUPER ADMIN
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#F8FAFC] transition-colors hidden md:block" />
            </button>

            {/* Dropdown Menu Popup */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-[#111113] border border-[#FFBF24]/30 shadow-2xl py-1.5 z-50 animate-fadeIn text-xs">
                <div className="px-3.5 py-2.5 border-b border-[#27272A] mb-1 bg-[#16161B]/60">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#F8FAFC] truncate">{user?.full_name}</p>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-[#FFBF24] text-[#0B0B0C]">
                      ADMIN
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A1A1AA] font-mono truncate mt-0.5">{user?.email}</p>
                </div>

                <Link
                  to="/admin/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#FFBF24]" />
                  <span>System Configuration</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFBF24]" />
                  <span>Switch to Entrepreneur Suite</span>
                </Link>

                <div className="border-t border-[#27272A] my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
