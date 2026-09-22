import React from 'react';
import { Target } from 'lucide-react';

export interface RadiusSelectorProps {
  selectedRadiusMeters: number;
  onChangeRadius: (radiusMeters: number) => void;
  disabled?: boolean;
  className?: string;
}

interface RadiusOption {
  label: string;
  meters: number;
  km: number;
  areaKm2: string;
}

const RADIUS_OPTIONS: RadiusOption[] = [
  { label: '0.5 km', meters: 500, km: 0.5, areaKm2: '0.79' },
  { label: '1.0 km', meters: 1000, km: 1.0, areaKm2: '3.14' },
  { label: '2.0 km', meters: 2000, km: 2.0, areaKm2: '12.57' },
  { label: '5.0 km', meters: 5000, km: 5.0, areaKm2: '78.54' },
];

export const RadiusSelector: React.FC<RadiusSelectorProps> = ({
  selectedRadiusMeters,
  onChangeRadius,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-[#FFBF24]" />
          Analysis Radius
        </label>
        <span className="text-[11px] text-[#71717A]">
          Area: ~{(Math.PI * Math.pow(selectedRadiusMeters / 1000, 2)).toFixed(2)} km²
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {RADIUS_OPTIONS.map((opt) => {
          const isSelected = selectedRadiusMeters === opt.meters;
          return (
            <button
              key={opt.meters}
              type="button"
              disabled={disabled}
              onClick={() => onChangeRadius(opt.meters)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 ${
                isSelected
                  ? 'bg-[#FFBF24]/15 border-[#FFBF24] text-[#FFBF24] shadow-[0_0_12px_rgba(255,191,36,0.15)]'
                  : 'bg-[#111113] border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D]'
              }`}
            >
              <span className="text-xs font-bold">{opt.label}</span>
              <span className={`text-[10px] ${isSelected ? 'text-[#FFBF24]/80' : 'text-[#71717A]'}`}>
                ~{opt.areaKm2} km²
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
