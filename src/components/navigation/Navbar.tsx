/**
 * BizMind – Public Landing Navigation Bar
 */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, User, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-2">
      <div className="max-w-6xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left balance placeholder */}
        <div className="hidden md:block w-48" />

        {/* Centered Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-2 flex-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'text-[#FFBF24] font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Public / Authenticated Action CTAs (Right-aligned) */}
        <div className="hidden md:flex items-center justify-end gap-3 w-48">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#1A1A1D] border border-[#27272A] text-xs text-[#F8FAFC] hover:border-[#FFBF24]/40 transition-colors"
              >
                <div className="w-5 h-5 rounded bg-[#FFBF24] text-[#0B0B0C] font-bold flex items-center justify-center text-[10px]">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="font-medium max-w-[100px] truncate">{user?.full_name}</span>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" variant="primary" rightIcon={<LayoutDashboard className="w-3.5 h-3.5" />}>
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile View Controls */}
        <div className="flex md:hidden items-center justify-between w-full">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Navigation</span>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm" variant="primary">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm" variant="outline">
                  Sign In
                </Button>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111113] border-b border-[#27272A] px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#27272A] flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" variant="primary" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-center text-xs text-[#EF4444] hover:underline"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Create Free Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
