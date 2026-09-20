import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Activity,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Building2,
  DollarSign,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [data, setData] = useState<MarketDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryTrend | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const res = await api.get<MarketDataResponse>('/market/trends');
        if (res.data) {
          setData(res.data);
          if (res.data.industries?.length > 0) {
            setSelectedIndustry(res.data.industries[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load market trends:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, []);

  const filteredIndustries =
    !data?.industries
      ? []
      : selectedCategory === 'all'
      ? data.industries
      : data.industries.filter((i) => i.category === selectedCategory);

  const categories = ['all', ...(data?.industries ? Array.from(new Set(data.industries.map((i) => i.category))) : [])];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Market Analysis & Macroeconomic Trends"
        description="Sector capitalization velocity, regional commercial benchmarks, and saturation dynamics."
        badge="Market Intelligence"
        actions={
          <Link to="/location-analysis">
            <Button size="sm" leftIcon={<Compass className="w-3.5 h-3.5" />}>
              Open Local Geospatial Scan
            </Button>
          </Link>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tracked Market Cap"
          value={loading ? '...' : `$${data?.summary.totalMarketTrackedBillions || 270.6}B`}
          sublabel="SME primary consumer spend"
          icon={<DollarSign className="w-5 h-5 text-[#FFBF24]" />}
        />
        <StatCard
          label="Average Sector CAGR"
          value={loading ? '...' : `+${data?.summary.averageCAGR || 13.4}%`}
          sublabel="5-year projected growth"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Fastest Growing Domain"
          value={loading ? '...' : 'Pet Services'}
          sublabel="+19.4% YoY expansion"
          icon={<Activity className="w-5 h-5 text-indigo-400" />}
        />
        <StatCard
          label="Lowest Risk Index"
          value={loading ? '...' : 'Healthcare & Chemist'}
          sublabel="Inelastic essential demand"
          icon={<ShieldCheck className="w-5 h-5 text-blue-400" />}
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#27272A] pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/30'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D]'
            }`}
          >
            {cat === 'all' ? 'All Sectors' : cat}
          </button>
        ))}
      </div>

      {/* Industries Grid and Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIndustries.map((ind) => {
              const isSelected = selectedIndustry?.id === ind.id;
              return (
                <div
                  key={ind.id}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#18181B] border-[#FFBF24] shadow-lg shadow-[#FFBF24]/5'
                      : 'bg-[#111113] border-[#27272A] hover:border-[#3F3F46]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-[#FFBF24] uppercase tracking-wider">
                        {ind.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#F8FAFC] mt-0.5">{ind.name}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        ind.riskTier === 'Low'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : ind.riskTier === 'Moderate'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {ind.riskTier} Risk
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center py-2 bg-[#18181B] rounded-lg border border-[#27272A]">
                    <div>
                      <span className="text-[10px] text-[#71717A] block">Market Size</span>
                      <span className="text-xs font-bold text-[#F8FAFC]">${ind.marketSizeInBillions}B</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71717A] block">CAGR</span>
                      <span className="text-xs font-bold text-emerald-400">+{ind.cagr}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71717A] block">Avg Ticket</span>
                      <span className="text-xs font-bold text-[#F8FAFC]">₹{ind.avgTicketSize}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[#A1A1AA] line-clamp-2">{ind.projectedOutlook}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div>
          {selectedIndustry ? (
            <Card className="border-[#27272A] bg-[#111113] sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FFBF24] uppercase tracking-wider">
                    {selectedIndustry.category}
                  </span>
                  <Badge variant={selectedIndustry.riskTier === 'Low' ? 'success' : 'warning'}>
                    {selectedIndustry.riskTier} Risk Profile
                  </Badge>
                </div>
                <CardTitle className="text-base mt-1">{selectedIndustry.name}</CardTitle>
                <CardDescription className="text-xs">{selectedIndustry.projectedOutlook}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A1A1AA]">Saturation Index:</span>
                    <span className="font-bold text-[#F8FAFC]">{selectedIndustry.saturationIndex} / 10</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#27272A] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#FFBF24]"
                      style={{ width: `${selectedIndustry.saturationIndex * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#18181B] border border-[#27272A] space-y-2">
                  <span className="text-xs font-bold text-[#F8FAFC] block">Primary Growth Drivers:</span>
                  <ul className="space-y-1 text-xs text-[#A1A1AA]">
                    {selectedIndustry.keyDrivers.map((driver, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#FFBF24] mt-0.5">•</span>
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/business-planner" className="block pt-2">
                  <Button className="w-full" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Plan a {selectedIndustry.category} Business
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Regional Commercial Benchmarks Table */}
      <Card className="border-[#27272A] bg-[#111113]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#FFBF24]" />
            <span>Regional Commercial Real Estate & Footfall Benchmarks</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Commercial lease rates, competitor density, and household income across verified urban districts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#27272A] text-[#71717A] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">District & City</th>
                  <th className="py-2.5 px-3">Footfall Index</th>
                  <th className="py-2.5 px-3">Avg Household Income</th>
                  <th className="py-2.5 px-3">Lease Rate (/sq ft)</th>
                  <th className="py-2.5 px-3">Competitor Density</th>
                  <th className="py-2.5 px-3">YoY Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] text-[#A1A1AA]">
                {(data?.regionalBenchmarks || []).map((bench) => (
                  <tr key={bench.id} className="hover:bg-[#18181B] transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#F8FAFC]">
                      {bench.region}
                      <span className="block text-[11px] text-[#71717A] font-normal">{bench.city}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#FFBF24]/10 text-[#FFBF24] font-bold">
                        {bench.footfallIndex}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#F8FAFC]">{bench.avgHouseholdIncome}</td>
                    <td className="py-3 px-3 font-medium text-[#F8FAFC]">{bench.commercialRentPerSqFt}</td>
                    <td className="py-3 px-3">{bench.competitorDensity}</td>
                    <td className="py-3 px-3 text-emerald-400 font-semibold">{bench.growthTrend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
