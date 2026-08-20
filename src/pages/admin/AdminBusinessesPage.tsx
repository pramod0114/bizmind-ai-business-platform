/**
 * BizMind – Administrator Business Data & Industry Benchmarks Management
 */
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import {
  Database,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Tag,
  DollarSign,
  Percent,
  Clock,
  Footprints,
  FileSpreadsheet,
  Building2,
  Eye,
  X,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { adminService } from '../../services/adminService';
import { planService, AdminPlansTelemetry } from '../../services/planService';
import { BusinessDataset, BusinessPlan } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const AdminBusinessesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'plans'>('benchmarks');
  const [datasets, setDatasets] = useState<BusinessDataset[]>([]);
  const [telemetry, setTelemetry] = useState<AdminPlansTelemetry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingDataset, setEditingDataset] = useState<BusinessDataset | null>(null);
  const [inspectingPlan, setInspectingPlan] = useState<BusinessPlan | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Food & Beverage');
  const [typicalCapex, setTypicalCapex] = useState('$50,000 - $100,000');
  const [avgMargin, setAvgMargin] = useState('25.0%');
  const [riskIndex, setRiskIndex] = useState('Low-Medium');
  const [breakevenMonths, setBreakevenMonths] = useState('12');
  const [targetFootfall, setTargetFootfall] = useState('600+ per hour');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchDatasetsAndTelemetry = async () => {
    try {
      setIsLoading(true);
      const [bizData, telemetryData] = await Promise.all([
        adminService.getBusinesses(),
        planService.getAdminPlansTelemetry().catch(() => null),
      ]);
      setDatasets(bizData);
      if (telemetryData) setTelemetry(telemetryData);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch business benchmarks.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasetsAndTelemetry();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingDataset(null);
    setName('');
    setCategory('Food & Beverage');
    setTypicalCapex('$60,000 - $120,000');
    setAvgMargin('25.0%');
    setRiskIndex('Low-Medium');
    setBreakevenMonths('12');
    setTargetFootfall('600+ per hour');
    setShowModal(true);
  };

  const handleOpenEdit = (item: BusinessDataset) => {
    setEditingDataset(item);
    setName(item.name);
    setCategory(item.category);
    setTypicalCapex(item.typicalCapex);
    setAvgMargin(item.avgMargin);
    setRiskIndex(item.riskIndex);
    setBreakevenMonths(String(item.breakevenMonths));
    setTargetFootfall(item.targetFootfall);
    setShowModal(true);
  };

  const handleDelete = async (id: number, bName: string) => {
    if (!window.confirm(`Are you sure you want to delete the benchmark for "${bName}"?`)) return;
    try {
      await adminService.deleteBusiness(id);
      setDatasets((prev) => prev.filter((d) => d.id !== id));
      showToast(`Benchmark "${bName}" deleted successfully.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete benchmark.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingDataset) {
        const updated = await adminService.updateBusiness(editingDataset.id, {
          name,
          category,
          typicalCapex,
          avgMargin,
          riskIndex,
          breakevenMonths: Number(breakevenMonths),
          targetFootfall,
        });
        setDatasets((prev) => prev.map((d) => (d.id === editingDataset.id ? updated : d)));
        showToast(`Benchmark "${updated.name}" updated successfully.`);
      } else {
        const created = await adminService.createBusiness({
          name,
          category,
          typicalCapex,
          avgMargin,
          riskIndex,
          breakevenMonths: Number(breakevenMonths),
          targetFootfall,
        });
        setDatasets((prev) => [created, ...prev]);
        showToast(`New benchmark "${created.name}" created.`);
      }
      setShowModal(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save benchmark.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Business Benchmarks & Feasibility Telemetry"
          description="Curate reference business models, review submitted business plans, and monitor platform feasibility metrics."
          badge="Admin Console"
          badgeVariant="primary"
        />
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDatasetsAndTelemetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          {activeTab === 'benchmarks' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              New Benchmark
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#27272A] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('benchmarks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'benchmarks'
              ? 'bg-[#FFBF24] text-[#0B0B0C]'
              : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Industry Benchmarks ({datasets.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'plans'
              ? 'bg-[#FFBF24] text-[#0B0B0C]'
              : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D]'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>User Business Plans ({telemetry?.totalPlans || 0})</span>
        </button>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
              : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tab 1: Industry Benchmarks */}
      {activeTab === 'benchmarks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-xs text-[#71717A]">
              Loading business benchmark datasets...
            </div>
          ) : datasets.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-[#71717A]">
              No business benchmarks defined.
            </div>
          ) : (
            datasets.map((item) => (
              <Card
                key={item.id}
                className="border-[#27272A] bg-[#111113] flex flex-col justify-between hover:border-[#FFBF24]/40 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#FFBF24] px-1.5 py-0.5 rounded bg-[#FFBF24]/10 border border-[#FFBF24]/30">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#F8FAFC] mt-2 leading-snug">
                        {item.name}
                      </h3>
                    </div>
                    <Badge variant="outline" size="sm">
                      ID #{item.id}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs py-2 border-t border-b border-[#27272A] my-3">
                    <div className="flex items-center justify-between text-[#A1A1AA]">
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#FFBF24]" />
                        <span>Typical CapEx:</span>
                      </span>
                      <span className="font-mono text-[#F8FAFC]">{item.typicalCapex}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#A1A1AA]">
                      <span className="flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5 text-[#22C55E]" />
                        <span>Target Net Margin:</span>
                      </span>
                      <span className="font-mono text-[#22C55E]">{item.avgMargin}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#A1A1AA]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>Break-even Target:</span>
                      </span>
                      <span className="font-mono text-[#F8FAFC]">{item.breakevenMonths} mos</span>
                    </div>

                    <div className="flex items-center justify-between text-[#A1A1AA]">
                      <span className="flex items-center gap-1.5">
                        <Footprints className="w-3.5 h-3.5 text-[#F472B6]" />
                        <span>Target Footfall:</span>
                      </span>
                      <span className="font-mono text-[#D4D4D8]">{item.targetFootfall}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.riskIndex.includes('Low')
                        ? 'bg-[#22C55E]/15 text-[#22C55E]'
                        : item.riskIndex.includes('Medium')
                        ? 'bg-[#FFBF24]/15 text-[#FFBF24]'
                        : 'bg-[#EF4444]/15 text-[#EF4444]'
                    }`}
                  >
                    Risk: {item.riskIndex}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-[#A1A1AA] hover:text-[#FFBF24] transition-colors"
                      title="Edit Benchmark"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 text-[#A1A1AA] hover:text-[#EF4444] transition-colors"
                      title="Delete Benchmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab 2: User Business Plans Telemetry */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Telemetry KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#111113] border border-[#27272A]">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">
                Total Business Plans
              </span>
              <p className="text-2xl font-bold text-[#F8FAFC] font-mono mt-1">
                {telemetry?.totalPlans || 0}
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5">Created across users</p>
            </div>

            <div className="p-4 rounded-xl bg-[#111113] border border-[#27272A]">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">
                Analyzed Plans
              </span>
              <p className="text-2xl font-bold text-[#22C55E] font-mono mt-1">
                {telemetry?.analyzedPlans || 0}
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5">Completed feasibility engine</p>
            </div>

            <div className="p-4 rounded-xl bg-[#111113] border border-[#27272A]">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">
                Draft Plans
              </span>
              <p className="text-2xl font-bold text-[#FFBF24] font-mono mt-1">
                {telemetry?.draftPlans || 0}
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5">In-progress formulations</p>
            </div>

            <div className="p-4 rounded-xl bg-[#111113] border border-[#27272A]">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">
                Avg Feasibility Score
              </span>
              <p className="text-2xl font-bold text-[#38BDF8] font-mono mt-1">
                {telemetry?.averageFeasibilityScore || 0}
                <span className="text-xs text-[#71717A] font-normal"> / 100</span>
              </p>
              <p className="text-[10px] text-[#71717A] mt-0.5">Server evaluation mean</p>
            </div>
          </div>

          {/* User Plans Table */}
          <Card className="border-[#27272A] bg-[#111113]">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#FFBF24]" />
                User Business Plans Registry
              </CardTitle>
              <CardDescription className="text-xs">
                All business plans submitted by platform users with server-side feasibility scores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#27272A] text-[#A1A1AA] text-left">
                      <th className="pb-3 font-semibold">ID</th>
                      <th className="pb-3 font-semibold">Business Name</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Location</th>
                      <th className="pb-3 font-semibold text-right">CapEx</th>
                      <th className="pb-3 font-semibold text-right">Monthly Rev</th>
                      <th className="pb-3 font-semibold text-center">Score</th>
                      <th className="pb-3 font-semibold text-center">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E1E22]">
                    {!telemetry?.plans || telemetry.plans.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-[#71717A]">
                          No user business plans recorded.
                        </td>
                      </tr>
                    ) : (
                      telemetry.plans.map((p) => {
                        const score = p.feasibilityScore || 0;
                        return (
                          <tr key={p.id} className="hover:bg-[#16161B] transition-colors">
                            <td className="py-3 font-mono text-[#71717A]">#{p.id}</td>
                            <td className="py-3 font-semibold text-[#F8FAFC]">
                              {p.businessName || p.business_name}
                            </td>
                            <td className="py-3">
                              <span className="font-mono text-[#FFBF24] bg-[#FFBF24]/10 px-1.5 py-0.5 rounded">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-3 text-[#A1A1AA]">{p.location || 'India'}</td>
                            <td className="py-3 text-right font-mono text-[#F8FAFC]">
                              {formatCurrency(p.totalInitialInvestment || 0)}
                            </td>
                            <td className="py-3 text-right font-mono text-[#22C55E]">
                              {p.monthlyRevenue ? formatCurrency(p.monthlyRevenue) : '—'}
                            </td>
                            <td className="py-3 text-center">
                              {score > 0 ? (
                                <span className="font-mono font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
                                  {score}/100
                                </span>
                              ) : (
                                <span className="text-[#71717A]">—</span>
                              )}
                            </td>
                            <td className="py-3 text-center">
                              <span
                                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                                  p.planStatus === 'analyzed'
                                    ? 'bg-[#22C55E]/15 text-[#22C55E]'
                                    : 'bg-[#FFBF24]/15 text-[#FFBF24]'
                                }`}
                              >
                                {p.planStatus || 'draft'}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setInspectingPlan(p)}
                                className="text-[11px] h-7 px-2"
                              >
                                <Eye className="w-3 h-3 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plan Inspection Modal */}
      {inspectingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-[#111113] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-[#27272A] flex items-center justify-between bg-[#16161B]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FFBF24]" />
                <h3 className="text-sm font-bold text-[#F8FAFC]">
                  {inspectingPlan.businessName || inspectingPlan.business_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingPlan(null)}
                className="p-1 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded bg-[#16161B] border border-[#27272A]">
                  <span className="text-[#A1A1AA]">Category:</span>
                  <p className="font-semibold text-[#FFBF24]">{inspectingPlan.category}</p>
                </div>
                <div className="p-2.5 rounded bg-[#16161B] border border-[#27272A]">
                  <span className="text-[#A1A1AA]">Location:</span>
                  <p className="font-semibold text-[#F8FAFC]">{inspectingPlan.location || 'India'}</p>
                </div>
                <div className="p-2.5 rounded bg-[#16161B] border border-[#27272A]">
                  <span className="text-[#A1A1AA]">Total Initial CapEx:</span>
                  <p className="font-mono font-bold text-[#F8FAFC]">
                    {formatCurrency(inspectingPlan.totalInitialInvestment || 0)}
                  </p>
                </div>
                <div className="p-2.5 rounded bg-[#16161B] border border-[#27272A]">
                  <span className="text-[#A1A1AA]">Feasibility Score:</span>
                  <p className="font-mono font-bold text-[#22C55E]">
                    {inspectingPlan.feasibilityScore || 0}/100 ({inspectingPlan.riskLevel || 'N/A'})
                  </p>
                </div>
              </div>

              {inspectingPlan.description && (
                <div className="p-3 rounded bg-[#16161B] border border-[#27272A]">
                  <span className="text-[#A1A1AA] block mb-1">Description:</span>
                  <p className="text-[#D4D4D8]">{inspectingPlan.description}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#27272A] bg-[#16161B] flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setInspectingPlan(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Create/Edit Benchmark */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#111113] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-[#27272A] flex items-center justify-between bg-[#16161B]">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FFBF24]" />
                <h3 className="text-sm font-bold text-[#F8FAFC]">
                  {editingDataset ? 'Edit Industry Benchmark' : 'New Industry Benchmark'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <Input
                label="Benchmark Name *"
                placeholder="e.g. Specialty Coffee Bar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#16161B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24]"
                  >
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Retail">Retail</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Beauty & Salon">Beauty & Salon</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <Input
                  label="Typical CapEx Range"
                  placeholder="e.g. $50,000 - $100,000"
                  value={typicalCapex}
                  onChange={(e) => setTypicalCapex(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Avg Margin"
                  placeholder="e.g. 25.0%"
                  value={avgMargin}
                  onChange={(e) => setAvgMargin(e.target.value)}
                />
                <Input
                  label="Risk Index"
                  placeholder="e.g. Low-Medium"
                  value={riskIndex}
                  onChange={(e) => setRiskIndex(e.target.value)}
                />
                <Input
                  label="Break-even (Mos)"
                  type="number"
                  placeholder="e.g. 12"
                  value={breakevenMonths}
                  onChange={(e) => setBreakevenMonths(e.target.value)}
                />
              </div>

              <Input
                label="Target Footfall"
                placeholder="e.g. 600+ per hour"
                value={targetFootfall}
                onChange={(e) => setTargetFootfall(e.target.value)}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#27272A]">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingDataset ? 'Save Changes' : 'Create Benchmark'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
