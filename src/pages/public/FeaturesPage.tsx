import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
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
      icon: FileSpreadsheet,
      route: '/business-planner',
      badge: 'Part 2 Focus',
    },
    {
      title: 'Market Intelligence & Trends',
      desc: 'Aggregate macroeconomic market size estimates, annual CAGR indicators, and category demand indices.',
      icon: TrendingUp,
      route: '/market-analysis',
      badge: 'Part 3 Focus',
    },
    {
      title: 'Location & Geospatial Intelligence',
      desc: 'Spatial visualization using Leaflet and OpenStreetMap. Evaluate commercial footfall, transit proximity, and zoning.',
      icon: MapPin,
      route: '/location-analysis',
      badge: 'Part 4 Focus',
    },
    {
      title: 'Competitor Density Mapping',
      desc: 'Pinpoint nearby competitor clusters, evaluate pricing tiers, and compute municipal market saturation scores.',
      icon: GitCompare,
      route: '/market-analysis',
      badge: 'Part 4 Focus',
    },
    {
      title: 'Financial Feasibility Calculator',
      desc: 'Simulate fixed and variable monthly expenses, calculate unit economics, break-even timelines, and runway metrics.',
      icon: Calculator,
      route: '/business-planner',
      badge: 'Part 3 Focus',
    },
    {
      title: 'Machine Learning Success Prediction',
      desc: 'Trained Scikit-learn Random Forest classification models assessing multi-factor business survival odds.',
      icon: Cpu,
      route: '/predictions',
      badge: 'Part 5 Focus',
    },
    {
      title: 'Risk Diagnostics & Vulnerability Scoring',
      desc: 'Identify critical vulnerabilities in capital runway, market saturation, customer acquisition cost, and margins.',
      icon: ShieldAlert,
      route: '/predictions',
      badge: 'Part 6 Focus',
    },
    {
      title: 'Multi-Venture Comparative Matrix',
      desc: 'Evaluate multiple business categories or target locations side-by-side to choose the optimal investment path.',
      icon: Layers,
      route: '/comparison',
      badge: 'Part 7 Focus',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Platform Feature Catalog"
        description="Comprehensive architectural overview of BizMind decision-support capabilities."
        badge="Part 1 Foundation"
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
                <CardDescription className="mt-2 text-xs md:text-sm">{f.desc}</CardDescription>
              </div>
              <div className="mt-6 pt-4 border-t border-[#27272A]">
                <Link to={f.route}>
                  <Button size="sm" variant="outline" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Module Shell
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
