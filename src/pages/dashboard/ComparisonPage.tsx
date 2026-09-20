import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { GitCompare, Check, Plus, ArrowRight, Sparkles, TrendingUp, DollarSign, Layers } from 'lucide-react';
import { planService } from '../../services/planService';
import { BusinessPlan } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export const ComparisonPage: React.FC = () => {
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [selectedPlanIds, setSelectedPlanIds] = useState<(number | string)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const userPlans = await planService.getPlans();
        setPlans(userPlans);
        if (userPlans.length >= 2) {
          setSelectedPlanIds([userPlans[0].id, userPlans[1].id]);
        } else if (userPlans.length === 1) {
          setSelectedPlanIds([userPlans[0].id]);
        }
      } catch (err) {
        console.error('Failed to load plans for comparison:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const togglePlanSelection = (id: number | string) => {
    if (selectedPlanIds.includes(id)) {
      if (selectedPlanIds.length > 1) {
        setSelectedPlanIds((prev) => prev.filter((pId) => pId !== id));
      }
    } else {
      if (selectedPlanIds.length < 4) {
        setSelectedPlanIds((prev) => [...prev, id]);
      }
    }
  };

  const comparedPlans = plans.filter((p) => selectedPlanIds.includes(p.id));

  const highestProfitPlan = [...comparedPlans].sort((a, b) => b.monthlyProfit - a.monthlyProfit)[0];
  const fastestPaybackPlan = [...comparedPlans].sort((a, b) => a.paybackPeriodMonths - b.paybackPeriodMonths)[0];
  const lowestCapexPlan = [...comparedPlans].sort((a, b) => a.totalInitialInvestment - b.totalInitialInvestment)[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Opportunity Comparison"
        description="Side-by-side unit economics, capital requirements, and feasibility metrics across candidate ventures."
        badge={`${comparedPlans.length} Selected`}
        actions={
          <Link to="/business-planner">
            <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Create New Model
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="p-12 text-center text-xs text-[#A1A1AA]">Loading comparison models...</div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <GitCompare className="w-10 h-10 text-[#FFBF24] mx-auto opacity-70" />
            <h3 className="text-base font-bold text-[#F8FAFC]">No Business Models to Compare</h3>
            <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
              Create at least two business models in the planner to compare their Capex, break-even timelines, and profitability metrics side-by-side.
            </p>
            <Link to="/business-planner">
              <Button size="sm">Create First Business Plan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Plan Selector Badges */}
          <div className="p-4 rounded-xl bg-[#111113] border border-[#27272A] space-y-2">
            <span className="text-xs font-semibold text-[#A1A1AA] block">
              Select business models to compare (up to 4):
            </span>
            <div className="flex flex-wrap gap-2">
              {plans.map((p) => {
                const isSelected = selectedPlanIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlanSelection(p.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/40'
                        : 'bg-[#18181B] text-[#A1A1AA] border border-[#27272A] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-[#FFBF24] text-[#121214] border-[#FFBF24]' : 'border-[#52525B]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>{p.businessName || p.business_name}</span>
                    <span className="text-[10px] opacity-70">({p.category})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparative Matrix Table */}
          <Card className="border-[#27272A] bg-[#111113] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#27272A] bg-[#18181B]">
                    <th className="py-4 px-4 text-[#71717A] uppercase text-[10px] w-1/4">Metric</th>
                    {comparedPlans.map((p) => (
                      <th key={p.id} className="py-4 px-4 text-[#F8FAFC] font-bold text-sm">
                        <div className="flex items-center justify-between">
                          <span>{p.businessName || p.business_name}</span>
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-[#27272A] text-[#FFBF24]">
                            {p.category}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  {/* Total Initial Investment */}
                  <tr className="hover:bg-[#18181B]/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#A1A1AA]">Initial Startup Capex</td>
                    {comparedPlans.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-bold text-[#F8FAFC]">
                        {formatCurrency(p.totalInitialInvestment)}
                        {lowestCapexPlan?.id === p.id && comparedPlans.length > 1 && (
                          <span className="ml-2 inline-block px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">
                            Lowest Capex
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Monthly Fixed Expenses */}
                  <tr className="hover:bg-[#18181B]/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#A1A1AA]">Monthly Fixed Costs (Rent + Salaries)</td>
                    {comparedPlans.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-[#F8FAFC]">
                        {formatCurrency(p.totalMonthlyFixedExpenses)}
                      </td>
                    ))}
                  </tr>

                  {/* Monthly Revenue */}
                  <tr className="hover:bg-[#18181B]/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#A1A1AA]">Gross Monthly Revenue</td>
                    {comparedPlans.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-bold text-[#F8FAFC]">
                        {formatCurrency(p.monthlyRevenue)}
                      </td>
                    ))}
                  </tr>

                  {/* Net Monthly Profit */}
                  <tr className="hover:bg-[#18181B]/50 transition-colors bg-[#FFBF24]/5">
                    <td className="py-3 px-4 font-semibold text-[#FFBF24]">Net Monthly Profit</td>
                    {comparedPlans.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-extrabold text-[#FFBF24]">
                        {formatCurrency(p.monthlyProfit)}
                        {highestProfitPlan?.id === p.id && comparedPlans.length > 1 && (
                          <span className="ml-2 inline-block px-1.5 py-0.2 rounded bg-[#FFBF24]/20 text-[#FFBF24] text-[10px]">
                            Highest Profit
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Profit Margin */}
                  <tr className="hover:bg-[#18181B]/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#A1A1AA]">Net Profit Margin</td>
                    {comparedPlans.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-[#F8FAFC] font-semibold">
                        {formatPercentage(p.profitMargin)}
                      </td>
                    ))}
                  </tr>

                  {/* Break-Even Units */}
                  <tr className="hover:bg-[#18181B]/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#A1A1AA]">Monthly Break-Even Units</td>
                    {comparedPlans.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-[#F8FAFC]">
                        {Math.round(p.breakEvenUnits || 0).toLocaleString()} transactions
                      </td>
                    ))}
                  </tr>

                  {/* Payback Horizon */}
                  <tr className="hover:bg-[#18181B]/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#A1A1AA]">Payback Period</td>
                    {comparedPlans.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-semibold text-emerald-400">
                        {p.paybackPeriodMonths} Months
                        {fastestPaybackPlan?.id === p.id && comparedPlans.length > 1 && (
                          <span className="ml-2 inline-block px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">
                            Fastest Recovery
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Feasibility Score */}
                  <tr className="hover:bg-[#18181B]/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#A1A1AA]">Feasibility Score & Risk</td>
                    {comparedPlans.map((p) => (
                      <td key={p.id} className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#F8FAFC]">{p.feasibilityScore}/100</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                              p.riskLevel === 'LOW'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : p.riskLevel === 'MEDIUM'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {p.riskLevel} RISK
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Action */}
                  <tr className="bg-[#18181B]">
                    <td className="py-3 px-4 font-semibold text-[#71717A]">Actions</td>
                    {comparedPlans.map((p) => (
                      <td key={p.id} className="py-3 px-4">
                        <Link to={`/business-planner`}>
                          <Button size="xs" variant="outline" rightIcon={<ArrowRight className="w-3 h-3" />}>
                            View Model
                          </Button>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
