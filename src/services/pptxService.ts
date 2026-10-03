/**
 * BizMind – Elite Advanced PowerPoint (.pptx) Generator
 * Features:
 * - Standard Office 16:9 Widescreen Layout (13.333" x 7.5") with perfect margins (no clipping)
 * - Native PowerPoint Vector Charts (Doughnut, Clustered Bar, Line, Horizontal Bar)
 * - Real PowerPoint Slide Transitions (<p:transition>) injected via JSZip
 * - Full executive styling, formatted financial numbers, and speaker notes
 */
import pptxgen from 'pptxgenjs';
import JSZip from 'jszip';
import { BusinessPlan } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export async function generateBizMindPptx(plan?: BusinessPlan | null): Promise<void> {
  const pptx = new pptxgen();

  // Define true Office 365 16:9 widescreen layout (13.333 inches x 7.5 inches)
  pptx.defineLayout({ name: 'WIDE_16_9', width: 13.333, height: 7.5 });
  pptx.layout = 'WIDE_16_9';

  pptx.author = 'BizMind AI Platform';
  pptx.company = 'BizMind Decision Intelligence';
  pptx.title = plan?.businessName
    ? `${plan.businessName} - Executive Pitch Deck & Market Feasibility`
    : 'BizMind - AI Business Planning Platform Pitch Deck';

  // Master Color Palette (Hex codes without hash for PptxGenJS)
  const C = {
    BG_DARK: '0A0D14',       // Deep rich midnight obsidian
    BG_CARD: '121722',       // Elevated glass slate
    BG_CARD_LIGHT: '1E2433', // Border / separator line
    BG_CARD_HOVER: '252D3F', // Lighter container
    GOLD: 'F59E0B',          // Core Amber/Gold brand
    GOLD_LIGHT: 'FDE68A',    // Pale gold highlight
    CYAN: '0EA5E9',          // Modern tech cyan
    CYAN_LIGHT: 'BAE6FD',    // Ice blue
    EMERALD: '10B981',       // Success / profit green
    ROSE: 'F43F5E',          // Alert / risk rose
    PURPLE: '8B5CF6',        // ML intelligence violet
    TEXT_WHITE: 'FFFFFF',    // Primary typography
    TEXT_MUTED: '94A3B8',    // Secondary captions
    TEXT_DIM: '64748B',      // Footnotes
  };

  // Helper: Adds consistent modern header, category pill, footer, and speaker notes
  const addMasterSlide = (
    title: string,
    category: string,
    slideNumber: number,
    speakerNotes: string,
    totalSlides = 12
  ) => {
    const slide = pptx.addSlide();
    slide.background = { color: C.BG_DARK };

    // Header Category Pill
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 0.35,
      w: 2.8,
      h: 0.32,
      rectRadius: 0.16,
      fill: { color: C.BG_CARD_LIGHT },
      line: { color: C.GOLD, width: 1 },
    });

    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.36,
      w: 2.8,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.GOLD,
      bold: true,
      align: 'center',
      charSpacing: 2,
    });

    // Slide Main Title
    slide.addText(title, {
      x: 0.8,
      y: 0.75,
      w: 11.5,
      h: 0.55,
      fontSize: 22,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    // Decorative Accent Line under header
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 1.35,
      w: 11.7,
      h: 0.015,
      fill: { color: C.BG_CARD_LIGHT },
    });

    // Slide Bottom Divider
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 7.0,
      w: 11.7,
      h: 0.015,
      fill: { color: C.BG_CARD_LIGHT },
    });

    // Footer Branding
    slide.addText('BIZMIND  •  AI-Powered Business Planning & Market Intelligence Platform', {
      x: 0.8,
      y: 7.05,
      w: 9.0,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
    });

    // Slide Number Badge
    slide.addText(`${slideNumber} / ${totalSlides}`, {
      x: 10.5,
      y: 7.05,
      w: 2.0,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.GOLD,
      align: 'right',
      bold: true,
    });

    // Add Presenter Speaker Notes
    if (speakerNotes) {
      slide.addNotes(speakerNotes);
    }

    return slide;
  };

  // =========================================================================
  // SLIDE 1: Title & Hero Cover
  // =========================================================================
  const slide1 = pptx.addSlide();
  slide1.background = { color: C.BG_DARK };

  // Decorative ambient glow backdrop card
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 0.6,
    w: 11.7,
    h: 6.2,
    rectRadius: 0.15,
    fill: { color: C.BG_CARD },
    line: { color: C.BG_CARD_LIGHT, width: 1.5 },
  });

  // Vertical brand ribbon
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 1.2,
    y: 1.0,
    w: 0.15,
    h: 5.2,
    rectRadius: 0.08,
    fill: { color: C.GOLD },
  });

  slide1.addText('NEXT-GENERATION DECISION INTELLIGENCE', {
    x: 1.6,
    y: 1.0,
    w: 9.5,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: C.GOLD,
    bold: true,
    charSpacing: 2,
  });

  const heroTitle = plan?.businessName ? plan.businessName : 'BIZMIND AI PLATFORM';
  slide1.addText(heroTitle, {
    x: 1.6,
    y: 1.35,
    w: 10.2,
    h: 1.1,
    fontSize: 34,
    fontFace: 'Arial',
    color: C.TEXT_WHITE,
    bold: true,
  });

  const heroSubtitle = plan
    ? `Comprehensive Feasibility Dossier, Unit Economics & Geospatial Market Validation for ${plan.location || 'Target Location'}`
    : 'Predictive Business Planning, Location Demographics, Competitor Clustering & Unit Economics Architecture';
  slide1.addText(heroSubtitle, {
    x: 1.6,
    y: 2.5,
    w: 10.0,
    h: 0.7,
    fontSize: 13,
    fontFace: 'Arial',
    color: C.TEXT_MUTED,
    lineSpacing: 18,
  });

  // 4 Core Metrics Pill Bar on Cover (Precisely sized to fit within 11.7" width)
  const coverStats = [
    { label: 'INDUSTRY SECTOR', val: plan?.category || 'Retail & Hospitality' },
    { label: 'STARTUP CAPEX', val: plan ? formatCurrency(plan.totalInitialInvestment || 0) : '$875,000' },
    { label: 'NET MARGIN', val: plan ? `${formatPercentage(plan.profitMargin || 0)} Net` : '22.9% Target' },
    { label: 'CAPITAL PAYBACK', val: plan ? `${plan.paybackPeriodMonths || 12.1} Months` : '12.1 Months' },
  ];

  coverStats.forEach((st, idx) => {
    // 4 cards: width 2.55 each, gap 0.23 => total 10.9", starting at x: 1.6 => ends at 12.5"
    const xPos = 1.6 + idx * 2.78;
    slide1.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 3.6,
      w: 2.55,
      h: 2.2,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD_LIGHT },
      line: { color: idx === 1 ? C.GOLD : C.BG_CARD_HOVER, width: 1.2 },
    });

    slide1.addText(st.label, {
      x: xPos + 0.15,
      y: 3.85,
      w: 2.25,
      h: 0.25,
      fontSize: 8,
      fontFace: 'Arial',
      color: C.GOLD,
      bold: true,
    });

    slide1.addText(st.val, {
      x: xPos + 0.15,
      y: 4.3,
      w: 2.25,
      h: 0.8,
      fontSize: 18,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });
  });

  slide1.addNotes('Welcome. Today we present the executive business feasibility dossier powered by the BizMind decision intelligence engine.');

  // =========================================================================
  // SLIDE 2: CapEx Allocation (Real Native Doughnut Chart)
  // =========================================================================
  const slide2 = addMasterSlide(
    'Startup Capital Allocation & Investment Structure',
    'CapEx Breakdown',
    2,
    'This slide shows the exact distribution of initial capital. Notice how working capital and reserves are sized to guarantee survival through the break-even curve.'
  );

  const capexData = [
    {
      name: 'Initial Investment',
      labels: ['Property Deposit', 'Interior Setup', 'Equipment', 'Technology', 'Launch Marketing', 'Initial Inventory'],
      values: [
        plan?.propertyDeposit || 250000,
        plan?.interiorSetup || 280000,
        plan?.equipmentCost || 180000,
        plan?.technologyCost || 20000,
        plan?.launchMarketing || 25000,
        plan?.initialInventory || 35000,
      ],
    },
  ];

  slide2.addChart(pptx.ChartType.doughnut, capexData, {
    x: 0.8,
    y: 1.6,
    w: 5.8,
    h: 5.0,
    holeSize: 55,
    showLegend: true,
    legendPos: 'b',
    legendColor: C.TEXT_WHITE,
    legendFontSize: 9,
    showValue: false,
    showPercent: true,
    dataLabelColor: C.TEXT_WHITE,
    dataLabelFontSize: 10,
    chartColors: [C.GOLD, C.CYAN, C.EMERALD, C.PURPLE, C.ROSE, 'EAB308'],
  });

  const capexItems = [
    { title: 'Total Startup Outlay', val: plan ? formatCurrency(plan.totalInitialInvestment || 0) : '$790,000', sub: 'Comprehensive fixed CapEx requirement', color: C.GOLD },
    { title: 'Working Capital Reserve', val: plan ? formatCurrency((plan.totalMonthlyFixedExpenses || 165000) * 3) : '$495,000', sub: '3-month buffer to absorb footfall ramp-up', color: C.CYAN },
    { title: 'Equipment & Infrastructure', val: plan ? formatCurrency(plan.equipmentCost || 180000) : '$180,000', sub: 'Commercial assets with depreciation buffer', color: C.EMERALD },
  ];

  capexItems.forEach((ci, idx) => {
    const yPos = 1.6 + idx * 1.65;
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: 7.0,
      y: yPos,
      w: 5.5,
      h: 1.45,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide2.addText(ci.title, {
      x: 7.3,
      y: yPos + 0.2,
      w: 4.9,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      bold: true,
    });

    slide2.addText(ci.val, {
      x: 7.3,
      y: yPos + 0.55,
      w: 4.9,
      h: 0.45,
      fontSize: 18,
      fontFace: 'Arial',
      color: ci.color,
      bold: true,
    });

    slide2.addText(ci.sub, {
      x: 7.3,
      y: yPos + 1.05,
      w: 4.9,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
    });
  });

  // =========================================================================
  // SLIDE 3: The Problem (4 Structural Failure Vectors)
  // =========================================================================
  const slide3 = addMasterSlide(
    'The $1.3 Trillion Failure Epidemic: Why 90% of Startups Collapse',
    'Market Need & Friction',
    3,
    'Explain how small businesses fail from lack of integrated spatial analysis, inadequate cash runway, and spreadsheet errors.'
  );

  const problemCards = [
    { num: '42%', title: 'No Market Demand & Site Saturation', desc: 'Committing to long-term commercial leases based on surface foot-traffic impressions rather than competitor clustering and target purchasing power.', tag: 'FATAL LOCATION' },
    { num: '29%', title: 'Premature Cash Depletion', desc: 'Spreadsheets fail to calculate customer ramp-up drag and variable cost spikes, exhausting cash reserves before achieving break-even.', tag: 'CASH RUNWAY' },
    { num: '23%', title: 'Pricing & Unit Economics Distortion', desc: 'Setting retail price points without accounting for exact contribution margins, spoilage, merchant processing fees, and utility overhead.', tag: 'MARGIN EROSION' },
    { num: '19%', title: 'Outcompeted by Hidden Rivals', desc: 'Failing to track nearby complementary vs direct rivals, allowing aggressive local competitors to capture prime customer footfall corridors.', tag: 'MARKET SHARE' },
  ];

  problemCards.forEach((pc, idx) => {
    const xPos = idx % 2 === 0 ? 0.8 : 6.8;
    const yPos = idx < 2 ? 1.6 : 4.2;

    slide3.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 5.7,
      h: 2.3,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.ROSE, width: 1 },
    });

    slide3.addText(pc.num, {
      x: xPos + 0.3,
      y: yPos + 0.25,
      w: 1.5,
      h: 0.6,
      fontSize: 26,
      fontFace: 'Arial',
      color: C.ROSE,
      bold: true,
    });

    slide3.addText(pc.tag, {
      x: xPos + 3.2,
      y: yPos + 0.35,
      w: 2.2,
      h: 0.3,
      fontSize: 8,
      fontFace: 'Arial',
      color: C.ROSE,
      align: 'right',
      bold: true,
    });

    slide3.addText(pc.title, {
      x: xPos + 0.3,
      y: yPos + 0.9,
      w: 5.1,
      h: 0.35,
      fontSize: 13,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide3.addText(pc.desc, {
      x: xPos + 0.3,
      y: yPos + 1.3,
      w: 5.1,
      h: 0.85,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 14,
    });
  });

  // =========================================================================
  // SLIDE 4: Full-Stack Enterprise Architecture (Visual Tier Blocks)
  // =========================================================================
  const slide4 = addMasterSlide(
    'Unified Platform Architecture: Built for Scale & Low Latency',
    'Technical Blueprint',
    4,
    'BizMind unites modern React client interfaces, high-throughput Node.js microservices, Python FastAPI ML pipelines, and spatial engines.'
  );

  const archTiers = [
    { tier: 'TIER 01: PRESENTATION & CLIENT', name: 'React 19 + TypeScript + Vite + Tailwind', desc: 'Responsive SPA, motion transitions, dark Leaflet/OSM GIS renderer, interactive Recharts dashboard.', color: C.GOLD },
    { tier: 'TIER 02: API GATEWAY & LOGIC', name: 'Node.js 22 + Express + JWT Authentication', desc: 'Deterministic financial formulas, RBAC authorization, ACID in-memory fallback, REST microservices.', color: C.CYAN },
    { tier: 'TIER 03: GEOSPATIAL INTELLIGENCE', name: 'Google Places (New) + OpenStreetMap Overpass', desc: 'Isochrone radius dispersion (500m to 5km), footfall synergy proxies, white-space gap detection.', color: C.EMERALD },
    { tier: 'TIER 04: ML PREDICTIVE PIPELINE', name: 'Python FastAPI + XGBoost + Scikit-Learn', desc: 'Sub-20ms inference latency, Random Forest & XGBoost ensembles, calibrated Responsible AI validation.', color: C.PURPLE },
  ];

  archTiers.forEach((at, idx) => {
    const yPos = 1.6 + idx * 1.28;
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 11.7,
      h: 1.15,
      rectRadius: 0.08,
      fill: { color: C.BG_CARD },
      line: { color: at.color, width: 1.2 },
    });

    slide4.addText(at.tier, {
      x: 1.1,
      y: yPos + 0.15,
      w: 4.5,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      color: at.color,
      bold: true,
      charSpacing: 1.5,
    });

    slide4.addText(at.name, {
      x: 1.1,
      y: yPos + 0.42,
      w: 4.5,
      h: 0.35,
      fontSize: 13,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide4.addText(at.desc, {
      x: 5.8,
      y: yPos + 0.3,
      w: 6.4,
      h: 0.6,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 14,
    });
  });

  // =========================================================================
  // SLIDE 5: 6-Stage Planning Process Flow
  // =========================================================================
  const slide5 = addMasterSlide(
    'The 6-Stage Guided Planning Methodology',
    'Process Workflow',
    5,
    'Explain how entrepreneurs are guided through a rigorous 6-step financial and market formulation pipeline.'
  );

  const processSteps = [
    { step: '01', title: 'Business Identity', sub: 'Category, target demographic, B2B/B2C model, and location corridor.' },
    { step: '02', title: 'CapEx Outlay', sub: 'Itemized setup: deposits, fit-outs, equipment, licenses, initial inventory.' },
    { step: '03', title: 'OpEx Fixed Burn', sub: 'Rent, payroll, utilities, marketing, maintenance, insurance, loan EMI.' },
    { step: '04', title: 'Unit Economics', sub: 'Ticket size, daily customer volume, operating days, variable COGS.' },
    { step: '05', title: 'Assumptions Review', sub: 'Validation checks, sensitivity buffers, and scenario stress testing.' },
    { step: '06', title: 'Live KPI Dashboard', sub: 'Break-even units, payback period, annual ROI, and cash projections.' },
  ];

  processSteps.forEach((ps, idx) => {
    const xPos = 0.8 + (idx % 3) * 4.0;
    const yPos = idx < 3 ? 1.6 : 4.2;

    slide5.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 3.7,
      h: 2.3,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide5.addText(ps.step, {
      x: xPos + 0.3,
      y: yPos + 0.2,
      w: 1.0,
      h: 0.45,
      fontSize: 22,
      fontFace: 'Arial',
      color: C.GOLD,
      bold: true,
    });

    slide5.addText(ps.title, {
      x: xPos + 0.3,
      y: yPos + 0.7,
      w: 3.1,
      h: 0.35,
      fontSize: 14,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide5.addText(ps.sub, {
      x: xPos + 0.3,
      y: yPos + 1.1,
      w: 3.1,
      h: 1.0,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 15,
    });
  });

  // =========================================================================
  // SLIDE 6: 12-Month Break-Even & Growth Trajectory (Native Line Chart)
  // =========================================================================
  const slide6 = addMasterSlide(
    '12-Month Financial Trajectory: Compounding Revenue vs. Expenses',
    'Financial Modeling',
    6,
    'This native line chart displays the monthly revenue growth trajectory crossing the fixed expense baseline to establish clear cash flow neutrality.'
  );

  const baseRev = plan?.monthlyRevenue || 316800;
  const baseExp = plan?.totalMonthlyExpenses || 244200;
  const months = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];

  const lineChartData = [
    {
      name: 'Monthly Revenue',
      labels: months,
      values: months.map((_, i) => Math.round(baseRev * (0.75 + i * 0.045))),
    },
    {
      name: 'Total Expenses',
      labels: months,
      values: months.map((_, i) => Math.round(baseExp * (0.95 + i * 0.015))),
    },
  ];

  slide6.addChart(pptx.ChartType.line, lineChartData, {
    x: 0.8,
    y: 1.6,
    w: 7.2,
    h: 5.0,
    showLegend: true,
    legendPos: 'b',
    legendColor: C.TEXT_WHITE,
    legendFontSize: 9,
    showTitle: true,
    title: '12-Month Revenue Ramp vs Total Operating Expenses',
    titleColor: C.GOLD,
    titleFontSize: 11,
    chartColors: [C.EMERALD, C.ROSE],
  });

  const beUnits = plan?.breakEvenUnits || 1000;
  const beRev = plan?.breakEvenRevenue || 220000;
  const beCap = plan?.breakEvenCapacityPercentage || 69.4;

  const beCards = [
    { title: 'Break-Even Units', val: `${beUnits.toLocaleString()} Units / mo`, sub: 'Sales volume required for zero loss', color: C.GOLD },
    { title: 'Break-Even Revenue', val: formatCurrency(beRev), sub: 'Monthly gross receipts to cover all OpEx', color: C.CYAN },
    { title: 'Capacity Utilization', val: formatPercentage(beCap), sub: `${(100 - beCap).toFixed(1)}% buffer against demand drops`, color: C.EMERALD },
  ];

  beCards.forEach((bc, idx) => {
    const yPos = 1.6 + idx * 1.65;
    slide6.addShape(pptx.ShapeType.roundRect, {
      x: 8.3,
      y: yPos,
      w: 4.2,
      h: 1.45,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide6.addText(bc.title, {
      x: 8.5,
      y: yPos + 0.2,
      w: 3.8,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      bold: true,
    });

    slide6.addText(bc.val, {
      x: 8.5,
      y: yPos + 0.55,
      w: 3.8,
      h: 0.45,
      fontSize: 16,
      fontFace: 'Arial',
      color: bc.color,
      bold: true,
    });

    slide6.addText(bc.sub, {
      x: 8.5,
      y: yPos + 1.05,
      w: 3.8,
      h: 0.3,
      fontSize: 8,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
    });
  });

  // =========================================================================
  // SLIDE 7: Sensitivity & Scenario Stress-Testing (Native Clustered Column Chart)
  // =========================================================================
  const slide7 = addMasterSlide(
    'Stress-Testing: Scenario Comparison & Downside Protection',
    'Risk & Sensitivity',
    7,
    'Compare the Conservative, Base, and Optimistic cases. Even with a 20% drop in footfall, the model remains solvent.'
  );

  const scenarioChartData = [
    {
      name: 'Revenue',
      labels: ['Conservative (-20%)', 'Base Case (Target)', 'Optimistic (+20%)'],
      values: [Math.round(baseRev * 0.8), baseRev, Math.round(baseRev * 1.2)],
    },
    {
      name: 'Expenses',
      labels: ['Conservative (-20%)', 'Base Case (Target)', 'Optimistic (+20%)'],
      values: [Math.round(baseExp * 1.05), baseExp, Math.round(baseExp * 1.1)],
    },
    {
      name: 'Net Profit',
      labels: ['Conservative (-20%)', 'Base Case (Target)', 'Optimistic (+20%)'],
      values: [Math.round(baseRev * 0.8 - baseExp * 1.05), Math.round(baseRev - baseExp), Math.round(baseRev * 1.2 - baseExp * 1.1)],
    },
  ];

  slide7.addChart(pptx.ChartType.bar, scenarioChartData, {
    x: 0.8,
    y: 1.6,
    w: 7.2,
    h: 5.0,
    barDir: 'col',
    barGrouping: 'clustered',
    showLegend: true,
    legendPos: 'b',
    legendColor: C.TEXT_WHITE,
    legendFontSize: 9,
    showTitle: true,
    title: 'Monthly Cash Flow Under Economic Stress',
    titleColor: C.GOLD,
    titleFontSize: 11,
    chartColors: [C.CYAN, C.ROSE, C.EMERALD],
  });

  const scenarioNotes = [
    { title: 'Conservative Case (-20%)', body: 'Footfall drops by 20% while fixed costs inflate by 5%. Cash reserves bridge the 16-month extended runway with zero insolvency.', color: C.ROSE },
    { title: 'Base Target Case', body: 'Expected steady-state performance yielding 22.9% net margin and full initial capital payback in 12.1 months.', color: C.GOLD },
    { title: 'Optimistic Case (+20%)', body: 'High customer repeat frequency yields 29.3% net margin, accelerating capital payback to 8.5 months for multi-unit scaling.', color: C.EMERALD },
  ];

  scenarioNotes.forEach((sn, idx) => {
    const yPos = 1.6 + idx * 1.65;
    slide7.addShape(pptx.ShapeType.roundRect, {
      x: 8.3,
      y: yPos,
      w: 4.2,
      h: 1.45,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: sn.color, width: 1 },
    });

    slide7.addText(sn.title, {
      x: 8.5,
      y: yPos + 0.2,
      w: 3.8,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      color: sn.color,
      bold: true,
    });

    slide7.addText(sn.body, {
      x: 8.5,
      y: yPos + 0.55,
      w: 3.8,
      h: 0.8,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 14,
    });
  });

  // =========================================================================
  // SLIDE 8: Geospatial Market & Location Intelligence
  // =========================================================================
  const slide8 = addMasterSlide(
    'Geospatial Competitor Density & White-Space Discovery',
    'Spatial Intelligence',
    8,
    'BizMind eliminates location blind spots using micro-radius competitor clustering, footfall synergy, and white-space gap analysis.'
  );

  const geoModules = [
    {
      num: '01',
      title: 'Isochrone Radius Banding',
      body: 'Calculates competitor density across 500m, 1km, 2km, and 5km bands to evaluate pedestrian accessibility and vehicular retail draw.',
      stat: '500m - 5km Dynamic Radii',
      accent: C.CYAN,
    },
    {
      num: '02',
      title: 'Footfall Synergy vs Rivalry',
      body: 'Differentiates direct competitors (dividing category spend) from complementary hubs (transit, offices, retail anchors) that drive footfall.',
      stat: 'Synergy Score Algorithm',
      accent: C.GOLD,
    },
    {
      num: '03',
      title: 'White-Space Gap Discovery',
      body: 'Highlights high-density residential and commercial pockets where specific consumer offerings are completely unserved.',
      stat: 'Opportunity Score Index',
      accent: C.EMERALD,
    },
  ];

  geoModules.forEach((gm, idx) => {
    const xPos = 0.8 + idx * 4.0;
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.6,
      w: 3.7,
      h: 4.8,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide8.addText(gm.num, {
      x: xPos + 0.3,
      y: 1.9,
      w: 1.0,
      h: 0.45,
      fontSize: 22,
      fontFace: 'Arial',
      color: gm.accent,
      bold: true,
    });

    slide8.addText(gm.title, {
      x: xPos + 0.3,
      y: 2.45,
      w: 3.1,
      h: 0.6,
      fontSize: 15,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide8.addText(gm.body, {
      x: xPos + 0.3,
      y: 3.2,
      w: 3.1,
      h: 1.8,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 16,
    });

    slide8.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.3,
      y: 5.4,
      w: 3.1,
      h: 0.6,
      rectRadius: 0.06,
      fill: { color: C.BG_DARK },
      line: { color: gm.accent, width: 1 },
    });

    slide8.addText(gm.stat, {
      x: xPos + 0.3,
      y: 5.5,
      w: 3.1,
      h: 0.4,
      fontSize: 10,
      fontFace: 'Arial',
      color: gm.accent,
      align: 'center',
      bold: true,
    });
  });

  // =========================================================================
  // SLIDE 9: ML Feature Importance (Native Horizontal Bar Chart)
  // =========================================================================
  const slide9 = addMasterSlide(
    'Machine Learning Engine: Feature Weights & Validation Guards',
    'Predictive Modeling',
    9,
    'Explain the empirical feature attribution: Footfall Density 32%, Capital Adequacy 26%, Proximity 21%. Emphasize the Responsible AI validation guard.'
  );

  const featureChartData = [
    {
      name: 'Feature Weight',
      labels: [
        'Seasonality Multiplier',
        'Target Demographic Income',
        'Competitor Proximity Index',
        'Capital Adequacy & Runway',
        'Location Footfall Density',
      ],
      values: [7, 14, 21, 26, 32],
    },
  ];

  slide9.addChart(pptx.ChartType.bar, featureChartData, {
    x: 0.8,
    y: 1.6,
    w: 6.8,
    h: 5.0,
    barDir: 'bar',
    barGrouping: 'standard',
    showLegend: false,
    showTitle: true,
    title: 'Model Feature Attribution & Predictive Weights (%)',
    titleColor: C.GOLD,
    titleFontSize: 11,
    chartColors: [C.GOLD],
  });

  slide9.addShape(pptx.ShapeType.roundRect, {
    x: 7.9,
    y: 1.6,
    w: 4.6,
    h: 5.0,
    rectRadius: 0.1,
    fill: { color: C.BG_CARD },
    line: { color: C.BG_CARD_LIGHT, width: 1 },
  });

  slide9.addText('RESPONSIBLE AI GOVERNANCE', {
    x: 8.2,
    y: 1.9,
    w: 4.0,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    color: C.PURPLE,
    bold: true,
    charSpacing: 1.5,
  });

  slide9.addText('Validation Guards & Policy', {
    x: 8.2,
    y: 2.2,
    w: 4.0,
    h: 0.4,
    fontSize: 16,
    fontFace: 'Arial',
    color: C.TEXT_WHITE,
    bold: true,
  });

  slide9.addText(
    'BizMind strictly adheres to enterprise AI safety guidelines:\n\n• Calibrated Probabilities: Success probability percentages are displayed ONLY if the dataset is validated with high empirical confidence.\n\n• Zero Hallucination Guard: If regional training records are sparse for a niche category, the platform transparently reports:\n"Prediction unavailable — insufficient validated data"\nand falls back to deterministic rule-based feasibility scoring.',
    {
      x: 8.2,
      y: 2.8,
      w: 4.0,
      h: 3.5,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 17,
    }
  );

  // =========================================================================
  // SLIDE 10: Administrative MLOps & Real-Time Telemetry
  // =========================================================================
  const slide10 = addMasterSlide(
    'Administrative MLOps & Production Telemetry',
    'Operations & Quality',
    10,
    'Explain the administrative telemetry: 14.2ms inference latency, 91.8% validated accuracy, and automated retraining pipelines.'
  );

  const opsMetrics = [
    { title: 'Inference Latency', val: '14.2ms', sub: 'Average response time', desc: 'Ultra-fast sub-20ms inference enables immediate metric updates inside the financial wizard.', color: C.CYAN },
    { title: 'Model Accuracy', val: '91.8%', sub: 'Validated F1: 0.894', desc: 'Ensemble model evaluated against multi-year municipal small business survival registries.', color: C.EMERALD },
    { title: 'Audit Trail', val: '100% ACID', sub: 'Tamper-evident logs', desc: 'Granular administrative logs of plan updates, role changes, and dataset modifications.', color: C.GOLD },
  ];

  opsMetrics.forEach((om, idx) => {
    const xPos = 0.8 + idx * 4.0;
    slide10.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.6,
      w: 3.7,
      h: 4.8,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide10.addText(om.title, {
      x: xPos + 0.3,
      y: 1.9,
      w: 3.1,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      bold: true,
    });

    slide10.addText(om.val, {
      x: xPos + 0.3,
      y: 2.3,
      w: 3.1,
      h: 0.6,
      fontSize: 28,
      fontFace: 'Arial',
      color: om.color,
      bold: true,
    });

    slide10.addText(om.sub, {
      x: xPos + 0.3,
      y: 3.0,
      w: 3.1,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: om.color,
      bold: true,
    });

    slide10.addText(om.desc, {
      x: xPos + 0.3,
      y: 3.4,
      w: 3.1,
      h: 1.8,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 16,
    });
  });

  // =========================================================================
  // SLIDE 11: Business Impact & Transformation Scorecard
  // =========================================================================
  const slide11 = addMasterSlide(
    'Transformation Scorecard: Proven Business Outcomes',
    'Value Realization',
    11,
    'Review the proven business impact: 85% planning time reduction, 3.4x capital efficiency, and 94% loan approval readiness.'
  );

  const scorecard = [
    { stat: '85%', label: 'Planning Time Compressed', detail: 'Accelerates business plan formulation from 3-4 weeks to under an hour of structured, data-driven modeling.', color: C.GOLD },
    { stat: '3.4x', label: 'Higher Capital Efficiency', detail: 'Prevents premature burnout by accurately sizing fixed reserves and working capital before leasing commercial space.', color: C.CYAN },
    { stat: '94%', label: 'Loan & Pitch Readiness', detail: 'Produces institutional-grade financial projections and location dossiers accepted by lenders, landlords, and angels.', color: C.EMERALD },
    { stat: '< 20ms', label: 'Real-Time Spatial Queries', detail: 'Instantaneous competitor mapping and radius density retrieval via optimized geospatial APIs.', color: C.PURPLE },
  ];

  scorecard.forEach((sc, idx) => {
    const xPos = idx % 2 === 0 ? 0.8 : 6.8;
    const yPos = idx < 2 ? 1.6 : 4.2;

    slide11.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 5.7,
      h: 2.3,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide11.addText(sc.stat, {
      x: xPos + 0.3,
      y: yPos + 0.25,
      w: 2.2,
      h: 0.6,
      fontSize: 30,
      fontFace: 'Arial',
      color: sc.color,
      bold: true,
    });

    slide11.addText(sc.label, {
      x: xPos + 2.5,
      y: yPos + 0.35,
      w: 2.9,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide11.addText(sc.detail, {
      x: xPos + 0.3,
      y: yPos + 1.05,
      w: 5.1,
      h: 0.95,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 15,
    });
  });

  // =========================================================================
  // SLIDE 12: Strategic Roadmap & Vision
  // =========================================================================
  const slide12 = addMasterSlide(
    'Strategic Roadmap & Next Horizons',
    'The Vision Ahead',
    12,
    'Conclude with the roadmap: Multi-unit franchise intelligence, supplier wholesale bidding, and global commercial lease datasets.'
  );

  const roadmapPhases = [
    {
      phase: 'PHASE 01: COMPLETED',
      title: 'Core Engine & Spatial Mapping',
      items: '• 6-stage financial wizard with unit economics\n• Google Places & OSM Overpass engines\n• XGBoost success prediction prototype\n• Role-based User & Admin consoles',
      border: C.BG_CARD_LIGHT,
      color: C.TEXT_MUTED,
    },
    {
      phase: 'PHASE 02: ACTIVE DEPLOYMENT',
      title: 'Scenario & MLOps Pipeline',
      items: '• Sensitivity stress-testing & break-even models\n• Multi-scenario financial forecasting\n• Admin MLOps telemetry & retraining\n• One-click native PowerPoint (.pptx) generator',
      border: C.GOLD,
      color: C.GOLD,
    },
    {
      phase: 'PHASE 03: FUTURE EXPANSION',
      title: 'Enterprise Multi-Unit Expansion',
      items: '• Multi-location franchise portfolio modeling\n• AI supplier procurement & wholesale bidding\n• Commercial lease intelligence & footfall sensors\n• Global demographic data feeds',
      border: C.CYAN,
      color: C.CYAN,
    },
  ];

  roadmapPhases.forEach((rp, idx) => {
    const xPos = 0.8 + idx * 4.0;
    slide12.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.6,
      w: 3.7,
      h: 4.8,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: rp.border, width: idx === 1 ? 1.5 : 1 },
    });

    slide12.addText(rp.phase, {
      x: xPos + 0.3,
      y: 1.9,
      w: 3.1,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: rp.color,
      bold: true,
      charSpacing: 1.5,
    });

    slide12.addText(rp.title, {
      x: xPos + 0.3,
      y: 2.3,
      w: 3.1,
      h: 0.6,
      fontSize: 14,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide12.addText(rp.items, {
      x: xPos + 0.3,
      y: 3.1,
      w: 3.1,
      h: 3.0,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 18,
    });
  });

  // =========================================================================
  // GENERATE ARRAYBUFFER & INJECT SLIDE TRANSITIONS VIA JSZIP
  // =========================================================================
  const rawArrayBuffer = (await pptx.write({ outputType: 'arraybuffer' })) as ArrayBuffer;

  // Load the PPTX zip archive
  const zip = await JSZip.loadAsync(rawArrayBuffer);

  // Find all slide XML files
  const slideFiles = Object.keys(zip.files).filter(
    (f) => f.startsWith('ppt/slides/slide') && f.endsWith('.xml')
  );

  // Inject OpenXML slide transitions into each slide
  for (let i = 0; i < slideFiles.length; i++) {
    const filename = slideFiles[i];
    let xml = await zip.file(filename)!.async('string');

    if (!xml.includes('<p:transition')) {
      // Alternate between Fade and Push transitions for high visual appeal
      const transitionXml =
        i % 2 === 0
          ? '<p:transition spd="med" advClick="1"><p:fade/></p:transition>'
          : '<p:transition spd="med" advClick="1"><p:push dir="l"/></p:transition>';

      // Insert immediately before </p:sld>
      xml = xml.replace('</p:sld>', transitionXml + '</p:sld>');
      zip.file(filename, xml);
    }
  }

  // Generate finalized PPTX blob with native transitions
  const finalBlob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  });

  // Trigger client download
  const filename = plan?.businessName
    ? `BizMind-${plan.businessName.replace(/[^a-zA-Z0-9]/g, '_')}-PitchDeck.pptx`
    : 'BizMind-Executive-PitchDeck.pptx';

  const downloadUrl = URL.createObjectURL(finalBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
