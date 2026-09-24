import React, { useState } from 'react';
import { MarketAnalysisDashboard } from '../../components/market/MarketAnalysisDashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';
import {
  TrendingUp,
  Compass,
  BarChart2,
  DollarSign,
  Activity,
  Globe,
  Building2,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface IndustryTrend {
  id: string;
  name: string;
  category: string;
  marketSizeInBillions: number;
  cagr: number;
  saturationIndex: number;
  avgTicketSize: number;
  demandGrowthRate: number;
  riskTier: 'Low' | 'Moderate' | 'High';
  keyDrivers: string[];
  projectedOutlook: string;
}

interface RegionalBenchmark {
  id: string;
  region: string;
  city: string;
  footfallIndex: number;
  avgHouseholdIncome: string;
  commercialRentPerSqFt: string;
  competitorDensity: string;
  growthTrend: string;
  status: string;
}

interface MarketDataResponse {
  industries: IndustryTrend[];
  regionalBenchmarks: RegionalBenchmark[];
  summary: {
    totalMarketTrackedBillions: number;
    averageCAGR: number;
    highestGrowthSector: string;
    lowestRiskSector: string;
  };
}

export const MarketAnalysisPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'competition' | 'macro'>('competition');
  const [macroData, setMacroData] = useState<MarketDataResponse | null>(null);
  const [loadingMacro, setLoadingMacro] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryTrend | null>(null);

  const loadMacroData = async () => {
    if (macroData) return;
    setLoadingMacro(true);
    try {
      const res = await api.get<MarketDataResponse>('/market/trends');
      if (res.data) {
        setMacroData(res.data);
        if (res.data.industries?.length > 0) {
          setSelectedIndustry(res.data.industries[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load macro benchmarks:', err);
    } finally {
      setLoadingMacro(false);
    }
  };

  const handleTabChange = (tab: 'competition' | 'macro') => {
    setActiveTab(tab);
    if (tab === 'macro') {
      loadMacroData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Module Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
        <div className="flex items-center gap-2 bg-[#111113] p-1 rounded-xl border border-[#27272A] text-xs">
          <button
            type="button"
            onClick={() => handleTabChange('competition')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'competition'
                ? 'bg-[#FFBF24] text-[#0B0B0C] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Hyperlocal Market & Competition (Part 6)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('macro')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'macro'
                ? 'bg-[#FFBF24] text-[#0B0B0C] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Macro Industry Benchmarks</span>
          </button>
        </div>

        <span className="text-[11px] text-[#A1A1AA] font-mono hidden sm:inline-block">
          BizMind Decision Engine
        </span>
      </div>

      {/* Tab 1: Primary Part 6 Market & Competition Analysis */}
      {activeTab === 'competition' && <MarketAnalysisDashboard />}

      {/* Tab 2: Secondary Macroeconomic Industry Benchmarks */}
      {activeTab === 'macro' && (
        <div className="space-y-6">
          <Card className="border-[#27272A] bg-[#1A1A1D]">
            <CardHeader>
              <CardTitle>Regional Macroeconomic Industry Benchmarks</CardTitle>
              <CardDescription>
                High-level sector capitalization estimates and growth velocities across Indian metropolitan hubs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingMacro ? (
                <div className="p-8 text-center text-xs text-[#A1A1AA]">Loading macroeconomic datasets...</div>
              ) : macroData ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {macroData.industries.map((ind) => (
                      <div
                        key={ind.id}
                        onClick={() => setSelectedIndustry(ind)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          selectedIndustry?.id === ind.id
                            ? 'bg-[#18181B] border-[#FFBF24]'
                            : 'bg-[#111113] border-[#27272A] hover:border-[#3F3F46]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#F8FAFC]">{ind.name}</span>
                          <Badge variant={ind.riskTier === 'Low' ? 'success' : ind.riskTier === 'Moderate' ? 'warning' : 'error'} size="sm">
                            {ind.riskTier} Risk
                          </Badge>
                        </div>
                        <span className="text-[10px] text-[#FFBF24] block">{ind.category}</span>
                        <div className="mt-2 pt-2 border-t border-[#27272A] flex justify-between text-[11px] text-[#A1A1AA]">
                          <span>Market: ${ind.marketSizeInBillions}B</span>
                          <span className="text-emerald-400 font-semibold">+{ind.cagr}% CAGR</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedIndustry && (
                    <div className="p-4 rounded-xl bg-[#111113] border border-[#27272A] space-y-2 mt-4">
                      <span className="text-xs font-bold text-[#FFBF24] uppercase font-mono block">
                        Sector Deep Dive: {selectedIndustry.name}
                      </span>
                      <p className="text-[#F8FAFC] text-xs leading-relaxed">{selectedIndustry.projectedOutlook}</p>
                      <div className="pt-2">
                        <span className="text-[10px] text-[#A1A1AA] uppercase font-mono block mb-1">Primary Growth Drivers:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedIndustry.keyDrivers.map((driver, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-[11px] text-slate-300">
                              • {driver}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
