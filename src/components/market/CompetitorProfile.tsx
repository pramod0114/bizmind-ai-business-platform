import React from 'react';
import { MarketCompetitor } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Building2,
  MapPin,
  Phone,
  Globe,
  Clock,
  ExternalLink,
  ShieldCheck,
  Tag,
  AlertCircle,
  Flame,
} from 'lucide-react';

interface CompetitorProfileProps {
  competitor: MarketCompetitor | null;
  isOpen: boolean;
  onClose: () => void;
  onFocusOnMap?: (competitor: MarketCompetitor) => void;
}

export const CompetitorProfile: React.FC<CompetitorProfileProps> = ({
  competitor,
  isOpen,
  onClose,
  onFocusOnMap,
}) => {
  if (!competitor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Competitor Profile & Spatial Attributes" size="md">
      <div className="space-y-4 text-xs">
        {/* Header Block */}
        <div className="p-4 rounded-xl bg-[#111113] border border-[#27272A] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-mono">
              OSM ID: {competitor.osm_id || 'POI-Record'}
            </span>
            <Badge variant={competitor.isDirectCompetitor !== false ? 'warning' : 'info'} size="sm">
              {competitor.isDirectCompetitor !== false ? 'Direct Competitor' : 'Nearby Commercial Point'}
            </Badge>
          </div>

          <h3 className="text-base font-bold text-[#F8FAFC]">{competitor.name}</h3>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-2 py-0.5 rounded bg-[#27272A] text-slate-200 text-[11px] font-medium flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#FFBF24]" />
              {competitor.category}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-[#FFBF24] border border-amber-500/20 text-[11px] font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {competitor.distance_formatted} away
            </span>
          </div>

          {competitor.relevanceReason && (
            <p className="text-[11px] text-[#A1A1AA] pt-1 leading-relaxed border-t border-[#27272A]/60">
              <strong className="text-slate-300">Classification Note:</strong> {competitor.relevanceReason}
            </p>
          )}
        </div>

        {/* Public Attributes Table */}
        <div className="p-4 rounded-xl bg-[#111113] border border-[#27272A] space-y-3">
          <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
            Verified Public Attributes
          </h4>

          <div className="space-y-2.5">
            {/* Address */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#A1A1AA] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[#A1A1AA] block text-[10px]">Address</span>
                <span className="text-[#F8FAFC] leading-snug">
                  {competitor.address || 'Address details not cataloged in OpenStreetMap'}
                </span>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#A1A1AA] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[#A1A1AA] block text-[10px]">Operating Hours</span>
                <span className={competitor.opening_hours ? 'text-[#F8FAFC]' : 'text-[#71717A] italic'}>
                  {competitor.opening_hours || 'Not available'}
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#A1A1AA] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[#A1A1AA] block text-[10px]">Telephone Contact</span>
                {competitor.phone ? (
                  <a href={`tel:${competitor.phone}`} className="text-[#38BDF8] hover:underline">
                    {competitor.phone}
                  </a>
                ) : (
                  <span className="text-[#71717A] italic">Not available</span>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-[#A1A1AA] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[#A1A1AA] block text-[10px]">Website / Online Link</span>
                {competitor.website ? (
                  <a
                    href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#38BDF8] hover:underline flex items-center gap-1"
                  >
                    <span>{competitor.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[#71717A] italic">Not available</span>
                )}
              </div>
            </div>

            {/* Price Information */}
            <div className="flex items-start gap-2.5">
              <Tag className="w-4 h-4 text-[#A1A1AA] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[#A1A1AA] block text-[10px]">Pricing & Ticket Size</span>
                <span className="text-[#71717A] italic">
                  Public price information unavailable. Never estimated.
                </span>
              </div>
            </div>

            {/* Spatial Coordinates */}
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-[#A1A1AA] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[#A1A1AA] block text-[10px]">Spatial Coordinates</span>
                <span className="font-mono text-[11px] text-[#A1A1AA]">
                  Lat: {competitor.latitude.toFixed(5)}, Lng: {competitor.longitude.toFixed(5)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Source Footnote */}
        <div className="p-3 rounded-lg bg-[#18181B] border border-[#27272A] flex items-center justify-between text-[11px] text-[#A1A1AA]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Data Source: {competitor.source || 'OpenStreetMap Contributors'}</span>
          </div>
          <span className="text-[10px] font-mono">
            {competitor.source_timestamp ? new Date(competitor.source_timestamp).toLocaleDateString() : 'Verified'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#27272A]">
          {onFocusOnMap && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onFocusOnMap(competitor);
                onClose();
              }}
              leftIcon={<MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />}
            >
              Locate on Map
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
