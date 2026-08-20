import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  TrendingUp,
  ShieldAlert,
  Calculator,
  Cpu,
  GitCompare,
  Layers,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Server,
  Database,
  Code2,
  FileSpreadsheet,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const problems = [
    {
      title: 'Poor Location Selection',
      desc: 'Choosing a store location without empirical footfall, competitor radius, or demographic density data.',
      icon: MapPin,
    },
    {
      title: 'Overlooked High Competition',
      desc: 'Entering saturated markets without visibility into competitor market shares and pricing structures.',
      icon: GitCompare,
    },
    {
      title: 'Incorrect Investment Estimation',
      desc: 'Underestimating working capital requirements and fixed operational burn before achieving break-even.',
      icon: Calculator,
    },
    {
      title: 'Lack of Market Information',
      desc: 'Relying on guesswork instead of real-time municipal, industry, and sectoral growth indicators.',
      icon: TrendingUp,
    },
    {
      title: 'Difficulty Predicting Business Potential',
      desc: 'Inability to compute statistical viability or failure risk probabilities before deploying real capital.',
      icon: ShieldAlert,
    },
  ];

  const features = [
    {
      title: 'AI Business Planning',
      desc: 'Structured canvas for formulating capital allocation, market positioning, and operational parameters.',
      icon: FileSpreadsheet,
      badge: 'Core Planning',
    },
    {
      title: 'Market Analysis',
      desc: 'Macroeconomic market size estimates, annual CAGR projections, and category demand indices.',
      icon: TrendingUp,
      badge: 'Market Intel',
    },
    {
      title: 'Location Intelligence',
      desc: 'OpenStreetMap and Leaflet spatial analysis for commercial footfall and radius zoning.',
      icon: MapPin,
      badge: 'Geospatial',
    },
    {
      title: 'Competition Analysis',
      desc: 'Cluster mapping, price-tier categorization, and saturation index calculations.',
      icon: GitCompare,
      badge: 'Competitive',
    },
    {
      title: 'Financial Planning',
      desc: 'Automated break-even analysis, runway projections, fixed vs. variable cost modeling.',
      icon: Calculator,
      badge: 'Feasibility',
    },
    {
      title: 'Success Prediction',
      desc: 'Machine learning classification assessing historical viability and venture survival probability.',
      icon: Cpu,
      badge: 'ML Engine',
    },
    {
      title: 'Risk Analysis',
      desc: 'Multi-factor risk scoring across capital adequacy, saturation, and margin vulnerability.',
      icon: ShieldAlert,
      badge: 'Diagnostics',
    },
    {
      title: 'Business Comparison',
      desc: 'Side-by-side comparative evaluations between different business types and target locations.',
      icon: Layers,
      badge: 'Decision Matrix',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Enter Business Requirements',
      desc: 'Specify your business category, proposed capital, timeline, and operational objectives.',
      icon: FileSpreadsheet,
    },
    {
      step: '02',
      title: 'Analyze Location & Market',
      desc: 'Evaluate geographic footfall, demographic tiers, and local competitor density on interactive OSM maps.',
      icon: MapPin,
    },
    {
      step: '03',
      title: 'Calculate Financial Feasibility',
      desc: 'Model fixed and variable operating costs, break-even months, and 1-3 year projected ROI.',
      icon: Calculator,
    },
    {
      step: '04',
      title: 'Run ML Prediction',
      desc: 'Deploy Scikit-learn classification models to evaluate multi-factor success probabilities and risk tiers.',
      icon: Cpu,
    },
    {
      step: '05',
      title: 'Receive Actionable Intelligence',
      desc: 'Generate comprehensive feasibility dossiers with tailored risk mitigation and location recommendations.',
      icon: Sparkles,
    },
  ];

  const techStack = [
    { name: 'React 19 & Vite', role: 'Frontend Architecture', icon: Code2 },
    { name: 'Node.js & Express', role: 'REST API & Orchestration', icon: Server },
    { name: 'MySQL 8.0', role: 'Relational 3NF Database', icon: Database },
    { name: 'Python & FastAPI', role: 'ML Microservice & Scikit-Learn', icon: Cpu },
    { name: 'Leaflet & OpenStreetMap', role: 'Open-Source Spatial Maps', icon: MapPin },
    { name: 'Recharts & Tailwind', role: 'Data Visualization & Design', icon: BarChart3 },
  ];

  return (
    <div className="space-y-24 py-8 md:py-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFBF24]/10 border border-[#FFBF24]/30 text-[#FFBF24] text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Part 1 Architecture – Capstone Decision Support System</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F8FAFC] tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Make Smarter Business Decisions with{' '}
          <span className="text-[#FFBF24]">
            AI Intelligence
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#A1A1AA] mt-6 max-w-2xl mx-auto leading-relaxed">
          BizMind combines business planning, market intelligence, financial analysis and machine learning to help you evaluate business opportunities before you invest.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg" rightIcon={<LayoutDashboard className="w-4 h-4" />}>
                Open Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Create Free Account
              </Button>
            </Link>
          )}
          <Link to="/how-it-works">
            <Button size="lg" variant="secondary">
              Explore How It Works
            </Button>
          </Link>
        </div>

        {/* Dashboard Visual Preview Card */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl p-2 bg-[#111113] border border-[#27272A] shadow-2xl">
          <div className="rounded-xl bg-[#1A1A1D] border border-[#27272A] p-4 sm:p-6 text-left">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
                <div className="w-3 h-3 rounded-full bg-[#FACC15]/80" />
                <div className="w-3 h-3 rounded-full bg-[#22C55E]/80" />
                <span className="text-xs font-mono text-[#71717A] ml-2">
                  bizmind.platform/decision-suite/demo-preview
                </span>
              </div>
              <Badge variant="primary" size="sm">Live Preview Shell</Badge>
            </div>

            {/* Mock Dashboard Layout Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#111113] border border-[#27272A]">
                <p className="text-xs text-[#A1A1AA]">Predicted Success Probability</p>
                <div className="text-2xl font-bold text-[#22C55E] mt-1">78.4%</div>
                <p className="text-[11px] text-[#71717A] mt-1">Low Capital-at-Risk Score</p>
              </div>
              <div className="p-4 rounded-lg bg-[#111113] border border-[#27272A]">
                <p className="text-xs text-[#A1A1AA]">Location Footfall Index</p>
                <div className="text-2xl font-bold text-[#FFBF24] mt-1">8.2 / 10</div>
                <p className="text-[11px] text-[#71717A] mt-1">Tier-1 Commercial Density</p>
              </div>
              <div className="p-4 rounded-lg bg-[#111113] border border-[#27272A]">
                <p className="text-xs text-[#A1A1AA]">Projected Break-Even</p>
                <div className="text-2xl font-bold text-[#F8FAFC] mt-1">9.4 Months</div>
                <p className="text-[11px] text-[#71717A] mt-1">Fixed Burn: $3,200/mo</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-[#111113]/60 border border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#FFBF24]" />
                <span>Integrated Decision Pipeline: Planning → GIS Map → Financial Feasibility → ML Model</span>
              </div>
              <Link to="/dashboard" className="text-[#FFBF24] hover:text-[#F59E0B] font-medium flex items-center gap-1">
                Enter Dashboard Preview <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="danger" size="sm" className="mb-2">The Problem</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
            Why 60% of New Businesses Fail Within 3 Years
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-2">
            Most business founders lack access to enterprise-grade location intelligence, financial projection models, and predictive risk diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {problems.map((p, idx) => {
            const Icon = p.icon;
            return (
              <Card key={idx} hoverEffect className="bg-[#1A1A1D] border-[#27272A] flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#F8FAFC] mb-1.5">{p.title}</h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#27272A] text-[11px] font-mono text-[#EF4444]">
                  Critical Risk Factor
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#111113] border border-[#27272A] p-8 md:p-12 relative overflow-hidden">
          <div className="max-w-3xl">
            <Badge variant="success" size="sm" className="mb-3">The BizMind Solution</Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F8FAFC] tracking-tight">
              An End-to-End Decision Support System for Aspiring Entrepreneurs
            </h2>
            <p className="text-sm md:text-base text-[#A1A1AA] mt-4 leading-relaxed">
              BizMind eliminates speculative guessing by creating a unified workflow. From validating local demand using geospatial OpenStreetMap data to computing statistical survival rates via trained Scikit-learn models, every decision is supported by data.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FFBF24] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F8FAFC]">Zero Expensive API Fees</h4>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">Powered by OpenStreetMap & Leaflet mapping infrastructure.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FFBF24] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F8FAFC]">Multi-Model ML Classification</h4>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">Scikit-learn Random Forest & Gradient Boosting ensembles.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FFBF24] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F8FAFC]">Deterministic Financial Math</h4>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">Precise break-even, fixed burn, and cashflow runway calculations.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FFBF24] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F8FAFC]">Clean Monorepo Architecture</h4>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">Separation across React UI, Express API, MySQL & FastAPI.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" size="sm" className="mb-2">Core Capabilities</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
            Eight Integrated Decision Intelligence Modules
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-2">
            Engineered modularly for independent scalability and cross-domain data synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <Card key={idx} hoverEffect className="bg-[#1A1A1D] border-[#27272A] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant="neutral" size="sm">{f.badge}</Badge>
                  </div>
                  <CardTitle className="text-sm md:text-base">{f.title}</CardTitle>
                  <CardDescription className="mt-1.5">{f.desc}</CardDescription>
                </div>
                <div className="mt-4 pt-3 border-t border-[#27272A] text-[11px] text-[#FFBF24] font-semibold flex items-center gap-1">
                  <span>Explore Module</span> <ArrowRight className="w-3 h-3" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" size="sm" className="mb-2">Methodology</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
            How BizMind Analyzes Your Venture
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-2">
            A 5-step structured pipeline from initial concept to executive recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-5 rounded-xl bg-[#1A1A1D] border border-[#27272A] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-extrabold text-[#FFBF24] font-mono">
                      {step.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-[#F8FAFC] mb-1">{step.title}</h4>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. TECHNOLOGY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="outline" size="sm" className="mb-2">Tech Stack</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
            Engineered on Modern Open Architecture
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#1A1A1D] border border-[#27272A] flex flex-col items-center text-center hover:border-[#3F3F46] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24] mb-2.5">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#F8FAFC]">{t.name}</span>
                <span className="text-[10px] text-[#71717A] mt-0.5">{t.role}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. STATISTICS / IMPACT SECTION (CLEARLY MARKED AS DEMO PLACEHOLDERS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 md:p-8 rounded-2xl bg-[#111113] border border-[#27272A]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#27272A]">
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Simulated Target Metrics</h3>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Benchmark evaluation placeholders for academic presentation.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FACC15]/10 border border-[#FACC15]/30 text-[#FACC15] text-[11px] font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Academic Demonstration Placeholders</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
            <div>
              <div className="text-3xl font-extrabold text-[#FFBF24] font-mono">14+</div>
              <p className="text-xs text-[#F8FAFC] font-medium mt-1">Relational DB Entities</p>
              <p className="text-[10px] text-[#71717A]">Established in 3NF schema</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#F8FAFC] font-mono">8</div>
              <p className="text-xs text-[#F8FAFC] font-medium mt-1">Core Modules</p>
              <p className="text-[10px] text-[#71717A]">Planning to ML inference</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#22C55E] font-mono">100%</div>
              <p className="text-xs text-[#F8FAFC] font-medium mt-1">Open-Source GIS</p>
              <p className="text-[10px] text-[#71717A]">Zero paid Google Maps cost</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#F8FAFC] font-mono">9 Parts</div>
              <p className="text-xs text-[#F8FAFC] font-medium mt-1">Modular Build Plan</p>
              <p className="text-[10px] text-[#71717A]">Part 1 Foundation Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 md:p-12 rounded-2xl bg-[#111113] border border-[#27272A] shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
            Start Your Business Analysis Today
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-2 max-w-xl mx-auto leading-relaxed">
            Experience the modular decision-support dashboard and explore business planning, geospatial map views, and financial modeling tools.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" rightIcon={<LayoutDashboard className="w-4 h-4" />}>
                  Enter Dashboard Workspace
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Create Free Account
                </Button>
              </Link>
            )}
            <Link to="/features">
              <Button size="lg" variant="outline">
                Review Feature Architecture
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
