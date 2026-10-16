/**
 * BizMind – Elite Advanced PowerPoint (.pptx) Generator (9 Academic & Project Slides)
 * Fully aligned with Rajarambapu Institute of Technology (RIT) MCA Capstone Defense:
 * - Slide 1: Official RIT Capstone Technical Report Title Cover with Team & Guide Details
 * - Slide 2: Project Overview & Core Mission
 * - Slide 3: 3-Tier Monorepo Technical Architecture
 * - Slide 4: Deterministic Financial Feasibility Engine & Unit Economics (Native Vector Donut Chart)
 * - Slide 5: 12-Month Compounding Cash Flow & Break-Even Curve (Native Vector Line Chart)
 * - Slide 6: Multi-Scenario Sensitivity Stress-Testing (Native Vector Bar Chart)
 * - Slide 7: Geospatial GIS Engine & Micro-Radius Calculus
 * - Slide 8: LIVE DEMO: Real-Time Spatial Radar (Uran Islampur Narshhpur Road & Live API)
 * - Slide 9: Project Conclusion & Final Takeaways in Simple Language
 * - RIT Logo & Institutional Badge embedded across ALL slides
 * - PowerPoint Slide Transitions (<p:transition>) injected via JSZip
 */
import pptxgen from 'pptxgenjs';
import JSZip from 'jszip';
import { BusinessPlan } from '../types';
import { formatCurrency } from '../utils/formatters';

