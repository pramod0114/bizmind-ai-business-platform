import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardTitle, CardDescription } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ExpandableText } from '../../components/common/ExpandableText';
import {
  FileSpreadsheet,
  TrendingUp,
  MapPin,
  GitCompare,
  Calculator,
  Cpu,
  ShieldAlert,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const FeaturesPage: React.FC = () => {
  const featureList = [
    {
      title: 'AI Business Planning',
      desc: 'Formulate your value proposition, capital requirements, revenue models, and operational milestones with structured guidance.',
      extendedDesc: 'Includes multi-step guided wizards, automated capex/opex breakdown, break-even validation, and instant executive summary formatting.',
      icon: FileSpreadsheet,
      route: '/business-planner',
      badge: 'Planning Canvas',
    },
    {
      title: 'Market Intelligence & Trends',
      desc: 'Aggregate macroeconomic market size estimates, annual CAGR indicators, and category demand indices.',
      extendedDesc: 'Examine sector growth benchmarks, customer density indices, and average regional discretionary spending per household.',
      icon: TrendingUp,
      route: '/market-analysis',
      badge: 'Market Analytics',
    },
    {
      title: 'Location & Geospatial Intelligence',
      desc: 'Spatial visualization using Leaflet and OpenStreetMap. Evaluate commercial footfall, transit proximity, and zoning.',
      extendedDesc: 'Radial proximity rings from 500m to 10km, commercial zoning validation, and transit accessibility indexing.',
      icon: MapPin,
      route: '/location-analysis',
      badge: 'Geospatial AI',
    },
    {
      title: 'Competitor Density Mapping',
      desc: 'Pinpoint nearby competitor clusters, evaluate pricing tiers, and compute municipal market saturation scores.',
      extendedDesc: 'Nearest competitor calculation, average radial dispersion, and direct vs. indirect market share saturation indicators.',
      icon: GitCompare,
      route: '/market-analysis',
      badge: 'Competitor Radar',
    },
    {
      title: 'Financial Feasibility Calculator',
      desc: 'Simulate fixed and variable monthly expenses, calculate unit economics, break-even timelines, and runway metrics.',
      extendedDesc: 'Computes contribution margin per unit, break-even capacity utilization percentage, and 12-month month-by-month cashflow projections.',
      icon: Calculator,
      route: '/business-planner',
      badge: 'Financial Math',
    },
    {
      title: 'Machine Learning Success Prediction',
      desc: 'Trained Scikit-learn Random Forest classification models assessing multi-factor business survival odds.',
      extendedDesc: 'Features engineered from footfall, capital buffer ratio, competitor density, and pricing power to produce statistical survival scores.',
      icon: Cpu,
      route: '/predictions',
      badge: 'ML Ensemble',
    },
    {
      title: 'Risk Diagnostics & Vulnerability Scoring',
      desc: 'Identify critical vulnerabilities in capital runway, market saturation, customer acquisition cost, and margins.',
      extendedDesc: 'Automated vulnerability alerts across fixed overhead, seasonal revenue swings, and commercial saturation thresholds.',
      icon: ShieldAlert,
      route: '/predictions',
      badge: 'Risk Engine',
    },
    {
      title: 'Multi-Venture Comparative Matrix',
      desc: 'Evaluate multiple business categories or target locations side-by-side to choose the optimal investment path.',
      extendedDesc: 'Side-by-side KPI comparison across ROI, initial capex, footfall density, break-even velocity, and overall feasibility index.',
      icon: Layers,
      route: '/comparison',
      badge: 'Decision Matrix',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Platform Feature Catalog"
        description="Comprehensive overview of BizMind decision-support capabilities and analytical engines."
        badge="Platform Capabilities"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {featureList.map((f, idx) => {
          const Icon = f.icon;
          return (
            <Card key={idx} hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="primary" size="sm">{f.badge}</Badge>
                </div>
                <CardTitle className="text-base">{f.title}</CardTitle>
                <div className="mt-2 text-xs md:text-sm text-[#A1A1AA]">
                  <p className="leading-relaxed">{f.desc}</p>
                  <ExpandableText
                    label="View specifications"
                    collapseLabel="Hide specifications"
                    className="mt-2"
                  >
                    <p className="text-xs text-[#CBD5E1] bg-[#111113] p-2.5 rounded-lg border border-[#27272A]">
                      {f.extendedDesc}
                    </p>
                  </ExpandableText>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#27272A]">
                <Link
                  to={f.route}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFBF24] hover:text-[#F59E0B] transition-colors group cursor-pointer"
                >
                  <span>Launch Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center p-8 rounded-2xl bg-[#111113] border border-[#27272A]">
        <h3 className="text-xl font-bold text-[#F8FAFC]">Ready to evaluate your business idea?</h3>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1.5 max-w-lg mx-auto">
          Start by modeling your financials or exploring competitor density in your target city.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link to="/business-planner">
            <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Business Planner
            </Button>
          </Link>
          <Link to="/market-analysis">
            <Button size="md" variant="outline">
              Explore Market Map
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
