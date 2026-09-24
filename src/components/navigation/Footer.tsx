import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Github, Shield, Cpu, Database, Map } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0B0C] border-t border-[#27272A] text-[#A1A1AA] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FFBF24] flex items-center justify-center text-[#0B0B0C] font-bold text-base shadow-sm">
                B
              </div>
              <span className="text-base font-bold text-[#F8FAFC]">BizMind</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              "Plan Smarter. Analyze Better. Build with Confidence."
            </p>
            <p className="text-[11px] text-[#71717A]">
              AI-driven business decision-support, location intelligence, and predictive success modeling.
            </p>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-[#FFBF24] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-[#FFBF24] transition-colors">
                  Platform Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#FFBF24] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FFBF24] transition-colors">
                  About Project
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FFBF24] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Suite Features Col */}
          <div>
            <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">
              Decision Suite
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="hover:text-[#FFBF24] transition-colors">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link to="/business-planner" className="hover:text-[#FFBF24] transition-colors">
                  AI Business Planner
                </Link>
              </li>
              <li>
                <Link to="/market-analysis" className="hover:text-[#FFBF24] transition-colors">
                  Market & Competition Intelligence
                </Link>
              </li>
              <li>
                <Link to="/market-analysis" className="hover:text-[#FFBF24] transition-colors">
                  Location Intelligence
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="hover:text-[#FFBF24] transition-colors">
                  Site & Market Comparison
                </Link>
              </li>
              <li>
                <Link to="/predictions" className="hover:text-[#FFBF24] transition-colors">
                  ML Probability Modeling
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Capabilities Col */}
          <div>
            <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">
              Platform & Features
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/market-analysis" className="hover:text-[#FFBF24] transition-colors">
                  Geospatial Market Analytics
                </Link>
              </li>
              <li>
                <Link to="/market-analysis" className="hover:text-[#FFBF24] transition-colors">
                  OpenStreetMap & Google Places
                </Link>
              </li>
              <li>
                <Link to="/predictions" className="hover:text-[#FFBF24] transition-colors">
                  Predictive Risk Diagnostics
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-[#FFBF24] transition-colors">
                  Decision Intelligence Suite
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1A1A1D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#71717A]">
          <p>© 2026 BizMind Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#A1A1AA]">
              <Shield className="w-3 h-3 text-[#FFBF24]" />
              Enterprise Decision Intelligence
            </span>
            <span>•</span>
            <span className="text-[#71717A] font-mono">BizMind AI Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
