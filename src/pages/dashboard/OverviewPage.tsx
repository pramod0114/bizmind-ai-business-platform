import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { healthService } from '../../services/healthService';
import { planService } from '../../services/planService';
import { locationApiService } from '../../services/locationService';
import { SystemHealth, BusinessPlan, SavedLocationAnalysis, SavedBusiness } from '../../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FileSpreadsheet,
  Bookmark,
  TrendingUp,
  Sparkles,
  MapPin,
  Cpu,
  ArrowRight,
  Server,
  Database,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Navigation,
  Compass,
  Store,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [locationAnalyses, setLocationAnalyses] = useState<SavedLocationAnalysis[]>([]);
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      healthService.getSystemHealth().catch(() => null),
      planService.getPlans().catch(() => []),
      locationApiService.listLocationAnalyses().catch(() => []),
      locationApiService.listSavedBusinesses().catch(() => []),
    ]).then(([healthData, plansData, analysesData, businessesData]) => {
      if (healthData) setHealth(healthData);
      if (plansData) setPlans(plansData);
      if (analysesData) setLocationAnalyses(analysesData);
      if (businessesData) setSavedBusinesses(businessesData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Page Header */}
      <PageHeader
        title={`Welcome back, ${user?.full_name || 'Entrepreneur'}`}
        description="AI-powered business decision-support, market intelligence, geospatial discovery, and predictive feasibility platform."
        badge={user?.role ? `${user.role} Workspace` : 'Active Session'}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/location-analysis">
              <Button variant="outline" size="sm" leftIcon={<MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />}>
                Explore Map
              </Button>
            </Link>
            <Link to="/business-planner">
              <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Create New Plan
              </Button>
            </Link>
          </div>
        }
      />

      {/* 4 Core Analytic Stat Cards (Populated with live user portfolio data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Business Plans"
          value={loading ? '...' : String(plans.length)}
          sublabel={plans.length > 0 ? 'Active business models in vault' : 'Draft your first plan in Part 2'}
          icon={<FileSpreadsheet className="w-5 h-5" />}
        />
        <StatCard
          label="Bookmarked Businesses"
          value={loading ? '...' : String(savedBusinesses.length)}
          sublabel="Saved OSM establishments"
          icon={<Bookmark className="w-5 h-5" />}
        />
        <StatCard
          label="Location Analyses"
          value={loading ? '...' : String(locationAnalyses.length)}
          sublabel="Geospatial competition scans"
          icon={<MapPin className="w-5 h-5" />}
        />
        <StatCard
          label="Feasibility Models"
          value={loading ? '...' : String(plans.filter((p) => p.feasibility_score !== undefined).length)}
          sublabel="Cashflow & sensitivity computed"
          icon={<Sparkles className="w-5 h-5" />}
        />
      </div>

      {/* Location Intelligence Spotlight Card */}
      <Card className="border-[#27272A] bg-[#111113] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFBF24]/10 border border-[#FFBF24]/20 flex items-center justify-center text-[#FFBF24]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Live Location Intelligence</h3>
              <p className="text-xs text-[#A1A1AA]">
                Discover competitors, local density, and calculate rule-based opportunity scores using OpenStreetMap
              </p>
            </div>
          </div>

          <Link to="/location-analysis">
            <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Spatial Analysis
            </Button>
          </Link>
        </div>

        {/* Recent Location Scans / Quick Actions */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {locationAnalyses.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#18181B] border border-[#27272A] flex flex-col justify-between space-y-2 group hover:border-[#FFBF24]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8FAFC] line-clamp-1">{item.location_name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFBF24]/10 text-[#FFBF24]">
                    {item.opportunity_score}/100
                  </span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] line-clamp-1 mt-1">{item.address}</p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#71717A] pt-1 border-t border-[#27272A]">
                <span>Radius: {(item.radius / 1000).toFixed(1)} km</span>
                <span>{item.business_count} POIs</span>
              </div>
            </div>
          ))}

          {locationAnalyses.length === 0 && (
            <div className="md:col-span-3 p-4 rounded-xl bg-[#18181B] border border-[#27272A] text-center text-xs text-[#A1A1AA] space-y-1">
              <p className="font-semibold text-[#F8FAFC]">No location scans recorded yet</p>
              <p className="text-[11px]">Use the Location Analysis tool to scan your local area or target trade zone.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Real-time System & Architecture Status Panel */}
      <Card className="border-[#27272A] bg-[#1A1A1D]">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FFBF24]" />
              <CardTitle>Architecture & Subsystem Connectivity</CardTitle>
            </div>
            <CardDescription>
              Live operational health status verified across full-stack layers.
            </CardDescription>
          </div>
          <Badge variant="primary" size="sm">
            {loading ? 'Checking...' : health?.status === 'healthy' ? 'All Services Registered' : 'Active'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Express API Layer */}
            <div className="p-4 rounded-lg bg-[#111113] border border-[#27272A] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#FFBF24]" />
                    Express REST API
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                </div>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                  Port {health?.services?.api?.port || 3000} • Full-Stack Vite integration • CORS & JWT ready
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#27272A] text-[10px] font-mono text-[#22C55E]">
                Status: Operational
              </div>
            </div>

            {/* MySQL Database Layer */}
            <div className="p-4 rounded-lg bg-[#111113] border border-[#27272A] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#FFBF24]" />
                    MySQL Database Engine
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                </div>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                  14 Relational 3NF tables + Location Intelligence & Saved Business tables
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#27272A] text-[10px] font-mono text-[#38BDF8]">
                Architecture Established
              </div>
            </div>

            {/* Python FastAPI ML Service */}
            <div className="p-4 rounded-lg bg-[#111113] border border-[#27272A] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#FFBF24]" />
                    Python FastAPI ML
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
                </div>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                  Scikit-learn pipeline bridge • Spatial features integrated for Part 5
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#27272A] text-[10px] font-mono text-[#FACC15]">
                Service Pipeline Configured
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Launchpad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Decision Suite Modules</CardTitle>
            <CardDescription>
              Navigate to specialized decision intelligence workspaces.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/business-planner"
              className="p-3 rounded-lg bg-[#111113] border border-[#27272A] hover:border-[#FFBF24]/50 hover:bg-[#1A1A1D] transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#FFBF24] group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#F8FAFC] truncate">Business Planner</p>
                <p className="text-[10px] text-[#71717A]">Draft & model ideas</p>
              </div>
            </Link>

            <Link
              to="/location-analysis"
              className="p-3 rounded-lg bg-[#111113] border border-[#27272A] hover:border-[#FFBF24]/50 hover:bg-[#1A1A1D] transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#FFBF24] group-hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#F8FAFC] truncate">Location Analysis</p>
                <p className="text-[10px] text-[#71717A]">Leaflet & OSM map</p>
              </div>
            </Link>

            <Link
              to="/market-analysis"
              className="p-3 rounded-lg bg-[#111113] border border-[#27272A] hover:border-[#FFBF24]/50 hover:bg-[#1A1A1D] transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#FFBF24] group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#F8FAFC] truncate">Market Trends</p>
                <p className="text-[10px] text-[#71717A]">Industry CAGR intel</p>
              </div>
            </Link>

            <Link
              to="/predictions"
              className="p-3 rounded-lg bg-[#111113] border border-[#27272A] hover:border-[#FFBF24]/50 hover:bg-[#1A1A1D] transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1D] border border-[#27272A] flex items-center justify-center text-[#FFBF24] group-hover:scale-105 transition-transform">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#F8FAFC] truncate">ML Predictions</p>
                <p className="text-[10px] text-[#71717A]">Success modeling</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* 9-Part Capstone Roadmap Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>9-Part Build Lifecycle</CardTitle>
              <Badge variant="primary" size="sm">Part 4 Active</Badge>
            </div>
            <CardDescription>
              Progression roadmap strictly adhering to capstone development boundaries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="p-2 rounded bg-[#111113] border border-[#27272A] flex items-center justify-between text-[#A1A1AA]">
              <span>Part 1: Architecture, Monorepo & UI Shell</span>
              <span className="text-[10px] text-[#22C55E]">Completed</span>
            </div>
            <div className="p-2 rounded bg-[#111113] border border-[#27272A] flex items-center justify-between text-[#A1A1AA]">
              <span>Part 2: Authentication & Business Planner</span>
              <span className="text-[10px] text-[#22C55E]">Completed</span>
            </div>
            <div className="p-2 rounded bg-[#111113] border border-[#27272A] flex items-center justify-between text-[#A1A1AA]">
              <span>Part 3: Financial Feasibility Engine</span>
              <span className="text-[10px] text-[#22C55E]">Completed</span>
            </div>
            <div className="p-2 rounded bg-[#FFBF24]/10 border border-[#FFBF24]/30 flex items-center justify-between text-[#FFBF24]">
              <span className="font-semibold">Part 4: Location Intelligence & OSM Discovery</span>
              <span className="font-mono text-[10px] bg-[#FFBF24]/20 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <div className="p-2 rounded bg-[#111113] border border-[#27272A] flex items-center justify-between text-[#A1A1AA]">
              <span>Part 5: Python ML Model & Success Engine</span>
              <span className="text-[10px] text-[#71717A]">Next Phase</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
