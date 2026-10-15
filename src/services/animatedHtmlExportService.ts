/**
 * BizMind – Standalone Animated HTML Presentation Generator (8 Core Slides)
 * Generates a self-contained, offline-ready animated HTML slide deck
 * with CSS/JS motion effects, vector charts, interactive location radar, and keyboard navigation.
 * Synchronized with the technical architecture of the BizMind platform.
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
  <title>${planName} – Technical Architecture & Feasibility Presentation</title>
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
      z-index: 10;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--accent-gold);
      color: #000;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-text h1 {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }
    .brand-text p {
      font-size: 11px;
      color: var(--text-dim);
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn {
      background: #141824;
      border: 1px solid var(--bg-card-border);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn:hover {
      background: #1A2030;
      color: #fff;
      border-color: var(--text-dim);
    }
    .btn-gold {
      background: var(--accent-gold);
      color: #000;
      border-color: var(--accent-gold);
    }
    .btn-gold:hover {
      background: #e59306;
      color: #000;
    }

    /* Progress Bar */
    .progress-bar {
      height: 3px;
      background: #141824;
      width: 100%;
    }
    .progress-fill {
      height: 100%;
      background: var(--accent-gold);
      width: 12.5%;
      transition: width 0.3s ease;
    }

    /* Main Slide Arena */
    main {
      flex: 1;
      padding: 36px 48px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-y: auto;
    }

    .slide {
      display: none;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.35s ease, transform 0.35s ease;
      height: 100%;
    }
    .slide.active {
      display: flex;
      flex-direction: column;
      justify-content: center;
      opacity: 1;
      transform: translateY(0);
    }

    .slide-tag {
      font-size: 11px;
      font-family: monospace;
      color: var(--accent-gold);
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .slide-title {
      font-size: 28px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    .slide-subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--bg-card-border);
      border-radius: 12px;
      padding: 16px;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: rgba(245, 158, 11, 0.4); }

    /* SVG Donut Chart */
    .donut-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 220px;
    }
    .donut-legend {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-top: 8px;
      font-size: 10px;
      color: var(--text-muted);
    }
    .legend-item { display: flex; align-items: center; gap: 6px; }
    .legend-dot { width: 8px; height: 8px; border-radius: 50%; }

    /* Bar/Line SVG styling */
    .chart-box {
      width: 100%;
      height: 220px;
      background: #0D111A;
      border: 1px solid var(--bg-card-border);
      border-radius: 10px;
      padding: 12px;
    }

    /* Radar Map Simulator */
    .radar-box {
      width: 100%;
      height: 260px;
      background: #0B0E17;
      border: 1px solid var(--bg-card-border);
      border-radius: 12px;
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
      background: conic-gradient(from 0deg, rgba(245, 158, 11, 0.25) 0deg, transparent 60deg);
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
        <h1>BIZMIND PLATFORM ARCHITECTURE</h1>
        <p>AI Business Planning, Micro-Radius Location GIS & ML Success Prediction</p>
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
      <div class="slide-tag">01 / Project Overview • Page 01 of 08</div>
      <div class="slide-title">BIZMIND: AI Business Planning & Location Intelligence</div>
      <div class="slide-subtitle">Plan Smarter. Analyze Better. Build with Confidence. — Empirical decision-support platform for modern business ventures.</div>

      <div class="grid-4" style="margin-top: 12px;">
        <div class="card">
          <div style="font-size: 10px; color: var(--accent-gold); font-weight: 700; text-transform: uppercase;">Startup CapEx Outlay</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff; margin: 4px 0;">${capex}</div>
          <div style="font-size: 10px; color: var(--text-dim);">Turnkey launch capital</div>
        </div>
        <div class="card">
          <div style="font-size: 10px; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase;">Fixed Burn (OpEx)</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff; margin: 4px 0;">${opex}</div>
          <div style="font-size: 10px; color: var(--text-dim);">Recurring monthly overhead</div>
        </div>
        <div class="card">
          <div style="font-size: 10px; color: var(--accent-emerald); font-weight: 700; text-transform: uppercase;">Projected Margin</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--accent-emerald); margin: 4px 0;">${profitMargin}</div>
          <div style="font-size: 10px; color: var(--text-dim);">Net operating return</div>
        </div>
        <div class="card">
          <div style="font-size: 10px; color: var(--accent-purple); font-weight: 700; text-transform: uppercase;">Payback Period</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff; margin: 4px 0;">${payback}</div>
          <div style="font-size: 10px; color: var(--text-dim);">Capital recovery window</div>
        </div>
      </div>

      <div class="grid-4" style="margin-top: 16px;">
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-cyan);">Spatial GIS Radar</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Micro-radius competitor indexing (500m-5km) using Leaflet & OpenStreetMap with 0 API cost.</div>
        </div>
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-gold);">Financial Engine</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Deterministic unit economics, contribution margin, break-even calculus, and 12-month compounding cash curves.</div>
        </div>
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-emerald);">Solvency Stress-Testing</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Multi-scenario sensitivity simulations under market downturn (-20%) and cost inflation (+5%).</div>
        </div>
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-purple);">Predictive ML</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Scikit-Learn Random Forest and Gradient Boosting classifier with automated risk diagnostics.</div>
        </div>
      </div>
    </div>

    <!-- Slide 2: System Architecture & Technical Stack -->
    <div class="slide" id="slide-2">
      <div class="slide-tag">02 / Technical Stack • Page 02 of 08</div>
      <div class="slide-title">Full-Stack Technical Architecture & Monorepo Design</div>
      <div class="slide-subtitle">Decoupled multi-tier architecture delivering high-throughput spatial queries, deterministic math, and ML inference</div>

      <div class="grid-3">
        <div class="card" style="border-top: 3px solid var(--accent-cyan);">
          <div style="font-size: 11px; font-family: monospace; color: var(--accent-cyan); font-weight: 700;">TIER 1: CLIENT SPA</div>
          <div style="font-size: 15px; font-weight: 700; color: #fff; margin: 4px 0 8px;">React 19 + TypeScript</div>
          <ul style="font-size: 11px; color: var(--text-muted); line-height: 1.6; list-style: square; padding-left: 14px;">
            <li>React Router DOM v7 client routing</li>
            <li>Tailwind CSS v4 & Framer Motion transitions</li>
            <li>Leaflet 1.9 GIS container with dark tiles</li>
            <li>Recharts vector visualization charts</li>
          </ul>
        </div>

        <div class="card" style="border-top: 3px solid var(--accent-gold);">
          <div style="font-size: 11px; font-family: monospace; color: var(--accent-gold); font-weight: 700;">TIER 2: API BROKER</div>
          <div style="font-size: 15px; font-weight: 700; color: #fff; margin: 4px 0 8px;">Node.js / Express REST</div>
          <ul style="font-size: 11px; color: var(--text-muted); line-height: 1.6; list-style: square; padding-left: 14px;">
            <li>Central JWT perimeter & role access control</li>
            <li>Deterministic Break-Even & ROI calculation engines</li>
            <li>MySQL 8.0 pool with ACID in-memory fallback</li>
            <li>Request logging and audit telemetry</li>
          </ul>
        </div>

        <div class="card" style="border-top: 3px solid var(--accent-emerald);">
          <div style="font-size: 11px; font-family: monospace; color: var(--accent-emerald); font-weight: 700;">TIER 3: DATA & ML</div>
          <div style="font-size: 15px; font-weight: 700; color: #fff; margin: 4px 0 8px;">Python FastAPI + 3NF MySQL</div>
          <ul style="font-size: 11px; color: var(--text-muted); line-height: 1.6; list-style: square; padding-left: 14px;">
            <li>Python 3.11 FastAPI serving /predict endpoints</li>
            <li>Scikit-Learn Random Forest ensemble pipelines</li>
            <li>14 Normalized 3NF relational tables in MySQL</li>
            <li>Zero-cost Leaflet & OpenStreetMap spatial layer</li>
          </ul>
        </div>
      </div>

      <div class="card" style="margin-top: 16px; border-color: rgba(245, 158, 11, 0.3);">
        <div style="font-size: 11px; color: var(--accent-gold); font-weight: 700;">Core Architecture Principle: Strict Layer Separation</div>
        <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
          The frontend maintains zero business secrets or database credentials. The Express API acts as the secure central broker, orchestrating relational database queries and invoking the isolated Python statistical modeling microservice.
        </p>
      </div>
    </div>

    <!-- Slide 3: Deterministic Financial Feasibility (Donut Chart) -->
    <div class="slide" id="slide-3">
      <div class="slide-tag">03 / Financial Feasibility • Page 03 of 08</div>
      <div class="slide-title">Deterministic Financial Feasibility & Unit Economics Engine</div>
      <div class="slide-subtitle">Mathematical modeling replacing spreadsheets with exact unit economics formulas, break-even calculus, and CapEx sizing</div>

      <div class="grid-2" style="align-items: center;">
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 8px; text-transform: uppercase;">Startup CapEx Allocation</div>
          <div class="donut-container">
            <svg viewBox="0 0 100 100" width="160" height="160">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#FFBF24" stroke-width="16" stroke-dasharray="70 200" stroke-dashoffset="0" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#38BDF8" stroke-width="16" stroke-dasharray="60 200" stroke-dashoffset="-70" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#10B981" stroke-width="16" stroke-dasharray="45 200" stroke-dashoffset="-130" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#A855F7" stroke-width="16" stroke-dasharray="25 200" stroke-dashoffset="-175" />
            </svg>
          </div>
          <div class="donut-legend">
            <div class="legend-item"><span class="legend-dot" style="background:#FFBF24;"></span> Property Deposit (32%)</div>
            <div class="legend-item"><span class="legend-dot" style="background:#38BDF8;"></span> Interior Fitout (35%)</div>
            <div class="legend-item"><span class="legend-dot" style="background:#10B981;"></span> Machinery & Equip (23%)</div>
            <div class="legend-item"><span class="legend-dot" style="background:#A855F7;"></span> Tech & Inventory (10%)</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="card">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 11px; font-weight: 700; color: #fff;">Contribution Margin per Unit</span>
              <span style="font-size: 10px; font-family: monospace; color: var(--accent-gold);">CM = P - V</span>
            </div>
            <div style="font-size: 20px; font-weight: 800; color: var(--accent-gold); margin: 2px 0;">$180.00 / Customer</div>
            <div style="font-size: 10px; color: var(--text-muted);">Net revenue per transaction contributing directly to fixed operational overhead.</div>
          </div>

          <div class="card">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 11px; font-weight: 700; color: #fff;">Break-Even Sales Volume</span>
              <span style="font-size: 10px; font-family: monospace; color: var(--accent-cyan);">Units = Fixed / CM</span>
            </div>
            <div style="font-size: 20px; font-weight: 800; color: var(--accent-cyan); margin: 2px 0;">${beUnits} / Month</div>
            <div style="font-size: 10px; color: var(--text-muted);">Exact volume to clear ${opex} in fixed overhead.</div>
          </div>

          <div class="card">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 11px; font-weight: 700; color: #fff;">Payback Period Horizon</span>
              <span style="font-size: 10px; font-family: monospace; color: var(--accent-emerald);">CapEx / Annual Net Cash</span>
            </div>
            <div style="font-size: 20px; font-weight: 800; color: var(--accent-emerald); margin: 2px 0;">${payback}</div>
            <div style="font-size: 10px; color: var(--text-muted);">Full capital recovery after covering operational overhead and working capital reserves.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 4: 12-Month Cash Flow & Break-Even -->
    <div class="slide" id="slide-4">
      <div class="slide-tag">04 / Cash Flow Trajectory • Page 04 of 08</div>
      <div class="slide-title">12-Month Compounding Cash Flow & Break-Even Trajectory</div>
      <div class="slide-subtitle">Dynamic growth curve visualizing footfall customer ramp-up crossing the operational expense floor</div>

      <div class="grid-2" style="align-items: center;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #fff;">12-Month Cash Curve</span>
            <span style="font-size: 10px; font-family: monospace; color: var(--accent-emerald);">Crossover @ Month 3</span>
          </div>
          <div class="chart-box">
            <svg viewBox="0 0 300 150" width="100%" height="100%">
              <line x1="20" y1="130" x2="280" y2="130" stroke="#1E2433" stroke-width="1"/>
              <line x1="20" y1="80" x2="280" y2="80" stroke="#1E2433" stroke-width="1"/>
              <line x1="20" y1="30" x2="280" y2="30" stroke="#1E2433" stroke-width="1"/>
              <path d="M 20 85 Q 150 82 280 75" fill="none" stroke="#F43F5E" stroke-width="2" stroke-dasharray="4 4" />
              <path d="M 20 115 Q 120 85 280 25" fill="none" stroke="#10B981" stroke-width="3" />
              <circle cx="110" cy="84" r="5" fill="#FFBF24" stroke="#fff" stroke-width="2" />
              <text x="120" y="80" fill="#FFBF24" font-size="9" font-weight="bold">Month 3 Break-Even</text>
            </svg>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="card">
            <div style="font-size: 11px; color: var(--text-muted);">Break-Even Sales Floor</div>
            <div style="font-size: 22px; font-weight: 800; color: var(--accent-gold);">${beRev} / mo</div>
            <div style="font-size: 10px; color: var(--text-dim);">Minimum monthly revenue required to achieve cash-neutrality.</div>
          </div>
          <div class="card">
            <div style="font-size: 11px; color: var(--text-muted);">3-Month Working Capital Runway</div>
            <div style="font-size: 22px; font-weight: 800; color: var(--accent-cyan);">$495,000</div>
            <div style="font-size: 10px; color: var(--text-dim);">Mandatory reserve absorbing footfall ramp-up volatility during M1-M2 launch.</div>
          </div>
          <div class="card">
            <div style="font-size: 11px; color: var(--text-muted);">Capacity Demand Safety Margin</div>
            <div style="font-size: 22px; font-weight: 800; color: var(--accent-emerald);">${beBuffer} Buffer</div>
            <div style="font-size: 10px; color: var(--text-dim);">Protection cushion against temporary pedestrian traffic dips.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 5: Scenario Sensitivity Analysis -->
    <div class="slide" id="slide-5">
      <div class="slide-tag">05 / Sensitivity Analysis • Page 05 of 08</div>
      <div class="slide-title">Solvency Stress-Testing: Multi-Scenario Sensitivity Analysis</div>
      <div class="slide-subtitle">Simulating market downturn (-20% footfall, +5% cost) vs base target and growth expansion cases</div>

      <div class="grid-2" style="align-items: center;">
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 8px;">Revenue vs Expenses vs Profit</div>
          <div class="chart-box">
            <svg viewBox="0 0 300 150" width="100%" height="100%">
              <!-- Conservative Case -->
              <rect x="30" y="50" width="16" height="80" fill="#38BDF8" rx="2" />
              <rect x="50" y="45" width="16" height="85" fill="#F43F5E" rx="2" />
              <rect x="70" y="110" width="16" height="20" fill="#10B981" rx="2" />
              <text x="35" y="145" fill="#94A3B8" font-size="8">Conservative</text>

              <!-- Base Case -->
              <rect x="120" y="30" width="16" height="100" fill="#38BDF8" rx="2" />
              <rect x="140" y="48" width="16" height="82" fill="#F43F5E" rx="2" />
              <rect x="160" y="85" width="16" height="45" fill="#10B981" rx="2" />
              <text x="130" y="145" fill="#94A3B8" font-size="8">Base Target</text>

              <!-- Optimistic Case -->
              <rect x="210" y="15" width="16" height="115" fill="#38BDF8" rx="2" />
              <rect x="230" y="42" width="16" height="88" fill="#F43F5E" rx="2" />
              <rect x="250" y="65" width="16" height="65" fill="#10B981" rx="2" />
              <text x="215" y="145" fill="#94A3B8" font-size="8">Optimistic</text>
            </svg>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="card" style="border-left: 3px solid var(--accent-gold);">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 11px; font-weight: 700; color: #fff;">Conservative Case (-20% Demand)</span>
              <span style="font-size: 9px; font-family: monospace; color: var(--accent-gold);">Solvent</span>
            </div>
            <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Absorbs 20% traffic drop and 5% cost surge. Generates $22.4k/mo profit with zero capital impairment.</p>
          </div>

          <div class="card" style="border-left: 3px solid var(--accent-emerald);">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 11px; font-weight: 700; color: #fff;">Base Target Case</span>
              <span style="font-size: 9px; font-family: monospace; color: var(--accent-emerald);">Target</span>
            </div>
            <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Steady-state operations yield 22.9% net margin ($72.6k/mo profit), recovering full CapEx outlay in 12.1 months.</p>
          </div>

          <div class="card" style="border-left: 3px solid var(--accent-cyan);">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 11px; font-weight: 700; color: #fff;">Optimistic Case (+20% Expansion)</span>
              <span style="font-size: 9px; font-family: monospace; color: var(--accent-cyan);">Growth</span>
            </div>
            <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">High repeat patronage scales net margin to 29.3% ($111.5k/mo), compressing capital payback to 8.5 months.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 6: Geospatial GIS Engine -->
    <div class="slide" id="slide-6">
      <div class="slide-tag">06 / Spatial GIS Engine • Page 06 of 08</div>
      <div class="slide-title">Geospatial GIS Engine & Micro-Radius Competitor Density</div>
      <div class="slide-subtitle">Algorithmic spatial analysis transforming coordinate geography into quantifiable competitive advantages</div>

      <div class="grid-3">
        <div class="card">
          <div style="font-size: 26px; font-weight: 900; color: var(--accent-cyan);">01</div>
          <div style="font-size: 13px; font-weight: 700; color: #fff; margin: 4px 0;">Isochrone Radius Rings</div>
          <div style="font-size: 9px; font-family: monospace; color: var(--accent-gold); background: #0A0D14; padding: 4px; border-radius: 4px; margin-bottom: 6px;">
            Buffers: 500m, 1km, 2km, 5km Radii
          </div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Calculates competitor density across pedestrian walkshed (500m) and vehicular trade area (5km) to model consumer travel friction.</p>
        </div>

        <div class="card">
          <div style="font-size: 26px; font-weight: 900; color: var(--accent-gold);">02</div>
          <div style="font-size: 13px; font-weight: 700; color: #fff; margin: 4px 0;">Competitor Density Calculus</div>
          <div style="font-size: 9px; font-family: monospace; color: var(--accent-gold); background: #0A0D14; padding: 4px; border-radius: 4px; margin-bottom: 6px;">
            Density = Competitors / (π × r²)
          </div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Computes competitor clustering per km². Detects high-density market saturation vs. underserved commercial white-space corridors.</p>
        </div>

        <div class="card">
          <div style="font-size: 26px; font-weight: 900; color: var(--accent-emerald);">03</div>
          <div style="font-size: 13px; font-weight: 700; color: #fff; margin: 4px 0;">Synergy vs Rivalry Scoring</div>
          <div style="font-size: 9px; font-family: monospace; color: var(--accent-gold); background: #0A0D14; padding: 4px; border-radius: 4px; margin-bottom: 6px;">
            Cannibalization vs Footfall Anchors
          </div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">Distinguishes head-to-head rivals splitting market spend from synergistic demand hubs (transit stations, universities, corporate parks).</p>
        </div>
      </div>

      <div class="card" style="margin-top: 16px;">
        <div style="font-size: 11px; color: var(--accent-gold); font-weight: 700;">Spatial Metrics Output:</div>
        <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
          Nearest Competitor Distance (m) &nbsp;•&nbsp; Average Competitor Proximity (km) &nbsp;•&nbsp; Farthest Catchment Boundary &nbsp;•&nbsp; Opportunity Viability Score (0-100)
        </p>
      </div>
    </div>

    <!-- Slide 7: Live Map Demo -->
    <div class="slide" id="slide-7">
      <div class="slide-tag">07 / Live Spatial Demo • Page 07 of 08</div>
      <div class="slide-title">LIVE DEMO: Real-Time Location Intelligence & Spatial Radar</div>
      <div class="slide-subtitle">Interactive geospatial simulator — select hotspot corridors, toggle radius rings, and inspect real-time competitor clustering</div>

      <div class="grid-2" style="align-items: center;">
        <div class="radar-box">
          <div class="radar-sweep"></div>
          <div class="radar-circle" style="width: 70px; height: 70px;"></div>
          <div class="radar-circle" style="width: 140px; height: 140px;"></div>
          <div class="radar-circle" style="width: 210px; height: 210px;"></div>
          <div class="radar-pin" style="top: 40%; left: 45%; background: var(--accent-rose); color: var(--accent-rose);"></div>
          <div class="radar-pin" style="top: 60%; left: 55%; background: var(--accent-gold); color: var(--accent-gold);"></div>
          <div class="radar-pin" style="top: 35%; left: 65%; background: var(--accent-cyan); color: var(--accent-cyan);"></div>
          <div class="radar-pin" style="top: 65%; left: 35%; background: var(--accent-emerald); color: var(--accent-emerald);"></div>
          <div style="position: absolute; bottom: 8px; left: 12px; font-size: 10px; font-family: monospace; color: var(--accent-gold);">
            ● Center Pin: Indiranagar 100ft Road (12.9784° N, 77.6408° E)
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="card">
            <div style="font-size: 11px; font-weight: 700; color: #fff;">Interactive Radar Controls</div>
            <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">In the live web platform, the user can toggle between metro hotspots (Koramangala, Connaught Place, Bandra), adjust radius from 500m to 5km, and click POI pins for real-time rating and threat analysis.</p>
          </div>
          <div class="card" style="border-left: 3px solid var(--accent-gold);">
            <div style="font-size: 11px; color: var(--accent-gold); font-weight: 700;">Live Recalculation Engine</div>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Dynamic competitor density per km², nearest rival distance, and algorithmic opportunity viability score update in sub-20ms.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 8: Machine Learning Viability & Relational Schema -->
    <div class="slide" id="slide-8">
      <div class="slide-tag">08 / ML Pipeline & Schema • Page 08 of 08</div>
      <div class="slide-title">Scikit-Learn ML Viability Pipeline & Relational Data Architecture</div>
      <div class="slide-subtitle">Calibrated predictive modeling, 14-table 3NF MySQL relational database, and end-to-end platform capabilities</div>

      <div class="grid-2">
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 8px;">ML Feature Importance Weights (%)</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted);">
                <span>Commercial Footfall</span><span>32%</span>
              </div>
              <div style="background:#1E2433; height:6px; border-radius:3px; overflow:hidden; margin-top:2px;">
                <div style="background:var(--accent-gold); width:32%; height:100%;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted);">
                <span>Capital Adequacy</span><span>26%</span>
              </div>
              <div style="background:#1E2433; height:6px; border-radius:3px; overflow:hidden; margin-top:2px;">
                <div style="background:var(--accent-cyan); width:26%; height:100%;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted);">
                <span>Competitor Density</span><span>21%</span>
              </div>
              <div style="background:#1E2433; height:6px; border-radius:3px; overflow:hidden; margin-top:2px;">
                <div style="background:var(--accent-emerald); width:21%; height:100%;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted);">
                <span>Demographic Income Tier</span><span>14%</span>
              </div>
              <div style="background:#1E2433; height:6px; border-radius:3px; overflow:hidden; margin-top:2px;">
                <div style="background:var(--accent-purple); width:14%; height:100%;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted);">
                <span>Seasonality Index</span><span>7%</span>
              </div>
              <div style="background:#1E2433; height:6px; border-radius:3px; overflow:hidden; margin-top:2px;">
                <div style="background:var(--accent-rose); width:7%; height:100%;"></div>
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="card">
            <div style="font-size: 11px; font-weight: 700; color: #fff;">14 Relational 3NF MySQL Tables</div>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px; line-height: 1.5;">
              <code>users</code>, <code>business_categories</code>, <code>locations</code>, <code>businesses</code>, <code>market_data</code>, <code>competitors</code>, <code>business_plans</code>, <code>financial_projections</code>, <code>predictions</code>, <code>recommendations</code>, <code>saved_businesses</code>, <code>reviews</code>, <code>notifications</code>, <code>admin_logs</code>.
            </div>
          </div>

          <div class="card" style="border-color: rgba(245, 158, 11, 0.4);">
            <div style="font-size: 11px; color: var(--accent-gold); font-weight: 700;">Capstone Platform Summary</div>
            <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px; line-height: 1.5;">
              BizMind eliminates expensive proprietary Google Maps API billing with 100% open-source spatial GIS (Leaflet + OpenStreetMap), backed by deterministic financial feasibility calculus, multi-venture comparisons, and calibrated Scikit-learn viability ensembles.
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer Navigation Info -->
  <footer>
    <div>BIZMIND  •  AI-Powered Business Planning & Location Intelligence Platform</div>
    <div>Use <span class="kbd">←</span> <span class="kbd">→</span> or <span class="kbd">Space</span> to navigate  •  Press <span class="kbd">F</span> for fullscreen</div>
  </footer>

  <!-- Script for Navigation -->
  <script>
    let currentSlideIndex = 0;
    const totalSlides = 8;
    const slides = document.querySelectorAll('.slide');
    const counter = document.getElementById('slide-counter');
    const progressFill = document.getElementById('progress-fill');

    function showSlide(index) {
      if (index < 0) index = 0;
      if (index >= totalSlides) index = totalSlides - 1;
      currentSlideIndex = index;

      slides.forEach((slide, i) => {
        if (i === currentSlideIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      counter.textContent = 'Slide ' + (currentSlideIndex + 1) + ' / ' + totalSlides;
      progressFill.style.width = ((currentSlideIndex + 1) / totalSlides * 100) + '%';
    }

    function nextSlide() {
      if (currentSlideIndex < totalSlides - 1) {
        showSlide(currentSlideIndex + 1);
      } else {
        showSlide(0);
      }
    }

    function prevSlide() {
      if (currentSlideIndex > 0) {
        showSlide(currentSlideIndex - 1);
      } else {
        showSlide(totalSlides - 1);
      }
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.error(err));
      } else {
        document.exitFullscreen().catch(err => console.error(err));
      }
    }

    document.addEventListener('keydown', (e) => {
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
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = plan?.businessName
    ? `${plan.businessName.toLowerCase().replace(/\s+/g, '_')}_presentation.html`
    : 'bizmind_presentation.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