export async function generateBizMindPptx(plan?: BusinessPlan | null): Promise<void> {
  const pptx = new pptxgen();

  // Define true Office 365 16:9 widescreen layout (13.333 inches x 7.5 inches)
  pptx.defineLayout({ name: 'WIDE_16_9', width: 13.333, height: 7.5 });
  pptx.layout = 'WIDE_16_9';

  pptx.author = 'Pramod Mahajan, Harshad Patil, Sakshi Randive, Rutika Deshmukh';
  pptx.company = 'Rajarambapu Institute of Technology (RIT), Rajaramnagar';
  pptx.title = 'BizMind - AI Business Planner & Success Prediction Platform (MCA Capstone Report)';

  // Master Color Palette
  const C = {
    BG_DARK: '0A0D14',       // Deep rich midnight obsidian
    BG_CARD: '121722',       // Elevated glass slate
    BG_CARD_LIGHT: '1E2433', // Border / separator line
    BG_CARD_HOVER: '252D3F', // Lighter container
    GOLD: 'FFC72C',          // Official RIT Gold / Amber brand
    GOLD_DARK: 'D97706',     // Deep amber
    RED_ACCENT: 'D8232A',    // RIT Dot Red
    CYAN: '0EA5E9',          // Modern tech cyan
    EMERALD: '10B981',       // Success / profit green
    ROSE: 'F43F5E',          // Alert / risk rose
    PURPLE: '8B5CF6',        // ML intelligence violet
    TEXT_WHITE: 'FFFFFF',    // Primary typography
    TEXT_MUTED: '94A3B8',    // Secondary captions
    TEXT_DIM: '64748B',      // Footnotes
  };

  const TOTAL_SLIDES = 10;

  // Helper: Adds consistent RIT logo badge on slide header
  const addRitLogoBadge = (slide: any, x = 11.2, y = 0.45, w = 1.35, h = 0.42) => {
    // Yellow card background
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      rectRadius: 0.05,
      fill: { color: C.GOLD },
      line: { color: 'B4840A', width: 1 },
    });

    // Bold 'rit' text with red accent dot
    slide.addText('r', {
      x: x + 0.1,
      y: y + 0.03,
      w: 0.25,
      h: 0.24,
      fontSize: 16,
      fontFace: 'Arial Black',
      color: '1C1B1F',
      bold: true,
    });

    // Red square dot for 'i'
    slide.addShape(pptx.ShapeType.rect, {
      x: x + 0.44,
      y: y + 0.07,
      w: 0.07,
      h: 0.07,
      fill: { color: C.RED_ACCENT },
    });

    slide.addText('i', {
      x: x + 0.38,
      y: y + 0.07,
      w: 0.2,
      h: 0.22,
      fontSize: 15,
      fontFace: 'Arial Black',
      color: '1C1B1F',
      bold: true,
    });

    slide.addText('t', {
      x: x + 0.58,
      y: y + 0.03,
      w: 0.25,
      h: 0.24,
      fontSize: 16,
      fontFace: 'Arial Black',
      color: '1C1B1F',
      bold: true,
    });

    // Institutional subtext
    slide.addText('RAJARAMBAPU INST OF TECH', {
      x: x + 0.05,
      y: y + 0.26,
      w: w - 0.1,
      h: 0.13,
      fontSize: 5,
      fontFace: 'Arial',
      color: '2C2B2F',
      bold: true,
      align: 'center',
    });
  };

  // Helper: Adds master slide background, RIT logo, header, and footer
  const addMasterSlide = (
    title: string,
    slideNumber: number,
    speakerNotes: string,
    category = 'RIT MCA CAPSTONE DEFENSE'
  ) => {
    const slide = pptx.addSlide();
    slide.background = { color: C.BG_DARK };

    // Slide Category Tag
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.4,
      w: 8.0,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.GOLD,
      bold: true,
    });

    // Slide Main Title
    slide.addText(title, {
      x: 0.8,
      y: 0.65,
      w: 10.0,
      h: 0.6,
      fontSize: 20,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    // Add RIT Logo Badge in top right corner
    addRitLogoBadge(slide, 11.15, 0.4, 1.4, 0.45);

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
    slide.addText('Rajarambapu Institute of Technology (RIT)  •  Department of Computer Applications (MCA)  •  BizMind Platform', {
      x: 0.8,
      y: 7.05,
      w: 9.5,
      h: 0.3,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
    });

    // Slide Number Badge
    slide.addText(`${slideNumber} / ${TOTAL_SLIDES}`, {
      x: 10.5,
      y: 7.05,
      w: 2.0,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      align: 'right',
    });

    if (speakerNotes) {
      slide.addNotes(speakerNotes);
    }

    return slide;
  };

  // =========================================================================
  // SLIDE 1: Official RIT Capstone Project Technical Report Cover (Page 1 of 9)
  // =========================================================================
  const slide1 = pptx.addSlide();
  slide1.background = { color: C.BG_DARK };

  // Main backdrop card
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 6.5,
    rectRadius: 0.15,
    fill: { color: C.BG_CARD },
    line: { color: C.BG_CARD_LIGHT, width: 1.5 },
  });

  // Top Institutional Metadata
  slide1.addText('Academic Year: 2026 – 27', {
    x: 1.2,
    y: 0.65,
    w: 10.9,
    h: 0.25,
    fontSize: 10,
    fontFace: 'Arial',
    color: C.TEXT_MUTED,
    align: 'center',
    bold: true,
  });

  slide1.addText('(An Empowered Autonomous Institute, Affiliated to Shivaji University, Kolhapur)', {
    x: 1.2,
    y: 0.9,
    w: 10.9,
    h: 0.25,
    fontSize: 9,
    fontFace: 'Arial',
    color: C.TEXT_DIM,
    align: 'center',
    italic: true,
  });

  slide1.addText('RAJARAMBAPU INSTITUTE OF TECHNOLOGY, RAJARAMNAGAR', {
    x: 1.2,
    y: 1.15,
    w: 10.9,
    h: 0.35,
    fontSize: 14,
    fontFace: 'Arial',
    color: C.TEXT_WHITE,
    align: 'center',
    bold: true,
  });

  slide1.addText('DEPARTMENT OF COMPUTER APPLICATIONS', {
    x: 1.2,
    y: 1.48,
    w: 10.9,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: C.GOLD,
    align: 'center',
    bold: true,
  });

  // Centered Official RIT Logo
  addRitLogoBadge(slide1, 5.2, 1.85, 2.9, 0.9);

  // Project Title Highlight
  slide1.addText('“BizMind – AI Business Planner & Success Prediction Platform”', {
    x: 1.2,
    y: 3.15,
    w: 10.9,
    h: 0.8,
    fontSize: 26,
    fontFace: 'Arial',
    color: C.GOLD,
    align: 'center',
    bold: true,
  });

  // Left Card: Guidance
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 1.2,
    y: 4.35,
    w: 4.2,
    h: 2.1,
    rectRadius: 0.1,
    fill: { color: C.BG_DARK },
    line: { color: C.GOLD, width: 1.2 },
  });

  slide1.addText('UNDER THE GUIDANCE OF', {
    x: 1.4,
    y: 4.55,
    w: 3.8,
    h: 0.25,
    fontSize: 9,
    fontFace: 'Arial',
    color: C.GOLD,
    bold: true,
  });

  slide1.addText('Ms. A. R. Patil', {
    x: 1.4,
    y: 4.9,
    w: 3.8,
    h: 0.45,
    fontSize: 16,
    fontFace: 'Arial',
    color: C.TEXT_WHITE,
    bold: true,
  });

  slide1.addText('Department of Computer Applications\nRajarambapu Institute of Technology, Rajaramnagar', {
    x: 1.4,
    y: 5.45,
    w: 3.8,
    h: 0.7,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: C.TEXT_MUTED,
    lineSpacing: 14,
  });

  // Right Card: Project Team (Presented By)
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 5.6,
    y: 4.35,
    w: 6.5,
    h: 2.1,
    rectRadius: 0.1,
    fill: { color: C.BG_DARK },
    line: { color: C.CYAN, width: 1.2 },
  });

  slide1.addText('PRESENTED BY (PROJECT TEAM)', {
    x: 5.8,
    y: 4.55,
    w: 6.1,
    h: 0.25,
    fontSize: 9,
    fontFace: 'Arial',
    color: C.CYAN,
    bold: true,
  });

  const studentTeam = [
    { name: 'Pramod Rajendra Mahajan', roll: 'Roll No: 2547047' },
    { name: 'Harshad Shahaji Patil', roll: 'Roll No: 2547062' },
    { name: 'Sakshi Dnyaneshwar Randive', roll: 'Roll No: 2547048' },
    { name: 'Rutika Rajesh Deshmukh', roll: 'Roll No: 2547025' },
  ];

  studentTeam.forEach((member, idx) => {
    const col = idx % 2 === 0 ? 5.8 : 8.9;
    const rowY = 4.95 + Math.floor(idx / 2) * 0.65;

    slide1.addText(member.name, {
      x: col,
      y: rowY,
      w: 3.0,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide1.addText(member.roll, {
      x: col,
      y: rowY + 0.26,
      w: 3.0,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.GOLD,
    });
  });

  slide1.addNotes('Welcome to the official Master of Computer Applications Capstone Technical Presentation for BizMind, completed at Rajarambapu Institute of Technology, Rajaramnagar.');

  // =========================================================================
  // SLIDE 2: Feature 1 – Business Plans Portfolio & Venture Tracking (Page 2 of 10)
  // =========================================================================
  const slide2 = addMasterSlide(
    'Business Plans Portfolio & Venture Tracking',
    2,
    'The Business Plans module serves as the command center for entrepreneurs. It allows managing multi-location ventures, reviewing feasibility ratings, tracking CapEx allocations, and cloning plans for rapid scenario testing.',
    '02 / FEATURE 1: BUSINESS PLANS'
  );

  slide2.addText(
    'Centralized repository for comprehensive business models, financial snapshots, feasibility ratings, and version management.',
    {
      x: 0.8,
      y: 1.45,
      w: 11.7,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
    }
  );

  // 4 Summary Metric Cards
  const planSummaryStats = [
    { label: 'ACTIVE PORTFOLIOS', val: '2+ Ventures', sub: 'Coffee & Fitness Tracked', color: C.TEXT_WHITE },
    { label: 'EVALUATED CAPEX', val: '$2.32M Total', sub: 'Across Active Concepts', color: C.GOLD },
    { label: 'AVG PAYBACK TIME', val: '11.9 Months', sub: '~1.0 Year Capital Return', color: C.CYAN },
    { label: 'AVG FEASIBILITY', val: '83.0 / 100', sub: 'High Feasibility Tier', color: C.EMERALD },
  ];

  planSummaryStats.forEach((st, idx) => {
    const xPos = 0.8 + idx * 2.95;
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.95,
      w: 2.8,
      h: 1.25,
      rectRadius: 0.08,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide2.addText(st.label, {
      x: xPos + 0.15,
      y: 2.05,
      w: 2.5,
      h: 0.22,
      fontSize: 8,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      bold: true,
    });

    slide2.addText(st.val, {
      x: xPos + 0.15,
      y: 2.3,
      w: 2.5,
      h: 0.45,
      fontSize: 16,
      fontFace: 'Arial',
      color: st.color,
      bold: true,
    });

    slide2.addText(st.sub, {
      x: xPos + 0.15,
      y: 2.8,
      w: 2.5,
      h: 0.25,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
    });
  });

  // Showcase Plan Card 1: Artisanal Cafe
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 3.4,
    w: 5.7,
    h: 2.7,
    rectRadius: 0.1,
    fill: { color: C.BG_CARD },
    line: { color: C.GOLD, width: 1.2 },
  });

  slide2.addText('FOOD & BEVERAGE • B2C', {
    x: 1.05,
    y: 3.55,
    w: 3.5,
    h: 0.25,
    fontSize: 8,
    fontFace: 'Arial',
    color: C.GOLD,
    bold: true,
  });

  slide2.addText('The Roasted Bean Artisanal Café', {
    x: 1.05,
    y: 3.8,
    w: 3.8,
    h: 0.35,
    fontSize: 13,
    fontFace: 'Arial',
    color: C.TEXT_WHITE,
    bold: true,
  });

  slide2.addText('Indiranagar / Islampur Corridor • Feasibility: 84 / 100', {
    x: 1.05,
    y: 4.15,
    w: 4.0,
    h: 0.25,
    fontSize: 8.5,
    fontFace: 'Arial',
    color: C.TEXT_MUTED,
  });

  const cafeMetrics = [
    { l: 'Initial CapEx', v: '$875,000' },
    { l: 'Net Profit/mo', v: '$72,600' },
    { l: 'Payback', v: '12.1 Mos' },
    { l: 'Break-Even', v: '1,000 units/mo' },
  ];
  cafeMetrics.forEach((m, i) => {
    const mx = 1.05 + (i % 2) * 2.65;
    const my = 4.5 + Math.floor(i / 2) * 0.65;
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: mx,
      y: my,
      w: 2.5,
      h: 0.55,
      rectRadius: 0.05,
      fill: { color: '0E121B' },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });
    slide2.addText(m.l.toUpperCase(), {
      x: mx + 0.1,
      y: my + 0.06,
      w: 2.3,
      h: 0.18,
      fontSize: 7.5,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
    });
    slide2.addText(m.v, {
      x: mx + 0.1,
      y: my + 0.25,
      w: 2.3,
      h: 0.25,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });
  });

  // Showcase Plan Card 2: Fitness Studio
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 3.4,
    w: 5.7,
    h: 2.7,
    rectRadius: 0.1,
    fill: { color: C.BG_CARD },
    line: { color: C.CYAN, width: 1.2 },
  });

  slide2.addText('FITNESS & WELLNESS • SUBSCRIPTION', {
    x: 7.05,
    y: 3.55,
    w: 3.5,
    h: 0.25,
    fontSize: 8,
    fontFace: 'Arial',
    color: C.CYAN,
    bold: true,
  });

  slide2.addText('Aura High-Intensity & Yoga Studio', {
    x: 7.05,
    y: 3.8,
    w: 3.8,
    h: 0.35,
    fontSize: 13,
    fontFace: 'Arial',
    color: C.TEXT_WHITE,
    bold: true,
  });

  slide2.addText('Bandra West / Sangli Hub • Feasibility: 82 / 100', {
    x: 7.05,
    y: 4.15,
    w: 4.0,
    h: 0.25,
    fontSize: 8.5,
    fontFace: 'Arial',
    color: C.TEXT_MUTED,
  });

  const gymMetrics = [
    { l: 'Initial CapEx', v: '$1,450,000' },
    { l: 'Net Profit/mo', v: '$124,000' },
    { l: 'Payback', v: '11.7 Mos' },
    { l: 'Break-Even', v: '80 members/mo' },
  ];
  gymMetrics.forEach((m, i) => {
    const mx = 7.05 + (i % 2) * 2.65;
    const my = 4.5 + Math.floor(i / 2) * 0.65;
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: mx,
      y: my,
      w: 2.5,
      h: 0.55,
      rectRadius: 0.05,
      fill: { color: '0E121B' },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });
    slide2.addText(m.l.toUpperCase(), {
      x: mx + 0.1,
      y: my + 0.06,
      w: 2.3,
      h: 0.18,
      fontSize: 7.5,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
    });
    slide2.addText(m.v, {
      x: mx + 0.1,
      y: my + 0.25,
      w: 2.3,
      h: 0.25,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });
  });

  // Bottom Lifecycle Strip
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 6.25,
    w: 11.7,
    h: 0.55,
    rectRadius: 0.06,
    fill: { color: '0E121B' },
    line: { color: C.BG_CARD_LIGHT, width: 1 },
  });

  slide2.addText('FULL LIFECYCLE SUPPORT: Create, Clone, Edit, Financial Deep-Dive, Compare & Native PPTX Export | 1-Click Duplication', {
    x: 1.0,
    y: 6.38,
    w: 11.3,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    color: C.GOLD,
    bold: true,
  });

  // =========================================================================
  // SLIDE 3: Feature 2 – Planner Wizard: 6-Step Dynamic Financial Modeling (Page 3 of 10)
  // =========================================================================
  const slide3 = addMasterSlide(
    'Planner Wizard: 6-Step Dynamic Financial Modeling',
    3,
    'The 6-Step Planner Wizard guides founders through Business Info, Initial Investment (CapEx), Monthly Expenses (OpEx), Revenue & Unit Economics, Assumptions Review, and Feasibility Dashboard with zero manual spreadsheet errors.',
    '03 / FEATURE 2: PLANNER WIZARD'
  );

  slide3.addText(
    'Step-by-step guided business model architect transforming commercial concepts into mathematically sound ventures.',
    {
      x: 0.8,
      y: 1.45,
      w: 11.7,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
    }
  );

  // 6 Steps Cards
  const wizardSteps = [
    { num: '01', title: 'Business Profile', desc: 'Category, target demographic, and revenue model selection (B2C, B2B, Sub)', color: C.CYAN },
    { num: '02', title: 'Initial CapEx', desc: 'Lease deposit, interior fit-out, machinery, licensing, and IT hardware', color: C.GOLD },
    { num: '03', title: 'Monthly OpEx', desc: 'Base rent, staffing payroll, utilities, marketing budget, and insurance', color: C.PURPLE },
    { num: '04', title: 'Unit Economics', desc: 'Average ticket price, variable cost per unit, and projected daily customer count', color: C.EMERALD },
    { num: '05', title: 'Review & Audit', desc: 'Deterministic formulas cross-audit assumptions before dashboard generation', color: C.GOLD_DARK },
    { num: '06', title: 'Feasibility Matrix', desc: 'Automated break-even volume, payback horizon, and viability scoring', color: C.ROSE },
  ];

  wizardSteps.forEach((st, idx) => {
    const xPos = 0.8 + idx * 1.95;
    slide3.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 2.05,
      w: 1.85,
      h: 2.7,
      rectRadius: 0.08,
      fill: { color: C.BG_CARD },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide3.addText(st.num, {
      x: xPos + 0.15,
      y: 2.2,
      w: 1.55,
      h: 0.35,
      fontSize: 16,
      fontFace: 'Arial',
      color: st.color,
      bold: true,
    });

    slide3.addText(st.title, {
      x: xPos + 0.15,
      y: 2.65,
      w: 1.55,
      h: 0.5,
      fontSize: 10,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide3.addText(st.desc, {
      x: xPos + 0.15,
      y: 3.25,
      w: 1.55,
      h: 1.35,
      fontSize: 8,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 11,
    });
  });

  // 3 Advantage Pillars
  const wizardPillars = [
    { title: 'Zero Spreadsheet Dependency', desc: 'Replaces fragile Excel formulas with certified deterministic math equations executing real-time in milliseconds.', col: C.EMERALD },
    { title: 'Instant Dynamic Re-Calculation', desc: 'Tweak expected customer footfall or unit price; watch break-even volume and payback period recompute live.', col: C.GOLD },
    { title: 'Automated Feasibility Grade', desc: 'Synthesizes operating margin, break-even capacity %, and payback horizon into an empirical score out of 100.', col: C.CYAN },
  ];

  wizardPillars.forEach((p, idx) => {
    const px = 0.8 + idx * 3.95;
    slide3.addShape(pptx.ShapeType.roundRect, {
      x: px,
      y: 5.0,
      w: 3.8,
      h: 1.75,
      rectRadius: 0.08,
      fill: { color: '0E121B' },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide3.addText(p.title, {
      x: px + 0.2,
      y: 5.2,
      w: 3.4,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: p.col,
      bold: true,
    });

    slide3.addText(p.desc, {
      x: px + 0.2,
      y: 5.55,
      w: 3.4,
      h: 1.05,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 12,
    });
  });

  // =========================================================================
  // SLIDE 4: Feature 3 – Financial Feasibility Engine & Break-Even Trajectory (Page 4 of 10)
  // =========================================================================
  const slide4 = addMasterSlide(
    'Financial Feasibility Engine & Break-Even Trajectory',
    4,
    'This engine computes exact contribution margins, break-even unit volumes, and 12-month compounding cash curves. Evaluators can see how customer ramp-up crosses the operational cost floor.',
    '04 / FEATURE 3: FINANCIAL FEASIBILITY'
  );

  slide4.addText(
    'Deterministic unit economics, CapEx recovery timeline, and 12-month compounding cash flow.',
    {
      x: 0.8,
      y: 1.45,
      w: 11.7,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
    }
  );

  // Left: CapEx Sizing & Donut Chart
  slide4.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.95,
    w: 5.4,
    h: 4.8,
    rectRadius: 0.1,
    fill: { color: C.BG_CARD },
    line: { color: C.BG_CARD_LIGHT, width: 1.2 },
  });

  slide4.addText('CAPEX ALLOCATION BREAKDOWN ($875,000 TOTAL)', {
    x: 1.05,
    y: 2.15,
    w: 4.9,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    color: C.GOLD,
    bold: true,
  });

  const capexChartData = [
    {
      name: 'CapEx Allocation',
      labels: ['Fit-out', 'Deposit', 'Equipment', 'Licenses', 'Marketing', 'Inventory'],
      values: [280000, 250000, 180000, 45000, 60000, 60000],
    },
  ];

  slide4.addChart(pptx.ChartType.doughnut, capexChartData, {
    x: 1.0,
    y: 2.5,
    w: 5.0,
    h: 2.8,
    holeSize: 55,
    chartColors: [C.GOLD, C.CYAN, C.EMERALD, C.PURPLE, C.ROSE, C.GOLD_DARK],
    showLegend: true,
    legendPos: 'b',
    legendFontSize: 8,
    legendColor: C.TEXT_MUTED,
  });

  slide4.addText('100% Sized • Fully Capitalized with 2.5 Months Working Capital Reserve', {
    x: 1.05,
    y: 6.25,
    w: 4.9,
    h: 0.35,
    fontSize: 8,
    fontFace: 'Arial',
    color: C.EMERALD,
    align: 'center',
    bold: true,
  });

  // Right: 12-Month Compounding Curve
  slide4.addShape(pptx.ShapeType.roundRect, {
    x: 6.5,
    y: 1.95,
    w: 6.0,
    h: 4.8,
    rectRadius: 0.1,
    fill: { color: C.BG_CARD },
    line: { color: C.BG_CARD_LIGHT, width: 1.2 },
  });

  slide4.addText('12-MONTH CASH FLOW & BREAK-EVEN CROSSOVER', {
    x: 6.75,
    y: 2.15,
    w: 5.5,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    color: C.CYAN,
    bold: true,
  });

  const cashFlowChartData = [
    {
      name: 'Revenue',
      labels: ['M1', 'M2', 'M3', 'M4', 'M6', 'M9', 'M12'],
      values: [158400, 205920, 253440, 285120, 316800, 332640, 348480],
    },
    {
      name: 'OpEx Floor',
      labels: ['M1', 'M2', 'M3', 'M4', 'M6', 'M9', 'M12'],
      values: [204600, 216480, 228360, 236280, 244200, 248160, 252120],
    },
    {
      name: 'Net Profit',
      labels: ['M1', 'M2', 'M3', 'M4', 'M6', 'M9', 'M12'],
      values: [-46200, -10560, 25080, 48840, 72600, 84480, 96360],
    },
  ];

  slide4.addChart(pptx.ChartType.line, cashFlowChartData, {
    x: 6.7,
    y: 2.5,
    w: 5.6,
    h: 2.8,
    chartColors: [C.EMERALD, C.ROSE, C.CYAN],
    lineDataSymbol: 'circle',
    lineDataSymbolSize: 4,
    showLegend: true,
    legendPos: 'b',
    legendFontSize: 8,
    legendColor: C.TEXT_MUTED,
  });

  const kpis = [
    { l: 'Break-Even Vol', v: '1,000 units/mo' },
    { l: 'Contribution Margin', v: '$165 / unit' },
    { l: 'Operating Margin', v: '22.9% Net' },
  ];
  kpis.forEach((k, idx) => {
    const kx = 6.75 + idx * 1.85;
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: kx,
      y: 5.85,
      w: 1.75,
      h: 0.7,
      rectRadius: 0.05,
      fill: { color: '0E121B' },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });
    slide4.addText(k.l.toUpperCase(), {
      x: kx + 0.1,
      y: 5.92,
      w: 1.55,
      h: 0.2,
      fontSize: 7.5,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
    });
    slide4.addText(k.v, {
      x: kx + 0.1,
      y: 6.15,
      w: 1.55,
      h: 0.3,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });
  });

  // =========================================================================
  // SLIDE 5: Feature 4 – Market Analysis: Real-Time Spatial Radar (Page 5 of 10)
  // [Using existing Slide 8 Live Location Demo as requested by user]
  // =========================================================================
  const slide5 = addMasterSlide(
    'Market Analysis: Real-Time Spatial Radar & Saturation',
    5,
    'Live interactive spatial radar centered on Uran Islampur Narshhpur Road (Islampur, Maharashtra). Evaluates real-time business discovery, radius expansion from 500m to 5km, competitor threat scoring, and saturation index.',
    '05 / FEATURE 4: MARKET ANALYSIS'
  );

  slide5.addText(
    'Target Corridor: Uran Islampur Narshhpur Road — Live spatial query connecting Google Places & OpenStreetMap Overpass spatial engines.',
    {
      x: 0.8,
      y: 1.45,
      w: 11.7,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
    }
  );

  // Left: Radar Simulation Box with Concentric Rings
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.95,
    w: 6.2,
    h: 4.8,
    rectRadius: 0.1,
    fill: { color: C.BG_CARD },
    line: { color: C.GOLD, width: 1.5 },
  });

  slide5.addText('SPATIAL RADAR SWEEP • URAN ISLAMPUR NARSHHPUR ROAD (17.0500° N, 74.2600° E)', {
    x: 1.05,
    y: 2.15,
    w: 5.7,
    h: 0.25,
    fontSize: 8,
    fontFace: 'Arial',
    color: C.GOLD,
    bold: true,
  });

  // Concentric Radar Rings
  [
    { r: 3.4, col: C.BG_CARD_LIGHT },
    { r: 2.5, col: C.BG_CARD_LIGHT },
    { r: 1.6, col: C.BG_CARD_LIGHT },
  ].forEach((ring) => {
    slide5.addShape(pptx.ShapeType.ellipse, {
      x: 3.9 - ring.r / 2,
      y: 4.2 - ring.r / 2,
      w: ring.r,
      h: ring.r,
      fill: { color: '000000', transparency: 100 },
      line: { color: ring.col, width: 1, dashType: 'dash' },
    });
  });

  // Center Marker (Target Commercial Hotspot)
  slide5.addShape(pptx.ShapeType.ellipse, {
    x: 3.75,
    y: 4.05,
    w: 0.3,
    h: 0.3,
    fill: { color: C.EMERALD },
    line: { color: C.TEXT_WHITE, width: 1.5 },
  });

  slide5.addText('TARGET SITE\nUran Islampur Rd', {
    x: 3.2,
    y: 4.4,
    w: 1.4,
    h: 0.4,
    fontSize: 7.5,
    fontFace: 'Arial',
    color: C.EMERALD,
    align: 'center',
    bold: true,
  });

  // Competitor Marker Pins
  const competitorMarkers = [
    { x: 3.1, y: 3.4, name: 'Green Leaf Cafe (110m)' },
    { x: 4.6, y: 3.6, name: 'Krishna Restaurant (170m)' },
    { x: 2.8, y: 4.7, name: 'Sai Refreshments (230m)' },
    { x: 4.8, y: 4.8, name: 'Shivaji Bakery (240m)' },
  ];

  competitorMarkers.forEach((cm) => {
    slide5.addShape(pptx.ShapeType.ellipse, {
      x: cm.x,
      y: cm.y,
      w: 0.16,
      h: 0.16,
      fill: { color: C.ROSE },
    });
    slide5.addText(cm.name, {
      x: cm.x - 0.5,
      y: cm.y + 0.18,
      w: 1.6,
      h: 0.25,
      fontSize: 6.5,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
    });
  });

  slide5.addText('Micro-Radius Expansion: 500m to 5.0km • Zero API Rate Limiting • Dual Failover Fallback', {
    x: 1.05,
    y: 6.35,
    w: 5.7,
    h: 0.25,
    fontSize: 8,
    fontFace: 'Arial',
    color: C.TEXT_DIM,
    align: 'center',
  });

  // Right: Verified Places & Intelligence Cards
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: 7.3,
    y: 1.95,
    w: 5.2,
    h: 4.8,
    rectRadius: 0.1,
    fill: { color: C.BG_CARD },
    line: { color: C.BG_CARD_LIGHT, width: 1.2 },
  });

  slide5.addText('VERIFIED LIVE ESTABLISHMENTS (ISLAMPUR CORRIDOR)', {
    x: 7.55,
    y: 2.15,
    w: 4.7,
    h: 0.25,
    fontSize: 8.5,
    fontFace: 'Arial',
    color: C.CYAN,
    bold: true,
  });

  const verifiedPlaces = [
    { name: 'Green Leaf Cafe & Bakery', dist: '110m', rating: '4.6★', threat: 'Direct Rival' },
    { name: 'Krishna Family Restaurant', dist: '170m', rating: '4.4★', threat: 'Moderate' },
    { name: 'Sai Refreshments & Pure Veg', dist: '230m', rating: '4.3★', threat: 'Moderate' },
    { name: 'Shivaji Bakery & Sweets', dist: '240m', rating: '4.5★', threat: 'Indirect' },
    { name: 'Islampur Central Medical & Clinic', dist: '300m', rating: '4.5★', threat: 'Anchor Anchor' },
  ];

  verifiedPlaces.forEach((vp, idx) => {
    const vy = 2.5 + idx * 0.58;
    slide5.addShape(pptx.ShapeType.roundRect, {
      x: 7.55,
      y: vy,
      w: 4.7,
      h: 0.5,
      rectRadius: 0.05,
      fill: { color: '0E121B' },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });
    slide5.addText(vp.name, {
      x: 7.65,
      y: vy + 0.08,
      w: 2.8,
      h: 0.35,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });
    slide5.addText(`${vp.dist} • ${vp.rating}`, {
      x: 10.4,
      y: vy + 0.08,
      w: 1.7,
      h: 0.35,
      fontSize: 8,
      fontFace: 'Arial',
      color: C.GOLD,
      align: 'right',
    });
  });

  // Saturation Score Pill
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: 7.55,
    y: 5.65,
    w: 4.7,
    h: 0.9,
    rectRadius: 0.06,
    fill: { color: '0E121B' },
    line: { color: C.GOLD, width: 1 },
  });

  slide5.addText('SPATIAL OPPORTUNITY SCORE: 78 / 100 (HIGH)', {
    x: 7.7,
    y: 5.75,
    w: 4.4,
    h: 0.25,
    fontSize: 9,
    fontFace: 'Arial',
    color: C.GOLD,
    bold: true,
  });

  slide5.addText('Optimal spacing with 340m average distance between direct competitors. High vehicular and pedestrian commuter traffic along Uran Islampur Narshhpur trade corridor.', {
    x: 7.7,
    y: 6.0,
    w: 4.4,
    h: 0.5,
    fontSize: 7.5,
    fontFace: 'Arial',
    color: C.TEXT_MUTED,
    lineSpacing: 10,
  });

  // =========================================================================
  // SLIDE 6: Feature 5 – Comparison Engine: Multi-Location Benchmarking (Page 6 of 10)
  // =========================================================================
  const slide6 = addMasterSlide(
    'Comparison Engine: Multi-Location & Scenario Benchmarking',
    6,
    'The Comparison tool enables entrepreneurs to evaluate multiple target sites side-by-side (e.g., Uran Islampur Road vs Rajaramnagar vs Indiranagar), benchmarking competitor density, opportunity scores, and payback periods.',
    '06 / FEATURE 5: COMPARISON ENGINE'
  );

  slide6.addText(
    'Side-by-side empirical decision matrix evaluating prospective locations, competitor density, and payback speed.',
    {
      x: 0.8,
      y: 1.45,
      w: 11.7,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
    }
  );

  const candidates = [
    {
      name: 'Uran Islampur Narshhpur Rd',
      sub: 'Islampur Commercial Artery',
      tag: 'RECOMMENDED WINNER',
      score: '78 / 100',
      rivals: '14 Competitors',
      dist: '340 meters',
      payback: '11.4 Months',
      rent: '$32,000 / mo',
      desc: 'Optimal balance: High commuter footfall, lowest saturation per sq km, and fastest payback horizon.',
      borderColor: C.EMERALD,
      tagColor: C.EMERALD,
    },
    {
      name: 'Rajaramnagar Campus Hub',
      sub: 'RIT Educational Corridor',
      tag: 'SECONDARY CANDIDATE',
      score: '71 / 100',
      rivals: '28 Competitors',
      dist: '210 meters',
      payback: '12.8 Months',
      rent: '$38,000 / mo',
      desc: 'High student/youth density, moderate snack competition. Strong seasonal footfall variation during vacations.',
      borderColor: C.CYAN,
      tagColor: C.CYAN,
    },
    {
      name: 'Indiranagar 100ft Road',
      sub: 'Bengaluru Tier-1 Metropole',
      tag: 'HIGH CAPITAL INTENSIVE',
      score: '65 / 100',
      rivals: '86 Competitors',
      dist: '85 meters',
      payback: '15.2 Months',
      rent: '$95,000 / mo',
      desc: 'Dense footfall with intense brand rivalry; requires high marketing capital cushion to survive initial launch.',
      borderColor: C.GOLD,
      tagColor: C.GOLD,
    },
  ];

  candidates.forEach((cand, idx) => {
    const cx = 0.8 + idx * 3.95;
    slide6.addShape(pptx.ShapeType.roundRect, {
      x: cx,
      y: 2.0,
      w: 3.8,
      h: 4.1,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: cand.borderColor, width: idx === 0 ? 2 : 1 },
    });

    slide6.addText(cand.tag, {
      x: cx + 0.2,
      y: 2.15,
      w: 3.4,
      h: 0.25,
      fontSize: 7.5,
      fontFace: 'Arial',
      color: cand.tagColor,
      bold: true,
    });

    slide6.addText(cand.name, {
      x: cx + 0.2,
      y: 2.4,
      w: 3.4,
      h: 0.35,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide6.addText(cand.sub, {
      x: cx + 0.2,
      y: 2.75,
      w: 3.4,
      h: 0.25,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
    });

    const metricsList = [
      { l: 'Opportunity Score', v: cand.score, highlight: true },
      { l: 'Competitor Density', v: cand.rivals },
      { l: 'Avg Competitor Dist', v: cand.dist },
      { l: 'Break-Even Payback', v: cand.payback },
      { l: 'Monthly Rent Outlay', v: cand.rent },
    ];

    metricsList.forEach((m, mi) => {
      const my = 3.1 + mi * 0.38;
      slide6.addText(m.l, {
        x: cx + 0.2,
        y: my,
        w: 1.8,
        h: 0.3,
        fontSize: 8,
        fontFace: 'Arial',
        color: C.TEXT_MUTED,
      });
      slide6.addText(m.v, {
        x: cx + 2.0,
        y: my,
        w: 1.6,
        h: 0.3,
        fontSize: 8.5,
        fontFace: 'Arial',
        color: m.highlight ? C.EMERALD : C.TEXT_WHITE,
        align: 'right',
        bold: true,
      });
    });

    slide6.addShape(pptx.ShapeType.roundRect, {
      x: cx + 0.2,
      y: 5.15,
      w: 3.4,
      h: 0.8,
      rectRadius: 0.05,
      fill: { color: '0E121B' },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide6.addText(cand.desc, {
      x: cx + 0.3,
      y: 5.22,
      w: 3.2,
      h: 0.68,
      fontSize: 7.5,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 10,
    });
  });

  // Bottom Takeaway Banner
  slide6.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 6.25,
    w: 11.7,
    h: 0.55,
    rectRadius: 0.06,
    fill: { color: '0E121B' },
    line: { color: C.EMERALD, width: 1 },
  });

  slide6.addText('MULTI-CRITERIA SCORING FORMULA: Market Gap (35%) + Footfall (30%) + OpEx Rent Overhead (20%) + Payback Horizon (15%) | Variance Advantage: +24.8%', {
    x: 1.0,
    y: 6.38,
    w: 11.3,
    h: 0.3,
    fontSize: 8.5,
    fontFace: 'Arial',
    color: C.EMERALD,
    bold: true,
  });

  // =========================================================================
  // SLIDE 7: Feature 6 – Predictions [ML]: Ensemble Viability & Probability Curve (Page 7 of 10)
  // [Includes native vector animated prediction graph curve + Random Forest weights]
  // =========================================================================
  const slide7 = addMasterSlide(
    'Predictions [ML]: Ensemble Viability & Probability Curve',
    7,
    'The Predictions module leverages an ensemble of 100 Random Forest decision trees trained on commercial venture datasets. It predicts overall venture viability, displays dynamic sensitivity curves, and identifies key risk factors.',
    '07 / FEATURE 6: ML PREDICTIONS'
  );

  slide7.addText(
    'Calibrated Scikit-Learn Random Forest ensemble with probability curves, feature weights, and sensitivity simulation.',
    {
      x: 0.8,
      y: 1.45,
      w: 11.7,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
    }
  );

  // Left: Animated Prediction Graph / Probability Curve vs Footfall
  slide7.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.95,
    w: 6.5,
    h: 4.8,
    rectRadius: 0.1,
    fill: { color: C.BG_CARD },
    line: { color: C.CYAN, width: 1.2 },
  });

  slide7.addText('PREDICTION PROBABILITY CURVE VS FOOTFALL DEMAND (SIGMOID / ENSEMBLE)', {
    x: 1.05,
    y: 2.15,
    w: 6.0,
    h: 0.3,
    fontSize: 8.5,
    fontFace: 'Arial',
    color: C.CYAN,
    bold: true,
  });

  const predCurveData = [
    {
      name: 'Viability Probability (%)',
      labels: ['15/d', '25/d', '33/d', '40/d', '48/d', '55/d', '65/d', '75/d', '90/d'],
      values: [9, 27, 49, 69, 85, 93, 97, 99, 99],
    },
    {
      name: 'Break-Even Baseline (50%)',
      labels: ['15/d', '25/d', '33/d', '40/d', '48/d', '55/d', '65/d', '75/d', '90/d'],
      values: [50, 50, 50, 50, 50, 50, 50, 50, 50],
    },
  ];

  slide7.addChart(pptx.ChartType.line, predCurveData, {
    x: 1.0,
    y: 2.5,
    w: 6.1,
    h: 3.1,
    chartColors: [C.EMERALD, C.GOLD],
    lineDataSymbol: 'circle',
    lineDataSymbolSize: 5,
    showLegend: true,
    legendPos: 'b',
    legendFontSize: 8,
    legendColor: C.TEXT_MUTED,
  });

  // Slider Scenario Metric Pill
  slide7.addShape(pptx.ShapeType.roundRect, {
    x: 1.05,
    y: 5.85,
    w: 6.0,
    h: 0.75,
    rectRadius: 0.05,
    fill: { color: '0E121B' },
    line: { color: C.BG_CARD_LIGHT, width: 1 },
  });

  slide7.addText('CURRENT TARGET SCENARIO: 48 Customers/day -> 85% High Success Viability', {
    x: 1.2,
    y: 5.95,
    w: 5.7,
    h: 0.25,
    fontSize: 8.5,
    fontFace: 'Arial',
    color: C.EMERALD,
    bold: true,
  });

  slide7.addText('Break-Even Threshold: 33.3 customers/day • Solvency Cushion: +44.1% above operating floor', {
    x: 1.2,
    y: 6.22,
    w: 5.7,
    h: 0.25,
    fontSize: 7.5,
    fontFace: 'Arial',
    color: C.TEXT_MUTED,
  });

  // Right: Random Forest Feature Importance & Model Accuracy
  slide7.addShape(pptx.ShapeType.roundRect, {
    x: 7.6,
    y: 1.95,
    w: 4.9,
    h: 4.8,
    rectRadius: 0.1,
    fill: { color: C.BG_CARD },
    line: { color: C.GOLD, width: 1.2 },
  });

  slide7.addText('RANDOM FOREST FEATURE IMPORTANCE (100 TREES)', {
    x: 7.85,
    y: 2.15,
    w: 4.4,
    h: 0.3,
    fontSize: 8.5,
    fontFace: 'Arial',
    color: C.GOLD,
    bold: true,
  });

  const featureWeights = [
    { name: 'Daily Footfall & Demand Velocity', weight: 32, barCol: C.EMERALD },
    { name: 'Competitor Proximity & Saturation', weight: 24, barCol: C.CYAN },
    { name: 'Unit Contribution Margin Ratio', weight: 21, barCol: C.GOLD },
    { name: 'Initial CapEx Runway Cushion', weight: 15, barCol: C.PURPLE },
    { name: 'Demographic Spending Density', weight: 8, barCol: C.ROSE },
  ];

  featureWeights.forEach((fw, idx) => {
    const fy = 2.55 + idx * 0.58;
    slide7.addText(fw.name, {
      x: 7.85,
      y: fy,
      w: 3.4,
      h: 0.22,
      fontSize: 8,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
    });
    slide7.addText(`${fw.weight}%`, {
      x: 11.2,
      y: fy,
      w: 1.0,
      h: 0.22,
      fontSize: 8,
      fontFace: 'Arial',
      color: C.GOLD,
      align: 'right',
      bold: true,
    });

    // Bar background
    slide7.addShape(pptx.ShapeType.roundRect, {
      x: 7.85,
      y: fy + 0.25,
      w: 4.4,
      h: 0.12,
      rectRadius: 0.04,
      fill: { color: C.BG_CARD_LIGHT },
    });
    // Bar fill
    slide7.addShape(pptx.ShapeType.roundRect, {
      x: 7.85,
      y: fy + 0.25,
      w: (4.4 * fw.weight) / 100 * 2.8,
      h: 0.12,
      rectRadius: 0.04,
      fill: { color: fw.barCol },
    });
  });

  // Model Specs Grid
  const mlSpecs = [
    { l: 'MODEL ACCURACY', v: '91.4% (5-Fold CV)' },
    { l: 'AUC-ROC SCORE', v: '0.942 High Viability' },
  ];
  mlSpecs.forEach((s, idx) => {
    const sx = 7.85 + idx * 2.25;
    slide7.addShape(pptx.ShapeType.roundRect, {
      x: sx,
      y: 5.75,
      w: 2.15,
      h: 0.85,
      rectRadius: 0.05,
      fill: { color: '0E121B' },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });
    slide7.addText(s.l, {
      x: sx + 0.1,
      y: 5.85,
      w: 1.95,
      h: 0.2,
      fontSize: 7,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
      bold: true,
    });
    slide7.addText(s.v, {
      x: sx + 0.1,
      y: 6.1,
      w: 1.95,
      h: 0.35,
      fontSize: 9,
      fontFace: 'Arial',
      color: idx === 0 ? C.TEXT_WHITE : C.EMERALD,
      bold: true,
    });
  });

  // =========================================================================
  // SLIDE 8: Feature 7 – Recommendations: Prescriptive Strategic Action Engine (Page 8 of 10)
  // =========================================================================
  const slide8 = addMasterSlide(
    'Recommendations: Prescriptive Strategic Action Engine',
    8,
    'The Recommendations engine analyzes the financial and spatial model to prescribe specific high-impact actions, such as lease negotiations, ticket bundling, and corridor positioning to improve overall viability.',
    '08 / FEATURE 7: RECOMMENDATIONS'
  );

  slide8.addText(
    'Algorithmic decision optimization delivering targeted operational, pricing, spatial, and cash buffer improvements.',
    {
      x: 0.8,
      y: 1.45,
      w: 11.7,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
    }
  );

  const recCards = [
    {
      cat: 'OPEX OPTIMIZATION • HIGH IMPACT',
      impact: '-120 Units/mo',
      title: 'Commercial Lease Lock-in & Overhead Trimming',
      desc: 'Negotiate 3-year rent cap with 60-day rent-free fit-out period. Reduces break-even threshold volume by 12% and protects early cash flows.',
      color: C.EMERALD,
    },
    {
      cat: 'PRICING & MARGIN • HIGH IMPACT',
      impact: '+$30 Margin/Unit',
      title: 'Combo Ticket Bundling Strategy',
      desc: 'Bundle premium pour-overs with artisan sourdough pastries at $260 average ticket size, boosting unit contribution margin from $165 to $195.',
      color: C.GOLD,
    },
    {
      cat: 'SPATIAL CAPTURE • MEDIUM IMPACT',
      impact: '+28% Morning Footfall',
      title: 'Transit Corridor Micro-Frontage',
      desc: 'Situate storefront within 200m of the prime commuter road junction along Uran Islampur Road to capture morning rush-hour commuters.',
      color: C.CYAN,
    },
    {
      cat: 'SOLVENCY CUSHION • CRITICAL',
      impact: '2.5 Mos OpEx Buffer',
      title: 'Working Capital Liquidity Safety Net',
      desc: 'Retain $410,000 cash reserve to insulate against initial 60-day customer acquisition ramp-up variability before break-even crossover.',
      color: C.PURPLE,
    },
  ];

  recCards.forEach((rc, idx) => {
    const rx = 0.8 + (idx % 2) * 5.95;
    const ry = 2.0 + Math.floor(idx / 2) * 2.05;

    slide8.addShape(pptx.ShapeType.roundRect, {
      x: rx,
      y: ry,
      w: 5.75,
      h: 1.9,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: rc.color, width: 1.2 },
    });

    slide8.addText(rc.cat, {
      x: rx + 0.2,
      y: ry + 0.15,
      w: 3.5,
      h: 0.25,
      fontSize: 7.5,
      fontFace: 'Arial',
      color: rc.color,
      bold: true,
    });

    slide8.addText(rc.impact, {
      x: rx + 3.8,
      y: ry + 0.15,
      w: 1.7,
      h: 0.25,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: rc.color,
      align: 'right',
      bold: true,
    });

    slide8.addText(rc.title, {
      x: rx + 0.2,
      y: ry + 0.45,
      w: 5.3,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide8.addText(rc.desc, {
      x: rx + 0.2,
      y: ry + 0.85,
      w: 5.3,
      h: 0.85,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 12,
    });
  });

  // Projected Outcome Strip
  slide8.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 6.25,
    w: 11.7,
    h: 0.55,
    rectRadius: 0.06,
    fill: { color: '0E121B' },
    line: { color: C.EMERALD, width: 1 },
  });

  slide8.addText('COMBINED PRESCRIPTIVE RECOMMENDATION IMPACT: Feasibility Score 84/100 -> 92/100 (+8 pts) | Payback Horizon Accelerated by -2.1 Months', {
    x: 1.0,
    y: 6.38,
    w: 11.3,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    color: C.EMERALD,
    bold: true,
  });

  // =========================================================================
  // SLIDE 9: Project Conclusion (Page 9 of 10)
  // =========================================================================
  const slide9 = addMasterSlide(
    'Conclusion',
    9,
    'In conclusion, BizMind makes business planning simple, clear, and practical. Entrepreneurs can check their costs, find the right location, study nearby competitors, and get simple advice before spending real money.',
    '09 / CONCLUSION'
  );

  slide9.addText(
    'How BizMind helps everyday entrepreneurs make smart, confident, and risk-free business decisions.',
    {
      x: 0.8,
      y: 1.45,
      w: 11.7,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
    }
  );

  const conclusionCards = [
    {
      title: 'Easy Business Planning',
      desc: 'Calculate startup costs, monthly bills, and daily sales goals in minutes without messy spreadsheets or complicated accounting terms.',
      badge: 'KNOW YOUR PROFIT & BREAK-EVEN POINT',
      color: C.GOLD,
    },
    {
      title: 'Smart Location Check',
      desc: 'See nearby competitors on the map and check customer footfall before renting a shop, helping you avoid overcrowded spots.',
      badge: 'PICK THE BEST SPOT FOR YOUR SHOP',
      color: C.CYAN,
    },
    {
      title: 'Practical Success Advice',
      desc: 'Receive clear, easy suggestions on setting product prices, cutting extra expenses, and keeping a cash buffer so your business survives and grows.',
      badge: 'SAVE MONEY & AVOID BEGINNER MISTAKES',
      color: C.EMERALD,
    },
  ];

  conclusionCards.forEach((ef, idx) => {
    const ex = 0.8 + idx * 3.95;
    slide9.addShape(pptx.ShapeType.roundRect, {
      x: ex,
      y: 2.05,
      w: 3.8,
      h: 3.0,
      rectRadius: 0.1,
      fill: { color: C.BG_CARD },
      line: { color: ef.color, width: 1.2 },
    });

    slide9.addText(ef.title, {
      x: ex + 0.2,
      y: 2.3,
      w: 3.4,
      h: 0.35,
      fontSize: 12,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      bold: true,
    });

    slide9.addText(ef.desc, {
      x: ex + 0.2,
      y: 2.75,
      w: 3.4,
      h: 1.4,
      fontSize: 9,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      lineSpacing: 13,
    });

    slide9.addText(ef.badge, {
      x: ex + 0.2,
      y: 4.45,
      w: 3.4,
      h: 0.3,
      fontSize: 7.5,
      fontFace: 'Arial',
      color: ef.color,
      bold: true,
    });
  });

  // Conclusion Summary Strip
  const conclusionStats = [
    { l: 'TEST FIRST', v: 'Zero Risk', s: 'Test ideas before spending money' },
    { l: 'CLEAR ANSWERS', v: 'Simple Data', s: 'Easy charts anyone can understand' },
    { l: 'BETTER DECISIONS', v: 'Smart Guidance', s: 'Practical tips for real-world shops' },
    { l: 'FOR EVERYONE', v: 'Free & Open', s: 'Built for students & new founders' },
  ];

  conclusionStats.forEach((st, idx) => {
    const sx = 0.8 + idx * 2.95;
    slide9.addShape(pptx.ShapeType.roundRect, {
      x: sx,
      y: 5.3,
      w: 2.8,
      h: 1.5,
      rectRadius: 0.08,
      fill: { color: '0E121B' },
      line: { color: C.BG_CARD_LIGHT, width: 1 },
    });

    slide9.addText(st.l, {
      x: sx + 0.15,
      y: 5.45,
      w: 2.5,
      h: 0.2,
      fontSize: 7.5,
      fontFace: 'Arial',
      color: C.TEXT_DIM,
      bold: true,
    });

    slide9.addText(st.v, {
      x: sx + 0.15,
      y: 5.72,
      w: 2.5,
      h: 0.45,
      fontSize: 14,
      fontFace: 'Arial',
      color: C.GOLD,
      bold: true,
    });

    slide9.addText(st.s, {
      x: sx + 0.15,
      y: 6.22,
      w: 2.5,
      h: 0.3,
      fontSize: 8,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
    });
  });

  // =========================================================================
  // SLIDE 10: Thank You & Project Defense (Page 10 of 10)
  // =========================================================================
  const slide10 = addMasterSlide(
    'THANK YOU!',
    10,
    'Thank the faculty evaluation committee, guide Ms. A. R. Patil, and Department of Computer Applications. Open the floor for technical project defense inquiries and live system demonstrations.',
    '10 / THANK YOU & PROJECT DEFENSE'
  );

  // Hero Card Backdrop
  slide10.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 5.2,
    rectRadius: 0.12,
    fill: { color: C.BG_CARD },
    line: { color: C.BG_CARD_LIGHT, width: 1.5 },
  });

  // Main Thank You Heading
  slide10.addText('Thank You!', {
    x: 1.2,
    y: 2.05,
    w: 10.9,
    h: 0.9,
    fontSize: 42,
    fontFace: 'Arial',
    color: C.TEXT_WHITE,
    bold: true,
    align: 'center',
  });

  slide10.addText(
    'We express our sincere gratitude to our guide Ms. A. R. Patil and faculty members at Rajarambapu Institute of Technology for their continuous mentorship, support, and guidance.',
    {
      x: 2.2,
      y: 2.95,
      w: 8.9,
      h: 0.45,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: C.TEXT_MUTED,
      align: 'center',
    }
  );

  // Centered Card: Presented By (Project Team)
  slide10.addShape(pptx.ShapeType.roundRect, {
    x: 3.2,
    y: 3.65,
    w: 6.9,
    h: 2.3,
    rectRadius: 0.1,
    fill: { color: C.BG_DARK },
    line: { color: C.CYAN, width: 1.2 },
  });

  slide10.addText('PRESENTED BY (PROJECT TEAM)', {
    x: 3.4,
    y: 3.85,
    w: 6.5,
    h: 0.25,
    fontSize: 10,
    fontFace: 'Arial',
    color: C.CYAN,
    bold: true,
    align: 'center',
  });

  slide10.addText(
    '• Pramod Rajendra Mahajan  (Roll No: 2547047)\n• Harshad Shahaji Patil  (Roll No: 2547062)\n• Sakshi Dnyaneshwar Randive  (Roll No: 2547048)\n• Rutika Rajesh Deshmukh  (Roll No: 2547025)',
    {
      x: 3.6,
      y: 4.25,
      w: 6.1,
      h: 1.5,
      fontSize: 11,
      fontFace: 'Arial',
      color: C.TEXT_WHITE,
      lineSpacing: 18,
      align: 'center',
    }
  );

  // Footer Tagline
  slide10.addText('RAJARAMBAPU INSTITUTE OF TECHNOLOGY, RAJARAMNAGAR • SANGALI, MAHARASHTRA • 2026–27', {
    x: 1.2,
    y: 6.35,
    w: 10.9,
    h: 0.25,
    fontSize: 8.5,
    fontFace: 'Arial',
    color: C.TEXT_DIM,
    align: 'center',
  });

  // =========================================================================
  // Generate Base PPTX Blob
  // =========================================================================
  const pptxBlob = (await pptx.write({ outputType: 'blob' })) as Blob;

  // =========================================================================
  // Inject PowerPoint Native Transitions (<p:transition>) via JSZip
  // =========================================================================
  try {
    const zip = await JSZip.loadAsync(pptxBlob);
    const slideFiles = Object.keys(zip.files).filter((fileName) =>
      fileName.match(/ppt\/slides\/slide\d+\.xml/)
    );

    for (let i = 0; i < slideFiles.length; i++) {
      const fileName = slideFiles[i];
      let xmlContent = await zip.files[fileName].async('text');

      if (!xmlContent.includes('<p:transition')) {
        const transitionXml =
          i % 2 === 0
            ? '<p:transition spd="med"><p:push dir="r"/></p:transition></p:sld>'
            : '<p:transition spd="med"><p:fade/></p:transition></p:sld>';
        xmlContent = xmlContent.replace('</p:sld>', transitionXml);
        zip.file(fileName, xmlContent);
      }
    }

    const enhancedBlob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });

    downloadBlob(
      enhancedBlob,
      'RIT_MCA_Capstone_BizMind_Pitch_Deck.pptx'
    );
  } catch (zipErr) {
    console.warn('Failed to inject transitions, downloading standard PPTX:', zipErr);
    downloadBlob(
      pptxBlob,
      'RIT_MCA_Capstone_BizMind_Pitch_Deck.pptx'
    );
  }
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
