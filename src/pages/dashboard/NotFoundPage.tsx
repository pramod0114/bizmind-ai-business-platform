import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#FFBF24] mb-4 shadow-xl">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-4xl font-extrabold text-[#FFBF24] font-mono">404</span>
      <h1 className="text-xl font-bold text-[#F8FAFC] mt-2">Page Not Found</h1>
      <p className="text-xs text-[#A1A1AA] mt-1 max-w-sm">
        The requested endpoint or view does not exist in the BizMind decision suite.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/">
          <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Return Home
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button size="sm">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
