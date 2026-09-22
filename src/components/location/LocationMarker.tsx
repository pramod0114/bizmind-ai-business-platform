import L from 'leaflet';
import { DiscoveredBusiness } from '../../types';

export const CATEGORY_MARKER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  restaurant: { bg: '#EF4444', border: '#B91C1C', text: '#FFFFFF' },
  cafe: { bg: '#F59E0B', border: '#D97706', text: '#000000' },
  fast_food: { bg: '#F97316', border: '#EA580C', text: '#FFFFFF' },
  bar: { bg: '#8B5CF6', border: '#7C3AED', text: '#FFFFFF' },
  supermarket: { bg: '#10B981', border: '#059669', text: '#FFFFFF' },
  convenience: { bg: '#14B8A6', border: '#0D9488', text: '#FFFFFF' },
  bakery: { bg: '#F59E0B', border: '#B45309', text: '#FFFFFF' },
  pharmacy: { bg: '#06B6D4', border: '#0891B2', text: '#FFFFFF' },
  hospital: { bg: '#EC4899', border: '#BE185D', text: '#FFFFFF' },
  clinic: { bg: '#F43F5E', border: '#E11D48', text: '#FFFFFF' },
  bank: { bg: '#3B82F6', border: '#2563EB', text: '#FFFFFF' },
  atm: { bg: '#60A5FA', border: '#3B82F6', text: '#FFFFFF' },
  hotel: { bg: '#6366F1', border: '#4F46E5', text: '#FFFFFF' },
  gym: { bg: '#10B981', border: '#047857', text: '#FFFFFF' },
  school: { bg: '#A855F7', border: '#9333EA', text: '#FFFFFF' },
  clothes: { bg: '#EC4899', border: '#DB2777', text: '#FFFFFF' },
  electronics: { bg: '#38BDF8', border: '#0284C7', text: '#FFFFFF' },
  default: { bg: '#94A3B8', border: '#64748B', text: '#000000' },
};

/**
 * Generates an SVG/HTML divIcon for the target chosen location with a pulsing beacon effect
 */
export function createTargetLocationIcon(label: string = 'Target Location'): L.DivIcon {
  return L.divIcon({
    className: 'custom-target-marker',
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; pointer-events: auto;">
        <span style="position: absolute; inset: 0; border-radius: 50%; background: #FFBF24; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <span style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(255, 191, 36, 0.2); border: 1.5px solid #FFBF24;"></span>
        <div style="position: relative; z-index: 10; width: 24px; height: 24px; border-radius: 50%; background: #FFBF24; color: #0B0B0C; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); border: 2px solid #FFFFFF;">
          ★
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

/**
 * Generates an SVG/HTML divIcon for nearby businesses, highlighting direct competitors in red/amber
 */
export function createBusinessMarkerIcon(business: DiscoveredBusiness, isSelected: boolean = false): L.DivIcon {
  const isDirect = Boolean(business.is_direct_competitor || business.isDirectCompetitor);
  const catKey = (business.category || '').toLowerCase();
  const theme = isDirect
    ? { bg: '#DC2626', border: '#EF4444', text: '#FFFFFF' }
    : (CATEGORY_MARKER_COLORS[catKey] || CATEGORY_MARKER_COLORS.default);

  const size = isSelected ? 34 : isDirect ? 28 : 22;
  const borderStyle = isSelected ? '3px solid #FFBF24' : `1.5px solid ${theme.border}`;
  const iconLetter = (business.category || business.name || 'B').charAt(0).toUpperCase();

  return L.divIcon({
    className: 'custom-business-marker',
    html: `
      <div class="flex items-center justify-center cursor-pointer transition-transform hover:scale-125" style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background-color: ${theme.bg};
        border: ${borderStyle};
        color: ${theme.text};
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        font-weight: 700;
        font-size: ${size >= 28 ? '12px' : '10px'};
      ">
        ${isDirect ? '!' : iconLetter}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}
