import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Cpu, Play, Sparkles, ShieldAlert, CheckCircle, Database } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const PredictionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Machine Learning Success Prediction"
        description="Statistical success probability, model confidence score, and risk tier evaluation powered by Python & Scikit-Learn."
        badge="Part 5 Focus"
        actions={
          <Button size="sm" leftIcon={<Play className="w-3.5 h-3.5" />}>
            Run Prediction Pipeline
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inference Pipeline Output</CardTitle>
              <CardDescription>
                Success probability estimations and confidence intervals for active business models.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Cpu className="w-6 h-6 text-[#FFBF24]" />}
                title="ML Model Inference Scheduled for Part 5"
                description="In accordance with project rules, no fake simulated ML outputs are generated. The Python FastAPI microservice with Scikit-learn Random Forest models will be connected in Part 5."
                actionLabel="Review Feature Schema"
                onAction={() => {}}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFBF24]" />
                <span>Model Pipeline Spec</span>
              </CardTitle>
              <CardDescription>
                Scikit-Learn Ensemble Pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-[#A1A1AA]">
              <div className="p-2.5 rounded bg-[#111113] border border-[#27272A]">
                <p className="font-semibold text-[#F8FAFC]">1. Capital Adequacy Ratio</p>
                <p className="text-[11px] text-[#71717A] mt-0.5">Ratio of initial capital to estimated 12-month burn rate.</p>
              </div>
              <div className="p-2.5 rounded bg-[#111113] border border-[#27272A]">
                <p className="font-semibold text-[#F8FAFC]">2. Footfall Saturation Index</p>
                <p className="text-[11px] text-[#71717A] mt-0.5">Commercial zone footfall score normalized by competitor density.</p>
              </div>
              <div className="p-2.5 rounded bg-[#111113] border border-[#27272A]">
                <p className="font-semibold text-[#F8FAFC]">3. Break-Even Horizon</p>
                <p className="text-[11px] text-[#71717A] mt-0.5">Calculated timeline (in months) to reach cashflow neutrality.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
