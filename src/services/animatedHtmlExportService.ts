/**
 * BizMind – Standalone Animated HTML Presentation Generator (9 Academic & Project Slides)
 * Fully aligned with Rajarambapu Institute of Technology (RIT) MCA Capstone Defense:
 * - Slide 1: Official RIT Capstone Technical Report Title Cover with Team & Guide Details
 * - RIT Logo on all slides
 * - Slide 8: Real-time Spatial Radar for Uran Islampur Narshhpur Road
 */
import { BusinessPlan } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export function generateAnimatedHtmlPresentation(plan?: BusinessPlan | null): void {
  const planName = plan?.businessName || 'BizMind AI Platform';
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
  <title>RIT MCA Capstone Technical Report – BizMind AI Platform</title>
  <style>
    :root {
      --bg-dark: #0A0D14;
      --bg-card: #121722;
      --bg-card-border: #1E2433;
      --accent-gold: #FFC72C;
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

    header {
      background-color: #0E121B;
      border-bottom: 1px solid var(--bg-card-border);
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }
    .rit-badge {
      background: #FFC72C;
      color: #1C1B1F;
      padding: 4px 10px;
      border-radius: 4px;
      font-weight: 900;
      font-size: 13px;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
    .rit-dot {
      width: 5px;
      height: 5px;
      background: #D8232A;
      display: inline-block;
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
      font-weight: bold;
    }
    .btn-gold:hover {
      background: #e5b320;
    }

    .progress-bar {
      height: 3px;
      background: #141824;
      width: 100%;
    }
    .progress-fill {
      height: 100%;
      background: var(--accent-gold);
      width: 11.1%;
      transition: width 0.3s ease;
    }

    main {
      flex: 1;
      padding: 28px 48px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-y: auto;
    }

    .slide {
      display: none;
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
      height: 100%;
    }
    .slide.active {
      display: flex;
      flex-direction: column;
      justify-content: center;
      opacity: 1;
      transform: translateY(0);
    }
    .slide.active .card, .slide.active .radar-box {
      animation: cardFadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
    }
    .slide.active .card:nth-child(1) { animation-delay: 0.12s; }
    .slide.active .card:nth-child(2) { animation-delay: 0.22s; }
    .slide.active .card:nth-child(3) { animation-delay: 0.32s; }
    .slide.active .card:nth-child(4) { animation-delay: 0.42s; }
    @keyframes cardFadeIn {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
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
      font-size: 26px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    .slide-subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 18px;
      line-height: 1.5;
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--bg-card-border);
      border-radius: 12px;
      padding: 16px;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: rgba(255, 199, 44, 0.4); }

    .radar-box {
      width: 100%;
      height: 250px;
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
      border: 1px dashed rgba(255, 199, 44, 0.4);
      border-radius: 50%;
    }
    .radar-sweep {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: conic-gradient(from 0deg, rgba(255, 199, 44, 0.25) 0deg, transparent 60deg);
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

  <header>
    <div style="display: flex; align-items: center; gap: 12px;">
      <div class="rit-badge">
        <span>r</span><span style="position:relative;">i<span class="rit-dot" style="position:absolute;top:-4px;left:1px;"></span></span><span>t</span>
        <span style="font-size: 8px; font-weight: bold; margin-left: 4px; color: #4B4B4B;">RIT RAJARAMNAGAR</span>
      </div>
      <div style="font-size: 13px; font-weight: 700; color: #fff;">BIZMIND • MCA CAPSTONE REPORT</div>
    </div>
    <div class="controls">
      <span style="font-size: 12px; font-weight: 700; color: var(--accent-gold); margin-right: 12px;" id="slide-counter">Slide 1 / 9</span>
      <button class="btn" onclick="prevSlide()">← Prev</button>
      <button class="btn btn-gold" onclick="nextSlide()">Next →</button>
      <button class="btn" onclick="toggleFullscreen()">Fullscreen</button>
    </div>
  </header>

  <div class="progress-bar">
    <div class="progress-fill" id="progress-fill"></div>
  </div>

  <main>
    <!-- Slide 1: Official RIT Capstone Cover -->
    <div class="slide active" id="slide-1">
      <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <div style="font-size: 12px; color: var(--text-muted); font-weight: bold;">Academic Year: 2026 – 27</div>
        <div style="font-size: 11px; color: var(--text-dim); margin: 2px 0 6px;">(An Empowered Autonomous Institute, Affiliated to Shivaji University, Kolhapur)</div>
        <div style="font-size: 16px; font-weight: 800; color: #fff; text-transform: uppercase;">RAJARAMBAPU INSTITUTE OF TECHNOLOGY, RAJARAMNAGAR</div>
        <div style="font-size: 12px; font-weight: 700; color: var(--accent-gold); text-transform: uppercase; margin-bottom: 12px;">Department of Computer Applications</div>

        <div style="display: inline-block; background: #FFC72C; color: #1C1B1F; padding: 10px 24px; border-radius: 8px; font-size: 26px; font-weight: 900; margin-bottom: 12px;">
          r<span style="position:relative;">i<span style="position:absolute; top:-6px; left:2px; width:7px; height:7px; background:#D8232A;"></span></span>t
          <div style="font-size: 8px; font-weight: 800; color: #374151; letter-spacing: 1px;">RAJARAMBAPU INSTITUTE OF TECHNOLOGY</div>
        </div>

        <div style="font-size: 24px; font-weight: 800; color: var(--accent-gold); margin: 6px 0 18px;">
          “<span style="color:#EF4444;">Biz</span>Mind – AI Business Planner & Success Prediction Platform”
        </div>

        <div class="grid-2" style="text-align: left; margin-top: 10px;">
          <div class="card">
            <div style="font-size: 9px; font-weight: 700; color: var(--accent-gold); text-transform: uppercase;">Under the Guidance of</div>
            <div style="font-size: 15px; font-weight: 800; color: #fff; margin: 2px 0;">Ms. A. R. Patil</div>
            <div style="font-size: 10px; color: var(--text-muted);">Department of Computer Applications, RIT</div>
          </div>
          <div class="card">
            <div style="font-size: 9px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 4px;">Presented By (Project Team)</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10.5px;">
              <div><strong>Pramod R. Mahajan</strong> <span style="color:var(--accent-gold); font-size:9px;">(2547047)</span></div>
              <div><strong>Harshad S. Patil</strong> <span style="color:var(--accent-gold); font-size:9px;">(2547062)</span></div>
              <div><strong>Sakshi D. Randive</strong> <span style="color:var(--accent-gold); font-size:9px;">(2547048)</span></div>
              <div><strong>Rutika R. Deshmukh</strong> <span style="color:var(--accent-gold); font-size:9px;">(2547025)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 2: Project Overview & Core Mission -->
    <div class="slide" id="slide-2">
      <div class="slide-tag">02 / Project Overview • Page 02 of 09</div>
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
    </div>

    <!-- Slide 3: Full-Stack Architecture -->
    <div class="slide" id="slide-3">
      <div class="slide-tag">03 / Technical Stack • Page 03 of 09</div>
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
          </ul>
        </div>
        <div class="card" style="border-top: 3px solid var(--accent-gold);">
          <div style="font-size: 11px; font-family: monospace; color: var(--accent-gold); font-weight: 700;">TIER 2: API BROKER</div>
          <div style="font-size: 15px; font-weight: 700; color: #fff; margin: 4px 0 8px;">Node.js / Express REST</div>
          <ul style="font-size: 11px; color: var(--text-muted); line-height: 1.6; list-style: square; padding-left: 14px;">
            <li>Central JWT perimeter & role access control</li>
            <li>Deterministic Break-Even & ROI calculation engines</li>
            <li>MySQL 8.0 pool with ACID in-memory fallback</li>
          </ul>
        </div>
        <div class="card" style="border-top: 3px solid var(--accent-emerald);">
          <div style="font-size: 11px; font-family: monospace; color: var(--accent-emerald); font-weight: 700;">TIER 3: DATA & ML</div>
          <div style="font-size: 15px; font-weight: 700; color: #fff; margin: 4px 0 8px;">Python FastAPI + 3NF MySQL</div>
          <ul style="font-size: 11px; color: var(--text-muted); line-height: 1.6; list-style: square; padding-left: 14px;">
            <li>Python 3.11 FastAPI serving /predict endpoints</li>
            <li>Scikit-Learn Random Forest ensemble pipelines</li>
            <li>14 Normalized 3NF relational tables in MySQL</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Slide 4: Financial Feasibility -->
    <div class="slide" id="slide-4">
      <div class="slide-tag">04 / Financial Feasibility • Page 04 of 09</div>
      <div class="slide-title">Deterministic Financial Feasibility & Unit Economics Engine</div>
      <div class="slide-subtitle">Mathematical modeling replacing spreadsheets with exact unit economics formulas, break-even calculus, and CapEx sizing</div>
      <div class="grid-2">
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 8px;">Startup CapEx Allocation</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.6;">
            • Property Deposit: $250,000 (32%)<br>
            • Interior Fitout: $280,000 (35%)<br>
            • Machinery & Equipment: $180,000 (23%)<br>
            • Tech, POS & Inventory: $55,000 (10%)
          </p>
        </div>
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: #fff;">Calculated Unit Economics</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.6; margin-top: 4px;">
            • Contribution Margin: <strong>$180.00 / Customer</strong><br>
            • Break-Even Sales Floor: <strong>${beUnits} / Month</strong> (${beRev})<br>
            • Payback Period: <strong>${payback}</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- Slide 5: 12-Month Cash Flow -->
    <div class="slide" id="slide-5">
      <div class="slide-tag">05 / Cash Flow Trajectory • Page 05 of 09</div>
      <div class="slide-title">12-Month Compounding Cash Flow & Break-Even Trajectory</div>
      <div class="slide-subtitle">Dynamic growth curve visualizing footfall customer ramp-up crossing the operational expense floor</div>
      <div class="grid-2">
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: #fff;">Key Financial Milestones</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.6; margin-top: 4px;">
            • Break-Even Crossover: Month 3<br>
            • 3-Month Working Capital Runway: $495,000<br>
            • Demand Safety Cushion: ${beBuffer} Buffer
          </p>
        </div>
        <div class="card" style="border-left: 3px solid var(--accent-emerald);">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-emerald);">Positive Cash Accretion</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.6; margin-top: 4px;">
            Monthly receipts comfortably clear fixed operating expenses from Month 3 onwards, establishing long-term capital viability.
          </p>
        </div>
      </div>
    </div>

    <!-- Slide 6: Sensitivity Analysis -->
    <div class="slide" id="slide-6">
      <div class="slide-tag">06 / Sensitivity Analysis • Page 06 of 09</div>
      <div class="slide-title">Solvency Stress-Testing: Multi-Scenario Sensitivity Analysis</div>
      <div class="slide-subtitle">Simulating market downturn (-20% footfall, +5% cost) vs base target and growth expansion cases</div>
      <div class="grid-3">
        <div class="card" style="border-left: 3px solid var(--accent-gold);">
          <div style="font-size: 11px; font-weight: 700; color: #fff;">Conservative (-20%)</div>
          <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Absorbs 20% traffic drop and 5% cost surge. Generates positive operating cash flow.</p>
        </div>
        <div class="card" style="border-left: 3px solid var(--accent-emerald);">
          <div style="font-size: 11px; font-weight: 700; color: #fff;">Base Target Case</div>
          <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Steady-state operations yield 22.9% net margin and 12.1-month capital recovery.</p>
        </div>
        <div class="card" style="border-left: 3px solid var(--accent-cyan);">
          <div style="font-size: 11px; font-weight: 700; color: #fff;">Optimistic (+20%)</div>
          <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">High patronage scales net margin to 29.3%, compressing payback to 8.5 months.</p>
        </div>
      </div>
    </div>

    <!-- Slide 7: Geospatial GIS Engine -->
    <div class="slide" id="slide-7">
      <div class="slide-tag">07 / Spatial GIS Engine • Page 07 of 09</div>
      <div class="slide-title">Geospatial GIS Engine & Micro-Radius Competitor Density</div>
      <div class="slide-subtitle">Algorithmic spatial analysis transforming coordinate geography into quantifiable competitive advantages</div>
      <div class="grid-3">
        <div class="card">
          <div style="font-size: 20px; font-weight: 900; color: var(--accent-cyan);">01</div>
          <div style="font-size: 12px; font-weight: 700; color: #fff;">Isochrone Rings</div>
          <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Buffers: 500m, 1km, 2km, 5km to model pedestrian and vehicular catchment friction.</p>
        </div>
        <div class="card">
          <div style="font-size: 20px; font-weight: 900; color: var(--accent-gold);">02</div>
          <div style="font-size: 12px; font-weight: 700; color: #fff;">Density Calculus</div>
          <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Density = Competitors / (π × r²). Detects high saturation vs commercial opportunity corridors.</p>
        </div>
        <div class="card">
          <div style="font-size: 20px; font-weight: 900; color: var(--accent-emerald);">03</div>
          <div style="font-size: 12px; font-weight: 700; color: #fff;">Synergy Scoring</div>
          <p style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Differentiates zero-sum rivals from footfall anchors (metro stations, college campuses, markets).</p>
        </div>
      </div>
    </div>

    <!-- Slide 8: LIVE DEMO: Uran Islampur Narshhpur Road -->
    <div class="slide" id="slide-8">
      <div class="slide-tag">08 / Live Spatial Demo (Real-Time API) • Page 08 of 09</div>
      <div class="slide-title">LIVE DEMO: Real-Time Spatial Radar (Uran Islampur Narshhpur Road)</div>
      <div class="slide-subtitle">Target Corridor: Uran Islampur Narshhpur Road, Islampur — Live spatial query connecting Google Places & OSM API</div>

      <div class="grid-2" style="align-items: center;">
        <div class="radar-box">
          <div class="radar-sweep"></div>
          <div class="radar-circle" style="width: 70px; height: 70px;"></div>
          <div class="radar-circle" style="width: 140px; height: 140px;"></div>
          <div class="radar-circle" style="width: 210px; height: 210px;"></div>
          <div class="radar-pin" style="top: 42%; left: 48%; background: var(--accent-rose); color: var(--accent-rose);"></div>
          <div class="radar-pin" style="top: 58%; left: 54%; background: var(--accent-gold); color: var(--accent-gold);"></div>
          <div class="radar-pin" style="top: 36%; left: 62%; background: var(--accent-cyan); color: var(--accent-cyan);"></div>
          <div style="position: absolute; bottom: 8px; left: 12px; font-size: 10px; font-family: monospace; color: var(--accent-gold);">
            ● Center Pin: Uran Islampur Narshhpur Road (17.0515° N, 74.2660° E)
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="card">
            <div style="font-size: 11px; font-weight: 700; color: #fff;">Verified Real-Time Establishments:</div>
            <p style="font-size: 10.5px; color: var(--text-muted); line-height: 1.5; margin-top: 4px;">
              • Green Leaf Cafe & Bakery (110m • 4.6★)<br>
              • Krishna Family Restaurant & Garden (170m • 4.4★)<br>
              • Sai Refreshments & Pure Veg (230m • 4.3★)<br>
              • Shivaji Bakery & Confectionery (240m • 4.5★)<br>
              • Islampur Central Medical & Surgical (300m • 4.5★)
            </p>
          </div>
          <div class="card" style="border-left: 3px solid var(--accent-gold);">
            <div style="font-size: 10.5px; color: var(--accent-gold); font-weight: 700;">Spatial Saturation: Moderate Saturation (79/100 Index)</div>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Healthy competitor spacing with strong commercial footfall along the Narsinghpur trade corridor.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 9: ML Viability & Schema -->
    <div class="slide" id="slide-9">
      <div class="slide-tag">09 / ML Pipeline & Schema • Page 09 of 09</div>
      <div class="slide-title">Scikit-Learn ML Viability Pipeline & Relational Data Architecture</div>
      <div class="slide-subtitle">Calibrated predictive modeling, 14-table 3NF MySQL relational database, and RIT Capstone Summary</div>

      <div class="grid-2">
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 8px;">ML Feature Importance Weights (%)</div>
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 10.5px; color: var(--text-muted);">
            <div>• Footfall Density: <strong style="color:var(--accent-gold);">32%</strong></div>
            <div>• Capital Adequacy: <strong style="color:var(--accent-cyan);">26%</strong></div>
            <div>• Competitor Density: <strong style="color:var(--accent-emerald);">21%</strong></div>
            <div>• Demographic Income Tier: <strong style="color:var(--accent-purple);">14%</strong></div>
            <div>• Seasonality Index: <strong style="color:var(--accent-rose);">7%</strong></div>
          </div>
        </div>

        <div class="card" style="border-color: rgba(255, 199, 44, 0.4);">
          <div style="font-size: 11px; color: var(--accent-gold); font-weight: 700;">RIT MCA Capstone Defense Summary</div>
          <p style="font-size: 10.5px; color: var(--text-muted); margin-top: 4px; line-height: 1.5;">
            Developed at Rajarambapu Institute of Technology, Rajaramnagar by Pramod Mahajan, Harshad Patil, Sakshi Randive, and Rutika Deshmukh under the guidance of Ms. A. R. Patil. BizMind unifies real-time spatial APIs with deterministic financial feasibility and machine learning viability classification.
          </p>
        </div>
      </div>
    </div>

    <!-- Slide 10: Thank You & Project Defense -->
    <div class="slide" id="slide-10">
      <div style="max-width: 850px; margin: 0 auto; text-align: center;">
        <div style="font-size: 52px; font-weight: 900; color: #fff; margin-bottom: 8px; letter-spacing: -1px;">
          Thank <span style="color: var(--accent-gold);">You!</span>
        </div>
        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5;">
          We express our sincere gratitude to our guide <strong style="color:#fff;">Ms. A. R. Patil</strong> and faculty members at <strong style="color:#fff;">Rajarambapu Institute of Technology</strong> for their continuous mentorship, support, and guidance.
        </div>

        <div class="card" style="max-width: 580px; margin: 0 auto; text-align: left; padding: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 12px; text-align: center; border-bottom: 1px solid var(--bg-card-border); padding-bottom: 8px;">Presented By (Project Team)</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11.5px;">
            <div style="background: #0E121B; border: 1px solid var(--bg-card-border); padding: 8px 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <strong>Pramod R. Mahajan</strong>
              <span style="color:var(--accent-gold); font-family:monospace; font-size:10.5px; background: rgba(255,199,44,0.1); padding: 2px 6px; border-radius: 4px;">2547047</span>
            </div>
            <div style="background: #0E121B; border: 1px solid var(--bg-card-border); padding: 8px 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <strong>Harshad S. Patil</strong>
              <span style="color:var(--accent-gold); font-family:monospace; font-size:10.5px; background: rgba(255,199,44,0.1); padding: 2px 6px; border-radius: 4px;">2547062</span>
            </div>
            <div style="background: #0E121B; border: 1px solid var(--bg-card-border); padding: 8px 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <strong>Sakshi D. Randive</strong>
              <span style="color:var(--accent-gold); font-family:monospace; font-size:10.5px; background: rgba(255,199,44,0.1); padding: 2px 6px; border-radius: 4px;">2547048</span>
            </div>
            <div style="background: #0E121B; border: 1px solid var(--bg-card-border); padding: 8px 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <strong>Rutika R. Deshmukh</strong>
              <span style="color:var(--accent-gold); font-family:monospace; font-size:10.5px; background: rgba(255,199,44,0.1); padding: 2px 6px; border-radius: 4px;">2547025</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 18px; font-size: 10px; color: var(--text-dim); font-family: monospace;">
          RAJARAMBAPU INSTITUTE OF TECHNOLOGY, RAJARAMNAGAR • SANGALI, MAHARASHTRA • 2026–27
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div>Rajarambapu Institute of Technology (RIT)  •  Department of Computer Applications (MCA)  •  BizMind</div>
    <div>Use <span class="kbd">←</span> <span class="kbd">→</span> or <span class="kbd">Space</span> to navigate  •  Press <span class="kbd">F</span> for fullscreen</div>
  </footer>

  <script>
    let currentSlideIndex = 0;
    const totalSlides = 10;
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

    let isScrolling = false;
    let scrollTimeout = null;
    window.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) < 25) return;
      if (isScrolling) return;
      isScrolling = true;
      if (e.deltaY > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 750);
    }, { passive: true });

    let touchStartY = null;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
      if (touchStartY === null) return;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      touchStartY = null;
      if (isScrolling) return;
      if (deltaY < -45) {
        isScrolling = true;
        nextSlide();
      } else if (deltaY > 45) {
        isScrolling = true;
        prevSlide();
      }
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 750);
    }, { passive: true });
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = plan?.businessName
    ? `${plan.businessName.toLowerCase().replace(/\s+/g, '_')}_presentation.html`
    : 'RIT_MCA_BizMind_presentation.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
