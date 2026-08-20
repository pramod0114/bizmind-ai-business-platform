/**
 * BizMind – Dashboard TopBar with User Identity & Dropdown Menu
 */
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User as UserIcon, ExternalLink, LogOut, Settings, Shield, ChevronDown } from 'lucide-react';
import { healthService } from '../../services/healthService';
import { SystemHealth } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export interface TopBarProps {
  collapsed: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
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
        console.warn('API Health ping:', err);
        setHealthLoading(false);
      });
  }, []);

  // Close dropdown when clicking outside
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
      className={`fixed top-0 right-0 z-20 h-16 bg-[#111113]/90 backdrop-blur-md border-b border-[#27272A] transition-all duration-300 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Search Bar Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
          <input
            type="text"
            placeholder="Search plans, market metrics, location data..."
            className="w-full bg-[#1A1A1D] border border-[#27272A] rounded-lg pl-9 pr-4 py-1.5 text-xs md:text-sm text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:border-[#FFBF24] focus:ring-1 focus:ring-[#FFBF24]/40"
          />
        </div>

        {/* Right Topbar Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live System Health Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1A1A1D] border border-[#27272A] text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                health?.status === 'healthy' ? 'bg-[#22C55E] animate-pulse' : 'bg-[#FFBF24]'
              }`}
            />
            <span className="text-[11px] font-mono text-[#F8FAFC]">
              API: {healthLoading ? 'Connecting...' : health?.status || 'Online'}
            </span>
          </div>

          {/* Public Landing Link */}
          <Link
            to="/"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] border border-[#27272A] transition-colors"
          >
            <span>Landing</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] border border-[#27272A] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFBF24] rounded-full" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative pl-2 border-l border-[#27272A]" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#1A1A1D] transition-colors text-left cursor-pointer group"
              id="user-profile-menu-button"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FFBF24] text-[#0B0B0C] font-bold text-xs flex items-center justify-center shadow-md">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#FFBF24] transition-colors leading-tight">
                  {user?.full_name || 'Authenticated User'}
                </span>
                <span className="text-[10px] text-[#A1A1AA] font-mono">
                  {user?.role || 'USER'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#F8FAFC] transition-colors hidden md:block" />
            </button>

            {/* Dropdown Menu Popup */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111113] border border-[#27272A] shadow-2xl py-1.5 z-50 animate-fadeIn text-xs">
                <div className="px-3.5 py-2 border-b border-[#27272A] mb-1">
                  <p className="font-semibold text-[#F8FAFC] truncate">{user?.full_name}</p>
                  <p className="text-[11px] text-[#A1A1AA] font-mono truncate">{user?.email}</p>
                  <span
                    className={`inline-block mt-1 px-1.5 py-0.2 text-[9px] font-bold rounded ${
                      isAdmin ? 'bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/30' : 'bg-[#27272A] text-[#A1A1AA]'
                    }`}
                  >
                    {user?.role || 'USER'}
                  </span>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#FFBF24]" />
                  <span>Profile & Settings</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-[#FFBF24] hover:bg-[#1A1A1D] transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Console</span>
                  </Link>
                )}

                <div className="border-t border-[#27272A] my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left cursor-pointer"
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
