import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { FileSpreadsheet, MapPin, Calculator, Cpu, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Step 1: Enter Business Requirements',
      desc: 'Define initial parameters including category taxonomy, intended investment capital, target customer persona, and expansion milestones.',
      icon: FileSpreadsheet,
      details: [
        'Select from industry benchmark categories',
        'Set minimum and maximum capital allocation',
        'Define primary operational goals and timeline',
      ],
    },
    {
      num: '02',
      title: 'Step 2: Analyze Location and Market',
      desc: 'Pinpoint geographic coordinates on the interactive OpenStreetMap engine to calculate footfall, demographics, and competitor proximity.',
      icon: MapPin,
      details: [
        'Geospatial boundary and radius zoning',
        'Competitor cluster mapping with price tiers',
        'Area classification (Tier 1, Tier 2, Tier 3)',
      ],
    },
    {
      num: '03',
      title: 'Step 3: Calculate Financial Feasibility',
      desc: 'The deterministic calculation engine models fixed burn rate, variable cost ratios, expected margin, and break-even runway.',
      icon: Calculator,
      details: [
        'Automated fixed vs. variable expense modeling',
        'Projected revenue milestones at 12 & 36 months',
        'Cashflow sensitivity & burn-rate buffer analysis',
      ],
    },
    {
      num: '04',
      title: 'Step 4: Run ML Prediction',
      desc: 'Transmit structured feature vectors to the Python FastAPI microservice where Scikit-learn Random Forest models estimate survival odds.',
      icon: Cpu,
      details: [
        'Input normalization across all 6 core metrics',
        'Ensemble prediction probability calculation',
        'Risk tier categorization (Low, Moderate, High, Critical)',
      ],
    },
    {
      num: '05',
      title: 'Step 5: Receive Comprehensive Recommendation',
      desc: 'Generate executive summary reports with actionable mitigation steps, alternative location suggestions, and capital adjustments.',
      icon: Sparkles,
      details: [
        'Tailored strategic business recommendations',
        'Executive PDF/dossier export ready structure',
        'Ongoing progress tracking in saved opportunities',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="How BizMind Works"
        description="End-to-end analytical workflow guiding your business opportunity evaluation."
        badge="Methodology"
      />

      <div className="space-y-6 mt-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} hoverEffect className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex items-center gap-4 md:flex-col md:items-center">
                  <span className="text-3xl font-extrabold text-[#FFBF24] font-mono">
                    {s.num}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24]">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#F8FAFC]">{s.title}</h3>
                  <p className="text-sm text-[#A1A1AA] mt-1 leading-relaxed">{s.desc}</p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {s.details.map((d, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-lg bg-[#111113] border border-[#27272A] text-xs text-[#F8FAFC] flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFBF24] shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link to="/business-planner">
          <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Start Creating a Plan
          </Button>
        </Link>
      </div>
    </div>
  );
};
