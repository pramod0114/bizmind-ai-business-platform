import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0C] text-[#F8FAFC] selection:bg-[#FFBF24] selection:text-[#0B0B0C]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
