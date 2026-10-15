/**
 * BizMind – Elite Advanced PowerPoint (.pptx) Generator (8 Core Slides)
 * Features:
 * - Standard Office 16:9 Widescreen Layout (13.333" x 7.5") with perfect margins (no clipping)
 * - Native PowerPoint Vector Charts (Doughnut, Clustered Bar, Line, Horizontal Bar)
 * - Real PowerPoint Slide Transitions (<p:transition>) injected via JSZip
 * - Full executive styling, formatted financial numbers, and speaker notes
 * - Exactly 8 comprehensive slides matching the web presentation deck
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
    totalSlides = 8
  ) => {
    const slide = pptx.addSlide();
    slide.background = { color: C.BG_DARK };

    // Header Category Pill
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 0.35,
      w: 3.2,
      h: 0.32,
      rectRadius: 0.16,
      fill: { color: C.BG_CARD_LIGHT },
      line: { color: C.GOLD, width: 1 },
    });

    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.36,
      w: 3.2,
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
      fontSize: 21,
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
    slide.addText('BIZMIND  •  AI-Powered Business Planning & Location Intelligence Platform', {
      x: 0.8,
      y: 7.05,
      w: 9.0,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
    });

    // Slide Number Badge
    slide.addText(`PAGE ${slideNumber} / ${totalSlides}`, {
      x: 10.3,
      y: 7.05,
      w: 2.2,
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
  // SLIDE 1: Title & Hero Cover (Page 1 of 8)
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

  slide1.addText('NEXT-GENERATION DECISION INTELLIGENCE • 8-PAGE EXECUTIVE DOSSIER', {
    x: 1.6,
    y: 1.0,
    w: 9.5,
    h: 0.3,
    fontSize: 10,
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

  // 4 Core Metrics Pill Bar on Cover
  const coverStats = [
    { label: 'INDUSTRY SECTOR', val: plan?.category || 'Retail & Hospitality' },
    { label: 'STARTUP CAPEX', val: plan ? formatCurrency(plan.totalInitialInvestment || 0) : '$875,000' },
    { label: 'NET MARGIN', val: plan ? `${formatPercentage(plan.profitMargin || 0)} Net` : '22.9% Target' },
    { label: 'CAPITAL PAYBACK', val: plan ? `${plan.paybackPeriodMonths || 12.1} Months` : '12.1 Months' },
  ];

  coverStats.forEach((st, idx) => {
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
  // SLIDE 2: The Problem (4 Structural Failure Vectors) (Page 2 of 8)
  // =========================================================================
  const slide2 = addMasterSlide(
    'The $1.3 Trillion Failure Epidemic: Why 90% of Startups Collapse',
    'Market Friction & Need',
    2,
    'Explain how small businesses fail from lack of integrated spatial analysis, inadequate cash runway, and spreadsheet errors. BizMind solves all 4.'
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

    slide2.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 5.7,
      h: 2.3,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.ROSE, width: 1 },
    });

    slide2.addText(pc.num, {
      x: xPos + 0.3,
      y: yPos + 0.25,
      w: 1.5,
      h: 0.6,
      fontSize: 26,
      fontFace: 'Arial',
      color: C.ROSE,
      bold: true,
    });

    slide2.addText(pc.tag, {
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

    slide2.addText(pc.title, {
      x: xPos + 0.3,
      y: yPos + 0.9,
      w: 5.1,
      h: 0.35,
      fontSize: 13,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide2.addText(pc.desc, {
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
  // SLIDE 3: Startup Capital Allocation (Native Doughnut Chart) (Page 3 of 8)
  // =========================================================================
  const slide3 = addMasterSlide(
    'Startup Capital Allocation & Working Capital Reserves',
    'CapEx Breakdown',
    3,
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

  slide3.addChart(pptx.ChartType.doughnut, capexData, {
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
    slide3.addShape(pptx.ShapeType.roundRect, {
      x: 7.0,
      y: yPos,
      w: 5.5,
      h: 1.45,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide3.addText(ci.title, {
      x: 7.3,
      y: yPos + 0.2,
      w: 4.9,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      bold: true,
    });

    slide3.addText(ci.val, {
      x: 7.3,
      y: yPos + 0.55,
      w: 4.9,
      h: 0.45,
      fontSize: 18,
      fontFace: 'Arial',
      color: ci.color,
      bold: true,
    });

    slide3.addText(ci.sub, {
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
  // SLIDE 4: 12-Month Cash Flow & Break-Even (Native Line Chart) (Page 4 of 8)
  // =========================================================================
  const slide4 = addMasterSlide(
    '12-Month Financial Trajectory: Compounding Revenue vs. Expense Baseline',
    'Financial Modeling',
    4,
    'Point out month-by-month compounding growth. The break-even intersection occurs in month 3, providing positive cash flow thereafter.'
  );

  const baseRev = plan?.monthlyRevenue || 316800;
  const baseExp = plan?.totalMonthlyExpenses || 244200;

  const lineChartData = [
    {
      name: 'Gross Revenue',
      labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
      values: [
        Math.round(baseRev * 0.75),
        Math.round(baseRev * 0.82),
        Math.round(baseRev * 0.92),
        Math.round(baseRev * 0.98),
        Math.round(baseRev * 1.04),
        Math.round(baseRev * 1.10),
        Math.round(baseRev * 1.15),
        Math.round(baseRev * 1.20),
        Math.round(baseRev * 1.25),
        Math.round(baseRev * 1.29),
        Math.round(baseRev * 1.33),
        Math.round(baseRev * 1.38),
      ],
    },
    {
      name: 'Total Monthly Expenses',
      labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
      values: [
        Math.round(baseExp * 0.95),
        Math.round(baseExp * 0.97),
        Math.round(baseExp * 0.98),
        Math.round(baseExp * 1.0),
        Math.round(baseExp * 1.01),
        Math.round(baseExp * 1.02),
        Math.round(baseExp * 1.03),
        Math.round(baseExp * 1.04),
        Math.round(baseExp * 1.05),
        Math.round(baseExp * 1.06),
        Math.round(baseExp * 1.07),
        Math.round(baseExp * 1.08),
      ],
    },
  ];

  slide4.addChart(pptx.ChartType.line, lineChartData, {
    x: 0.8,
    y: 1.6,
    w: 7.2,
    h: 5.0,
    showLegend: true,
    legendPos: 'b',
    legendColor: C.TEXT_WHITE,
    legendFontSize: 9,
    showValue: false,
    lineDataSymbol: 'circle',
    lineDataSymbolSize: 5,
    chartColors: [C.EMERALD, C.ROSE],
  });

  const kpis = [
    { title: 'Break-Even Volume', val: `${plan?.breakEvenUnits || 1000} Units`, sub: 'Monthly units to achieve neutrality', color: C.GOLD },
    { title: 'Break-Even Revenue', val: formatCurrency(plan?.breakEvenRevenue || 220000), sub: 'Monthly revenue cash-neutral floor', color: C.CYAN },
    { title: 'Capacity Safety Buffer', val: `${(100 - (plan?.breakEvenCapacityPercentage || 69.4)).toFixed(1)}%`, sub: 'Demand cushion before operational loss', color: C.EMERALD },
  ];

  kpis.forEach((kp, idx) => {
    const yPos = 1.6 + idx * 1.65;
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 8.3,
      y: yPos,
      w: 4.2,
      h: 1.45,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide4.addText(kp.title, {
      x: 8.5,
      y: yPos + 0.2,
      w: 3.8,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      bold: true,
    });

    slide4.addText(kp.val, {
      x: 8.5,
      y: yPos + 0.55,
      w: 3.8,
      h: 0.45,
      fontSize: 18,
      fontFace: 'Arial',
      color: kp.color,
      bold: true,
    });

    slide4.addText(kp.sub, {
      x: 8.5,
      y: yPos + 1.05,
      w: 3.8,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
    });
  });

  // =========================================================================
  // SLIDE 5: Scenario Stress-Testing (Native Clustered Bar Chart) (Page 5 of 8)
  // =========================================================================
  const slide5 = addMasterSlide(
    'Solvency Stress-Testing: Multi-Scenario Sensitivity Analysis',
    'Risk & Sensitivity',
    5,
    'Review the 3 stress cases. Even in the Conservative case with 20% lower footfall and 5% cost inflation, the business maintains a safe runway.'
  );

  const scenarioData = [
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
      values: [
        Math.round(baseRev * 0.8 - baseExp * 1.05),
        Math.round(baseRev - baseExp),
        Math.round(baseRev * 1.2 - baseExp * 1.1),
      ],
    },
  ];

  slide5.addChart(pptx.ChartType.bar, scenarioData, {
    x: 0.8,
    y: 1.6,
    w: 7.2,
    h: 5.0,
    showLegend: true,
    legendPos: 'b',
    legendColor: C.TEXT_WHITE,
    legendFontSize: 9,
    showValue: false,
    chartColors: [C.CYAN, C.ROSE, C.EMERALD],
  });

  const scenarioSummaries = [
    { title: 'Conservative Case (-20% Demand)', desc: 'Footfall drops 20% while costs rise 5%. Working capital absorbs the slow period with zero insolvency.', color: C.ROSE },
    { title: 'Base Target Case', desc: 'Expected steady-state generating healthy 22.9% net margin and full capital payback in 12.1 months.', color: C.GOLD },
    { title: 'Optimistic Case (+20% Expansion)', desc: 'High repeat customer volume yields 29.3% net margin, accelerating payback to 8.5 months.', color: C.EMERALD },
  ];

  scenarioSummaries.forEach((ss, idx) => {
    const yPos = 1.6 + idx * 1.65;
    slide5.addShape(pptx.ShapeType.roundRect, {
      x: 8.3,
      y: yPos,
      w: 4.2,
      h: 1.45,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: ss.color, width: 1.2 },
    });

    slide5.addText(ss.title, {
      x: 8.5,
      y: yPos + 0.2,
      w: 3.8,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide5.addText(ss.desc, {
      x: 8.5,
      y: yPos + 0.6,
      w: 3.8,
      h: 0.75,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 13,
    });
  });

  // =========================================================================
  // SLIDE 6: Geospatial Location Intelligence (Page 6 of 8)
  // =========================================================================
  const slide6 = addMasterSlide(
    'Geospatial Intelligence: Micro-Radius Competitor Indexing',
    'Spatial Intelligence',
    6,
    'Discuss spatial intelligence: Isochrone radius bands, differentiation between direct competitors and traffic-driving complementary businesses.'
  );

  const geoCards = [
    { num: '01', title: 'Isochrone Radius Banding', body: 'Calculates competitor density across 500m, 1km, 2km, and 5km bands to evaluate pedestrian accessibility and vehicular retail draw.', stat: '500m - 5km Dynamic Radii', color: C.CYAN },
    { num: '02', title: 'Footfall Synergy vs Rivalry', body: 'Differentiates zero-sum direct competitors from complementary hubs (transit, offices, retail anchors) that drive footfall.', stat: 'Synergy Score Algorithm', color: C.GOLD },
    { num: '03', title: 'White-Space Gap Discovery', body: 'Highlights high-density residential and commercial pockets where specific consumer offerings are completely unserved.', stat: 'Opportunity Score Index', color: C.EMERALD },
  ];

  geoCards.forEach((gc, idx) => {
    const xPos = 0.8 + idx * 4.0;
    slide6.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.6,
      w: 3.7,
      h: 5.0,
      rectRadius: 0.12,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1.2 },
    });

    slide6.addText(gc.num, {
      x: xPos + 0.3,
      y: 2.0,
      w: 3.1,
      h: 0.6,
      fontSize: 32,
      fontFace: 'Arial',
      color: gc.color,
      bold: true,
    });

    slide6.addText(gc.title, {
      x: xPos + 0.3,
      y: 2.7,
      w: 3.1,
      h: 0.5,
      fontSize: 14,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide6.addText(gc.body, {
      x: xPos + 0.3,
      y: 3.4,
      w: 3.1,
      h: 2.0,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 16,
    });

    slide6.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.3,
      y: 5.7,
      w: 3.1,
      h: 0.45,
      rectRadius: 0.08,
      fill: { color: C.BG_CARD_LIGHT },
    });

    slide6.addText(gc.stat, {
      x: xPos + 0.3,
      y: 5.78,
      w: 3.1,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      align: 'center',
      bold: true,
    });
  });

  // =========================================================================
  // SLIDE 7: LIVE DEMO: Real-Time Location Intelligence Engine (Page 7 of 8)
  // =========================================================================
  const slide7 = addMasterSlide(
    'LIVE DEMO: Real-Time Location Intelligence & Spatial Radar',
    'Live Spatial Demo',
    7,
    'Explain how the presenter uses the live interactive spatial simulator to toggle corridor presets (Indiranagar, Connaught Place, Bandra), radius rings, and inspect rivals live.'
  );

  // Left card: Map Simulator Visual Representation
  slide7.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.6,
    w: 7.2,
    h: 5.0,
    rectRadius: 0.12,
    fill: { color: C.BG_CARD },
    line: { color: C.GOLD, width: 1.5 },
  });

  slide7.addText('INTERACTIVE SPATIAL RADAR & LEAFLET GIS ENGINE', {
    x: 1.1,
    y: 1.9,
    w: 6.6,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: C.GOLD,
    bold: true,
  });

  slide7.addText('Live Demo Active in Web Console & Offline HTML Player', {
    x: 1.1,
    y: 2.3,
    w: 6.6,
    h: 0.3,
    fontSize: 13,
    fontFace: 'Arial',
    color: C.TEXT_WHITE,
    bold: true,
  });

  const demoFeatures = [
    '• Preset Hotspots: Indiranagar (Bengaluru), Connaught Place (New Delhi), Bandra West (Mumbai), Koramangala, Rajaramnagar',
    '• Dynamic Radius Ring: Instant toggle between 500m, 1km, 2km, and 3km catchment areas',
    '• Real-Time Threat Classification: Categorizes competitors into High, Medium, and Low threat tiers',
    '• Opportunity Index Gauge: Algorithmic calculation evaluating cluster density and unserved white space',
    '• Single-Click Custom Coordinate Pinning: Click anywhere on the map to evaluate custom sites live',
  ];

  slide7.addText(demoFeatures.join('\n\n'), {
    x: 1.1,
    y: 2.8,
    w: 6.6,
    h: 3.4,
    fontSize: 10,
    fontFace: 'Arial',
    color: C.TEXT_MUTED,
    lineSpacing: 16,
  });

  // Right card: Real-time Metric KPIs
  const demoKpis = [
    { title: 'Live Opportunity Score', val: '78 / 100', sub: 'High commercial feasibility rating', color: C.EMERALD },
    { title: 'Competitor Density', val: '4.8 / km²', sub: 'Micro-radius cluster concentration', color: C.CYAN },
    { title: 'Nearest Rival Distance', val: '140 Meters', sub: 'Walking accessibility threshold', color: C.GOLD },
  ];

  demoKpis.forEach((dk, idx) => {
    const yPos = 1.6 + idx * 1.65;
    slide7.addShape(pptx.ShapeType.roundRect, {
      x: 8.3,
      y: yPos,
      w: 4.2,
      h: 1.45,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide7.addText(dk.title, {
      x: 8.5,
      y: yPos + 0.2,
      w: 3.8,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      bold: true,
    });

    slide7.addText(dk.val, {
      x: 8.5,
      y: yPos + 0.55,
      w: 3.8,
      h: 0.45,
      fontSize: 18,
      fontFace: 'Arial',
      color: dk.color,
      bold: true,
    });

    slide7.addText(dk.sub, {
      x: 8.5,
      y: yPos + 1.05,
      w: 3.8,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
    });
  });

  // =========================================================================
  // SLIDE 8: ML Feature Weights & Transformation Scorecard (Page 8 of 8)
  // =========================================================================
  const slide8 = addMasterSlide(
    'Machine Learning Success Regressor & Transformation Scorecard',
    'Predictive AI & Outcomes',
    8,
    'Conclude the pitch deck. Review the empirical feature attribution, the Responsible AI safety guardrail, and the proven business transformation outcomes.'
  );

  const featureChartData = [
    {
      name: 'Importance Weight (%)',
      labels: ['Footfall Density', 'Capital Adequacy', 'Competitor Proximity', 'Target Income', 'Seasonality Index'],
      values: [32, 26, 21, 14, 7],
    },
  ];

  slide8.addChart(pptx.ChartType.bar, featureChartData, {
    x: 0.8,
    y: 1.6,
    w: 5.8,
    h: 5.0,
    showLegend: false,
    barDir: 'bar',
    showValue: true,
    dataLabelColor: C.TEXT_WHITE,
    chartColors: [C.GOLD],
  });

  const outcomes = [
    { stat: '85%', label: 'Planning Time Saved', detail: 'Accelerates business plan formulation from 4 weeks to under an hour of modeling.', color: C.GOLD },
    { stat: '3.4x', label: 'Higher Capital Efficiency', detail: 'Prevents premature burnout by accurately sizing fixed reserves before leasing.', color: C.CYAN },
    { stat: '94%', label: 'Loan Approval Readiness', detail: 'Produces institutional financial projections accepted by commercial lenders.', color: C.EMERALD },
    { stat: '< 20ms', label: 'Real-Time Spatial Queries', detail: 'Instantaneous competitor mapping and radius density retrieval via optimized APIs.', color: C.PURPLE },
  ];

  outcomes.forEach((oc, idx) => {
    const xPos = idx % 2 === 0 ? 7.0 : 9.8;
    const yPos = idx < 2 ? 1.6 : 4.1;

    slide8.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 2.6,
      h: 2.3,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide8.addText(oc.stat, {
      x: xPos + 0.2,
      y: yPos + 0.2,
      w: 2.2,
      h: 0.55,
      fontSize: 24,
      fontFace: 'Arial',
      color: oc.color,
      bold: true,
    });

    slide8.addText(oc.label, {
      x: xPos + 0.2,
      y: yPos + 0.8,
      w: 2.2,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide8.addText(oc.detail, {
      x: xPos + 0.2,
      y: yPos + 1.2,
      w: 2.2,
      h: 0.95,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 13,
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
    ? `BizMind-${plan.businessName.replace(/[^a-zA-Z0-9]/g, '_')}-8Page-PitchDeck.pptx`
    : 'BizMind-Executive-8Page-PitchDeck.pptx';

  const downloadUrl = URL.createObjectURL(finalBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
