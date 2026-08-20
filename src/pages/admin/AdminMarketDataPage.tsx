/**
 * BizMind – Administrator Market Data & Geospatial Datasets Management
 */
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import {
  TrendingUp,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Footprints,
  DollarSign,
  Building,
  Activity,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { adminService } from '../../services/adminService';
import { MarketDataset } from '../../types';

export const AdminMarketDataPage: React.FC = () => {
  const [datasets, setDatasets] = useState<MarketDataset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MarketDataset | null>(null);

  // Form states
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [footfallIndex, setFootfallIndex] = useState('85.0');
  const [avgHouseholdIncome, setAvgHouseholdIncome] = useState('$95,000');
  const [commercialRentPerSqFt, setCommercialRentPerSqFt] = useState('$45.00');
  const [competitorDensity, setCompetitorDensity] = useState('Moderate (5.5/10)');
  const [growthTrend, setGrowthTrend] = useState('+6.2% YoY');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchMarketData = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getMarketData();
      setDatasets(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load market datasets.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setRegion('Innovation District');
    setCity('San Francisco, CA');
    setFootfallIndex('91.5');
    setAvgHouseholdIncome('$124,000');
    setCommercialRentPerSqFt('$58.00');
    setCompetitorDensity('High (8.0/10)');
    setGrowthTrend('+7.5% YoY');
    setShowModal(true);
  };

  const handleOpenEdit = (item: MarketDataset) => {
    setEditingItem(item);
    setRegion(item.region);
    setCity(item.city);
    setFootfallIndex(String(item.footfallIndex));
    setAvgHouseholdIncome(item.avgHouseholdIncome);
    setCommercialRentPerSqFt(item.commercialRentPerSqFt);
    setCompetitorDensity(item.competitorDensity);
    setGrowthTrend(item.growthTrend);
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete market dataset "${name}"?`)) return;
    try {
      await adminService.deleteMarketData(id);
      setDatasets((prev) => prev.filter((d) => d.id !== id));
      showToast(`Market dataset "${name}" deleted.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete dataset.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!region.trim() || !city.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingItem) {
        const updated = await adminService.updateMarketData(editingItem.id, {
          region,
          city,
          footfallIndex: Number(footfallIndex),
          avgHouseholdIncome,
          commercialRentPerSqFt,
          competitorDensity,
          growthTrend,
        });
        setDatasets((prev) => prev.map((d) => (d.id === editingItem.id ? updated : d)));
        showToast(`Market dataset for ${updated.city} updated.`);
      } else {
        const created = await adminService.createMarketData({
          region,
          city,
          footfallIndex: Number(footfallIndex),
          avgHouseholdIncome,
          commercialRentPerSqFt,
          competitorDensity,
          growthTrend,
        });
        setDatasets((prev) => [created, ...prev]);
        showToast(`New market dataset created for ${created.city}.`);
      }
      setShowModal(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save market dataset.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Market Datasets & Geospatial Intelligence"
          description="Manage macroeconomic parameters, regional demographic indices, footfall multipliers, and rental benchmarks."
          badge="Admin Console"
          badgeVariant="primary"
        />
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMarketData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync Datasets
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Market Region
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

      {/* Market Datasets Table */}
      <Card className="border-[#27272A] bg-[#111113]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FFBF24]" />
              <span>Regional Market Records ({datasets.length})</span>
            </CardTitle>
            <Badge variant="outline" size="sm">
              Live Synchronized
            </Badge>
          </div>
          <CardDescription className="text-xs text-[#A1A1AA]">
            Feeding OpenStreetMap scoring and machine learning revenue forecasting pipelines.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#A1A1AA] uppercase border-b border-[#27272A] bg-[#1A1A1D]/60 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Region / City</th>
                  <th className="py-3 px-4">Footfall Index</th>
                  <th className="py-3 px-4">Median Income</th>
                  <th className="py-3 px-4">Rent / sq ft</th>
                  <th className="py-3 px-4">Competitor Density</th>
                  <th className="py-3 px-4">Growth YoY</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#71717A]">
                      Loading market intelligence datasets...
                    </td>
                  </tr>
                ) : datasets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#71717A]">
                      No regional datasets defined.
                    </td>
                  </tr>
                ) : (
                  datasets.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1A1A1D]/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#FFBF24] shrink-0" />
                          <div>
                            <p className="font-semibold text-[#F8FAFC]">{item.city}</p>
                            <p className="text-[10px] text-[#71717A]">{item.region}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#FFBF24]">{item.footfallIndex}</span>
                          <span className="text-[10px] text-[#71717A]">/ 100</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#F8FAFC]">
                        {item.avgHouseholdIncome}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#38BDF8]">
                        {item.commercialRentPerSqFt}
                      </td>
                      <td className="py-3.5 px-4 text-[#A1A1AA]">
                        {item.competitorDensity}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#22C55E] font-medium">
                        {item.growthTrend}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded hover:bg-[#1A1A1D] text-[#A1A1AA] hover:text-[#FFBF24] transition-colors cursor-pointer"
                            title="Edit market record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.city)}
                            className="p-1.5 rounded hover:bg-[#EF4444]/15 text-[#71717A] hover:text-[#EF4444] transition-colors cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0C]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#111113] border border-[#27272A] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <h3 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FFBF24]" />
                <span>{editingItem ? 'Edit Market Region' : 'Add Market Region'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#71717A] hover:text-[#F8FAFC] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="City / Metro *"
                  type="text"
                  placeholder="e.g. Austin, TX"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <Input
                  label="Sub-Region / Corridor *"
                  type="text"
                  placeholder="e.g. Downtown Core"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Footfall Index (0-100) *"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 88.5"
                  value={footfallIndex}
                  onChange={(e) => setFootfallIndex(e.target.value)}
                  required
                />
                <Input
                  label="Median Household Income *"
                  type="text"
                  placeholder="e.g. $105,000"
                  value={avgHouseholdIncome}
                  onChange={(e) => setAvgHouseholdIncome(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Commercial Rent / sq ft *"
                  type="text"
                  placeholder="e.g. $48.00"
                  value={commercialRentPerSqFt}
                  onChange={(e) => setCommercialRentPerSqFt(e.target.value)}
                  required
                />
                <Input
                  label="Annual Growth Trend *"
                  type="text"
                  placeholder="e.g. +7.2% YoY"
                  value={growthTrend}
                  onChange={(e) => setGrowthTrend(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Competitor Density Index"
                type="text"
                placeholder="e.g. High (7.8/10)"
                value={competitorDensity}
                onChange={(e) => setCompetitorDensity(e.target.value)}
              />

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
                  {isSubmitting ? 'Saving...' : editingItem ? 'Update Dataset' : 'Save Dataset'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
