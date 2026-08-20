# BIZMIND – AI Business Planning, Market Analysis & Success Prediction Platform

> **Tagline**: *"Plan Smarter. Analyze Better. Build with Confidence."*

BizMind is an AI-powered business decision-support platform designed to help aspiring entrepreneurs, financial analysts, and small business founders evaluate commercial opportunities before deploying real capital.

---

## 1. Project Overview & Problem Statement

### Problem Statement
Over 60% of newly launched businesses fail within their first three years due to critical, preventable oversights:
1. **Poor Location Selection**: Choosing commercial locations without footfall or demographic density analysis.
2. **Unnoticed Competitor Saturation**: Entering hyper-saturated markets without differentiation.
3. **Flawed Investment & Burn Estimation**: Underestimating working capital required before reaching cashflow break-even.
4. **Lack of Market Information**: Relying on intuition rather than localized demand indices and CAGR trends.
5. **Inability to Predict Survival Probability**: Lacking multi-factor statistical models to score business viability.

### Objectives
BizMind unifies business planning, financial feasibility, geospatial location intelligence, and predictive machine learning into a single modular platform:
- **What type of business should I start?** (Industry category benchmarks)
- **Which location may be suitable?** (Leaflet & OpenStreetMap spatial analysis)
- **What is the estimated investment?** (Fixed vs. variable cost modeling)
- **What could be the expected revenue & profit?** (Break-even and ROI calculations)
- **How competitive is the selected market?** (Competitor saturation scoring)
- **What is the predicted success probability?** (Scikit-learn ML classification)
- **What are the major business risks?** (Multi-factor vulnerability diagnostics)
- **Which option is better among multiple choices?** (Side-by-side comparative matrix)

> **Architectural Note**: This project is built without IoT devices or paid proprietary Google Maps APIs, utilizing 100% open-source spatial GIS infrastructure (Leaflet + OpenStreetMap).

---

## 2. Monorepo Folder Structure

```
BizMind/
│
├── frontend/ (src/)
│   ├── components/
│   │   ├── common/             # Button, Card, Badge, Modal, Input, Select, Textarea, Loading, Empty, Error, StatCard, PageHeader, ChartContainer
│   │   ├── map/                # MapView (Leaflet + OpenStreetMap container)
│   │   └── navigation/         # Navbar, Sidebar, TopBar, Footer
│   ├── layouts/                # PublicLayout, DashboardLayout
│   ├── pages/
│   │   ├── public/             # Home, Features, HowItWorks, About, Contact, Login, Register
│   │   └── dashboard/          # Overview, BusinessPlanner, MarketAnalysis, LocationAnalysis, Comparison, Predictions, Recommendations, Saved, Reports, Settings, Admin
│   ├── services/               # Axios API client, HealthService
│   ├── types/                  # TypeScript interfaces (User, Business, Location, Prediction, etc.)
│   └── utils/                  # Currency, percentage, and date formatters
│
├── backend/
│   ├── src/
│   │   ├── config/             # env.ts, database.ts (MySQL pool configuration)
│   │   ├── controllers/        # health, auth, business, market, location, plan, prediction, report, admin controllers
│   │   ├── middleware/         # errorHandler, notFound, requestLogger
│   │   ├── routes/             # REST route groups (/api/health, /api/auth, /api/businesses, etc.)
│   │   ├── services/           # ML client interface, DB service
│   │   ├── utils/              # apiResponse, logger
│   │   └── app.ts              # Express application setup
│
├── ml/
│   ├── data/                   # Raw & processed training datasets
│   ├── models/                 # Serialized Joblib model artifacts
│   ├── notebooks/              # Exploratory data analysis notebooks
│   ├── src/
│   │   ├── main.py             # FastAPI microservice entry point
│   │   ├── predictor.py        # Scikit-learn inference pipeline wrapper
│   │   └── requirements.txt    # Python dependencies
│   └── README.md
│
├── database/
│   ├── schema/
│   │   ├── schema.sql          # 14 Relational 3NF MySQL tables with foreign keys and indexes
│   │   └── ERD_DOCUMENTATION.md# Entity relationship design
│   └── seed/                   # Seeding guidelines
│
├── docs/
│   ├── ARCHITECTURE.md         # System design and layer separation
│   ├── DATABASE_DESIGN.md      # Relational data dictionary
│   └── API_SPECIFICATION.md    # REST API endpoints
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React, Recharts, Leaflet 1.9, OpenStreetMap
- **Backend**: Node.js, Express.js (REST API architecture)
- **Database**: MySQL 8.0+ (14 relational tables in 3NF)
- **Machine Learning**: Python 3.11+, Pandas, NumPy, Scikit-learn, Joblib, FastAPI, Uvicorn
- **Maps**: Leaflet + OpenStreetMap (Zero paid API dependency)

---

## 4. How to Run the Project

### Prerequisites
- Node.js 20+ & npm
- Python 3.10+ & pip (for ML microservice)
- MySQL Server 8.0+

### Environment Setup
Copy the environment template:
```bash
cp .env.example .env
```

### 1. Running the Full-Stack Web Application (Frontend + Express API)
```bash
npm install
npm run dev
```
The application will be running at `http://localhost:3000`.
- Web UI: `http://localhost:3000`
- API Health Status: `http://localhost:3000/api/health`

### 2. Running the Python Machine Learning Service
```bash
cd ml
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r src/requirements.txt
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```
ML API Docs: `http://localhost:8000/docs`

---

## 5. 9-Part Capstone Roadmap

- **✓ Part 1: Architecture, Monorepo, Database Design, Map Foundation & UI Shell** (Completed)
- **Part 2: User Authentication & Business Planner Module**
- **Part 3: Market Intelligence & Deterministic Financial Projections**
- **Part 4: Leaflet / OpenStreetMap Spatial Competitor Density Engine**
- **Part 5: Python FastAPI & Scikit-Learn Model Training & Inference**
- **Part 6: Risk Diagnostics & Recommendation Synthesis Engine**
- **Part 7: Multi-Venture Comparison Decision Matrix**
- **Part 8: Feasibility Dossier & Executive Report Generation**
- **Part 9: Admin Oversight, Telemetry & Final Defense Polishing**

---

## 6. Project & Academic Attribution Placeholders

- **Project Title**: BIZMIND – AI Business Planning, Market Analysis & Success Prediction Platform
- **Academic Degree**: Bachelor of Computer Applications (BCA) Capstone Project
- **Academic Year**: Final Year (2025–2026)
- **Project Team Members**: `[Insert Student Names & Register Numbers Here]`
- **Project Supervisor**: `[Insert Faculty Guide / Department Supervisor Name Here]`
- **Institution**: `[Insert College / University Name Here]`
