import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Shield, BookOpen, Layers, Terminal, Sparkles, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <PageHeader
        title="About BizMind Platform"
        description="Final-Year BCA Capstone Project Architecture & Engineering Statement."
        badge="Academic Capstone"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Project Mission & Vision</CardTitle>
            <CardDescription>
              A professional business decision-support system engineered to bring enterprise analytics to small business founders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              BizMind was conceptualized as a multi-tier academic capstone project to answer foundational questions faced by new entrepreneurs: What business category should I select? Where should I locate it? What are the empirical capital requirements? What are the statistical chances of survival?
            </p>
            <p>
              Unlike simple toys or mock interfaces, BizMind enforces rigorous engineering boundaries: clean separation between React presentation, Express API brokering, 3NF MySQL relational database schemas, and Python Scikit-learn predictive modeling services.
            </p>
            <p>
              To ensure cost sustainability and eliminate third-party API dependencies, spatial mapping is built purely on open-source OpenStreetMap and Leaflet architectures without requiring paid proprietary map subscriptions.
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#FFBF24]" />
                <span>Capstone Scope Rules</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-[#A1A1AA]">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <span>Zero IoT devices, ESP32, or sensor dependencies.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <span>Zero reliance on paid Google Maps APIs.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <span>No fake simulated predictive accuracy.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <span>Structured 9-part progressive build delivery.</span>
              </div>
            </CardContent>
          </div>
          <div className="mt-6 pt-4 border-t border-[#27272A] text-[11px] font-mono text-[#FFBF24]">
            Status: Part 1 Architecture Foundation Active
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24] mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <CardTitle>Layered Separation</CardTitle>
            <CardDescription>
              Independent micro-layers for UI, REST API, Database, and Python ML microservice.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24] mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <CardTitle>Academic Rigor</CardTitle>
            <CardDescription>
              Built strictly to capstone software engineering criteria and documented specifications.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24] mb-2">
              <Terminal className="w-5 h-5" />
            </div>
            <CardTitle>Extensible Architecture</CardTitle>
            <CardDescription>
              Prepared with controllers, middleware, and schemas ready for Parts 2 through 9.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
