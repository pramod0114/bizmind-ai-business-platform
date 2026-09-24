import React, { useEffect, useRef, useState } from 'react';
import { MarketCompetitor } from '../../types';
import { ZoomIn, ZoomOut, Maximize2, Flame, Building2, MapPin, Navigation, AlertCircle } from 'lucide-react';
import { loadGoogleMaps, BIZMIND_DARK_MAP_STYLES } from '../../services/googleMapsService';

interface CompetitorMapProps {
  center: [number, number];
  zoom?: number;
  radiusKm: number;
  locationName: string;
  competitors: MarketCompetitor[];
  otherBusinesses: MarketCompetitor[];
  selectedCompetitorId?: string | number | null;
  onSelectCompetitor?: (competitor: MarketCompetitor) => void;
  className?: string;
  height?: string;
}

export const CompetitorMap: React.FC<CompetitorMapProps> = ({
  center,
  zoom = 14,
  radiusKm,
  locationName,
  competitors = [],
  otherBusinesses = [],
  selectedCompetitorId,
  onSelectCompetitor,
  className = '',
  height = '480px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const centerMarkerRef = useRef<google.maps.Marker | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showOther, setShowOther] = useState(true);

  // Initialize Google Maps
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        setLoadError(null);
        const google = await loadGoogleMaps();
        if (!isMounted || !mapContainerRef.current) return;

        const map = new google.maps.Map(mapContainerRef.current, {
          center: { lat: center[0], lng: center[1] },
          zoom,
          styles: BIZMIND_DARK_MAP_STYLES,
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: 'greedy',
          backgroundColor: '#0B0B0C',
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();
        setMapLoaded(true);
      } catch (err: any) {
        if (!isMounted) return;
        setLoadError(err?.message || 'Failed to load Google Maps.');
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (circleRef.current) circleRef.current.setMap(null);
      if (centerMarkerRef.current) centerMarkerRef.current.setMap(null);
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.panTo({ lat: center[0], lng: center[1] });
  }, [center[0], center[1]]);

  // Update Circle, Target Marker & Competitors
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    const google = window.google;

    // 1. Draw Radius Circle
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }
    const radiusMeters = radiusKm * 1000;
    circleRef.current = new google.maps.Circle({
      strokeColor: '#FFBF24',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#FFBF24',
      fillOpacity: 0.07,
      map,
      center: { lat: center[0], lng: center[1] },
      radius: radiusMeters,
      clickable: false,
    });

    // 2. Draw Center Target Location Marker
    if (centerMarkerRef.current) {
      centerMarkerRef.current.setMap(null);
    }

    const centerMarker = new google.maps.Marker({
      position: { lat: center[0], lng: center[1] },
      map,
      title: locationName,
      zIndex: 1000,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#FFBF24',
        fillOpacity: 1,
        strokeColor: '#0B0B0C',
        strokeWeight: 3,
      },
    });

    centerMarker.addListener('click', () => {
      if (!infoWindowRef.current) return;
      infoWindowRef.current.setContent(`
        <div style="padding: 6px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 190px;">
          <div style="font-size: 10px; color: #FFBF24; font-weight: 800; text-transform: uppercase;">Analyzed Target Center</div>
          <div style="font-weight: 700; font-size: 13px; color: #F8FAFC; margin-top: 2px;">${locationName}</div>
          <div style="font-size: 11px; color: #A1A1AA; font-family: monospace; margin-top: 2px;">
            ${center[0].toFixed(5)}, ${center[1].toFixed(5)}
          </div>
          <div style="font-size: 11px; color: #CBD5E1; margin-top: 4px; border-top: 1px solid #27272A; padding-top: 3px;">
            Radius: <strong style="color: #FFBF24;">${radiusKm.toFixed(1)} km</strong>
          </div>
        </div>
      `);
      infoWindowRef.current.open(map, centerMarker);
    });

    centerMarkerRef.current = centerMarker;

    // 3. Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Helper to add markers
    const addMarker = (c: MarketCompetitor, isCompetitor: boolean) => {
      const isSelected = selectedCompetitorId === c.id;
      const displayName = c.name || c.business_name || 'Business';
      const marker = new google.maps.Marker({
        position: { lat: c.latitude, lng: c.longitude },
        map,
        title: displayName,
        zIndex: isSelected ? 900 : isCompetitor ? 800 : 400,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 8 : isCompetitor ? 6.5 : 5,
          fillColor: isCompetitor ? '#EF4444' : '#3B82F6',
          fillOpacity: 1,
          strokeColor: isSelected ? '#FFFFFF' : '#0B0B0C',
          strokeWeight: isSelected ? 2.5 : 1.5,
        },
      });

      marker.addListener('click', () => {
        if (onSelectCompetitor) onSelectCompetitor(c);

        if (infoWindowRef.current) {
          const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`;
          infoWindowRef.current.setContent(`
            <div style="padding: 8px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 230px; max-width: 280px; border-radius: 8px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${isCompetitor ? '#EF4444' : '#38BDF8'};">
                  ${isCompetitor ? '⚠️ Direct Competitor' : 'Trade Area Establishment'}
                </span>
                <span style="font-size: 10px; background: #27272A; padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #F8FAFC;">
                  ${c.distance_km < 1 ? `${Math.round(c.distance_km * 1000)} m` : `${c.distance_km.toFixed(1)} km`}
                </span>
              </div>

              <div style="font-weight: 800; font-size: 14px; color: #F8FAFC; margin-top: 4px; line-height: 1.3;">
                ${displayName}
              </div>

              <div style="font-size: 11px; color: #FFBF24; margin-top: 2px; font-weight: 600;">
                ${c.category}
              </div>

              ${c.address ? `<div style="font-size: 11px; color: #A1A1AA; margin-top: 4px; border-top: 1px solid #27272A; padding-top: 4px;">📍 ${c.address}</div>` : ''}

              <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #27272A; display: flex; align-items: center; justify-content: space-between;">
                <a 
                  href="${googleMapsLink}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style="font-size: 11px; color: #38BDF8; font-weight: 700; text-decoration: none;"
                >
                  View on Google Maps ↗
                </a>
              </div>
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current.push(marker);
    };

    // Render direct competitors
    competitors.forEach((c) => addMarker(c, true));

    // Render other businesses if toggled
    if (showOther) {
      otherBusinesses.forEach((c) => addMarker(c, false));
    }
  }, [center[0], center[1], radiusKm, competitors, otherBusinesses, selectedCompetitorId, showOther, locationName]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.panTo({ lat: center[0], lng: center[1] });
    mapInstanceRef.current.setZoom(14);
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current || !window.google?.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: center[0], lng: center[1] });
    competitors.forEach((c) => bounds.extend({ lat: c.latitude, lng: c.longitude }));
    if (showOther) {
      otherBusinesses.forEach((c) => bounds.extend({ lat: c.latitude, lng: c.longitude }));
    }
    mapInstanceRef.current.fitBounds(bounds, 40);
  };

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-[#27272A] bg-[#0B0B0C] ${className}`}
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {loadError && (
        <div className="absolute inset-0 bg-[#0B0B0C]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
          <AlertCircle className="w-8 h-8 text-[#FFBF24] mb-2" />
          <h4 className="text-sm font-bold text-white mb-1">Google Maps Platform</h4>
          <p className="text-xs text-[#A1A1AA] max-w-sm">{loadError}</p>
        </div>
      )}

      {mapLoaded && (
        <>
          {/* Top-Right Controls */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <button
              onClick={() => setShowOther(!showOther)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
                showOther
                  ? 'bg-[#111113]/90 border-[#27272A] text-[#F8FAFC]'
                  : 'bg-[#111113]/60 border-[#27272A] text-[#71717A]'
              }`}
              title="Toggle other businesses in trade zone"
            >
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${showOther ? 'bg-blue-400' : 'bg-zinc-600'}`}></span>
                Other ({otherBusinesses.length})
              </span>
            </button>

            <button
              onClick={handleFitAll}
              className="p-2 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] backdrop-blur-md transition-colors cursor-pointer"
              title="Fit all markers in view"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#FFBF24]" />
            </button>
          </div>

          {/* Top-Left Zoom Controls */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <button
              onClick={() => {
                const z = mapInstanceRef.current?.getZoom();
                if (z !== undefined) mapInstanceRef.current?.setZoom(z + 1);
              }}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const z = mapInstanceRef.current?.getZoom();
                if (z !== undefined) mapInstanceRef.current?.setZoom(z - 1);
              }}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleRecenter}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#FFBF24] flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
              title="Recenter on target"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Legend */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111113]/90 border border-[#27272A] text-xs backdrop-blur-md">
            <span className="flex items-center gap-1 text-red-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              {competitors.length} Direct Competitors
            </span>
            <span className="text-[#27272A]">|</span>
            <span className="text-[#A1A1AA] font-mono text-[11px]">
              {center[0].toFixed(4)}, {center[1].toFixed(4)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
