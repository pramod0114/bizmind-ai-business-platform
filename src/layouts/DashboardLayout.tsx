import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { TopBar } from '../components/navigation/TopBar';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F8FAFC] selection:bg-[#FFBF24] selection:text-[#0B0B0C]">
      {/* Dynamic Sidebar */}
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

      {/* Dynamic TopBar */}
      <TopBar collapsed={collapsed} />

      {/* Main Content Area */}
      <main
        className={`pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
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
