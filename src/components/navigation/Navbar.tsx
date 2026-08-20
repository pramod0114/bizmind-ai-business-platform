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
    <header className="sticky top-0 z-40 w-full bg-[#111113]/90 backdrop-blur-md border-b border-[#27272A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#FFBF24] flex items-center justify-center text-[#0B0B0C] font-black text-base shadow-sm group-hover:bg-[#F59E0B] transition-colors">
            B
          </div>
          <div>
            <span className="text-lg font-bold text-[#F8FAFC] tracking-tight flex items-center gap-1.5">
              BizMind <span className="text-[#FFBF24] font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#FFBF24]/10 border border-[#FFBF24]/30">AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#FFBF24] bg-[#FFBF24]/10 border border-[#FFBF24]/30'
                    : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Public / Authenticated Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/settings"
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#1A1A1D] border border-[#27272A] text-xs text-[#F8FAFC] hover:border-[#FFBF24]/40 transition-colors"
              >
                <div className="w-6 h-6 rounded-md bg-[#FFBF24] text-[#0B0B0C] font-bold flex items-center justify-center text-[10px]">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="font-medium max-w-[120px] truncate">{user?.full_name}</span>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" variant="primary" rightIcon={<LayoutDashboard className="w-3.5 h-3.5" />}>
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
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
