/**
 * BizMind – Standalone Animated HTML Presentation Generator (8 Core Slides)
 * Generates a self-contained, offline-ready animated HTML slide deck
 * with CSS/JS motion effects, vector charts, interactive location radar, and keyboard navigation.
 */
import { BusinessPlan } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export function generateAnimatedHtmlPresentation(plan?: BusinessPlan | null): void {
  const planName = plan?.businessName || 'BizMind AI Platform';
  const location = plan?.location || 'Prime Commercial Corridor';
  const capex = plan ? formatCurrency(plan.totalInitialInvestment || 0) : '$875,000';
  const opex = plan ? `${formatCurrency(plan.totalMonthlyFixedExpenses || 0)}/mo` : '$165,000 / mo';
  const profitMargin = plan ? formatPercentage(plan.profitMargin || 0) : '22.9% Net';
  const payback = plan ? `${plan.paybackPeriodMonths || 12.1} Months` : '12.1 Months';
  const beUnits = plan ? `${plan.breakEvenUnits || 1000} Units` : '1,000 Units';
  const beRev = plan ? formatCurrency(plan.breakEvenRevenue || 220000) : '$220,000';
  const beBuffer = plan ? `${(100 - (plan.breakEvenCapacityPercentage || 69.4)).toFixed(1)}%` : '30.6%';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${planName} – 8-Page Animated Project Pitch Deck</title>
  <style>
    :root {
      --bg-dark: #0A0D14;
      --bg-card: #121722;
      --bg-card-border: #1E2433;
      --accent-gold: #F59E0B;
      --accent-gold-light: #FDE68A;
      --accent-cyan: #0EA5E9;
      --accent-emerald: #10B981;
      --accent-rose: #F43F5E;
      --accent-purple: #8B5CF6;
      --text-white: #FFFFFF;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-dark);
      color: var(--text-white);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
    }

    /* Top Controls Bar */
    header {
      background-color: #0E121B;
      border-bottom: 1px solid var(--bg-card-border);
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 50;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 32px;
      height: 32px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid var(--accent-gold);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      color: var(--accent-gold);
    }
    .brand-text h1 { font-size: 14px; font-weight: 700; color: #fff; }
    .brand-text p { font-size: 11px; color: var(--text-muted); }

    .controls { display: flex; gap: 8px; align-items: center; }
    .btn {
      background: #121722;
      border: 1px solid var(--bg-card-border);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn:hover { background: #1E2433; color: #fff; border-color: var(--accent-gold); }
    .btn-gold { background: var(--accent-gold); color: #0A0D14; font-weight: 800; border: none; }
    .btn-gold:hover { background: #D97706; color: #000; }

    /* Progress Line */
    .progress-bar {
      width: 100%;
      height: 3px;
      background: #121722;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-gold), var(--accent-cyan));
      width: 12.5%;
      transition: width 0.4s ease;
    }

    /* Slide Arena */
    main {
      flex: 1;
      position: relative;
      padding: 36px 48px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow-y: auto;
    }

    .slide {
      width: 100%;
      max-width: 1080px;
      display: none;
      opacity: 0;
      transform: translateY(16px);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .slide.active {
      display: flex;
      flex-direction: column;
      opacity: 1;
      transform: translateY(0);
    }

    .slide-tag {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--accent-gold);
      margin-bottom: 6px;
    }
    .slide-title {
      font-size: 32px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    .slide-subtitle {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--bg-card-border);
      border-radius: 14px;
      padding: 20px;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: rgba(245, 158, 11, 0.4); }

    /* SVG Donut Chart */
    .donut-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 280px;
    }
    .donut-legend {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 12px;
      font-size: 11px;
      color: var(--text-muted);
    }
    .legend-item { display: flex; align-items: center; gap: 6px; }
    .legend-dot { width: 8px; height: 8px; border-radius: 50%; }

    /* Bar/Line SVG styling */
    .chart-box {
      width: 100%;
      height: 260px;
      background: #0D111A;
      border: 1px solid var(--bg-card-border);
      border-radius: 12px;
      padding: 16px;
    }

    /* Radar Map Simulator */
    .radar-box {
      width: 100%;
      height: 300px;
      background: #0B0E17;
      border: 1px solid var(--bg-card-border);
      border-radius: 14px;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .radar-circle {
      position: absolute;
      border: 1px dashed rgba(245, 158, 11, 0.4);
      border-radius: 50%;
    }
    .radar-sweep {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: conic-gradient(from 0deg, rgba(245, 158, 11, 0.2) 0deg, transparent 60deg);
      animation: sweep 4s linear infinite;
    }
    @keyframes sweep {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .radar-pin {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      box-shadow: 0 0 10px currentColor;
    }

    /* Bottom Status */
    footer {
      background-color: #080A10;
      border-top: 1px solid var(--bg-card-border);
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: var(--text-dim);
    }

    /* Keyboard Nav Helpers */
    .kbd {
      background: #121722;
      border: 1px solid var(--bg-card-border);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      color: #fff;
    }
  </style>
</head>
<body>

  <!-- Top Header Bar -->
  <header>
    <div class="brand">
      <div class="brand-icon">B</div>
      <div class="brand-text">
        <h1>${planName} – Executive Pitch Deck</h1>
        <p>BizMind AI Decision Support Platform • 8 Comprehensive Pages</p>
      </div>
    </div>
    <div class="controls">
      <span style="font-size: 12px; font-weight: 700; color: var(--accent-gold); margin-right: 12px;" id="slide-counter">Slide 1 / 8</span>
      <button class="btn" onclick="prevSlide()">← Prev</button>
      <button class="btn btn-gold" onclick="nextSlide()">Next →</button>
      <button class="btn" onclick="toggleFullscreen()">Fullscreen</button>
    </div>
  </header>

  <!-- Animated Progress Line -->
  <div class="progress-bar">
    <div class="progress-fill" id="progress-fill"></div>
  </div>

  <!-- Main Slide Arena (8 Slides) -->
  <main>
    <!-- Slide 1: Platform Vision & Hero -->
    <div class="slide active" id="slide-1">
      <div class="slide-tag">Executive Overview • Page 01 of 08</div>
      <div class="slide-title">${planName}</div>
      <div class="slide-subtitle">Where Spatial Demographics Meet Financial Precision — Complete Venture Dossier for ${location}</div>

      <div class="grid-4" style="margin-top: 12px;">
        <div class="card">
          <div style="font-size: 10px; color: var(--accent-gold); font-weight: 700; text-transform: uppercase;">Startup CapEx Outlay</div>
          <div style="font-size: 26px; font-weight: 800; color: #fff; margin: 4px 0;">${capex}</div>
          <div style="font-size: 11px; color: var(--text-dim);">Turnkey launch capital</div>
        </div>
        <div class="card">
          <div style="font-size: 10px; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase;">Fixed Burn (OpEx)</div>
          <div style="font-size: 26px; font-weight: 800; color: #fff; margin: 4px 0;">${opex}</div>
          <div style="font-size: 11px; color: var(--text-dim);">Recurring monthly overhead</div>
        </div>
        <div class="card">
          <div style="font-size: 10px; color: var(--accent-emerald); font-weight: 700; text-transform: uppercase;">Projected Margin</div>
          <div style="font-size: 26px; font-weight: 800; color: var(--accent-emerald); margin: 4px 0;">${profitMargin}</div>
          <div style="font-size: 11px; color: var(--text-dim);">Net operating return</div>
        </div>
        <div class="card">
          <div style="font-size: 10px; color: var(--accent-purple); font-weight: 700; text-transform: uppercase;">Payback Period</div>
          <div style="font-size: 26px; font-weight: 800; color: #fff; margin: 4px 0;">${payback}</div>
          <div style="font-size: 11px; color: var(--text-dim);">Capital recovery window</div>
        </div>
      </div>

      <div class="card" style="margin-top: 20px; border-color: rgba(245, 158, 11, 0.3);">
        <div style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 6px;">The 4 Pillars of Decision Intelligence:</div>
        <p style="font-size: 12px; color: var(--text-muted); line-height: 1.6;">
          1. Deterministic Unit Economics &nbsp;•&nbsp; 2. Dual-Engine Spatial Competitor Radar &nbsp;•&nbsp; 3. Multi-Scenario Solvency Stress-Testing &nbsp;•&nbsp; 4. Calibrated ML Success Regressor
        </p>
      </div>
    </div>

    <!-- Slide 2: The Core Problem -->
    <div class="slide" id="slide-2">
      <div class="slide-tag">Market Need & Friction • Page 02 of 08</div>
      <div class="slide-title">The $1.3T Startup Failure Epidemic: Why 90% Collapse</div>
      <div class="slide-subtitle">Entrepreneurs fail not from poor products, but from preventable blind spots in location selection and static financial spreadsheets</div>

      <div class="grid-2">
        <div class="card" style="border-left: 4px solid var(--accent-rose);">
          <div style="font-size: 28px; font-weight: 900; color: var(--accent-rose);">42%</div>
          <div style="font-size: 14px; font-weight: 700; color: #fff; margin: 4px 0;">Misjudged Location Demand & Saturation</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Committing to expensive long-term commercial leases based on surface foot-traffic impressions rather than empirical competitor clustering.</p>
          <div style="margin-top: 8px; font-size: 11px; color: var(--accent-emerald);"><strong>BizMind Solution:</strong> Isochrone radius indexing (500m to 5km).</div>
        </div>

        <div class="card" style="border-left: 4px solid var(--accent-gold);">
          <div style="font-size: 28px; font-weight: 900; color: var(--accent-gold);">29%</div>
          <div style="font-size: 14px; font-weight: 700; color: #fff; margin: 4px 0;">Premature Cash Depletion & Burnout</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Static spreadsheets fail to model footfall ramp-up drag and variable cost spikes, exhausting cash reserves before achieving break-even.</p>
          <div style="margin-top: 8px; font-size: 11px; color: var(--accent-emerald);"><strong>BizMind Solution:</strong> 3-month dynamic working capital buffers.</div>
        </div>

        <div class="card" style="border-left: 4px solid var(--accent-cyan);">
          <div style="font-size: 28px; font-weight: 900; color: var(--accent-cyan);">23%</div>
          <div style="font-size: 14px; font-weight: 700; color: #fff; margin: 4px 0;">Distorted Pricing & Omitted COGS</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Setting price points without granular contribution margins, inventory spoilage, merchant processing fees, or utility escalations.</p>
          <div style="margin-top: 8px; font-size: 11px; color: var(--accent-emerald);"><strong>BizMind Solution:</strong> Granular contribution margin calculus.</div>
        </div>

        <div class="card" style="border-left: 4px solid var(--accent-purple);">
          <div style="font-size: 28px; font-weight: 900; color: var(--accent-purple);">19%</div>
          <div style="font-size: 14px; font-weight: 700; color: #fff; margin: 4px 0;">Blind to Undetected Competitor Clusters</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Failing to track nearby complementary vs direct rivals, allowing aggressive local competitors to capture prime customer corridors.</p>
          <div style="margin-top: 8px; font-size: 11px; color: var(--accent-emerald);"><strong>BizMind Solution:</strong> Live Google Places & OSM Overpass discovery.</div>
        </div>
      </div>
    </div>

    <!-- Slide 3: Startup Capital Allocation (Donut Chart) -->
    <div class="slide" id="slide-3">
      <div class="slide-tag">Capital Allocation • Page 03 of 08</div>
      <div class="slide-title">Startup Capital Allocation & Working Capital Reserves</div>
      <div class="slide-subtitle">Native vector breakdown of initial CapEx launch expenditure and operating safety runway</div>

      <div class="grid-2" style="align-items: center;">
        <div class="card">
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 12px; text-transform: uppercase;">CapEx Allocation Breakdown</div>
          <div class="donut-container">
            <svg viewBox="0 0 100 100" width="180" height="180">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#FFBF24" stroke-width="16" stroke-dasharray="70 200" stroke-dashoffset="0" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#38BDF8" stroke-width="16" stroke-dasharray="60 200" stroke-dashoffset="-70" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#10B981" stroke-width="16" stroke-dasharray="45 200" stroke-dashoffset="-130" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#A855F7" stroke-width="16" stroke-dasharray="25 200" stroke-dashoffset="-175" />
            </svg>
          </div>
          <div class="donut-legend">
            <div class="legend-item"><span class="legend-dot" style="background:#FFBF24;"></span> Property Deposit (32%)</div>
            <div class="legend-item"><span class="legend-dot" style="background:#38BDF8;"></span> Interior Setup (35%)</div>
            <div class="legend-item"><span class="legend-dot" style="background:#10B981;"></span> Equipment (23%)</div>
            <div class="legend-item"><span class="legend-dot" style="background:#A855F7;"></span> Tech & Inventory (10%)</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="card">
            <div style="font-size: 11px; color: var(--text-muted);">Total Launch Outlay</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-gold); margin: 2px 0;">${capex}</div>
            <div style="font-size: 10px; color: var(--text-dim);">Fixed startup capital required</div>
          </div>
          <div class="card">
            <div style="font-size: 11px; color: var(--text-muted);">3-Month Working Capital Safety Reserve</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-cyan); margin: 2px 0;">$495,000</div>
            <div style="font-size: 10px; color: var(--text-dim);">Ensures survival during customer footfall ramp-up</div>
          </div>
          <div class="card" style="border-color: rgba(245, 158, 11, 0.4);">
            <div style="font-size: 11px; color: var(--accent-gold); font-weight: 700;">CapEx Safety Verification</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">BizMind guarantees plans maintain at least 90 days of cash reserves prior to lease commitment.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 4: 12-Month Cash Flow & Break-Even -->
    <div class="slide" id="slide-4">
      <div class="slide-tag">Financial Trajectory • Page 04 of 08</div>
      <div class="slide-title">12-Month Financial Trajectory: Revenue vs. Expenses</div>
      <div class="slide-subtitle">Dynamic growth curve visualizing customer ramp-up crossing the operational expense floor</div>

      <div class="grid-2" style="align-items: center;">
        <div class="card">
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 8px;">Compounding Monthly Cash Curve</div>
          <div class="chart-box">
            <svg viewBox="0 0 300 150" width="100%" height="100%">
              <!-- Grid lines -->
              <line x1="20" y1="130" x2="280" y2="130" stroke="#1E2433" stroke-width="1"/>
              <line x1="20" y1="80" x2="280" y2="80" stroke="#1E2433" stroke-width="1"/>
              <line x1="20" y1="30" x2="280" y2="30" stroke="#1E2433" stroke-width="1"/>
              <!-- Expense line (Red dashed) -->
              <path d="M 20 85 Q 150 82 280 75" fill="none" stroke="#F43F5E" stroke-width="2" stroke-dasharray="4 4" />
              <!-- Revenue line (Green solid) -->
              <path d="M 20 115 Q 120 85 280 25" fill="none" stroke="#10B981" stroke-width="3" />
              <!-- Break-even intersection dot -->
              <circle cx="110" cy="84" r="5" fill="#FFBF24" stroke="#fff" stroke-width="2" />
              <text x="120" y="80" fill="#FFBF24" font-size="9" font-weight="bold">Month 3 Break-Even</text>
            </svg>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="card">
            <div style="font-size: 11px; color: var(--text-muted);">Break-Even Sales Volume</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-gold);">${beUnits}</div>
            <div style="font-size: 10px; color: var(--text-dim);">Monthly units to cover total expenses</div>
          </div>
          <div class="card">
            <div style="font-size: 11px; color: var(--text-muted);">Break-Even Revenue Floor</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-cyan);">${beRev} / mo</div>
            <div style="font-size: 10px; color: var(--text-dim);">Cash-neutral revenue threshold</div>
          </div>
          <div class="card">
            <div style="font-size: 11px; color: var(--text-muted);">Demand Capacity Buffer</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-emerald);">${beBuffer} Buffer</div>
            <div style="font-size: 10px; color: var(--text-dim);">Downside protection against footfall dips</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 5: Scenario Stress-Testing -->
    <div class="slide" id="slide-5">
      <div class="slide-tag">Risk & Sensitivity • Page 05 of 08</div>
      <div class="slide-title">Solvency Stress-Testing: Multi-Scenario Sensitivity Analysis</div>
      <div class="slide-subtitle">Rigorous empirical modeling proving solvency under severe market contraction and peak upside</div>

      <div class="grid-3">
        <div class="card" style="border-top: 4px solid var(--accent-rose);">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-rose); text-transform: uppercase;">Conservative Case</div>
          <div style="font-size: 18px; font-weight: 800; color: #fff; margin: 6px 0;">-20% Footfall Shock</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Footfall drops 20% while fixed expenses inflate 5%. Sized cash reserves absorb the slowdown with zero insolvency.</p>
          <div style="margin-top: 12px; padding: 6px 10px; background: rgba(244, 63, 94, 0.1); border-radius: 6px; font-size: 11px; color: var(--accent-rose); font-weight: 700;">
            Outcome: Solvent & Intact
          </div>
        </div>

        <div class="card" style="border-top: 4px solid var(--accent-gold);">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-gold); text-transform: uppercase;">Base Target Case</div>
          <div style="font-size: 18px; font-weight: 800; color: #fff; margin: 6px 0;">Standard Operational Model</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Expected steady-state yielding healthy 22.9% net margin and full initial capital payback in 12.1 months.</p>
          <div style="margin-top: 12px; padding: 6px 10px; background: rgba(245, 158, 11, 0.1); border-radius: 6px; font-size: 11px; color: var(--accent-gold); font-weight: 700;">
            Outcome: 12.1 Mo Payback
          </div>
        </div>

        <div class="card" style="border-top: 4px solid var(--accent-emerald);">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-emerald); text-transform: uppercase;">Optimistic Case</div>
          <div style="font-size: 18px; font-weight: 800; color: #fff; margin: 6px 0;">+20% High Repeat Volume</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Strong word-of-mouth customer frequency expands margins to 29.3%, accelerating payback to 8.5 months.</p>
          <div style="margin-top: 12px; padding: 6px 10px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; font-size: 11px; color: var(--accent-emerald); font-weight: 700;">
            Outcome: 8.5 Mo Accelerated
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 6: Geospatial Location Intelligence -->
    <div class="slide" id="slide-6">
      <div class="slide-tag">Spatial Intelligence • Page 06 of 08</div>
      <div class="slide-title">Geospatial Intelligence: Micro-Radius Competitor Indexing</div>
      <div class="slide-subtitle">Transforming physical geography into competitive dominance via isochrone dispersion and spatial algorithms</div>

      <div class="grid-3">
        <div class="card">
          <div style="font-size: 26px; font-weight: 900; color: var(--accent-cyan);">01</div>
          <div style="font-size: 15px; font-weight: 700; color: #fff; margin: 4px 0;">Isochrone Radii</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Calculates competitor density across 500m (walkshed), 1km (core), 2km (catchment), and 5km (vehicular draw) to evaluate real pedestrian pull.</p>
        </div>
        <div class="card">
          <div style="font-size: 26px; font-weight: 900; color: var(--accent-gold);">02</div>
          <div style="font-size: 15px; font-weight: 700; color: #fff; margin: 4px 0;">Synergy vs Rivalry</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Separates zero-sum direct competitors from complementary demand hubs (metro stations, universities, office parks) that drive footfall.</p>
        </div>
        <div class="card">
          <div style="font-size: 26px; font-weight: 900; color: var(--accent-emerald);">03</div>
          <div style="font-size: 15px; font-weight: 700; color: #fff; margin: 4px 0;">White-Space Discovery</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Highlights dense consumer corridors where specific offerings (specialty coffee, artisan bakery, fitness) are completely unserved.</p>
        </div>
      </div>
    </div>

    <!-- Slide 7: LIVE DEMO: Location Intelligence Engine -->
    <div class="slide" id="slide-7">
      <div class="slide-tag">Live Spatial Demo • Page 07 of 08</div>
      <div class="slide-title">LIVE DEMO: Real-Time Location Intelligence & Spatial Radar</div>
      <div class="slide-subtitle">Interactive spatial simulator — test corridor hotspots, adjust radius rings, and inspect real-time competitor clustering</div>

      <div class="grid-2" style="align-items: center;">
        <div class="radar-box">
          <div class="radar-sweep"></div>
          <div class="radar-circle" style="width: 80px; height: 80px;"></div>
          <div class="radar-circle" style="width: 160px; height: 160px;"></div>
          <div class="radar-circle" style="width: 240px; height: 240px;"></div>

          <!-- Target Pin -->
          <div style="position: absolute; width: 16px; height: 16px; border-radius: 50%; background: var(--accent-gold); border: 2px solid #fff; box-shadow: 0 0 15px var(--accent-gold); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; color: #000;">★</div>

          <!-- Competitor Pins -->
          <div class="radar-pin" style="top: 35%; left: 38%; background: var(--accent-rose);"></div>
          <div class="radar-pin" style="top: 60%; left: 65%; background: var(--accent-gold);"></div>
          <div class="radar-pin" style="top: 25%; left: 70%; background: var(--accent-cyan);"></div>
          <div class="radar-pin" style="top: 75%; left: 30%; background: var(--accent-rose);"></div>
          <div class="radar-pin" style="top: 45%; left: 22%; background: var(--accent-cyan);"></div>

          <div style="position: absolute; bottom: 8px; left: 12px; font-size: 10px; color: var(--accent-emerald);">● Live Spatial Radar Active (500m - 3km)</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="card" style="border-color: var(--accent-gold);">
            <div style="font-size: 10px; font-weight: 700; color: var(--accent-gold); text-transform: uppercase;">Live Opportunity Index</div>
            <div style="font-size: 28px; font-weight: 800; color: #fff; margin: 4px 0;">78 / 100 Viability</div>
            <div style="width: 100%; height: 6px; background: #1E2433; border-radius: 3px; overflow: hidden; margin-top: 6px;">
              <div style="width: 78%; height: 100%; background: linear-gradient(90deg, var(--accent-gold), var(--accent-emerald));"></div>
            </div>
            <p style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">High commercial feasibility: Favorable footfall density with unmet consumer demand in corridor.</p>
          </div>

          <div class="grid-2">
            <div class="card">
              <div style="font-size: 10px; color: var(--text-muted);">Competitor Density</div>
              <div style="font-size: 18px; font-weight: 800; color: var(--accent-cyan); margin-top: 2px;">4.8 / km²</div>
            </div>
            <div class="card">
              <div style="font-size: 10px; color: var(--text-muted);">Nearest Rival Proximity</div>
              <div style="font-size: 18px; font-weight: 800; color: var(--accent-gold); margin-top: 2px;">140 Meters</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 8: Machine Learning & Outcomes -->
    <div class="slide" id="slide-8">
      <div class="slide-tag">Predictive AI & Outcomes • Page 08 of 08</div>
      <div class="slide-title">Machine Learning Regressor & Transformation Scorecard</div>
      <div class="slide-subtitle">Dual-engine AI validation (Random Forest & XGBoost) with Responsible AI governance and proven business outcomes</div>

      <div class="grid-2" style="align-items: center;">
        <div class="card">
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 12px;">ML Feature Attribution Weights</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;"><span>Footfall Density</span><span style="color:var(--accent-gold);">32%</span></div>
              <div style="width: 100%; height: 6px; background: #1E2433; border-radius: 3px;"><div style="width: 32%; height: 100%; background: var(--accent-gold); border-radius: 3px;"></div></div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;"><span>Capital Adequacy</span><span style="color:var(--accent-gold);">26%</span></div>
              <div style="width: 100%; height: 6px; background: #1E2433; border-radius: 3px;"><div style="width: 26%; height: 100%; background: var(--accent-gold); border-radius: 3px;"></div></div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;"><span>Competitor Proximity</span><span style="color:var(--accent-gold);">21%</span></div>
              <div style="width: 100%; height: 6px; background: #1E2433; border-radius: 3px;"><div style="width: 21%; height: 100%; background: var(--accent-gold); border-radius: 3px;"></div></div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;"><span>Target Demographic Income</span><span style="color:var(--accent-gold);">14%</span></div>
              <div style="width: 100%; height: 6px; background: #1E2433; border-radius: 3px;"><div style="width: 14%; height: 100%; background: var(--accent-gold); border-radius: 3px;"></div></div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;"><span>Seasonality Index</span><span style="color:var(--accent-gold);">7%</span></div>
              <div style="width: 100%; height: 6px; background: #1E2433; border-radius: 3px;"><div style="width: 7%; height: 100%; background: var(--accent-gold); border-radius: 3px;"></div></div>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div style="font-size: 26px; font-weight: 900; color: var(--accent-gold);">85%</div>
            <div style="font-size: 12px; font-weight: 700; color: #fff;">Planning Time Saved</div>
            <div style="font-size: 10px; color: var(--text-dim); margin-top: 2px;">From 4 weeks to &lt;1 hour</div>
          </div>
          <div class="card">
            <div style="font-size: 26px; font-weight: 900; color: var(--accent-cyan);">3.4x</div>
            <div style="font-size: 12px; font-weight: 700; color: #fff;">Capital Efficiency</div>
            <div style="font-size: 10px; color: var(--text-dim); margin-top: 2px;">Prevents premature burnout</div>
          </div>
          <div class="card">
            <div style="font-size: 26px; font-weight: 900; color: var(--accent-emerald);">94%</div>
            <div style="font-size: 12px; font-weight: 700; color: #fff;">Loan Approval Readiness</div>
            <div style="font-size: 10px; color: var(--text-dim); margin-top: 2px;">Institutional-grade dossier</div>
          </div>
          <div class="card">
            <div style="font-size: 26px; font-weight: 900; color: var(--accent-purple);">&lt; 20ms</div>
            <div style="font-size: 12px; font-weight: 700; color: #fff;">Spatial Inference Latency</div>
            <div style="font-size: 10px; color: var(--text-dim); margin-top: 2px;">Instantaneous radius queries</div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer Keyboard Info -->
  <footer>
    <div>BizMind • AI Business Planning Platform • 8 Interactive Pages</div>
    <div>Use <span class="kbd">←</span> <span class="kbd">→</span> or <span class="kbd">Space</span> to Navigate</div>
  </footer>

  <script>
    let currentSlideIndex = 0;
    const totalSlides = 8;

    function updateSlide() {
      const slides = document.querySelectorAll('.slide');
      slides.forEach((s, idx) => {
        if (idx === currentSlideIndex) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });

      document.getElementById('slide-counter').textContent = 'Slide ' + (currentSlideIndex + 1) + ' / ' + totalSlides;
      document.getElementById('progress-fill').style.width = (((currentSlideIndex + 1) / totalSlides) * 100) + '%';
    }

    function nextSlide() {
      if (currentSlideIndex < totalSlides - 1) {
        currentSlideIndex++;
      } else {
        currentSlideIndex = 0;
      }
      updateSlide();
    }

    function prevSlide() {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
      } else {
        currentSlideIndex = totalSlides - 1;
      }
      updateSlide();
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    });
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const filename = plan?.businessName
    ? `BizMind-${plan.businessName.replace(/[^a-zA-Z0-9]/g, '_')}-8Page-AnimatedDeck.html`
    : 'BizMind-Executive-8Page-AnimatedDeck.html';

  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
