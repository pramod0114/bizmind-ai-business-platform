import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  FileText,
  Printer,
  Download,
  Building,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  PieChart,
  Calendar,
  Layers,
} from 'lucide-react';
import { planService } from '../../services/planService';
import { BusinessPlan } from '../../types';
import { formatCurrency, formatPercentage, formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export const ReportsPage: React.FC = () => {
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const userPlans = await planService.getPlans();
        setPlans(userPlans);
        if (userPlans.length > 0) {
          setSelectedPlanId(userPlans[0].id);
        }
      } catch (err) {
        console.error('Failed to load plans for reporting:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const plan = plans.find((p) => String(p.id) === String(selectedPlanId));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    if (!plan) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BizMind-Report-${plan.businessName || 'Venture'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <PageHeader
          title="Business Feasibility Reports"
          description="Comprehensive analytical dossiers summarizing unit economics, capital structure, and feasibility indicators."
          badge="Executive Dossier"
          actions={
            <div className="flex items-center gap-2">
              {plans.length > 0 && (
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#111113] border border-[#27272A] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24]"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.businessName || p.business_name}
                    </option>
                  ))}
                </select>
              )}

              <Button size="sm" variant="outline" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={handleDownloadJSON} disabled={!plan}>
                Export JSON
              </Button>

              <Button size="sm" leftIcon={<Printer className="w-3.5 h-3.5" />} onClick={handlePrint} disabled={!plan}>
                Print Dossier / Save PDF
              </Button>
            </div>
          }
        />
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#A1A1AA]">Generating executive reports...</div>
      ) : !plan ? (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <FileText className="w-10 h-10 text-[#FFBF24] mx-auto opacity-70" />
            <h3 className="text-base font-bold text-[#F8FAFC]">No Business Models Available</h3>
            <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
              Please create a business model in the Business Planner to generate a full comprehensive feasibility dossier.
            </p>
            <Link to="/business-planner">
              <Button size="sm">Create Business Plan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 bg-[#111113] p-6 sm:p-8 rounded-2xl border border-[#27272A] print:border-none print:p-0 print:bg-white print:text-black">
          {/* Report Header */}
          <div className="border-b border-[#27272A] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#FFBF24] font-bold">
                BizMind Executive Feasibility Dossier
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mt-1">
                {plan.businessName || plan.business_name}
              </h1>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Sector: <span className="text-[#F8FAFC] font-semibold">{plan.category}</span> • Generated on{' '}
                {formatDate(plan.created_at || new Date().toISOString())}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-[#18181B] border border-[#27272A] text-right">
                <span className="text-[10px] text-[#71717A] block uppercase">Feasibility Rating</span>
                <span className="text-lg font-extrabold text-[#FFBF24]">{plan.feasibilityScore}/100</span>
              </div>
              <Badge variant={plan.riskLevel === 'LOW' ? 'success' : 'warning'} className="py-2 px-3 text-xs">
                {plan.riskLevel} Risk Profile
              </Badge>
            </div>
          </div>

          {/* Section 1: Executive Overview Metrics */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFBF24] mb-3">
              1. Executive Financial Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
                <span className="text-[10px] text-[#71717A] block">Initial Capex</span>
                <span className="text-base font-bold text-[#F8FAFC]">
                  {formatCurrency(plan.totalInitialInvestment)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
                <span className="text-[10px] text-[#71717A] block">Monthly Fixed Costs</span>
                <span className="text-base font-bold text-[#F8FAFC]">
                  {formatCurrency(plan.totalMonthlyFixedExpenses)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
                <span className="text-[10px] text-[#71717A] block">Monthly Revenue</span>
                <span className="text-base font-bold text-[#F8FAFC]">{formatCurrency(plan.monthlyRevenue)}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
                <span className="text-[10px] text-[#71717A] block">Net Monthly Profit</span>
                <span className="text-base font-bold text-emerald-400">{formatCurrency(plan.monthlyProfit)}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Capital Expenditure Breakdown */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFBF24] mb-3">
              2. Initial Capital Expenditure (Capex) Allocation
            </h2>
            <div className="overflow-x-auto rounded-xl border border-[#27272A]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#18181B] text-[#71717A] border-b border-[#27272A]">
                  <tr>
                    <th className="py-2.5 px-4">Investment Line Item</th>
                    <th className="py-2.5 px-4 text-right">Allocated Amount</th>
                    <th className="py-2.5 px-4 text-right">% of Total Capex</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A] text-[#F8FAFC]">
                  <tr>
                    <td className="py-2.5 px-4">Commercial Property Deposit</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(plan.propertyDeposit)}</td>
                    <td className="py-2.5 px-4 text-right text-[#A1A1AA]">
                      {(((Number(plan.propertyDeposit) || 0) / (Number(plan.totalInitialInvestment) || 1)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4">Interior Setup & Architecture Renovation</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(plan.interiorSetup)}</td>
                    <td className="py-2.5 px-4 text-right text-[#A1A1AA]">
                      {(((Number(plan.interiorSetup) || 0) / (Number(plan.totalInitialInvestment) || 1)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4">Commercial Equipment & Machinery</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(plan.equipment)}</td>
                    <td className="py-2.5 px-4 text-right text-[#A1A1AA]">
                      {(((Number(plan.equipment) || 0) / (Number(plan.totalInitialInvestment) || 1)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4">Opening Inventory & Consumables</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(plan.initialInventory)}</td>
                    <td className="py-2.5 px-4 text-right text-[#A1A1AA]">
                      {(((Number(plan.initialInventory) || 0) / (Number(plan.totalInitialInvestment) || 1)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4">Legal, Regulatory & Licenses</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(plan.licenses)}</td>
                    <td className="py-2.5 px-4 text-right text-[#A1A1AA]">
                      {(((Number(plan.licenses) || 0) / (Number(plan.totalInitialInvestment) || 1)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4">Launch Marketing & Signage</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(plan.marketing)}</td>
                    <td className="py-2.5 px-4 text-right text-[#A1A1AA]">
                      {(((Number(plan.marketing) || 0) / (Number(plan.totalInitialInvestment) || 1)) * 100).toFixed(1)}%
                    </td>
                  </tr>
                  <tr className="bg-[#18181B] font-bold text-[#FFBF24]">
                    <td className="py-3 px-4">Total Initial Capital Required</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(plan.totalInitialInvestment)}</td>
                    <td className="py-3 px-4 text-right">100.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Monthly Fixed Operating Expenses */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFBF24] mb-3">
              3. Monthly Operating Expenditure (Opex) Structure
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
                <span className="text-[10px] text-[#71717A] block">Monthly Rent</span>
                <span className="text-sm font-bold text-[#F8FAFC]">{formatCurrency(plan.rent)}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
                <span className="text-[10px] text-[#71717A] block">Staff Salaries</span>
                <span className="text-sm font-bold text-[#F8FAFC]">{formatCurrency(plan.salaries)}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
                <span className="text-[10px] text-[#71717A] block">Commercial Utilities</span>
                <span className="text-sm font-bold text-[#F8FAFC]">{formatCurrency(plan.utilities)}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
                <span className="text-[10px] text-[#71717A] block">Monthly Marketing</span>
                <span className="text-sm font-bold text-[#F8FAFC]">{formatCurrency(plan.monthlyMarketing)}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]">
                <span className="text-[10px] text-[#71717A] block">Loan Service / EMI</span>
                <span className="text-sm font-bold text-[#F8FAFC]">{formatCurrency(plan.loanEmi)}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Unit Economics & Sensitivity */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFBF24] mb-3">
              4. Unit Economics & Sensitivity Analysis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A] space-y-2">
                <span className="text-xs font-bold text-[#F8FAFC] block">Unit Pricing Model</span>
                <div className="flex justify-between text-xs text-[#A1A1AA]">
                  <span>Average Selling Price:</span>
                  <span className="text-[#F8FAFC] font-semibold">{formatCurrency(plan.sellingPrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#A1A1AA]">
                  <span>Variable Cost per Unit:</span>
                  <span className="text-[#F8FAFC] font-semibold">{formatCurrency(plan.variableCostPerUnit)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#A1A1AA] pt-2 border-t border-[#27272A]">
                  <span>Unit Contribution Margin:</span>
                  <span className="text-emerald-400 font-bold">
                    {formatCurrency(plan.sellingPrice - plan.variableCostPerUnit)}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A] space-y-2">
                <span className="text-xs font-bold text-[#F8FAFC] block">Break-Even Velocity</span>
                <div className="flex justify-between text-xs text-[#A1A1AA]">
                  <span>Break-Even Units / Month:</span>
                  <span className="text-[#F8FAFC] font-semibold">
                    {Math.round(plan.breakEvenUnits || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#A1A1AA]">
                  <span>Break-Even Revenue:</span>
                  <span className="text-[#F8FAFC] font-semibold">{formatCurrency(plan.breakEvenRevenue)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#A1A1AA] pt-2 border-t border-[#27272A]">
                  <span>Payback Horizon:</span>
                  <span className="text-emerald-400 font-bold">{plan.paybackPeriodMonths} Months</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A] space-y-2">
                <span className="text-xs font-bold text-[#F8FAFC] block">Capital Efficiency</span>
                <div className="flex justify-between text-xs text-[#A1A1AA]">
                  <span>Net Profit Margin:</span>
                  <span className="text-[#F8FAFC] font-semibold">{formatPercentage(plan.profitMargin)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#A1A1AA]">
                  <span>Projected Annual ROI:</span>
                  <span className="text-emerald-400 font-bold">
                    {((((Number(plan.monthlyProfit) || 0) * 12) / (Number(plan.totalInitialInvestment) || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#A1A1AA] pt-2 border-t border-[#27272A]">
                  <span>Risk Classification:</span>
                  <span className="text-[#FFBF24] font-bold">{plan.riskLevel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Recommendation */}
          <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-[#A1A1AA]">
              <span className="font-bold text-[#F8FAFC] block">BizMind Feasibility Recommendation:</span>
              Based on the evaluated unit economics, customer footfall throughput, and monthly fixed overhead, this venture demonstrates a{' '}
              <strong className="text-emerald-400">{plan.riskLevel.toLowerCase()} risk profile</strong> with an estimated payback timeline of{' '}
              <strong className="text-[#F8FAFC]">{plan.paybackPeriodMonths} months</strong>. Maintain at least 3 months of fixed operating reserves
              ({formatCurrency(plan.totalMonthlyFixedExpenses * 3)}) to navigate initial customer acquisition ramps.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
