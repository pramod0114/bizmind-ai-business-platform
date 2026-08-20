/**
 * BizMind – Administrator Machine Learning Models & Pipeline Management
 */
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import {
  Cpu,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  BarChart,
  GitBranch,
  Timer,
  Check,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { adminService } from '../../services/adminService';
import { MLModel } from '../../types';

export const AdminMLPage: React.FC = () => {
  const [models, setModels] = useState<MLModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retrainingId, setRetrainingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getMLModels();
      setModels(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load ML models registry.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRetrain = async (model: MLModel) => {
    try {
      setRetrainingId(model.id);
      const updated = await adminService.retrainModel(model.id);
      setModels((prev) => prev.map((m) => (m.id === model.id ? updated : m)));
      showToast(`Model "${model.name}" retrained successfully and updated in production.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to retrain ML model.', 'error');
    } finally {
      setRetrainingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Machine Learning Models & Inference Telemetry"
          description="Monitor active ensemble models, inference latency, accuracy metrics, feature weight distributions, and trigger automated retraining jobs."
          badge="Admin Console"
          badgeVariant="primary"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchModels}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="self-start sm:self-auto"
        >
          Refresh Telemetry
        </Button>
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

      {/* Model Cards */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-[#71717A]">
            Loading ML model telemetry and ensemble configs...
          </div>
        ) : (
          models.map((model) => {
            const isRetraining = retrainingId === model.id;

            return (
              <Card key={model.id} className="border-[#27272A] bg-[#111113] overflow-hidden">
                <CardHeader className="bg-[#16161B]/60 border-b border-[#27272A]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#FFBF24]" />
                        <CardTitle className="text-base text-[#F8FAFC]">{model.name}</CardTitle>
                      </div>
                      <CardDescription className="text-xs text-[#A1A1AA] mt-0.5">
                        Architecture: <span className="text-[#F8FAFC] font-mono">{model.architecture}</span>
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A1D] border border-[#27272A] text-[#A1A1AA]">
                        {model.version}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRetrain(model)}
                        isLoading={isRetraining}
                        leftIcon={<Zap className="w-3.5 h-3.5" />}
                      >
                        {isRetraining ? 'Retraining...' : 'Retrain Model'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-5">
                  {/* Top Key Performance Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-[#16161B] border border-[#27272A]">
                      <p className="text-[10px] text-[#A1A1AA] uppercase">Test Accuracy</p>
                      <p className="text-xl font-bold text-[#22C55E] mt-1 font-mono">{model.accuracy}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#16161B] border border-[#27272A]">
                      <p className="text-[10px] text-[#A1A1AA] uppercase">F1 Macro Score</p>
                      <p className="text-xl font-bold text-[#FFBF24] mt-1 font-mono">{model.f1Score}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#16161B] border border-[#27272A]">
                      <p className="text-[10px] text-[#A1A1AA] uppercase">Inference Latency</p>
                      <p className="text-xl font-bold text-[#38BDF8] mt-1 font-mono">{model.avgLatencyMs} ms</p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#16161B] border border-[#27272A]">
                      <p className="text-[10px] text-[#A1A1AA] uppercase">Total Inferences</p>
                      <p className="text-xl font-bold text-[#F8FAFC] mt-1 font-mono">
                        {model.totalInferences.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Feature Importance Weights Bar Chart */}
                  <div>
                    <h4 className="text-xs font-semibold text-[#F8FAFC] mb-2.5 flex items-center gap-1.5">
                      <BarChart className="w-3.5 h-3.5 text-[#FFBF24]" />
                      <span>Feature Importance Weights (SHAP Values)</span>
                    </h4>

                    <div className="space-y-2">
                      {model.featureWeights?.map((fw, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#A1A1AA]">{fw.feature}</span>
                            <span className="text-[#FFBF24] font-mono font-semibold">
                              {(fw.weight * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#1A1A1D] overflow-hidden">
                            <div
                              className="h-full bg-[#FFBF24] rounded-full transition-all duration-500"
                              style={{ width: `${fw.weight * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#71717A] pt-2 border-t border-[#27272A] font-mono">
                    <span>Status: <span className="text-[#22C55E] font-medium">{model.status}</span></span>
                    <span>Last Trained: {model.lastTrained}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
