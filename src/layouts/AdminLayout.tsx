/**
 * BizMind – Dedicated Administrator Console Layout
 */
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/navigation/AdminSidebar';
import { AdminTopBar } from '../components/navigation/AdminTopBar';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F8FAFC] selection:bg-[#FFBF24] selection:text-[#0B0B0C]">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

      {/* Admin TopBar Controls */}
      <AdminTopBar collapsed={collapsed} />

      {/* Main Content Area */}
      <main
        className={`pt-20 pb-16 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          collapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
