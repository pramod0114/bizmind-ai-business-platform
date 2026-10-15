import React from 'react';

interface RitLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const RitLogo: React.FC<RitLogoProps> = ({ className = 'h-10 w-auto', width, height }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded shadow-sm shrink-0 ${className}`}
      style={{
        backgroundColor: '#FFC72C',
        width: width ?? undefined,
        height: height ?? undefined,
      }}
      title="Rajarambapu Institute of Technology (RIT)"
    >
      <svg
        viewBox="0 0 300 90"
        className="w-full h-full object-contain"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="300" height="90" fill="#FFC72C" />
        {/* Letter 'r' */}
        <rect x="42" y="28" width="16" height="38" fill="#1C1B1F" />
        <rect x="42" y="28" width="88" height="12" fill="#1C1B1F" />

        {/* Letter 'i' with red square dot */}
        <rect x="135" y="14" width="13" height="13" fill="#D8232A" />
        <rect x="135" y="32" width="16" height="34" fill="#1C1B1F" />

        {/* Letter 't' */}
        <rect x="157" y="32" width="95" height="12" fill="#1C1B1F" />
        <rect x="157" y="32" width="16" height="34" fill="#1C1B1F" />
        <rect x="157" y="54" width="95" height="12" fill="#1C1B1F" />

        {/* Institution name subtitle */}
        <text
          x="150"
          y="79"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="10"
          fontWeight="800"
          letterSpacing="0.8"
          fill="#374151"
          textAnchor="middle"
        >
          RAJARAMBAPU INSTITUTE OF TECHNOLOGY
        </text>
      </svg>
    </div>
  );
};
