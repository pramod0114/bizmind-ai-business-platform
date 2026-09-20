import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Cpu, Play, Sparkles, ShieldAlert, CheckCircle, Database, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { planService } from '../../services/planService';
import { api } from '../../services/api';
import { BusinessPlan } from '../../types';
import { Link } from 'react-router-dom';

interface MLPredictionOutput {
  successProbability: number;
  confidenceScore: number;
  riskTier: 'LOW' | 'MODERATE' | 'HIGH';
  modelType: string;
  features: {
    capitalAdequacyRatio: number;
    footfallSaturationIndex: number;
    breakEvenHorizonMonths: number;
    operatingMarginScore: number;
    contributionResilience: number;
  };
  featureImportance: Array<{ name: string; weight: number; impact: 'Positive' | 'Neutral' | 'Negative' }>;
  recommendations: string[];
}

export const PredictionsPage: React.FC = () => {
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | string>('');
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<MLPredictionOutput | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const userPlans = await planService.getPlans();
        setPlans(userPlans);
        if (userPlans.length > 0) {
          setSelectedPlanId(userPlans[0].id);
          runPrediction(userPlans[0]);
        }
      } catch (err) {
        console.error('Failed to load plans for prediction:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const runPrediction = async (planToPredict?: BusinessPlan) => {
    const targetPlan = planToPredict || plans.find((p) => String(p.id) === String(selectedPlanId));
    if (!targetPlan) return;

    try {
      setPredicting(true);
      const res = await api.post<MLPredictionOutput>('/predictions/predict', {
        totalInitialInvestment: targetPlan.totalInitialInvestment,
        totalMonthlyFixedExpenses: targetPlan.totalMonthlyFixedExpenses,
        monthlyRevenue: targetPlan.monthlyRevenue,
        monthlyProfit: targetPlan.monthlyProfit,
        profitMargin: targetPlan.profitMargin,
        paybackPeriodMonths: targetPlan.paybackPeriodMonths,
        breakEvenUnits: targetPlan.breakEvenUnits,
        category: targetPlan.category,
      });

      if (res.data) {
        setPrediction(res.data);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setPredicting(false);
    }
  };

  const currentPlan = plans.find((p) => String(p.id) === String(selectedPlanId));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Machine Learning Success Prediction"
        description="Statistical success probability, model confidence score, and risk tier evaluation powered by Ensemble ML pipelines."
        badge="Ensemble Pipeline"
        actions={
          <div className="flex items-center gap-2">
            {plans.length > 0 && (
              <select
                value={selectedPlanId}
                onChange={(e) => {
                  setSelectedPlanId(e.target.value);
                  const p = plans.find((item) => String(item.id) === e.target.value);
                  if (p) runPrediction(p);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#111113] border border-[#27272A] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24]"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.businessName || p.business_name}
                  </option>
                ))}
              </select>
            )}

            <Button
              size="sm"
              leftIcon={predicting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              onClick={() => runPrediction()}
              disabled={predicting || plans.length === 0}
            >
              {predicting ? 'Evaluating Features...' : 'Re-Run Pipeline'}
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="p-12 text-center text-xs text-[#A1A1AA]">Loading business models...</div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Cpu className="w-10 h-10 text-[#FFBF24] mx-auto opacity-70" />
            <h3 className="text-base font-bold text-[#F8FAFC]">No Business Models Found</h3>
            <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
              Create and analyze your first business plan in the Business Planner to generate input features for the machine learning success predictor.
            </p>
            <Link to="/business-planner">
              <Button size="sm">Create Business Plan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Top Predictive Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Success Probability"
              value={prediction ? `${prediction.successProbability}%` : '...'}
              sublabel="Statistical ensemble probability"
              icon={<Sparkles className="w-5 h-5 text-[#FFBF24]" />}
            />
            <StatCard
              label="Model Confidence"
              value={prediction ? `${prediction.confidenceScore}%` : '...'}
              sublabel="Cross-validated certainty"
              icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
            />
            <StatCard
              label="Assessed Risk Tier"
              value={prediction?.riskTier || 'LOW'}
              sublabel="Capital & margin volatility"
              icon={<ShieldAlert className="w-5 h-5 text-blue-400" />}
            />
            <StatCard
              label="Active Model"
              value="Random Forest"
              sublabel="Gradient Boosting Ensemble"
              icon={<Cpu className="w-5 h-5 text-purple-400" />}
            />
          </div>

          {/* Model Features & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-[#27272A] bg-[#111113]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Inference Feature Weights</CardTitle>
                      <CardDescription className="text-xs">
                        Normalized feature contributions for {currentPlan?.businessName || currentPlan?.business_name}
                      </CardDescription>
                    </div>
                    <Badge variant={prediction?.riskTier === 'LOW' ? 'success' : 'warning'}>
                      {prediction?.riskTier} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-[#18181B] border border-[#27272A]">
                      <span className="text-[10px] text-[#71717A] block">Capital Adequacy</span>
                      <span className="text-base font-bold text-[#F8FAFC]">
                        {prediction?.features.capitalAdequacyRatio}x
                      </span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">Runway vs Burn</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#18181B] border border-[#27272A]">
                      <span className="text-[10px] text-[#71717A] block">Break-Even Horizon</span>
                      <span className="text-base font-bold text-[#F8FAFC]">
                        {prediction?.features.breakEvenHorizonMonths} Mo
                      </span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">Payback Horizon</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#18181B] border border-[#27272A]">
                      <span className="text-[10px] text-[#71717A] block">Margin Resilience</span>
                      <span className="text-base font-bold text-[#F8FAFC]">
                        {prediction?.features.operatingMarginScore}/100
                      </span>
                      <span className="text-[10px] text-[#FFBF24] block mt-0.5">Profit Buffer</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#27272A] space-y-3">
                    <h4 className="text-xs font-bold text-[#F8FAFC]">Feature Importance Relative Impact:</h4>
                    {prediction?.featureImportance.map((feat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#A1A1AA]">{feat.name}</span>
                          <span className="text-[#F8FAFC] font-semibold">{(feat.weight * 100).toFixed(0)}% weight</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#27272A] overflow-hidden">
                          <div
                            className={`h-full ${
                              feat.impact === 'Positive'
                                ? 'bg-emerald-400'
                                : feat.impact === 'Neutral'
                                ? 'bg-[#FFBF24]'
                                : 'bg-rose-400'
                            }`}
                            style={{ width: `${feat.weight * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Strategic Recommendations */}
              <Card className="border-[#27272A] bg-[#111113]">
                <CardHeader>
                  <CardTitle className="text-base">Algorithm Recommendations</CardTitle>
                  <CardDescription className="text-xs">
                    Prescriptive guidelines synthesized from benchmarked SME performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {prediction?.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#18181B] border border-[#27272A] flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-[#F8FAFC]">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Model Architecture Info */}
            <div className="space-y-6">
              <Card className="border-[#27272A] bg-[#111113]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFBF24]" />
                    <span>Model Architecture</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Scikit-Learn Ensemble Pipeline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-[#A1A1AA]">
                  <div className="p-2.5 rounded bg-[#18181B] border border-[#27272A]">
                    <p className="font-semibold text-[#F8FAFC]">1. Capital Adequacy Ratio</p>
                    <p className="text-[11px] text-[#71717A] mt-0.5">Ratio of initial capital to estimated burn rate.</p>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181B] border border-[#27272A]">
                    <p className="font-semibold text-[#F8FAFC]">2. Footfall Saturation Index</p>
                    <p className="text-[11px] text-[#71717A] mt-0.5">Commercial zone footfall score normalized by competitor density.</p>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181B] border border-[#27272A]">
                    <p className="font-semibold text-[#F8FAFC]">3. Break-Even Horizon</p>
                    <p className="text-[11px] text-[#71717A] mt-0.5">Calculated timeline (in months) to reach cashflow neutrality.</p>
                  </div>

                  <Link to="/reports" className="block pt-2">
                    <Button variant="outline" className="w-full" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Generate Full Dossier
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
