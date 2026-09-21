import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  TrendingUp,
  Award,
  Wallet,
  Calendar,
  MapPin,
  Copy,
  Trash2,
  Edit,
  Eye,
  BarChart3,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { planService } from '../../services/planService';
import { BusinessPlan } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export const BusinessPlansPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteConfirmPlan, setDeleteConfirmPlan] = useState<BusinessPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicatingId, setIsDuplicatingId] = useState<string | number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await planService.getPlans();
      setPlans(data || []);
    } catch (err: any) {
      console.error('Failed to load business plans:', err);
      setError(err?.message || 'Failed to load business plans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDuplicate = async (e: React.MouseEvent, plan: BusinessPlan) => {
    e.stopPropagation();
    setIsDuplicatingId(plan.id);
    try {
      const duplicated = await planService.duplicatePlan(plan.id);
      showToast(`Plan duplicated successfully as "${duplicated.businessName || duplicated.business_name}"`);
      await fetchPlans();
    } catch (err: any) {
      alert(`Failed to duplicate plan: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsDuplicatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmPlan) return;
    setIsDeleting(true);
    try {
      await planService.deletePlan(deleteConfirmPlan.id);
      showToast(`Plan "${deleteConfirmPlan.businessName || deleteConfirmPlan.business_name}" deleted`);
      setDeleteConfirmPlan(null);
      await fetchPlans();
    } catch (err: any) {
      alert(`Failed to delete plan: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered plans
  const filteredPlans = plans.filter((p) => {
    const name = (p.businessName || p.business_name || '').toLowerCase();
    const loc = (p.location || p.location_name || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesQuery = name.includes(q) || loc.includes(q) || cat.includes(q);
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  // Telemetry Aggregates
  const totalPlans = plans.length;
  const analyzedPlans = plans.filter((p) => p.planStatus === 'analyzed').length;
  const avgFeasibility = totalPlans > 0
    ? Math.round(plans.reduce((sum, p) => sum + (p.feasibilityScore || 0), 0) / totalPlans)
    : 0;
  const totalCapital = plans.reduce((sum, p) => sum + (p.totalInitialInvestment || 0), 0);

  const categories = Array.from(new Set(plans.map((p) => p.category).filter(Boolean)));

  const getStatusBadge = (score: number, status?: string) => {
    if (score >= 75 || status === 'Strong Financial Feasibility') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Strong Feasibility ({score})
        </span>
      );
    } else if (score >= 55 || status === 'Moderate Financial Feasibility') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Moderate Feasibility ({score})
        </span>
      );
    } else if (score >= 35 || status === 'Needs Review') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
          Needs Review ({score})
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
          Challenging ({score})
        </span>
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl border border-emerald-400 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-indigo-400" />
            Business Plans & Feasibility
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build, stress-test, and model comprehensive financial viability, sensitivity, and 12-month projections
          </p>
        </div>

        <button
          id="btn-create-business-plan"
          onClick={() => navigate('/business-plans/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          Create New Business Plan
        </button>
      </div>

      {/* Metric Summary Banners */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Plans</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalPlans}</div>
          <span className="text-[11px] text-slate-500">Saved business models</span>
        </div>

        <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Analyzed Plans</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{analyzedPlans}</div>
          <span className="text-[11px] text-slate-500">Feasibility reports finalized</span>
        </div>

        <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Avg Feasibility Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{avgFeasibility}<span className="text-xs text-slate-500">/100</span></div>
          <span className="text-[11px] text-slate-500">Commercial viable benchmark</span>
        </div>

        <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Capital Modelled</span>
            <Wallet className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{formatCurrency(totalCapital)}</div>
          <span className="text-[11px] text-slate-500">Total planned CapEx</span>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#18181B] p-3 rounded-xl border border-[#27272A]">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by business name, category, or location..."
              className="w-full bg-[#27272A] text-white pl-9 pr-3 py-1.5 rounded-lg border border-[#3F3F46] text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#27272A] text-white px-3 py-1.5 rounded-lg border border-[#3F3F46] text-xs focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 bg-[#27272A] p-0.5 rounded-lg border border-[#3F3F46]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
          <p className="text-xs">Loading business plans...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
          <button onClick={fetchPlans} className="underline ml-2 text-white">Retry</button>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-16 bg-[#18181B] rounded-2xl border border-dashed border-[#3F3F46] p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Business Plans Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchQuery || selectedCategory !== 'ALL'
                ? 'Try adjusting your search criteria or category filter.'
                : 'Get started by creating your first business plan to evaluate financial feasibility, calculate break-even, and model scenarios.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/business-plans/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Your First Plan
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan) => {
            const planName = plan.businessName || plan.business_name || 'Untitled Business Plan';
            const locationText = plan.location || plan.location_name || (plan.city ? `${plan.city}${plan.area ? `, ${plan.area}` : ''}` : 'Location unassigned');
            const score = plan.feasibilityScore || 0;
            const isProfitPositive = (plan.monthlyProfit || 0) > 0;
            const isDuping = isDuplicatingId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => navigate(`/business-plans/${plan.id}`)}
                className="bg-[#18181B] rounded-xl border border-[#27272A] hover:border-[#3F3F46] transition-all duration-200 p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Top Row: Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#27272A] text-slate-300">
                      {plan.category || 'Retail'}
                    </span>
                    {getStatusBadge(score, plan.feasibilityStatus)}
                  </div>

                  {/* Plan Name & Location */}
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {planName}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 mb-4">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span className="line-clamp-1">{locationText}</span>
                  </div>

                  {/* Key Financial Metrics */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#27272A] text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Initial Investment:</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(plan.totalInitialInvestment || 0)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Monthly Revenue:</span>
                      <span className="font-semibold text-blue-400">
                        {formatCurrency(plan.monthlyRevenue || 0)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Monthly Profit:</span>
                      <span className={`font-semibold ${isProfitPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatCurrency(plan.monthlyProfit || 0)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Annual ROI:</span>
                      <span className="font-semibold text-cyan-400">
                        {plan.annualRoi !== null && plan.annualRoi !== undefined ? formatPercentage(plan.annualRoi) : (plan.roi !== null && plan.roi !== undefined ? formatPercentage(plan.roi) : 'N/A')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Dates & Actions */}
                <div className="pt-4 mt-2 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    <span>Updated {new Date(plan.updated_at || plan.updatedAt || Date.now()).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/business-plans/${plan.id}/financial-analysis`)}
                      title="Open Financial Analysis"
                      className="p-1.5 rounded-lg hover:bg-[#27272A] text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => navigate(`/business-plans/${plan.id}/edit`)}
                      title="Edit Plan"
                      className="p-1.5 rounded-lg hover:bg-[#27272A] text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleDuplicate(e, plan)}
                      disabled={isDuping}
                      title="Duplicate Plan"
                      className="p-1.5 rounded-lg hover:bg-[#27272A] text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                    >
                      {isDuping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmPlan(plan);
                      }}
                      title="Delete Plan"
                      className="p-1.5 rounded-lg hover:bg-[#27272A] text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#18181B] rounded-xl border border-[#27272A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#27272A] text-slate-400 font-semibold uppercase tracking-wider bg-[#202024]">
                  <th className="py-3 px-4">Business Plan</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3 text-right">Investment</th>
                  <th className="py-3 px-3 text-right">Monthly Revenue</th>
                  <th className="py-3 px-3 text-right">Monthly Profit</th>
                  <th className="py-3 px-3 text-right">ROI</th>
                  <th className="py-3 px-3 text-center">Feasibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]/70 text-slate-200">
                {filteredPlans.map((plan) => {
                  const planName = plan.businessName || plan.business_name || 'Untitled Plan';
                  const locationText = plan.location || plan.location_name || plan.city || '—';
                  const isProfitPositive = (plan.monthlyProfit || 0) > 0;
                  const isDuping = isDuplicatingId === plan.id;

                  return (
                    <tr
                      key={plan.id}
                      onClick={() => navigate(`/business-plans/${plan.id}`)}
                      className="hover:bg-[#27272A]/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span className="line-clamp-1">{planName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{plan.category}</td>
                      <td className="py-3 px-3 text-slate-400 line-clamp-1">{locationText}</td>
                      <td className="py-3 px-3 text-right font-medium text-white">
                        {formatCurrency(plan.totalInitialInvestment || 0)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-blue-400">
                        {formatCurrency(plan.monthlyRevenue || 0)}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-semibold ${
                          isProfitPositive ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {formatCurrency(plan.monthlyProfit || 0)}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-cyan-400">
                        {plan.annualRoi !== null && plan.annualRoi !== undefined
                          ? formatPercentage(plan.annualRoi)
                          : plan.roi !== null && plan.roi !== undefined
                          ? formatPercentage(plan.roi)
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {getStatusBadge(plan.feasibilityScore || 0, plan.feasibilityStatus)}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/business-plans/${plan.id}`)}
                            title="View Details"
                            className="p-1.5 rounded-lg hover:bg-[#27272A] text-slate-400 hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/business-plans/${plan.id}/financial-analysis`)}
                            title="Financial Analysis"
                            className="p-1.5 rounded-lg hover:bg-[#27272A] text-slate-400 hover:text-indigo-400 transition-colors"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/business-plans/${plan.id}/edit`)}
                            title="Edit Plan"
                            className="p-1.5 rounded-lg hover:bg-[#27272A] text-slate-400 hover:text-white transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDuplicate(e, plan)}
                            disabled={isDuping}
                            title="Duplicate Plan"
                            className="p-1.5 rounded-lg hover:bg-[#27272A] text-slate-400 hover:text-blue-400 transition-colors"
                          >
                            {isDuping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setDeleteConfirmPlan(plan)}
                            title="Delete Plan"
                            className="p-1.5 rounded-lg hover:bg-[#27272A] text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 text-red-400 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Business Plan</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-white font-semibold">
                "{deleteConfirmPlan.businessName || deleteConfirmPlan.business_name}"
              </strong>
              ? All associated financial feasibility models, scenario forecasts, and sensitivity metrics will be permanently removed.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#27272A]">
              <button
                type="button"
                onClick={() => setDeleteConfirmPlan(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-[#27272A] hover:bg-[#3F3F46] text-slate-200 text-xs font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
