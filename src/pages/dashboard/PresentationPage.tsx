/**
 * BizMind – Project Presentation & Technical Architecture Deck
 * Features:
 * - Slide 1: Rajarambapu Institute of Technology (RIT) MCA Capstone Project Technical Report
 * - RIT Logo displayed across all slides
 * - Clean Fullscreen Mode: Displays ONLY the slide, Floating Close (X), and Previous/Next (< >) controls
 * - Slide 8: Real-Time Spatial Radar centered on Uran Islampur Narshhpur Road with live API integration
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
} from 'recharts';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Download,
  DollarSign,
  MapPin,
  TrendingUp,
  Cpu,
  Layers,
  Lightbulb,
  X,
  Presentation,
  CheckCircle2,
  Database,
  Compass,
  Radar,
  ShieldCheck,
  Server,
  Code2,
  GraduationCap,
  Users,
  Award,
} from 'lucide-react';
import { planService } from '../../services/planService';
import { generateBizMindPptx } from '../../services/pptxService';
import { generateAnimatedHtmlPresentation } from '../../services/animatedHtmlExportService';
import {
  SlideAnimationEngine,
  containerStaggerVariants,
  fadeUpVariant,
  popScaleVariant,
  chartRevealVariant,
} from '../../components/presentation/SlideAnimationEngine';
import { LiveLocationIntelligenceDemo } from '../../components/presentation/LiveLocationIntelligenceDemo';
import { RitLogo } from '../../components/common/RitLogo';
import { BusinessPlan } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface SlideData {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  notes: string;
  content: (plan?: BusinessPlan | null) => React.ReactNode;
}

export const PresentationPage: React.FC = () => {
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('platform');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [isExportingPptx, setIsExportingPptx] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<any>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const userPlans = await planService.getPlans();
        setPlans(userPlans || []);
      } catch (err) {
        console.error('Failed to load plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const selectedPlan = plans.find((p) => String(p.id) === selectedPlanId) || null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportPptx = async () => {
    setIsExportingPptx(true);
    try {
      await generateBizMindPptx(selectedPlan);
      showToast('Downloaded Native PowerPoint (.pptx) with Vector Charts & RIT Branding');
    } catch (err: any) {
      console.error('Failed to export PPTX:', err);
      showToast('Export failed: ' + (err?.message || 'Error'));
    } finally {
      setIsExportingPptx(false);
    }
  };

  const handleExportHtml = () => {
    try {
      generateAnimatedHtmlPresentation(selectedPlan);
      showToast('Downloaded Standalone Animated Deck (.html)');
    } catch (err: any) {
      console.error('Failed to export HTML deck:', err);
      showToast('Export failed: ' + (err?.message || 'Error'));
    }
  };

  // Full comprehensive 9-slide deck starting with official RIT Capstone Report Slide
  const slides: SlideData[] = [
    // SLIDE 1: Official RIT Capstone Technical Report Cover
    {
      id: 1,
      category: '01 / Academic Capstone Technical Report',
      title: 'CAPSTONE PROJECT TECHNICAL REPORT',
      subtitle: 'Rajarambapu Institute of Technology, Rajaramnagar — Department of Computer Applications',
      notes:
        'Official introduction. Presenting the Master of Computer Applications (MCA) Capstone Technical Project: BizMind - AI Business Planner & Success Prediction Platform, under the guidance of Ms. A. R. Patil.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center items-center h-full max-w-4xl mx-auto text-center space-y-4 py-2"
        >
          {/* Header Metadata */}
          <motion.div variants={fadeUpVariant} className="space-y-1">
            <div className="text-xs sm:text-sm font-semibold tracking-wide text-[#94A3B8]">
              Academic Year: <span className="text-white font-bold">2026 – 27</span>
            </div>
            <div className="text-[11px] sm:text-xs text-[#64748B] italic">
              (An Empowered Autonomous Institute, Affiliated to Shivaji University, Kolhapur)
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#F8FAFC] tracking-wide uppercase pt-1">
              RAJARAMBAPU INSTITUTE OF TECHNOLOGY, RAJARAMNAGAR
            </div>
            <div className="text-xs sm:text-sm text-[#FFBF24] font-semibold tracking-wider uppercase">
              Department of Computer Applications
            </div>
          </motion.div>

          {/* Official RIT Logo Banner */}
          <motion.div variants={popScaleVariant} className="py-1">
            <RitLogo className="w-56 h-16 sm:w-64 sm:h-20 shadow-xl border border-black/20" />
          </motion.div>

          {/* Degree & Project Title */}
          <motion.div variants={fadeUpVariant} className="space-y-1.5">
            <div className="text-xs font-mono tracking-widest text-[#94A3B8] uppercase">
              Master Of Computer Applications (MCA)
            </div>
            <div className="text-xs font-bold text-[#E2E8F0] tracking-wider uppercase">
              CAPSTONE PROJECT TECHNICAL REPORT ON
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              &ldquo;<span className="text-[#EF4444]">Biz</span><span className="text-white">Mind</span> &ndash; AI Business Planner &amp; Success Prediction Platform&rdquo;
            </h1>
          </motion.div>

          {/* Guidance & Team Grid */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2">
            {/* Guide Card */}
            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] text-left space-y-1">
              <div className="text-[10px] font-semibold text-[#FFBF24] uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#FFBF24]" />
                <span>Under the Guidance of</span>
              </div>
              <div className="text-base font-bold text-white mt-0.5">
                Ms. A. R. Patil
              </div>
              <div className="text-[11px] text-[#94A3B8]">
                Department of Computer Applications, RIT
              </div>
            </motion.div>

            {/* Submitted By Team Card */}
            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] text-left space-y-1.5">
              <div className="text-[10px] font-semibold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Submitted By (Project Team)</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <div>
                  <div className="font-bold text-white">Pramod Rajendra Mahajan</div>
                  <div className="text-[10px] font-mono text-[#FFBF24]">Roll No: 2547047</div>
                </div>
                <div>
                  <div className="font-bold text-white">Harshad Shahaji Patil</div>
                  <div className="text-[10px] font-mono text-[#FFBF24]">Roll No: 2547062</div>
                </div>
                <div>
                  <div className="font-bold text-white">Sakshi Dnyaneshwar Randive</div>
                  <div className="text-[10px] font-mono text-[#FFBF24]">Roll No: 2547048</div>
                </div>
                <div>
                  <div className="font-bold text-white">Rutika Rajesh Deshmukh</div>
                  <div className="text-[10px] font-mono text-[#FFBF24]">Roll No: 2547025</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="text-[10px] font-mono text-[#64748B] pt-1">
            RAJARAMBAPU INSTITUTE OF TECHNOLOGY, RAJARAMNAGAR • SANGALI, MAHARASHTRA
          </motion.div>
        </motion.div>
      ),
    },

    // SLIDE 2: Project Overview & Core Mission
    {
      id: 2,
      category: '02 / Project Overview',
      title: 'BIZMIND: AI Business Planning & Location Intelligence',
      subtitle: 'Plan Smarter. Analyze Better. Build with Confidence. — An empirical decision-support platform for modern business ventures.',
      notes:
        'BizMind provides an all-in-one platform integrating geospatial analysis, financial feasibility calculus, and machine learning to evaluate business ventures before capital deployment.',
      content: (plan) => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center h-full max-w-5xl mx-auto space-y-5"
        >
          <motion.div variants={fadeUpVariant} className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {plan ? plan.businessName : 'Data-Driven Feasibility, Geospatial GIS & Predictive ML'}
            </h1>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-3xl">
              {plan
                ? `Strategic feasibility assessment and micro-corridor analysis for ${plan.category} in ${plan.location}.`
                : 'Over 60% of startups fail from poor location selection, unnoticed competitor saturation, and inaccurate burn rate forecasting. BizMind eliminates these blind spots with unified spatial modeling and deterministic math.'}
            </p>
          </motion.div>

          {/* 4 Core Pillars */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
            {[
              {
                title: 'Spatial GIS Radar',
                sub: 'Micro-radius competitor indexing (500m - 5km) using Leaflet & OpenStreetMap (0 paid API lock-in)',
                icon: MapPin,
                color: 'text-sky-400',
              },
              {
                title: 'Financial Engine',
                sub: 'Deterministic unit economics, contribution margins, break-even calculus, and 12-month cash ramp-up',
                icon: DollarSign,
                color: 'text-[#FFBF24]',
              },
              {
                title: 'Stress-Testing',
                sub: 'Multi-scenario sensitivity simulations under market contraction and supply cost inflation',
                icon: TrendingUp,
                color: 'text-emerald-400',
              },
              {
                title: 'Predictive ML',
                sub: 'Scikit-Learn Random Forest & Gradient Boosting models with multi-factor risk diagnostics',
                icon: Cpu,
                color: 'text-purple-400',
              },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  variants={popScaleVariant}
                  className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1.5 hover:border-[#FFBF24]/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${p.color}`} />
                    <span className="text-xs font-bold text-white">{p.title}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">{p.sub}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Core System Highlights */}
          <motion.div variants={containerStaggerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#1E2433]">
            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">Monorepo Stack</div>
              <div className="text-lg sm:text-xl font-bold text-white mt-0.5">React 19 + Node</div>
              <div className="text-[10px] text-[#64748B]">TypeScript + Vite + Express</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">Relational Schema</div>
              <div className="text-lg sm:text-xl font-bold text-[#FFBF24] mt-0.5">14 Tables (3NF)</div>
              <div className="text-[10px] text-[#64748B]">MySQL 8.0 with cascading FKs</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">Spatial Engine</div>
              <div className="text-lg sm:text-xl font-bold text-sky-400 mt-0.5">Leaflet + OSM</div>
              <div className="text-[10px] text-[#64748B]">Zero paid API cost barrier</div>
            </motion.div>

            <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] font-semibold text-[#94A3B8] uppercase">ML Microservice</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5">FastAPI & Sklearn</div>
              <div className="text-[10px] text-[#64748B]">Ensemble viability classifier</div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
    },

    // SLIDE 3: System Architecture & Technical Specifications
    {
      id: 3,
      category: '03 / System Architecture',
      title: 'Full-Stack Technical Architecture & Monorepo Design',
      subtitle: 'Decoupled multi-tier architecture delivering high-performance spatial queries, deterministic business math, and ML inference.',
      notes:
        'Walk through the 3-tier architecture: React 19 SPA communicates over REST to Express API broker, backed by 14 3NF MySQL tables and Python FastAPI ML service with Leaflet GIS mapping.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 max-w-5xl mx-auto my-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tier 1 */}
            <motion.div variants={popScaleVariant} className="p-5 rounded-2xl bg-[#121722] border border-[#1E2433] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono text-sky-400 font-bold">TIER 1</span>
                  <h4 className="text-sm font-bold text-white">Frontend Web SPA</h4>
                </div>
              </div>
              <ul className="text-xs text-[#94A3B8] space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-sky-400 font-bold">•</span>
                  <span><strong>React 19 & TypeScript:</strong> Modular state management with functional hooks and strict types.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-sky-400 font-bold">•</span>
                  <span><strong>Vite & Tailwind CSS:</strong> High-performance bundling, zero-runtime CSS, and fluid Framer Motion transitions.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-sky-400 font-bold">•</span>
                  <span><strong>Leaflet 1.9 GIS:</strong> Interactive maps, custom circular isochrone overlays, and Dark Matter vector tiles.</span>
                </li>
              </ul>
            </motion.div>

            {/* Tier 2 */}
            <motion.div variants={popScaleVariant} className="p-5 rounded-2xl bg-[#121722] border border-[#FFBF24]/30 space-y-3 bg-gradient-to-b from-[#161D2B] to-[#121722]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFBF24]/15 border border-[#FFBF24]/30 flex items-center justify-center text-[#FFBF24]">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#FFBF24] font-bold">TIER 2</span>
                  <h4 className="text-sm font-bold text-white">Node / Express API Broker</h4>
                </div>
              </div>
              <ul className="text-xs text-[#94A3B8] space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#FFBF24] font-bold">•</span>
                  <span><strong>RESTful API Architecture:</strong> Route controllers for auth, plans, locations, predictions, and admin telemetry.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#FFBF24] font-bold">•</span>
                  <span><strong>Deterministic Calculators:</strong> Native backend calculation engines for Break-even, ROI, and Cash Runway.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#FFBF24] font-bold">•</span>
                  <span><strong>Autonomous DB Service:</strong> Full MySQL connection pooling with self-contained in-memory ACID fallback.</span>
                </li>
              </ul>
            </motion.div>

            {/* Tier 3 */}
            <motion.div variants={popScaleVariant} className="p-5 rounded-2xl bg-[#121722] border border-[#1E2433] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">TIER 3</span>
                  <h4 className="text-sm font-bold text-white">ML Microservice & Data</h4>
                </div>
              </div>
              <ul className="text-xs text-[#94A3B8] space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Python 3.11 & FastAPI:</strong> Dedicated statistical inference microservice serving `/predict` endpoints.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Scikit-Learn Ensembles:</strong> Random Forest and Gradient Boosting pipelines serialized via Joblib.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>14 3NF MySQL Tables:</strong> Fully relational schema with indexing on coordinates, foreign keys, and audit logs.</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Architectural Security & Cost Advantage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs text-[#94A3B8]">
                <strong className="text-white">Strict Layer Separation:</strong> Pure presentational frontend, central JWT backend perimeter, isolated ML container, and parameterized SQL queries.
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] flex items-center gap-3">
              <Compass className="w-5 h-5 text-sky-400 shrink-0" />
              <div className="text-xs text-[#94A3B8]">
                <strong className="text-white">Zero API Cost Dependency:</strong> Fully open-source geospatial stack eliminating commercial Google Maps billing requirements while maintaining precision.
              </div>
            </div>
          </div>
        </motion.div>
      ),
    },

    // SLIDE 4: Deterministic Financial Feasibility & Unit Economics Engine
    {
      id: 4,
      category: '04 / Financial Feasibility Engine',
      title: 'Deterministic Financial Feasibility & Unit Economics Engine',
      subtitle: 'Mathematical modeling replacing subjective spreadsheets with exact unit economics, break-even calculus, and CapEx sizing.',
      notes:
        'Explain the deterministic formulas: Contribution Margin = Price - Variable Cost; Break-Even Units = Fixed Costs / CM; Break-Even Revenue = Break-Even Units * Price. CapEx donut chart shows allocation.',
      content: (plan) => {
        const capexData = [
          { name: 'Property Deposit', value: plan?.propertyDeposit || 250000, color: '#FFBF24' },
          { name: 'Interior Setup & Fitout', value: plan?.interiorSetup || 280000, color: '#38BDF8' },
          { name: 'Equipment & Machinery', value: plan?.equipmentCost || 180000, color: '#10B981' },
          { name: 'Initial Inventory', value: plan?.initialInventory || 35000, color: '#A855F7' },
          { name: 'Technology & POS', value: plan?.technologyCost || 20000, color: '#F43F5E' },
          { name: 'Launch Marketing', value: plan?.launchMarketing || 25000, color: '#F59E0B' },
        ];
        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-5xl mx-auto my-auto"
          >
            {/* Left: Donut Chart */}
            <motion.div variants={chartRevealVariant} className="h-80 w-full p-4 rounded-2xl bg-[#121722] border border-[#1E2433]">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Itemized CapEx Capital Allocation
              </div>
              <ResponsiveContainer width="100%" height="88%">
                <RechartsPieChart>
                  <Pie
                    data={capexData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={900}
                  >
                    {capexData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Amount']}
                    contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E2433', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Right: Formulas & Calculus */}
            <motion.div variants={containerStaggerVariants} className="space-y-3">
              <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Contribution Margin per Unit</span>
                  <span className="text-[10px] font-mono text-[#FFBF24] bg-[#FFBF24]/10 px-2 py-0.5 rounded">CM = P - V</span>
                </div>
                <div className="text-xl font-bold text-[#FFBF24]">
                  {plan?.averageSellingPrice && plan?.variableCostPerUnit
                    ? formatCurrency(plan.averageSellingPrice - plan.variableCostPerUnit)
                    : '$180.00 / Customer'}
                </div>
                <div className="text-[11px] text-[#94A3B8]">Revenue per transaction minus direct variable raw material and transaction costs.</div>
              </motion.div>

              <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Break-Even Volume & Threshold</span>
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded">Units = Fixed / CM</span>
                </div>
                <div className="text-xl font-bold text-sky-400">
                  {plan ? `${plan.breakEvenUnits || 1000} Units/mo` : '1,000 Units / Month'}
                </div>
                <div className="text-[11px] text-[#94A3B8]">
                  Exact sales volume where operating revenue exactly matches fixed monthly overhead (${plan ? formatCurrency(plan.totalMonthlyFixedExpenses || 165000) : '$165,000'}).
                </div>
              </motion.div>

              <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Payback Period Horizon</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">CapEx / Annual Net Cash</span>
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  {plan ? `${plan.paybackPeriodMonths || 12.1} Months` : '12.1 Months'}
                </div>
                <div className="text-[11px] text-[#94A3B8]">Full capital recovery timeline after covering operational overhead and working capital buffer.</div>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      },
    },

    // SLIDE 5: 12-Month Compounding Cash Flow & Break-Even Trajectory
    {
      id: 5,
      category: '05 / Cash Flow Modeling',
      title: '12-Month Compounding Cash Flow & Break-Even Trajectory',
      subtitle: 'Dynamic growth curve visualizing footfall customer ramp-up crossing the operational expense floor.',
      notes:
        'Highlight the month-by-month compounding ramp-up. Month 1-2 starts at 75-82% capacity; Month 3 crosses break-even into sustained positive cash flow with a 3-month safety runway.',
      content: (plan) => {
        const baseRev = plan?.monthlyRevenue || 316800;
        const baseExp = plan?.totalMonthlyExpenses || 244200;
        const lineData = [
          { month: 'M1', revenue: Math.round(baseRev * 0.75), expenses: Math.round(baseExp * 0.95) },
          { month: 'M2', revenue: Math.round(baseRev * 0.82), expenses: Math.round(baseExp * 0.97) },
          { month: 'M3 (Break-Even)', revenue: Math.round(baseRev * 0.92), expenses: Math.round(baseExp * 0.98) },
          { month: 'M4', revenue: Math.round(baseRev * 0.98), expenses: Math.round(baseExp * 1.0) },
          { month: 'M5', revenue: Math.round(baseRev * 1.04), expenses: Math.round(baseExp * 1.01) },
          { month: 'M6', revenue: Math.round(baseRev * 1.10), expenses: Math.round(baseExp * 1.02) },
          { month: 'M7', revenue: Math.round(baseRev * 1.15), expenses: Math.round(baseExp * 1.03) },
          { month: 'M8', revenue: Math.round(baseRev * 1.20), expenses: Math.round(baseExp * 1.04) },
          { month: 'M9', revenue: Math.round(baseRev * 1.25), expenses: Math.round(baseExp * 1.05) },
          { month: 'M10', revenue: Math.round(baseRev * 1.29), expenses: Math.round(baseExp * 1.06) },
          { month: 'M11', revenue: Math.round(baseRev * 1.33), expenses: Math.round(baseExp * 1.07) },
          { month: 'M12', revenue: Math.round(baseRev * 1.38), expenses: Math.round(baseExp * 1.08) },
        ];
        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center max-w-5xl mx-auto my-auto"
          >
            {/* Left 2 Cols: Line Chart */}
            <motion.div variants={chartRevealVariant} className="lg:col-span-2 h-80 p-4 rounded-2xl bg-[#121722] border border-[#1E2433]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  12-Month Compounding Revenue vs. Expense Baseline
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                  Crossover @ Month 3
                </span>
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <RechartsLineChart data={lineData}>
                  <XAxis dataKey="month" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                    contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E2433', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                  <Line type="monotone" dataKey="revenue" name="Gross Monthly Revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} animationDuration={1000} />
                  <Line type="monotone" dataKey="expenses" name="Total Operational Expenses" stroke="#F43F5E" strokeWidth={2} strokeDasharray="5 5" animationDuration={800} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Right: Key Milestones */}
            <motion.div variants={containerStaggerVariants} className="space-y-3">
              <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="text-xs text-[#94A3B8]">Break-Even Sales Floor</div>
                <div className="text-2xl font-bold text-[#FFBF24]">
                  {plan ? formatCurrency(plan.breakEvenRevenue || 220000) : '$220,000 / mo'}
                </div>
                <div className="text-xs text-[#64748B]">Minimum monthly receipts to clear fixed and variable costs.</div>
              </motion.div>

              <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="text-xs text-[#94A3B8]">3-Month Working Capital Buffer</div>
                <div className="text-2xl font-bold text-sky-400">
                  {plan ? formatCurrency((plan.totalMonthlyFixedExpenses || 165000) * 3) : '$495,000'}
                </div>
                <div className="text-xs text-[#64748B]">Mandatory reserve absorbing ramp-up friction prior to break-even.</div>
              </motion.div>

              <motion.div variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                <div className="text-xs text-[#94A3B8]">Capacity Margin of Safety</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {plan ? `${(100 - (plan.breakEvenCapacityPercentage || 69.4)).toFixed(1)}% Buffer` : '30.6% Buffer'}
                </div>
                <div className="text-xs text-[#64748B]">Protection threshold against temporary pedestrian volume dips.</div>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      },
    },

    // SLIDE 6: Multi-Scenario Sensitivity Stress-Testing
    {
      id: 6,
      category: '06 / Sensitivity Analysis',
      title: 'Solvency Stress-Testing: Multi-Scenario Sensitivity Analysis',
      subtitle: 'Simulating severe market footfall contraction (-20%) and cost inflation (+5%) vs. target base and expansion cases.',
      notes:
        'Walk through the 3 scenarios. In the Conservative case, even with 20% lower revenue and 5% inflation, the business generates positive operating profit and avoids insolvency.',
      content: (plan) => {
        const baseRev = plan?.monthlyRevenue || 316800;
        const baseExp = plan?.totalMonthlyExpenses || 244200;
        const scenarioData = [
          {
            scenario: 'Conservative (-20%)',
            Revenue: Math.round(baseRev * 0.8),
            Expenses: Math.round(baseExp * 1.05),
            Profit: Math.round(baseRev * 0.8 - baseExp * 1.05),
          },
          {
            scenario: 'Base Target Case',
            Revenue: baseRev,
            Expenses: baseExp,
            Profit: Math.round(baseRev - baseExp),
          },
          {
            scenario: 'Optimistic (+20%)',
            Revenue: Math.round(baseRev * 1.2),
            Expenses: Math.round(baseExp * 1.1),
            Profit: Math.round(baseRev * 1.2 - baseExp * 1.1),
          },
        ];
        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center max-w-5xl mx-auto my-auto"
          >
            {/* Left 2 Cols: Grouped Bar Chart */}
            <motion.div variants={chartRevealVariant} className="lg:col-span-2 h-80 p-4 rounded-2xl bg-[#121722] border border-[#1E2433]">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Scenario Solvency Comparison: Revenue, Expense & Net Margin
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <RechartsBarChart data={scenarioData}>
                  <XAxis dataKey="scenario" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                    contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E2433', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                  <Bar dataKey="Revenue" fill="#38BDF8" radius={[4, 4, 0, 0]} animationDuration={800} />
                  <Bar dataKey="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="Profit" fill="#10B981" radius={[4, 4, 0, 0]} animationDuration={1200} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Right: Analysis Cards */}
            <motion.div variants={containerStaggerVariants} className="space-y-3">
              {[
                {
                  title: 'Conservative Case (-20% Demand, +5% Cost)',
                  body: 'Footfall drops by 20% while supplier prices rise 5%. Business maintains positive net margin ($22.4k/mo), proving capital resilience.',
                  badge: 'Solvent & Protected',
                  badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
                },
                {
                  title: 'Base Case (Target Feasibility Plan)',
                  body: 'Steady-state operations yield 22.9% net margin ($72.6k/mo profit), recovering full CapEx outlay in 12.1 months.',
                  badge: 'Target Baseline',
                  badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
                },
                {
                  title: 'Optimistic Case (+20% Expansion)',
                  body: 'High word-of-mouth customer density yields 29.3% net margin ($111.5k/mo), compressing capital payback to 8.5 months.',
                  badge: 'Growth Upside',
                  badgeColor: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
                },
              ].map((item, idx) => (
                <motion.div key={idx} variants={popScaleVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
      },
    },

    // SLIDE 7: Geospatial GIS Engine & Micro-Radius Competitor Saturation
    {
      id: 7,
      category: '07 / Spatial GIS Engine',
      title: 'Geospatial GIS Engine & Micro-Radius Competitor Density',
      subtitle: 'Algorithmic spatial analysis transforming coordinate geography into quantifiable competitive advantages.',
      notes:
        'Walk through the 3 core spatial algorithms: Isochrone radius rings (500m to 5km), Competitor Density calculus (competitors / km²), and Synergy vs Rivalry classification.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 max-w-5xl mx-auto my-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                num: '01',
                title: 'Isochrone Catchment Rings',
                formula: 'Buffers: 500m (walkshed), 1km (neighborhood), 2km (primary), 5km (metro)',
                body: 'Calculates competitor density across pedestrian and vehicular catchment zones to evaluate localized footfall absorption and customer travel friction.',
                accent: 'text-sky-400',
              },
              {
                num: '02',
                title: 'Competitor Density Calculus',
                formula: 'Density = Relevant Competitors / (π × r²)',
                body: 'Computes spatial competitor clustering per square kilometer. Distinguishes high-density saturation zones from underserved commercial corridors.',
                accent: 'text-[#FFBF24]',
              },
              {
                num: '03',
                title: 'Synergy vs Rivalry Scoring',
                formula: 'Index: Complementary Hubs vs Zero-Sum Rivals',
                body: 'Differentiates head-to-head rivals from synergistic traffic magnets (metro stations, universities, corporate parks) that generate high-volume pedestrian patron flows.',
                accent: 'text-emerald-400',
              },
            ].map((gm, idx) => (
              <motion.div key={idx} variants={popScaleVariant} className="p-5 rounded-2xl bg-[#121722] border border-[#1E2433] flex flex-col justify-between h-72">
                <div>
                  <span className={`text-3xl font-black ${gm.accent}`}>{gm.num}</span>
                  <h4 className="text-base font-bold text-white mt-2">{gm.title}</h4>
                  <div className="text-[10px] font-mono text-[#94A3B8] bg-[#0A0D14] p-1.5 rounded mt-2 border border-[#1E2433]">
                    {gm.formula}
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{gm.body}</p>
                </div>
                <div className="pt-3 border-t border-[#1E2433] text-xs text-[#64748B]">
                  Leaflet 1.9 + OpenStreetMap GIS Layer
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] flex items-center justify-between text-xs text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <Radar className="w-4 h-4 text-[#FFBF24]" />
              <span><strong>Calculated Distance Metrics:</strong> Nearest Competitor, Average Distance, and Farthest Perimeter Boundary.</span>
            </div>
            <span className="font-mono text-[#FFBF24]">Live Spatial Radar</span>
          </div>
        </motion.div>
      ),
    },

    // SLIDE 8: LIVE DEMO: Location Intelligence Engine (Uran Islampur Narshhpur Road)
    {
      id: 8,
      category: '08 / Live Spatial Demo (Real-Time API)',
      title: 'LIVE DEMO: Real-Time Location Intelligence & Spatial Radar',
      subtitle: 'Target Corridor: Uran Islampur Narshhpur Road — Live API execution querying real-time businesses, spatial saturation, and competitor clusters.',
      notes:
        'Live interactive demonstration centered on Uran Islampur Narshhpur Road (Islampur, Maharashtra). Shows real-time business discovery via the backend spatial API, live radius expansion, GPS location lookup, and instant saturation scoring.',
      content: () => (
        <motion.div
          variants={containerStaggerVariants}
          initial="hidden"
          animate="visible"
          className="w-full h-full max-w-5xl mx-auto flex flex-col justify-center"
        >
          <LiveLocationIntelligenceDemo />
        </motion.div>
      ),
    },

    // SLIDE 9: Machine Learning Viability Pipeline, 14 3NF Schema & Project Summary
    {
      id: 9,
      category: '09 / ML Pipeline & Schema',
      title: 'Scikit-Learn ML Viability Pipeline & Relational Data Architecture',
      subtitle: 'Calibrated predictive modeling, 14-table 3NF MySQL relational database, and end-to-end platform capabilities.',
      notes:
        'Explain the Scikit-learn Random Forest and Gradient Boosting classifier feature weights, the 14-table 3NF schema, and multi-factor risk diagnostics.',
      content: () => {
        const featureData = [
          { feature: 'Commercial Footfall', weight: 32 },
          { feature: 'Capital Adequacy', weight: 26 },
          { feature: 'Competitor Density', weight: 21 },
          { feature: 'Demographic Income Tier', weight: 14 },
          { feature: 'Seasonality Index', weight: 7 },
        ];
        return (
          <motion.div
            variants={containerStaggerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center max-w-5xl mx-auto my-auto"
          >
            {/* Left: ML Feature Weights & Pipeline */}
            <div className="space-y-4">
              <motion.div variants={chartRevealVariant} className="h-64 p-4 rounded-2xl bg-[#121722] border border-[#1E2433]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    ML Feature Importance Weights (%)
                  </span>
                  <span className="text-[10px] font-mono text-[#FFBF24] bg-[#FFBF24]/10 px-2 py-0.5 rounded">
                    Random Forest + XGBoost
                  </span>
                </div>
                <ResponsiveContainer width="100%" height="86%">
                  <RechartsBarChart layout="vertical" data={featureData}>
                    <XAxis type="number" stroke="#64748B" fontSize={10} domain={[0, 40]} />
                    <YAxis type="category" dataKey="feature" stroke="#64748B" fontSize={10} width={135} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Importance Weight']}
                      contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E2433', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="weight" fill="#FFBF24" radius={[0, 4, 4, 0]} animationDuration={900} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-1 text-xs">
                <div className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Automated Multi-Factor Risk Diagnostics</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Evaluates viability against 3 vulnerability thresholds: Capital Shortfall (&lt; 3 months runway), Market Saturation (&gt; 12 rivals/km²), and Unit Margin Compression (&lt; 15% net margin).
                </p>
              </motion.div>
            </div>

            {/* Right: 14 3NF Relational Tables & Project Summary */}
            <motion.div variants={containerStaggerVariants} className="space-y-3">
              <div className="p-4 rounded-xl bg-[#121722] border border-[#1E2433] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-sky-400" />
                    <span>14 Relational 3NF MySQL Tables</span>
                  </span>
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded">
                    ACID Compliant
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#94A3B8]">
                  <div>• `users` (Roles & Auth)</div>
                  <div>• `business_plans` (Dossiers)</div>
                  <div>• `business_categories` (Benchmarks)</div>
                  <div>• `financial_projections` (P&L)</div>
                  <div>• `locations` (Coordinates & Tiers)</div>
                  <div>• `predictions` (ML Outputs)</div>
                  <div>• `market_data` (Demand Indices)</div>
                  <div>• `recommendations` (Mitigations)</div>
                  <div>• `competitors` (Spatial POIs)</div>
                  <div>• `saved_businesses` (Pins)</div>
                  <div>• `businesses` (Entities)</div>
                  <div>• `admin_logs` (Audit Telemetry)</div>
                </div>
              </div>

              <motion.div variants={fadeUpVariant} className="p-3.5 rounded-xl bg-[#121722] border border-[#FFBF24]/20 space-y-1">
                <div className="text-xs font-bold text-[#FFBF24]">Project Defense & Capstone Summary</div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  BizMind is fully operational with 0 external paid Google Maps dependencies, end-to-end unit economics modeling, multi-venture comparisons, and calibrated machine learning viability scoring developed for RIT Capstone Project.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      },
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1 < totalSlides ? prev + 1 : 0));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 >= 0 ? prev - 1 : totalSlides - 1));
  }, [totalSlides]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.error(err));
    }
    setIsFullscreen(false);
  };

  // Sync fullscreen change with document fullscreen event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setShowDrawer(false);
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        nextSlide();
      }, 7000);
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, nextSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <div
      ref={containerRef}
      className={`min-h-[calc(100vh-80px)] flex flex-col bg-[#0A0D14] text-white selection:bg-[#FFBF24] selection:text-black ${
        isFullscreen
          ? 'fixed inset-0 z-50 p-4 sm:p-8 bg-[#0A0D14] h-screen w-screen overflow-hidden'
          : 'rounded-2xl border border-[#1E2433] overflow-hidden'
      }`}
    >
      {/* 
        CLEAN FULLSCREEN MODE:
        When isFullscreen is true, completely hide all normal top controllers, buttons, tabs, and export tools.
        Show ONLY the slide, with:
        - Floating close button (X) in top right
        - Floating previous button (<) on left edge
        - Floating next button (>) on right edge
      */}
      {isFullscreen ? (
        <>
          {/* Top Floating Bar in Fullscreen: Just the RIT Logo & Minimal Close X */}
          <div className="absolute top-4 left-6 right-6 z-40 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-3">
              <RitLogo className="w-28 h-8 shadow-md" />
              <div className="px-2.5 py-1 rounded-full bg-[#121722]/80 backdrop-blur-md border border-[#1E2433] text-[11px] font-mono text-[#FFBF24]">
                Slide {currentSlide + 1} / {totalSlides}
              </div>
            </div>

            <button
              onClick={exitFullscreen}
              className="pointer-events-auto p-2.5 rounded-full bg-[#121722]/90 hover:bg-[#1E2433] border border-[#27272A] hover:border-[#FFBF24] text-[#A1A1AA] hover:text-white transition-all shadow-xl cursor-pointer group"
              title="Close Fullscreen (Esc)"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform text-[#FFBF24]" />
            </button>
          </div>

          {/* Floating Left Navigation Button (<) */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-[#121722]/85 hover:bg-[#1E2433] border border-[#27272A] hover:border-[#FFBF24] text-white transition-all shadow-2xl cursor-pointer group"
            title="Previous Slide (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6 text-[#FFBF24] group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Floating Right Navigation Button (>) */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-[#121722]/85 hover:bg-[#1E2433] border border-[#27272A] hover:border-[#FFBF24] text-white transition-all shadow-2xl cursor-pointer group"
            title="Next Slide (Right Arrow / Space)"
          >
            <ChevronRight className="w-6 h-6 text-[#FFBF24] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      ) : (
        /* Normal Standard Controller Bar */
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#1E2433] bg-[#0E121B]/90 backdrop-blur-md">
          {/* Left: Presentation Branding & RIT Logo */}
          <div className="flex items-center gap-3">
            <RitLogo className="w-24 h-7" />
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#1E2433] text-xs font-medium text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#FFBF24]" />
              <span>
                Slide {currentSlide + 1} of {totalSlides}
              </span>
            </button>

            <span className="hidden sm:inline text-xs font-mono text-[#64748B] truncate max-w-xs">
              {currentSlideData.category}
            </span>
          </div>

          {/* Center: Venture Feasibility Plan Selector */}
          {plans.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#94A3B8] hidden md:inline">Feasibility Plan:</span>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="bg-[#141824] text-xs text-white border border-[#1E2433] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#FFBF24]"
              >
                <option value="platform">BizMind Project Architecture (Default)</option>
                {plans.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.businessName} ({p.location || 'Local'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Right: Controls & Export */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                isPlaying
                  ? 'bg-[#FFBF24]/20 border-[#FFBF24] text-[#FFBF24]'
                  : 'bg-[#141824] border-[#1E2433] text-[#94A3B8] hover:text-white'
              }`}
              title={isPlaying ? 'Pause Auto-Play (7s)' : 'Auto-Play Slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                showNotes
                  ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                  : 'bg-[#141824] border-[#1E2433] text-[#94A3B8] hover:text-white'
              }`}
              title="Toggle Presenter Speaking Notes"
            >
              <Lightbulb className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#1E2433] text-xs font-medium text-white transition-colors cursor-pointer"
              title="Download Standalone Animated HTML Deck"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">HTML</span>
            </button>

            <button
              onClick={handleExportPptx}
              disabled={isExportingPptx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFBF24] hover:bg-[#E5AC20] text-black font-bold text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              title="Download Native PowerPoint (.pptx) with Vector Charts & RIT Branding"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>{isExportingPptx ? 'Exporting...' : 'Export PPTX (9p)'}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#1E2433] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              title="Fullscreen Mode"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Slide Viewport */}
      <div
        className={`relative flex-1 flex flex-col justify-between overflow-hidden ${
          isFullscreen ? 'p-6 sm:p-12 h-full' : 'p-6 sm:p-10'
        }`}
      >
        {/* Slide Header with RIT Branding on EVERY Slide */}
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-[11px] font-mono text-[#FFBF24] tracking-wider uppercase font-semibold flex items-center gap-2">
              <span>{currentSlideData.category}</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#94A3B8]">RIT Rajaramnagar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              {currentSlideData.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-4xl">
              {currentSlideData.subtitle}
            </p>
          </div>

          {/* RIT Logo Badge on All Slides */}
          <div className="hidden sm:block shrink-0">
            <RitLogo className="w-24 h-7 shadow-sm" />
          </div>
        </div>

        {/* Slide Body Animated Transition */}
        <div className="flex-1 w-full min-h-[460px] flex items-center justify-center">
          <SlideAnimationEngine slideKey={currentSlide} direction={direction}>
            {currentSlideData.content(selectedPlan)}
          </SlideAnimationEngine>
        </div>

        {/* Presenter Notes Overlay (only in standard view) */}
        {!isFullscreen && showNotes && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#0E121B] border border-sky-500/30 text-xs text-sky-200 flex items-start gap-2.5 animate-fadeIn">
            <Lightbulb className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Presenter Speaking Notes: </strong>
              <span>{currentSlideData.notes}</span>
            </div>
          </div>
        )}

        {/* Bottom Navigation & Progress Bar (Hidden in Fullscreen) */}
        {!isFullscreen && (
          <div className="mt-4 pt-4 border-t border-[#1E2433] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#1E2433] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                title="Previous Slide (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#1E2433] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                title="Next Slide (Right Arrow / Space)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Slide Indicators */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentSlide ? 1 : -1);
                    setCurrentSlide(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlide
                      ? 'w-8 bg-[#FFBF24]'
                      : 'w-2 bg-[#1E2433] hover:bg-[#94A3B8]'
                  }`}
                  title={`Jump to Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="text-[11px] font-mono text-[#64748B]">
              Slide {currentSlide + 1} of {totalSlides}
            </div>
          </div>
        )}
      </div>

      {/* Slide Drawer Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-full max-w-sm bg-[#0E121B] border-l border-[#1E2433] h-full p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2433]">
                <div className="flex items-center gap-2">
                  <RitLogo className="w-16 h-5" />
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>9-Slide Deck Index</span>
                  </h3>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-1 rounded text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2 overflow-y-auto max-h-[75vh]">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setDirection(idx > currentSlide ? 1 : -1);
                      setCurrentSlide(idx);
                      setShowDrawer(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                      idx === currentSlide
                        ? 'bg-[#FFBF24]/10 border-[#FFBF24] text-white'
                        : 'bg-[#141824] border-[#1E2433] text-[#94A3B8] hover:bg-[#1A2030] hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-[#FFBF24]">{s.category}</div>
                    <div className="text-xs font-bold mt-0.5 truncate">{s.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E2433] text-center text-[11px] text-[#64748B]">
              Press Left/Right Arrow keys to navigate
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#0E121B] border border-[#FFBF24] text-xs text-white shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#FFBF24] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
export default PresentationPage;
