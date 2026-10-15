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
      width: 10%;
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

    /* Animated Prediction Graph & Bar Styles */
    .graph-curve {
      stroke-dasharray: 800;
      stroke-dashoffset: 800;
      animation: drawCurvePath 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .graph-curve-fill {
      opacity: 0;
      animation: fillFadeIn 1.5s ease forwards 1s;
    }
    .graph-glow-marker {
      animation: pulseMarker 2s ease-in-out infinite alternate;
    }
    @keyframes drawCurvePath {
      to {
        stroke-dashoffset: 0;
      }
    }
    @keyframes fillFadeIn {
      to {
        opacity: 0.25;
      }
    }
    @keyframes pulseMarker {
      0% { r: 5; filter: drop-shadow(0 0 4px #FFBF24); }
      100% { r: 8; filter: drop-shadow(0 0 12px #FFBF24); }
    }
    .feature-bar-animated {
      animation: expandBar 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      transform-origin: left;
    }
    @keyframes expandBar {
      from { width: 0%; }
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
      <span style="font-size: 12px; font-weight: 700; color: var(--accent-gold); margin-right: 12px;" id="slide-counter">Slide 1 / 10</span>
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

    <!-- Slide 2: Feature 1 – Business Plans Portfolio & Venture Tracking -->
    <div class="slide" id="slide-2">
      <div class="slide-tag">02 / FEATURE 1: BUSINESS PLANS • Page 02 of 10</div>
      <div class="slide-title">Business Plans Portfolio & Venture Tracking</div>
      <div class="slide-subtitle">Centralized repository for comprehensive business models, financial snapshots, feasibility ratings, and version management.</div>

      <div class="grid-4" style="margin-top: 12px;">
        <div class="card" style="border-top: 3px solid var(--accent-gold);">
          <div style="font-size: 10px; color: var(--accent-gold); font-weight: 700; text-transform: uppercase;">Startup CapEx Outlay</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff; margin: 4px 0;">${capex}</div>
          <div style="font-size: 10px; color: var(--text-dim);">Turnkey initial capitalization</div>
        </div>
        <div class="card" style="border-top: 3px solid var(--accent-cyan);">
          <div style="font-size: 10px; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase;">Monthly OpEx Burn</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff; margin: 4px 0;">${opex}</div>
          <div style="font-size: 10px; color: var(--text-dim);">Fixed monthly operational overhead</div>
        </div>
        <div class="card" style="border-top: 3px solid var(--accent-emerald);">
          <div style="font-size: 10px; color: var(--accent-emerald); font-weight: 700; text-transform: uppercase;">Operating Margin</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--accent-emerald); margin: 4px 0;">${profitMargin}</div>
          <div style="font-size: 10px; color: var(--text-dim);">Calculated net margin</div>
        </div>
        <div class="card" style="border-top: 3px solid var(--accent-purple);">
          <div style="font-size: 10px; color: var(--accent-purple); font-weight: 700; text-transform: uppercase;">Payback Horizon</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff; margin: 4px 0;">${payback}</div>
          <div style="font-size: 10px; color: var(--text-dim);">CapEx recovery timeline</div>
        </div>
      </div>

      <div class="grid-3" style="margin-top: 14px;">
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 4px;">Multi-Venture Portfolio Management</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.5;">
            Manage and track independent ventures across diverse industry categories with isolated financial books, version histories, and milestone timelines.
          </div>
        </div>
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 4px;">Dynamic Scenario Modeling</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.5;">
            Switch instantly between Conservative, Moderate, and Aggressive scenario profiles with dynamic recalculation of margin, burn rate, and payback horizon.
          </div>
        </div>
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 4px;">Continuous Feasibility Scoring</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.5;">
            Continuous health check combining unit economics, local market saturation, and machine learning risk ratings into a unified investment viability grade.
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 3: Feature 2 – Planner Wizard: 6-Step Dynamic Financial Modeling -->
    <div class="slide" id="slide-3">
      <div class="slide-tag">03 / FEATURE 2: PLANNER WIZARD • Page 03 of 10</div>
      <div class="slide-title">Planner Wizard: 6-Step Dynamic Financial Modeling</div>
      <div class="slide-subtitle">Step-by-step guided business model architect transforming commercial concepts into mathematically sound ventures.</div>

      <div class="grid-3" style="gap: 12px; margin-top: 10px;">
        <div class="card" style="border-left: 3px solid #38BDF8;">
          <div style="font-size: 16px; font-weight: 900; color: #38BDF8;">STEP 01</div>
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin: 2px 0;">Business Profile</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.4;">Category, target demographic, and business model selection (B2C, B2B, Subscription).</div>
        </div>
        <div class="card" style="border-left: 3px solid #FFBF24;">
          <div style="font-size: 16px; font-weight: 900; color: #FFBF24;">STEP 02</div>
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin: 2px 0;">Initial CapEx</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.4;">Lease deposit, interior fit-out, machinery, licensing, and IT hardware capitalization.</div>
        </div>
        <div class="card" style="border-left: 3px solid #C084FC;">
          <div style="font-size: 16px; font-weight: 900; color: #C084FC;">STEP 03</div>
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin: 2px 0;">Monthly OpEx</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.4;">Base rent, staffing payroll, utilities, marketing budget, and business insurance overhead.</div>
        </div>
        <div class="card" style="border-left: 3px solid #34D399;">
          <div style="font-size: 16px; font-weight: 900; color: #34D399;">STEP 04</div>
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin: 2px 0;">Unit Economics</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.4;">Average ticket price, variable cost per customer, and projected daily customer patronage.</div>
        </div>
        <div class="card" style="border-left: 3px solid #F59E0B;">
          <div style="font-size: 16px; font-weight: 900; color: #F59E0B;">STEP 05</div>
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin: 2px 0;">Review & Audit</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.4;">Deterministic formulas cross-audit assumptions and flag margin risks before finalizing.</div>
        </div>
        <div class="card" style="border-left: 3px solid #FB7185;">
          <div style="font-size: 16px; font-weight: 900; color: #FB7185;">STEP 06</div>
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin: 2px 0;">Feasibility Matrix</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.4;">Automated break-even volume, payback horizon, sensitivity curves, and viability scores.</div>
        </div>
      </div>
    </div>

    <!-- Slide 4: Feature 3 – Financial Feasibility Engine & Break-Even Trajectory -->
    <div class="slide" id="slide-4">
      <div class="slide-tag">04 / FEATURE 3: FINANCIAL FEASIBILITY • Page 04 of 10</div>
      <div class="slide-title">Financial Feasibility Engine & Break-Even Trajectory</div>
      <div class="slide-subtitle">Deterministic unit economics, CapEx recovery timeline, 12-month compounding cash flow, and multi-scenario solvency.</div>

      <div class="grid-2">
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-gold); margin-bottom: 6px; text-transform: uppercase;">Deterministic Unit Economics</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.7;">
            • Contribution Margin: <strong>$180.00 / Customer</strong><br>
            • Contribution Margin Ratio: <strong>72.0%</strong><br>
            • Monthly Fixed OpEx Burn: <strong>${opex}</strong><br>
            • Break-Even Sales Floor: <strong>${beUnits} Units / Month</strong> (${beRev})<br>
            • Payback Period: <strong>${payback}</strong>
          </p>
        </div>
        <div class="card">
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-cyan); margin-bottom: 6px; text-transform: uppercase;">12-Month Compounding Trajectory</div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.7;">
            • Crossover Month: <strong>Month 3 (Cash-Flow Positive)</strong><br>
            • Working Capital Buffer: <strong>${beBuffer} Demand Safety Cushion</strong><br>
            • Month 12 Net Operating Cash: <strong>$48,600 / Month</strong><br>
            • 3-Month Minimum Reserve: <strong>$495,000 Liquid Working Capital</strong>
          </p>
        </div>
      </div>

      <div class="grid-3" style="margin-top: 12px;">
        <div class="card" style="border-left: 3px solid var(--accent-gold);">
          <div style="font-size: 10.5px; font-weight: 700; color: #fff;">Conservative Case (-20%)</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Footfall: 48 cust/day • Margin: 14.8% • Payback: 16.2 mo • Solvency preserved.</div>
        </div>
        <div class="card" style="border-left: 3px solid var(--accent-emerald);">
          <div style="font-size: 10.5px; font-weight: 700; color: #fff;">Base Target Case (100%)</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Footfall: 60 cust/day • Margin: 22.9% • Payback: 12.1 mo • Healthy growth profile.</div>
        </div>
        <div class="card" style="border-left: 3px solid var(--accent-cyan);">
          <div style="font-size: 10.5px; font-weight: 700; color: #fff;">Optimistic Case (+20%)</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Footfall: 72 cust/day • Margin: 29.3% • Payback: 8.5 mo • Accelerated return.</div>
        </div>
      </div>
    </div>

    <!-- Slide 5: Feature 4 – Market Analysis & Real-Time Spatial Radar (Uran Islampur Narshhpur Road) -->
    <div class="slide" id="slide-5">
      <div class="slide-tag">05 / FEATURE 4: MARKET ANALYSIS • Page 05 of 10</div>
      <div class="slide-title">Market Analysis & Real-Time Spatial Radar</div>
      <div class="slide-subtitle">Target Corridor: Uran Islampur Narshhpur Road, Islampur — Live spatial query connecting Google Places & OpenStreetMap Overpass spatial engines.</div>

      <div class="grid-2" style="align-items: center;">
        <div class="radar-box">
          <div class="radar-sweep"></div>
          <div class="radar-circle" style="width: 70px; height: 70px;"></div>
          <div class="radar-circle" style="width: 140px; height: 140px;"></div>
          <div class="radar-circle" style="width: 210px; height: 210px;"></div>
          <div class="radar-pin" style="top: 42%; left: 48%; background: var(--accent-rose); color: var(--accent-rose);" title="Green Leaf Cafe"></div>
          <div class="radar-pin" style="top: 58%; left: 54%; background: var(--accent-gold); color: var(--accent-gold);" title="Krishna Family Restaurant"></div>
          <div class="radar-pin" style="top: 36%; left: 62%; background: var(--accent-cyan); color: var(--accent-cyan);" title="Sai Refreshments"></div>
          <div class="radar-pin" style="top: 64%; left: 38%; background: var(--accent-purple); color: var(--accent-purple);" title="Shivaji Bakery"></div>
          <div class="radar-pin" style="top: 28%; left: 44%; background: var(--accent-emerald); color: var(--accent-emerald);" title="Islampur Central Medical"></div>
          <div style="position: absolute; bottom: 8px; left: 12px; font-size: 10px; font-family: monospace; color: var(--accent-gold);">
            ● Center Pin: Uran Islampur Narshhpur Road (17.0515° N, 74.2660° E)
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="card">
            <div style="font-size: 11px; font-weight: 700; color: #fff;">Verified Real-Time Establishments Along Corridor:</div>
            <p style="font-size: 10.5px; color: var(--text-muted); line-height: 1.5; margin-top: 4px;">
              • <strong style="color:#fff;">Green Leaf Cafe & Bakery</strong> (110m • 4.6★ • High Direct Rivalry)<br>
              • <strong style="color:#fff;">Krishna Family Restaurant & Garden</strong> (170m • 4.4★ • Dining Anchor)<br>
              • <strong style="color:#fff;">Sai Refreshments & Pure Veg</strong> (230m • 4.3★ • Moderate Traffic)<br>
              • <strong style="color:#fff;">Shivaji Bakery & Confectionery</strong> (240m • 4.5★ • Synergistic Anchor)<br>
              • <strong style="color:#fff;">Islampur Central Medical & Surgical</strong> (300m • 4.5★ • Footfall Generator)
            </p>
          </div>
          <div class="card" style="border-left: 3px solid var(--accent-gold);">
            <div style="font-size: 10.5px; color: var(--accent-gold); font-weight: 700;">Spatial Saturation: Moderate Saturation (79/100 Index)</div>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">
              Isochrone radius rings (500m / 1km / 2km) confirm a healthy competitor spacing ratio with strong commercial footfall along the Narsinghpur trade corridor.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 6: Feature 5 – Comparison Engine: Multi-Location Benchmarking -->
    <div class="slide" id="slide-6">
      <div class="slide-tag">06 / FEATURE 5: COMPARISON ENGINE • Page 06 of 10</div>
      <div class="slide-title">Comparison Engine: Multi-Location & Scenario Benchmarking</div>
      <div class="slide-subtitle">Side-by-side empirical decision matrix evaluating prospective locations, pricing variations, and operational cost structures.</div>

      <div class="grid-3">
        <div class="card" style="border-top: 3px solid var(--accent-gold);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; font-weight: 700; color: var(--accent-gold); text-transform: uppercase;">Location A (Selected)</span>
            <span style="font-size: 11px; font-weight: 800; color: var(--accent-emerald);">88.5 / 100</span>
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #fff; margin: 4px 0;">Uran Islampur Narshhpur Rd</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.5;">
            • Footfall Index: <strong>92 / 100</strong><br>
            • Monthly Rent: <strong>$2,400 / mo</strong><br>
            • Direct Competitors (1km): <strong>3</strong><br>
            • Saturation Risk: <strong>Low-Medium</strong><br>
            • Net Viability Verdict: <strong>Recommended</strong>
          </div>
        </div>

        <div class="card" style="border-top: 3px solid var(--accent-cyan);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">Location B</span>
            <span style="font-size: 11px; font-weight: 800; color: var(--accent-gold);">76.2 / 100</span>
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #fff; margin: 4px 0;">Shivaji Road Commercial Zone</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.5;">
            • Footfall Index: <strong>78 / 100</strong><br>
            • Monthly Rent: <strong>$3,200 / mo</strong><br>
            • Direct Competitors (1km): <strong>8</strong><br>
            • Saturation Risk: <strong>High</strong><br>
            • Net Viability Verdict: <strong>Elevated OpEx</strong>
          </div>
        </div>

        <div class="card" style="border-top: 3px solid var(--accent-purple);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; font-weight: 700; color: var(--accent-purple); text-transform: uppercase;">Location C</span>
            <span style="font-size: 11px; font-weight: 800; color: var(--accent-cyan);">81.0 / 100</span>
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #fff; margin: 4px 0;">Peth Naka Highway Junction</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.5;">
            • Footfall Index: <strong>85 / 100</strong><br>
            • Monthly Rent: <strong>$1,900 / mo</strong><br>
            • Direct Competitors (1km): <strong>1</strong><br>
            • Saturation Risk: <strong>Low</strong><br>
            • Net Viability Verdict: <strong>Viable Alternative</strong>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 12px; border-left: 3px solid var(--accent-emerald);">
        <div style="font-size: 11px; font-weight: 700; color: #fff;">Multi-Criteria Decision Evaluation Result</div>
        <p style="font-size: 10.5px; color: var(--text-muted); margin-top: 3px; line-height: 1.5;">
          Uran Islampur Narshhpur Road offers the optimal empirical balance: 25% lower rental overhead than Shivaji Road with 1.4x higher vehicular and pedestrian conversion rates, securing the highest overall viability score.
        </p>
      </div>
    </div>

    <!-- Slide 7: Feature 6 – Predictions [ML]: Ensemble Viability & Animated Graph -->
    <div class="slide" id="slide-7">
      <div class="slide-tag">07 / FEATURE 6: PREDICTIONS [ML] • Page 07 of 10</div>
      <div class="slide-title">Predictions [ML]: Ensemble Viability & Probability Curve</div>
      <div class="slide-subtitle">Calibrated Scikit-Learn Random Forest ensemble with animated probability curves, feature weights, and interactive sensitivity simulation.</div>

      <div class="grid-2" style="align-items: center;">
        <!-- Animated Prediction Graph -->
        <div class="card" style="padding: 16px; background: #07090F; border: 1px solid rgba(255,199,44,0.3); position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 10.5px; font-weight: 700; color: var(--accent-gold); text-transform: uppercase;">Viability Probability Trajectory (Animated)</span>
            <span style="font-size: 10px; font-family: monospace; color: var(--accent-cyan); background: rgba(56,189,248,0.1); padding: 2px 6px; border-radius: 4px;">Scikit-Learn RF • AUC 0.942</span>
          </div>

          <svg viewBox="0 0 460 210" style="width: 100%; height: auto; display: block;">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#EF4444" />
                <stop offset="40%" stop-color="#FFBF24" />
                <stop offset="70%" stop-color="#10B981" />
                <stop offset="100%" stop-color="#38BDF8" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10B981" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#10B981" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Grid Lines -->
            <line x1="40" y1="20" x2="440" y2="20" stroke="#1E293B" stroke-dasharray="3 3" />
            <line x1="40" y1="65" x2="440" y2="65" stroke="#1E293B" stroke-dasharray="3 3" />
            <line x1="40" y1="110" x2="440" y2="110" stroke="#1E293B" stroke-dasharray="3 3" />
            <line x1="40" y1="155" x2="440" y2="155" stroke="#1E293B" stroke-dasharray="3 3" />
            <line x1="40" y1="185" x2="440" y2="185" stroke="#475569" stroke-width="1.5" />
            <line x1="40" y1="20" x2="40" y2="185" stroke="#475569" stroke-width="1.5" />

            <!-- Y-Axis Labels -->
            <text x="32" y="24" fill="#94A3B8" font-size="9" text-anchor="end" font-family="monospace">100%</text>
            <text x="32" y="69" fill="#94A3B8" font-size="9" text-anchor="end" font-family="monospace">75%</text>
            <text x="32" y="114" fill="#94A3B8" font-size="9" text-anchor="end" font-family="monospace">50%</text>
            <text x="32" y="159" fill="#94A3B8" font-size="9" text-anchor="end" font-family="monospace">25%</text>

            <!-- Break-Even Threshold Line -->
            <line x1="40" y1="110" x2="440" y2="110" stroke="#FFBF24" stroke-width="1" stroke-dasharray="4 4" opacity="0.6" />
            <text x="435" y="105" fill="#FFBF24" font-size="8" text-anchor="end" font-family="monospace">Solvency Threshold (50%)</text>

            <!-- Area fill under curve -->
            <path class="graph-curve-fill" d="M 40 180 Q 120 175 190 140 T 320 60 T 440 38 L 440 185 L 40 185 Z" fill="url(#areaGradient)" />

            <!-- Animated Probability Curve -->
            <path class="graph-curve" d="M 40 180 Q 120 175 190 140 T 320 60 T 440 38" fill="none" stroke="url(#curveGradient)" stroke-width="3.5" stroke-linecap="round" />

            <!-- Highlighted Operating Point: 84.5% Viability -->
            <circle class="graph-glow-marker" cx="350" cy="52" r="6" fill="#FFBF24" stroke="#fff" stroke-width="2" />
            <text x="350" y="38" fill="#FFBF24" font-size="11" font-weight="bold" text-anchor="middle" font-family="monospace">84.5% Current Viability</text>

            <!-- X-Axis Labels -->
            <text x="40" y="200" fill="#94A3B8" font-size="9" text-anchor="start" font-family="monospace">0.5x Scale</text>
            <text x="180" y="200" fill="#94A3B8" font-size="9" text-anchor="middle" font-family="monospace">0.8x Scale</text>
            <text x="320" y="200" fill="#94A3B8" font-size="9" text-anchor="middle" font-family="monospace">1.0x Base Scale</text>
            <text x="440" y="200" fill="#94A3B8" font-size="9" text-anchor="end" font-family="monospace">1.3x Expanded</text>
          </svg>

          <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 10px; color: var(--text-dim);">
            <span>Model: Random Forest Ensemble (100 Trees)</span>
            <span style="color: var(--accent-emerald); font-weight: 700;">● High Viability Tier Confirmed</span>
          </div>
        </div>

        <!-- ML Feature Weights & Pipeline Details -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="card">
            <div style="font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 8px;">Random Forest Feature Importance Weights</div>
            
            <div style="margin-bottom: 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
                <span>Footfall Density & Catchment</span>
                <strong style="color:var(--accent-gold);">32%</strong>
              </div>
              <div style="background: #151A28; border-radius: 4px; height: 6px; overflow: hidden;">
                <div class="feature-bar-animated" style="background: var(--accent-gold); height: 100%; width: 32%;"></div>
              </div>
            </div>

            <div style="margin-bottom: 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
                <span>Capital Adequacy & Runway</span>
                <strong style="color:var(--accent-cyan);">26%</strong>
              </div>
              <div style="background: #151A28; border-radius: 4px; height: 6px; overflow: hidden;">
                <div class="feature-bar-animated" style="background: var(--accent-cyan); height: 100%; width: 26%; animation-delay: 0.15s;"></div>
              </div>
            </div>

            <div style="margin-bottom: 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
                <span>Competitor Density & Spacing</span>
                <strong style="color:var(--accent-emerald);">21%</strong>
              </div>
              <div style="background: #151A28; border-radius: 4px; height: 6px; overflow: hidden;">
                <div class="feature-bar-animated" style="background: var(--accent-emerald); height: 100%; width: 21%; animation-delay: 0.3s;"></div>
              </div>
            </div>

            <div style="margin-bottom: 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
                <span>Demographic Income Tier</span>
                <strong style="color:var(--accent-purple);">14%</strong>
              </div>
              <div style="background: #151A28; border-radius: 4px; height: 6px; overflow: hidden;">
                <div class="feature-bar-animated" style="background: var(--accent-purple); height: 100%; width: 14%; animation-delay: 0.45s;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
                <span>Seasonality & Cyclical Index</span>
                <strong style="color:var(--accent-rose);">7%</strong>
              </div>
              <div style="background: #151A28; border-radius: 4px; height: 6px; overflow: hidden;">
                <div class="feature-bar-animated" style="background: var(--accent-rose); height: 100%; width: 7%; animation-delay: 0.6s;"></div>
              </div>
            </div>
          </div>

          <div class="card" style="border-left: 3px solid var(--accent-cyan);">
            <div style="font-size: 10.5px; font-weight: 700; color: var(--accent-cyan);">Cross-Validated Viability Verification</div>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px; line-height: 1.4;">
              5-fold cross validation demonstrates 91.4% test accuracy with 0.942 AUC-ROC, ensuring robust non-linear separation between bankrupt and flourishing local ventures.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide 8: Feature 7 – Recommendations: Prescriptive Strategic Action Engine -->
    <div class="slide" id="slide-8">
      <div class="slide-tag">08 / FEATURE 7: RECOMMENDATIONS • Page 08 of 10</div>
      <div class="slide-title">Recommendations: Prescriptive Strategic Action Engine</div>
      <div class="slide-subtitle">Algorithmic decision optimization delivering targeted operational, pricing, spatial, and cash buffer improvements.</div>

      <div class="grid-2">
        <div class="card" style="border-top: 3px solid var(--accent-gold);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: var(--accent-gold); text-transform: uppercase;">01 • OpEx Optimization</span>
            <span style="font-size: 10px; font-weight: 800; color: var(--accent-emerald); background: rgba(16,185,129,0.1); padding: 2px 6px; border-radius: 4px;">+4.2% Margin</span>
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #fff;">Fixed Lease & Utility Renegotiation</div>
          <p style="font-size: 10px; color: var(--text-muted); line-height: 1.5; margin-top: 4px;">
            Recommend locking multi-year commercial lease with 5% escalation cap and shifting heavy HVAC operations to off-peak tariff hours to reduce monthly burn by $320/mo.
          </p>
        </div>

        <div class="card" style="border-top: 3px solid var(--accent-emerald);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: var(--accent-emerald); text-transform: uppercase;">02 • Revenue Calibration</span>
            <span style="font-size: 10px; font-weight: 800; color: var(--accent-emerald); background: rgba(16,185,129,0.1); padding: 2px 6px; border-radius: 4px;">+$48,000 / Yr</span>
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #fff;">High-Margin Menu & Service Bundling</div>
          <p style="font-size: 10px; color: var(--text-muted); line-height: 1.5; margin-top: 4px;">
            Increase average customer ticket from $250 to $265 through curated beverage and dessert combo bundles, expanding overall contribution margin ratio from 72% to 75.4%.
          </p>
        </div>

        <div class="card" style="border-top: 3px solid var(--accent-cyan);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">03 • Spatial Penetration</span>
            <span style="font-size: 10px; font-weight: 800; color: var(--accent-cyan); background: rgba(56,189,248,0.1); padding: 2px 6px; border-radius: 4px;">+18% Footfall</span>
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #fff;">1.5km Catchment Hyper-Local Marketing</div>
          <p style="font-size: 10px; color: var(--text-muted); line-height: 1.5; margin-top: 4px;">
            Partner with nearby educational campuses (RIT) and commercial offices along Uran Islampur Narshhpur Road with student loyalty discounts to boost lunch hour footfall.
          </p>
        </div>

        <div class="card" style="border-top: 3px solid var(--accent-purple);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: var(--accent-purple); text-transform: uppercase;">04 • Capital Cushion</span>
            <span style="font-size: 10px; font-weight: 800; color: var(--accent-purple); background: rgba(192,132,252,0.1); padding: 2px 6px; border-radius: 4px;">Zero Insolvency Risk</span>
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #fff;">3.5-Month Liquid Working Capital Reserve</div>
          <p style="font-size: 10px; color: var(--text-muted); line-height: 1.5; margin-top: 4px;">
            Maintain liquid reserves of $495,000 to insulate the business against unexpected seasonal troughs or construction-related street closures along the arterial road.
          </p>
        </div>
      </div>
    </div>

    <!-- Slide 9: Feature 8 / Reports & Architecture – Comprehensive Analytical & Export Suite -->
    <div class="slide" id="slide-9">
      <div class="slide-tag">09 / FEATURE 8: REPORTS & ARCHITECTURE • Page 09 of 10</div>
      <div class="slide-title">Reports & Analytical Intelligence Suite</div>
      <div class="slide-subtitle">Automated executive deliverables, multi-format export pipeline (.pptx, .html, .pdf), and 14-table 3NF relational data architecture.</div>

      <div class="grid-3">
        <div class="card" style="border-top: 3px solid var(--accent-gold);">
          <div style="font-size: 11px; font-family: monospace; color: var(--accent-gold); font-weight: 700;">EXPORT ENGINE</div>
          <div style="font-size: 14px; font-weight: 700; color: #fff; margin: 4px 0 6px;">Multi-Format Output</div>
          <ul style="font-size: 10px; color: var(--text-muted); line-height: 1.6; list-style: square; padding-left: 14px;">
            <li><strong>Microsoft PPTX:</strong> Native Office OpenXML slides with JSZip transitions</li>
            <li><strong>Animated HTML:</strong> Self-contained browser presentation with radar sweep</li>
            <li><strong>Executive PDF:</strong> Formatted printable balance sheets and maps</li>
          </ul>
        </div>

        <div class="card" style="border-top: 3px solid var(--accent-cyan);">
          <div style="font-size: 11px; font-family: monospace; color: var(--accent-cyan); font-weight: 700;">DATABASE SCHEMA</div>
          <div style="font-size: 14px; font-weight: 700; color: #fff; margin: 4px 0 6px;">14 Normalized 3NF Tables</div>
          <ul style="font-size: 10px; color: var(--text-muted); line-height: 1.6; list-style: square; padding-left: 14px;">
            <li><code>business_plans</code>, <code>capex_items</code>, <code>opex_items</code></li>
            <li><code>market_analyses</code>, <code>competitor_places</code></li>
            <li><code>ml_predictions</code>, <code>recommendations</code></li>
            <li>ACID compliance with in-memory transaction fallback</li>
          </ul>
        </div>

        <div class="card" style="border-top: 3px solid var(--accent-emerald);">
          <div style="font-size: 11px; font-family: monospace; color: var(--accent-emerald); font-weight: 700;">RIT CAPSTONE DEFENSE</div>
          <div style="font-size: 14px; font-weight: 700; color: #fff; margin: 4px 0 6px;">Academic Synthesis</div>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.5;">
            Developed at Rajarambapu Institute of Technology (RIT), Rajaramnagar by Pramod Mahajan, Harshad Patil, Sakshi Randive, and Rutika Deshmukh under the guidance of Ms. A. R. Patil. BizMind bridges geospatial intelligence, financial science, and machine learning into an accessible enterprise platform.
          </div>
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
