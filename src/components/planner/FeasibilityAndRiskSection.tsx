import React from 'react';
import {
  FeasibilityStatus,
  RiskIndicator,
  TargetComparisonItem,
} from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  TrendingUp,
  Award,
} from 'lucide-react';

interface FeasibilityAndRiskSectionProps {
  feasibilityStatus: FeasibilityStatus;
  feasibilityScore: number;
  feasibilityReasons: string[];
  riskIndicators: RiskIndicator[];
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' | string;
  targetComparisons: TargetComparisonItem[];
}

export const FeasibilityAndRiskSection: React.FC<FeasibilityAndRiskSectionProps> = ({
  feasibilityStatus,
  feasibilityScore,
  feasibilityReasons,
  riskIndicators,
  riskLevel,
  targetComparisons,
}) => {
  // Styling according to status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Strong Financial Feasibility':
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          bar: 'bg-emerald-500',
        };
      case 'Moderate Financial Feasibility':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          bar: 'bg-amber-500',
        };
      case 'Needs Review':
        return {
          text: 'text-orange-400',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
          bar: 'bg-orange-500',
        };
      default:
        return {
          text: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          badge: 'bg-red-500/20 text-red-300 border-red-500/30',
          bar: 'bg-red-500',
        };
    }
  };

  const colors = getStatusColor(feasibilityStatus);

  return (
    <div className="space-y-6">
      {/* 1. Feasibility Score & Summary Card */}
      <div className={`p-5 rounded-xl border ${colors.border} ${colors.bg} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg bg-black/30 ${colors.text}`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{feasibilityStatus}</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${colors.badge}`}>
                  {riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Authoritative rule-based financial evaluation synthesized from operating margins, break-even barrier, and capital payback speed.
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
            <div className="text-3xl font-extrabold text-white">
              {feasibilityScore}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Feasibility Score
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.max(5, Math.min(100, feasibilityScore))}%` }}
          />
        </div>

        {/* Contributing Evaluation Drivers */}
        <div className="pt-2">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
            Evaluation Breakdown & Drivers:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {feasibilityReasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-200 bg-black/20 p-2.5 rounded-lg border border-white/5"
              >
                <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${colors.text}`} />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Targets Comparison Grid */}
      {targetComparisons.length > 0 && (
        <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#27272A] pb-3">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">Target vs Projected Comparison</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {targetComparisons.map((t, idx) => {
              const isMet = t.status === 'MET' || t.status === 'EXCEEDED';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg bg-[#202024] border transition-colors ${
                    isMet ? 'border-emerald-500/20' : 'border-amber-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">{t.targetName}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isMet
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">Target:</div>
                      <div className="text-sm font-semibold text-slate-300">
                        {t.unit === '₹' ? `₹${t.targetValue.toLocaleString('en-IN')}` : `${t.targetValue} ${t.unit}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Projected:</div>
                      <div className={`text-base font-bold ${isMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {t.unit === '₹' ? `₹${t.projectedValue.toLocaleString('en-IN')}` : `${t.projectedValue} ${t.unit}`}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#27272A] text-[11px] text-slate-400">
                    {t.displayText}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Financial Risk Indicators */}
      <div className="bg-[#18181B] rounded-xl border border-[#27272A] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">Financial Risk Indicators</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {riskIndicators.length} risk factor{riskIndicators.length === 1 ? '' : 's'} identified
          </span>
        </div>

        {riskIndicators.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-sm font-semibold text-emerald-200">No Critical Financial Risks Detected</strong>
              All primary operational ratios (profit margin, fixed overhead ratio, payback horizon, and break-even dependency) are comfortably within commercial feasibility limits.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {riskIndicators.map((risk, idx) => {
              const isHigh = risk.severity === 'HIGH';
              const isMed = risk.severity === 'MEDIUM';

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border transition-colors flex items-start gap-3 ${
                    isHigh
                      ? 'bg-red-500/5 border-red-500/20 text-red-200'
                      : isMed
                      ? 'bg-amber-500/5 border-amber-500/20 text-amber-200'
                      : 'bg-blue-500/5 border-blue-500/20 text-blue-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isHigh ? (
                      <AlertOctagon className="w-4 h-4 text-red-400" />
                    ) : isMed ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{risk.area}</span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          isHigh
                            ? 'bg-red-500/20 text-red-400'
                            : isMed
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {risk.severity} SEVERITY
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{risk.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
