/**
 * BizMind – Saved Location Predictions Modal
 */
import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { locationPredictionClient } from '../../services/locationPredictionService';
import { Bookmark, MapPin, Calendar, Trash2, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface SavedPredictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrediction: (prediction: any) => void;
}

export const SavedPredictionsModal: React.FC<SavedPredictionsModalProps> = ({
  isOpen,
  onClose,
  onSelectPrediction,
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSaved();
    }
  }, [isOpen]);

  const loadSaved = async () => {
    try {
      setLoading(true);
      const data = await locationPredictionClient.listSavedPredictions();
      setItems(data);
    } catch (err) {
      console.error('Failed to load saved predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      setDeletingId(id);
      await locationPredictionClient.deleteSavedPrediction(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete saved prediction:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Saved Location Predictions" size="lg">
      <div className="space-y-4">
        <p className="text-xs text-[#A1A1AA]">
          Review previously saved location-based opportunity assessments and competitor intelligence reports.
        </p>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#FFBF24]" />
            <span className="text-xs text-[#A1A1AA]">Loading saved evaluations...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-[#111113] border border-[#27272A] p-6 space-y-2">
            <Bookmark className="w-8 h-8 text-[#FFBF24] mx-auto opacity-40" />
            <h4 className="text-sm font-bold text-[#F8FAFC]">No Saved Predictions Found</h4>
            <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
              Analyze a location opportunity and click &quot;Save Analysis&quot; to archive it here for future reference.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {items.map((item) => {
              const comp = item.competitor_metrics || {};
              const pred = item.prediction_assessment || {};
              const feas = pred.feasibilityAssessment || {};

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectPrediction(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-[#111113] hover:bg-[#18181B] border border-[#27272A] hover:border-[#FFBF24]/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#FFBF24] transition-colors">
                        {item.business_idea}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1F2937] text-[#38BDF8] font-semibold">
                        {item.business_category}
                      </span>
                      {pred.mlModelValidated && pred.successProbability !== null ? (
                        <Badge variant="success">{pred.successProbability}% Success Prob</Badge>
                      ) : (
                        <Badge variant="warning">{feas.feasibilityGrade || 'Feasibility Evaluated'}</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#A1A1AA] flex-wrap">
                      <span className="flex items-center gap-1 text-[#F8FAFC]">
                        <MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />
                        {item.location_name}
                      </span>
                      <span>•</span>
                      <span>{comp.relevantCompetitorCount ?? 0} Competitors</span>
                      <span>•</span>
                      <span>Radius: {((item.radius_meters || 2000) / 1000).toFixed(1)} km</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[11px] text-[#71717A]">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, item.id)}
                      disabled={deletingId === item.id}
                      className="p-2 rounded-lg text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
                      title="Delete analysis"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#EF4444]" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Load
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
