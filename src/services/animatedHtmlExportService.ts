/**
 * BizMind – Standalone Animated HTML Presentation Generator
 * Generates a self-contained, offline-ready animated HTML slide deck
 * with CSS/JS motion effects, vector charts, and keyboard navigation.
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
  <title>${planName} – Interactive Animated Pitch Deck</title>
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
      width: 8.33%;
      transition: width 0.4s ease;
    }

    /* Slide Arena */
    main {
      flex: 1;
      position: relative;
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow-y: auto;
    }

    .slide {
      width: 100%;
      max-width: 1100px;
      display: none;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .slide.active {
      display: flex;
      flex-direction: column;
      opacity: 1;
      transform: translateY(0);
    }

    /* Motion Entrance Keyframes */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.92); }
      70% { transform: scale(1.02); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes barGrow {
      from { width: 0%; }
      to { width: var(--target-width); }
    }

    .slide.active .anim-fade-up {
      animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .slide.active .anim-delay-1 { animation-delay: 0.1s; }
    .slide.active .anim-delay-2 { animation-delay: 0.2s; }
    .slide.active .anim-delay-3 { animation-delay: 0.3s; }
    .slide.active .anim-delay-4 { animation-delay: 0.4s; }

    .slide.active .anim-card {
      animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    /* Slide Typography */
    .pill {
      align-self: flex-start;
      padding: 4px 12px;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid var(--accent-gold);
      color: var(--accent-gold);
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .slide-title { font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 8px; line-height: 1.2; }
    .slide-sub { font-size: 14px; color: var(--text-muted); margin-bottom: 28px; line-height: 1.5; }

    /* Layout Grids */
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; width: 100%; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; width: 100%; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; width: 100%; }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--bg-card-border);
      border-radius: 14px;
      padding: 22px;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .card:hover { transform: translateY(-3px); border-color: rgba(245, 158, 11, 0.5); }
    .card-label { font-size: 10px; font-weight: 700; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 1px; }
    .card-val { font-size: 24px; font-weight: 800; color: #fff; margin-top: 6px; }
    .card-sub { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

    /* Floating Navigation Controls */
    .nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(18, 23, 34, 0.85);
      border: 1px solid var(--bg-card-border);
      color: #fff;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      backdrop-filter: blur(8px);
      transition: all 0.2s ease;
      z-index: 40;
    }
    .nav-arrow:hover { background: #1E2433; border-color: var(--accent-gold); transform: translateY(-50%) scale(1.08); }
    .nav-prev { left: 24px; }
    .nav-next { right: 24px; }

    /* Footer */
    footer {
      background: #080A10;
      border-top: 1px solid var(--bg-card-border);
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--text-dim);
    }
    .slide-counter { font-family: monospace; font-weight: 700; color: var(--accent-gold); }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="brand-icon">B</div>
      <div class="brand-text">
        <h1>${planName}</h1>
        <p>Interactive Animated Pitch Deck</p>
      </div>
    </div>
    <div class="controls">
      <button class="btn" onclick="prevSlide()">← Prev</button>
      <button class="btn" onclick="nextSlide()">Next →</button>
      <button class="btn" onclick="togglePlay()" id="playBtn">▶ Auto</button>
      <button class="btn" onclick="toggleFullscreen()">⛶ Fullscreen</button>
      <button class="btn btn-gold" onclick="window.print()">Print PDF</button>
    </div>
  </header>

  <div class="progress-bar">
    <div class="progress-fill" id="progressFill"></div>
  </div>

  <main>
    <button class="nav-arrow nav-prev" onclick="prevSlide()">❮</button>
    <button class="nav-arrow nav-next" onclick="nextSlide()">❯</button>

    <!-- Slide 1: Cover -->
    <div class="slide active" id="slide-0">
      <div class="pill anim-fade-up">Decision Intelligence Platform</div>
      <h2 class="slide-title anim-fade-up anim-delay-1">${planName}</h2>
      <p class="slide-sub anim-fade-up anim-delay-2">Comprehensive Venture Feasibility, Location Demographics & Unit Economics for ${location}</p>
      <div class="grid-4 anim-fade-up anim-delay-3">
        <div class="card anim-card">
          <div class="card-label">Startup CapEx</div>
          <div class="card-val">${capex}</div>
          <div class="card-sub">Total initial outlay</div>
        </div>
        <div class="card anim-card" style="animation-delay: 0.1s">
          <div class="card-label" style="color: var(--accent-cyan)">Fixed Burn (OpEx)</div>
          <div class="card-val">${opex}</div>
          <div class="card-sub">Monthly recurring overhead</div>
        </div>
        <div class="card anim-card" style="animation-delay: 0.2s">
          <div class="card-label" style="color: var(--accent-emerald)">Projected Net Margin</div>
          <div class="card-val" style="color: var(--accent-emerald)">${profitMargin}</div>
          <div class="card-sub">After all fixed & variable COGS</div>
        </div>
        <div class="card anim-card" style="animation-delay: 0.3s">
          <div class="card-label" style="color: var(--accent-purple)">Payback Timeline</div>
          <div class="card-val">${payback}</div>
          <div class="card-sub">Capital recovery curve</div>
        </div>
      </div>
    </div>

    <!-- Slide 2: CapEx Allocation -->
    <div class="slide" id="slide-1">
      <div class="pill anim-fade-up">CapEx Structure</div>
      <h2 class="slide-title anim-fade-up anim-delay-1">Initial Capital Allocation & Investment Structure</h2>
      <p class="slide-sub anim-fade-up anim-delay-2">Itemized allocation guaranteeing liquidity through the customer acquisition curve</p>
      <div class="grid-3 anim-fade-up anim-delay-3">
        <div class="card anim-card">
          <div class="card-label">Property Deposit & Leases</div>
          <div class="card-val" style="color: var(--accent-gold)">${formatCurrency(plan?.propertyDeposit || 250000)}</div>
          <div class="card-sub">Security deposits & commercial lease bond</div>
        </div>
        <div class="card anim-card" style="animation-delay: 0.1s">
          <div class="card-label" style="color: var(--accent-cyan)">Fit-out & Equipment</div>
          <div class="card-val" style="color: var(--accent-cyan)">${formatCurrency((plan?.interiorSetup || 280000) + (plan?.equipmentCost || 180000))}</div>
          <div class="card-sub">Turnkey interior buildout & commercial machines</div>
        </div>
        <div class="card anim-card" style="animation-delay: 0.2s">
          <div class="card-label" style="color: var(--accent-emerald)">Working Capital Reserve</div>
          <div class="card-val" style="color: var(--accent-emerald)">${formatCurrency((plan?.totalMonthlyFixedExpenses || 165000) * 3)}</div>
          <div class="card-sub">3-month operational burn safety buffer</div>
        </div>
      </div>
    </div>

    <!-- Slide 3: The Problem -->
    <div class="slide" id="slide-2">
      <div class="pill anim-fade-up" style="color: var(--accent-rose); border-color: var(--accent-rose)">Market Need</div>
      <h2 class="slide-title anim-fade-up anim-delay-1">The $1.3T Failure Epidemic: Why 90% of Startups Collapse</h2>
      <p class="slide-sub anim-fade-up anim-delay-2">Preventable blind spots in site selection, capital adequacy, and pricing models</p>
      <div class="grid-2 anim-fade-up anim-delay-3">
        <div class="card anim-card" style="border-color: rgba(244, 63, 94, 0.3)">
          <div style="font-size: 28px; font-weight: 900; color: var(--accent-rose)">42%</div>
          <h3 style="font-size: 15px; margin: 6px 0;">Misjudged Market Demand & Site Saturation</h3>
          <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5">Committing to multi-year leases based on surface foot traffic rather than real competitor density.</p>
        </div>
        <div class="card anim-card" style="border-color: rgba(244, 63, 94, 0.3); animation-delay: 0.15s">
          <div style="font-size: 28px; font-weight: 900; color: var(--accent-rose)">29%</div>
          <h3 style="font-size: 15px; margin: 6px 0;">Premature Cash Depletion</h3>
          <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5">Static spreadsheets fail to model variable COGS spikes, exhausting reserves before break-even.</p>
        </div>
      </div>
    </div>

    <!-- Slide 4: Break-Even Economics -->
    <div class="slide" id="slide-3">
      <div class="pill anim-fade-up">Financial Model</div>
      <h2 class="slide-title anim-fade-up anim-delay-1">Unit Economics & Break-Even Velocity</h2>
      <p class="slide-sub anim-fade-up anim-delay-2">Mathematically sized contribution margins and defensive capacity utilization</p>
      <div class="grid-3 anim-fade-up anim-delay-3">
        <div class="card anim-card">
          <div class="card-label">Break-Even Units</div>
          <div class="card-val" style="color: var(--accent-gold)">${beUnits}</div>
          <div class="card-sub">Monthly sales volume to reach zero loss</div>
        </div>
        <div class="card anim-card" style="animation-delay: 0.1s">
          <div class="card-label" style="color: var(--accent-cyan)">Break-Even Revenue</div>
          <div class="card-val" style="color: var(--accent-cyan)">${beRev}</div>
          <div class="card-sub">Monthly threshold for operational cash neutrality</div>
        </div>
        <div class="card anim-card" style="animation-delay: 0.2s">
          <div class="card-label" style="color: var(--accent-emerald)">Defensive Buffer</div>
          <div class="card-val" style="color: var(--accent-emerald)">${beBuffer} Buffer</div>
          <div class="card-sub">Margin of safety against footfall downturns</div>
        </div>
      </div>
    </div>

    <!-- Slide 5: Strategic Impact -->
    <div class="slide" id="slide-4">
      <div class="pill anim-fade-up">Transformation</div>
      <h2 class="slide-title anim-fade-up anim-delay-1">Quantified Business Impact & Value Realization</h2>
      <p class="slide-sub anim-fade-up anim-delay-2">Measurable efficiency gains delivered to founders, lenders, and investors</p>
      <div class="grid-4 anim-fade-up anim-delay-3">
        <div class="card anim-card">
          <div style="font-size: 32px; font-weight: 900; color: var(--accent-gold)">85%</div>
          <h4 style="font-size: 13px; font-weight: 700; margin: 4px 0;">Planning Time Reduced</h4>
          <p style="font-size: 11px; color: var(--text-muted)">From 3-4 weeks to under an hour.</p>
        </div>
        <div class="card anim-card" style="animation-delay: 0.1s">
          <div style="font-size: 32px; font-weight: 900; color: var(--accent-cyan)">3.4x</div>
          <h4 style="font-size: 13px; font-weight: 700; margin: 4px 0;">Capital Efficiency</h4>
          <p style="font-size: 11px; color: var(--text-muted)">Correctly sized working reserves.</p>
        </div>
        <div class="card anim-card" style="animation-delay: 0.2s">
          <div style="font-size: 32px; font-weight: 900; color: var(--accent-emerald)">94%</div>
          <h4 style="font-size: 13px; font-weight: 700; margin: 4px 0;">Pitch Readiness</h4>
          <p style="font-size: 11px; color: var(--text-muted)">Institutional-grade bank dossiers.</p>
        </div>
        <div class="card anim-card" style="animation-delay: 0.3s">
          <div style="font-size: 32px; font-weight: 900; color: var(--accent-purple)">&lt; 20ms</div>
          <h4 style="font-size: 13px; font-weight: 700; margin: 4px 0;">Inference Latency</h4>
          <p style="font-size: 11px; color: var(--text-muted)">Instantaneous ML & spatial updates.</p>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div>BizMind • Enterprise Decision Intelligence Presentation Deck</div>
    <div>Slide <span class="slide-counter" id="slideNum">1 / 5</span></div>
  </footer>

  <script>
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let autoPlayTimer = null;

    function showSlide(index) {
      if (index >= totalSlides) index = 0;
      if (index < 0) index = totalSlides - 1;
      currentSlide = index;

      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === currentSlide);
      });

      document.getElementById('slideNum').textContent = (currentSlide + 1) + ' / ' + totalSlides;
      document.getElementById('progressFill').style.width = (((currentSlide + 1) / totalSlides) * 100) + '%';
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    function togglePlay() {
      const btn = document.getElementById('playBtn');
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        btn.textContent = '▶ Auto';
      } else {
        autoPlayTimer = setInterval(nextSlide, 5000);
        btn.textContent = '⏸ Pause';
      }
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { nextSlide(); }
      else if (e.key === 'ArrowLeft') { prevSlide(); }
      else if (e.key === 'f' || e.key === 'F') { toggleFullscreen(); }
    });
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const filename = `${planName.replace(/[^a-zA-Z0-9]/g, '_')}-Animated-Slideshow.html`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
