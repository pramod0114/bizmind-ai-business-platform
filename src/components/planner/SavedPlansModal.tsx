import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { BusinessPlan } from '../../types';
import {
  FolderOpen,
  X,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
  Building2,
  MapPin,
  Calendar,
} from 'lucide-react';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: BusinessPlan[];
  activePlanId?: number | string | null;
  onSelectPlan: (plan: BusinessPlan) => void;
  onDeletePlan: (planId: number | string) => void;
  onCreateNew: () => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  onCreateNew,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#111113] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#27272A] flex items-center justify-between bg-[#16161B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFBF24]/10 border border-[#FFBF24]/30 flex items-center justify-center text-[#FFBF24]">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC]">
                Saved Business Plans & Scenarios
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Select a saved plan to view its feasibility dashboard or edit parameters.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#27272A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {plans.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <Building2 className="w-10 h-10 text-[#71717A] mx-auto" />
              <p className="text-sm font-semibold text-[#D4D4D8]">No business plans saved yet</p>
              <p className="text-xs text-[#A1A1AA]">
                Start by creating your first business plan with the multi-step financial wizard.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onCreateNew();
                  onClose();
                }}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Create New Business Plan
              </Button>
            </div>
          ) : (
            plans.map((p) => {
              const isSelected = p.id === activePlanId;
              const investment = p.totalInitialInvestment || 0;
              const score = p.feasibilityScore || 0;

              return (
                <div
                  key={p.id}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#1A1A1D] border-[#FFBF24] shadow-md shadow-[#FFBF24]/10'
                      : 'bg-[#16161B] border-[#27272A] hover:border-[#FFBF24]/40'
                  }`}
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      onSelectPlan(p);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-mono font-bold bg-[#FFBF24]/15 text-[#FFBF24] px-2 py-0.5 rounded">
                        {p.category || 'General'}
                      </span>
                      <span className="text-[10px] font-mono text-[#A1A1AA] bg-[#27272A] px-2 py-0.5 rounded">
                        {p.planStatus === 'analyzed' ? 'Analyzed' : 'Draft'}
                      </span>
                      {score > 0 && (
                        <span className="text-[10px] font-mono font-bold bg-[#22C55E]/15 text-[#22C55E] px-2 py-0.5 rounded">
                          Score: {score}/100
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-[#F8FAFC]">
                      {p.businessName || p.business_name || 'Untitled Plan'}
                    </h4>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[#A1A1AA] flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FFBF24]" />
                        {p.location || 'India'}
                      </span>
                      <span className="font-mono text-[#D4D4D8]">
                        CapEx: {formatCurrency(investment)}
                      </span>
                      {p.monthlyRevenue && (
                        <span className="font-mono text-[#FFBF24]">
                          Rev: {formatCurrency(p.monthlyRevenue)}/mo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Button
                      variant={isSelected ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => {
                        onSelectPlan(p);
                        onClose();
                      }}
                      className="text-xs"
                    >
                      <span>Open</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>

                    <button
                      type="button"
                      title="Delete Plan"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${p.businessName || p.business_name}"?`)) {
                          onDeletePlan(p.id);
                        }
                      }}
                      className="p-2 rounded-lg text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#27272A] bg-[#16161B] flex items-center justify-between">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onCreateNew();
              onClose();
            }}
            className="text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Start New Business Plan
          </Button>

          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
