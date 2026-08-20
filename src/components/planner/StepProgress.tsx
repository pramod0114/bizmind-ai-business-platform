import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
  shortLabel: string;
  description: string;
}

export const PLANNER_STEPS: StepItem[] = [
  { id: 1, label: 'Business Profile', shortLabel: 'Info', description: 'Name, Category & Model' },
  { id: 2, label: 'Initial Investment', shortLabel: 'CapEx', description: 'Setup & Equipment' },
  { id: 3, label: 'Monthly Expenses', shortLabel: 'OpEx', description: 'Fixed Operating Overheads' },
  { id: 4, label: 'Revenue & Economics', shortLabel: 'Revenue', description: 'Pricing & Volume' },
  { id: 5, label: 'Review Assumptions', shortLabel: 'Review', description: 'Consolidated Summary' },
  { id: 6, label: 'Feasibility Analysis', shortLabel: 'Analysis', description: 'Score, ROI & Scenarios' },
];

interface StepProgressProps {
  currentStep: number;
  onSelectStep?: (step: number) => void;
  maxStepReached: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  onSelectStep,
  maxStepReached,
}) => {
  return (
    <div className="w-full bg-[#111113] border border-[#27272A] rounded-xl p-3 sm:p-4 mb-6 shadow-md">
      <div className="hidden md:grid grid-cols-6 gap-2">
        {PLANNER_STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isAccessible = step.id <= maxStepReached;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isAccessible}
              onClick={() => isAccessible && onSelectStep?.(step.id)}
              className={`text-left p-2.5 rounded-lg border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#1A1A1D] border-[#FFBF24] shadow-sm shadow-[#FFBF24]/10'
                  : isCompleted
                  ? 'bg-[#111113] border-[#27272A] hover:border-[#FFBF24]/50 cursor-pointer'
                  : 'bg-[#0E0E10] border-[#1E1E22] opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCompleted
                      ? 'bg-[#22C55E] text-[#0B0B0C]'
                      : isCurrent
                      ? 'bg-[#FFBF24] text-[#0B0B0C]'
                      : 'bg-[#27272A] text-[#A1A1AA]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
                </span>
                <span
                  className={`text-[9px] font-mono uppercase ${
                    isCurrent
                      ? 'text-[#FFBF24] font-semibold'
                      : isCompleted
                      ? 'text-[#22C55E]'
                      : 'text-[#71717A]'
                  }`}
                >
                  Step {step.id}
                </span>
              </div>
              <div>
                <p
                  className={`text-xs font-semibold truncate ${
                    isCurrent ? 'text-[#F8FAFC]' : isCompleted ? 'text-[#D4D4D8]' : 'text-[#71717A]'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-[#71717A] truncate mt-0.5">{step.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile Step Bar */}
      <div className="md:hidden flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#FFBF24] text-[#0B0B0C] flex items-center justify-center text-xs font-bold">
            {currentStep}
          </span>
          <div>
            <p className="text-xs font-bold text-[#F8FAFC]">
              {PLANNER_STEPS[currentStep - 1]?.label}
            </p>
            <p className="text-[10px] text-[#A1A1AA]">
              Step {currentStep} of 6 • {PLANNER_STEPS[currentStep - 1]?.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {PLANNER_STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all ${
                s.id === currentStep
                  ? 'w-6 bg-[#FFBF24]'
                  : s.id < currentStep
                  ? 'w-2 bg-[#22C55E]'
                  : 'w-2 bg-[#27272A]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
