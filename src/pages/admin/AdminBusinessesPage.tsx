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
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { adminService } from '../../services/adminService';
import { BusinessDataset } from '../../types';

export const AdminBusinessesPage: React.FC = () => {
  const [datasets, setDatasets] = useState<BusinessDataset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingDataset, setEditingDataset] = useState<BusinessDataset | null>(null);

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

  const fetchDatasets = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getBusinesses();
      setDatasets(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch business benchmarks.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
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
          title="Business Benchmarks & Industry Datasets"
          description="Curate reference business models, baseline CapEx models, risk indices, and operational targets."
          badge="Admin Console"
          badgeVariant="primary"
        />
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDatasets}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Benchmark
          </Button>
        </div>
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

      {/* Grid of Business Datasets */}
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
            <Card key={item.id} className="border-[#27272A] bg-[#111113] flex flex-col justify-between hover:border-[#FFBF24]/40 transition-all">
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
                    <span className="font-mono text-[#F8FAFC] font-semibold">{item.typicalCapex}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#A1A1AA]">
                    <span className="flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span>Avg Profit Margin:</span>
                    </span>
                    <span className="font-mono text-[#22C55E] font-semibold">{item.avgMargin}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#A1A1AA]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Breakeven Horizon:</span>
                    </span>
                    <span className="font-mono text-[#F8FAFC]">{item.breakevenMonths} Months</span>
                  </div>

                  <div className="flex items-center justify-between text-[#A1A1AA]">
                    <span className="flex items-center gap-1.5">
                      <Footprints className="w-3.5 h-3.5 text-[#A1A1AA]" />
                      <span>Target Footfall:</span>
                    </span>
                    <span className="font-mono text-[#F8FAFC]">{item.targetFootfall}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-[#71717A] font-mono">
                  Risk: <span className="text-[#FFBF24]">{item.riskIndex}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded hover:bg-[#1A1A1D] text-[#A1A1AA] hover:text-[#FFBF24] transition-colors cursor-pointer"
                    title="Edit benchmark"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1.5 rounded hover:bg-[#EF4444]/15 text-[#71717A] hover:text-[#EF4444] transition-colors cursor-pointer"
                    title="Delete benchmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Benchmark Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0C]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <h3 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#FFBF24]" />
                <span>{editingDataset ? 'Edit Business Benchmark' : 'Create Industry Benchmark'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#71717A] hover:text-[#F8FAFC] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                label="Benchmark Name *"
                type="text"
                placeholder="e.g. Specialty Artisanal Bakery"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#F8FAFC] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1A1A1D] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24]"
                  >
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Personal Services">Personal Services</option>
                    <option value="Retail & Specialty">Retail & Specialty</option>
                    <option value="Commercial Spaces">Commercial Spaces</option>
                    <option value="Technology & SaaS">Technology & SaaS</option>
                  </select>
                </div>

                <Input
                  label="Typical CapEx Range *"
                  type="text"
                  placeholder="e.g. $70,000 - $150,000"
                  value={typicalCapex}
                  onChange={(e) => setTypicalCapex(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Average Profit Margin *"
                  type="text"
                  placeholder="e.g. 26.5%"
                  value={avgMargin}
                  onChange={(e) => setAvgMargin(e.target.value)}
                  required
                />

                <Input
                  label="Breakeven Horizon (Months) *"
                  type="number"
                  placeholder="e.g. 14"
                  value={breakevenMonths}
                  onChange={(e) => setBreakevenMonths(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Target Footfall Threshold"
                  type="text"
                  placeholder="e.g. 700+ per hour"
                  value={targetFootfall}
                  onChange={(e) => setTargetFootfall(e.target.value)}
                />

                <div>
                  <label className="block text-xs font-medium text-[#F8FAFC] mb-1.5">
                    Risk Assessment Level
                  </label>
                  <select
                    value={riskIndex}
                    onChange={(e) => setRiskIndex(e.target.value)}
                    className="w-full bg-[#1A1A1D] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FFBF24]"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Low-Medium">Low-Medium Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Medium-High">Medium-High Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#27272A]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingDataset ? 'Update Benchmark' : 'Save Benchmark'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
