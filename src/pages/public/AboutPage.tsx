import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { ExpandableText } from '../../components/common/ExpandableText';
import { Shield, BookOpen, Layers, Terminal, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <PageHeader
        title="About BizMind Platform"
        description="Enterprise Architecture & Applied AI Decision-Support Platform."
        badge="Platform Architecture"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Platform Mission & Vision</CardTitle>
            <CardDescription>
              A unified business intelligence and feasibility platform engineered to bring enterprise analytics to founders and planners.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              BizMind answers the fundamental strategic questions faced by entrepreneurs: Which business sector holds viable demand? Where is the optimal target location? What are the empirical capital requirements and break-even timelines?
            </p>

            <ExpandableText
              label="Read full engineering & data methodology"
              collapseLabel="Hide detailed methodology"
            >
              <div className="space-y-3 pt-2 text-slate-400">
                <p>
                  BizMind enforces rigorous engineering boundaries: clean separation between React UI presentation, Express API brokering, 3NF relational database schemas, and trained predictive modeling pipelines.
                </p>
                <p>
                  To deliver maximum reliability without prohibitive third-party overhead, spatial competitor mapping is powered by dual GIS engines (Google Places Platform with seamless OpenStreetMap/Leaflet fallback).
                </p>
                <p>
                  Financial feasibility calculations operate with deterministic precision—computing contribution margins, unit economics, payback periods, and multi-year projection tables.
                </p>
              </div>
            </ExpandableText>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#FFBF24]" />
                <span>Engineering Standards</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-[#A1A1AA]">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <span>Deterministic financial algorithms with mathematical break-even guarantees.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <span>Dual spatial mapping engines with high-availability offline GIS fallback.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <span>Calibrated ML ensemble models assessing survival probability and risk tiers.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
                <span>Full-stack security with JWT role-based access control and audited data schemas.</span>
              </div>
            </CardContent>
          </div>
          <div className="mt-6 pt-4 border-t border-[#27272A] text-[11px] font-mono text-[#22C55E] flex items-center justify-between">
            <span>Status: Production Ready</span>
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
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
              Decoupled architecture across React SPA frontend, Express REST APIs, relational schemas, and ML inference microservices.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24] mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <CardTitle>Enterprise Reliability</CardTitle>
            <CardDescription>
              Built strictly to enterprise software engineering standards, verified unit economics, and audited decision algorithms.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#FFBF24] mb-2">
              <Terminal className="w-5 h-5" />
            </div>
            <CardTitle>Extensible Intelligence</CardTitle>
            <CardDescription>
              Integrated decision pipeline with automated slide deck generators, market saturation indicators, and scenario sensitivity matrices.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
