import React, { useEffect, useRef, useState } from 'react';
import { Layers, MapPin, ZoomIn, ZoomOut, Navigation, Maximize2, Tag, AlertCircle } from 'lucide-react';
import { DiscoveredBusiness } from '../../types';
import { loadGoogleMaps, BIZMIND_DARK_MAP_STYLES } from '../../services/googleMapsService';

export interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  businesses?: DiscoveredBusiness[];
  radiusMeters?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  onBusinessSelect?: (business: DiscoveredBusiness) => void;
  onBusinessSave?: (business: DiscoveredBusiness) => void;
  height?: string;
  className?: string;
  showControls?: boolean;
  selectedBusinessId?: string | null;
  targetLocationName?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  center = [16.8524, 74.5815],
  zoom = 14,
  businesses = [],
  radiusMeters = 2000,
  onLocationSelect,
  onBusinessSelect,
  height = '460px',
  className = '',
  showControls = true,
  selectedBusinessId = null,
  targetLocationName = 'Selected Location',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const targetMarkerRef = useRef<google.maps.Marker | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);

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

        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng && onLocationSelect) {
            onLocationSelect(e.latLng.lat(), e.latLng.lng());
          }
        });

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
      if (targetMarkerRef.current) targetMarkerRef.current.setMap(null);
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

  // Update circle & markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    const google = window.google;

    // Radius circle
    if (circleRef.current) circleRef.current.setMap(null);
    if (radiusMeters > 0) {
      circleRef.current = new google.maps.Circle({
        strokeColor: '#FFBF24',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#FFBF24',
        fillOpacity: 0.08,
        map,
        center: { lat: center[0], lng: center[1] },
        radius: radiusMeters,
        clickable: false,
      });
    }

    // Target center marker
    if (targetMarkerRef.current) targetMarkerRef.current.setMap(null);
    const targetMarker = new google.maps.Marker({
      position: { lat: center[0], lng: center[1] },
      map,
      title: targetLocationName,
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

    targetMarker.addListener('click', () => {
      if (!infoWindowRef.current) return;
      infoWindowRef.current.setContent(`
        <div style="padding: 6px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 180px;">
          <div style="font-size: 10px; color: #FFBF24; font-weight: 800; text-transform: uppercase;">Analyzed Target Location</div>
          <div style="font-weight: 700; font-size: 13px; color: #F8FAFC; margin-top: 2px;">${targetLocationName}</div>
          <div style="font-size: 11px; color: #A1A1AA; font-family: monospace; margin-top: 2px;">
            ${center[0].toFixed(5)}, ${center[1].toFixed(5)}
          </div>
        </div>
      `);
      infoWindowRef.current.open(map, targetMarker);
    });
    targetMarkerRef.current = targetMarker;

    // Discovered Businesses
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    businesses.forEach((b) => {
      const isComp = b.isDirectCompetitor;
      const isSelected = selectedBusinessId === b.osm_id || selectedBusinessId === b.id;

      const marker = new google.maps.Marker({
        position: { lat: b.latitude, lng: b.longitude },
        map,
        title: b.name,
        zIndex: isSelected ? 900 : isComp ? 800 : 400,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 8 : isComp ? 6.5 : 5,
          fillColor: isComp ? '#EF4444' : '#3B82F6',
          fillOpacity: 1,
          strokeColor: isSelected ? '#FFFFFF' : '#0B0B0C',
          strokeWeight: isSelected ? 2 : 1.5,
        },
        label:
          showLabels && b.name
            ? {
                text: b.name.length > 20 ? `${b.name.substring(0, 18)}…` : b.name,
                color: isSelected ? '#FFBF24' : isComp ? '#FCA5A5' : '#CBD5E1',
                fontSize: '10px',
                fontWeight: '700',
              }
            : undefined,
      });

      marker.addListener('click', () => {
        if (onBusinessSelect) onBusinessSelect(b);
        if (infoWindowRef.current) {
          const googleMapsLink =
            (b as any).googleMapsUri ||
            `https://www.google.com/maps/search/?api=1&query=${b.latitude},${b.longitude}`;

          infoWindowRef.current.setContent(`
            <div style="padding: 8px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 220px; border-radius: 8px;">
              <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${isComp ? '#EF4444' : '#38BDF8'};">
                ${isComp ? '⚠️ Direct Competitor' : b.broadCategory}
              </div>
              <div style="font-weight: 800; font-size: 13px; color: #F8FAFC; margin-top: 2px;">
                ${b.name}
              </div>
              <div style="font-size: 11px; color: #FFBF24; margin-top: 2px;">
                ${b.category} • ${b.distance_formatted}
              </div>
              ${b.address ? `<div style="font-size: 11px; color: #A1A1AA; margin-top: 4px;">📍 ${b.address}</div>` : ''}
              <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #27272A;">
                <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: #38BDF8; font-weight: 700; text-decoration: none;">
                  View on Google Maps ↗
                </a>
              </div>
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current.push(marker);
    });
  }, [center[0], center[1], radiusMeters, businesses, targetLocationName, selectedBusinessId, showLabels]);

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

      {showControls && mapLoaded && (
        <>
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <div className="px-2.5 py-1.5 rounded-lg bg-[#111113]/90 border border-[#27272A] text-xs font-medium text-[#A1A1AA] backdrop-blur-md">
              <span className="text-[#F8FAFC] font-semibold">{businesses.length}</span> Places
            </div>
            <button
              onClick={() => setShowLabels((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
                showLabels ? 'bg-[#FFBF24] border-[#FFBF24] text-[#0B0B0C]' : 'bg-[#111113]/90 border-[#27272A] text-[#F8FAFC]'
              }`}
            >
              <Tag className="w-3.5 h-3.5 inline mr-1" />
              {showLabels ? 'Labels' : 'No Labels'}
            </button>
          </div>

          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <button
              onClick={() => {
                const z = mapInstanceRef.current?.getZoom();
                if (z !== undefined) mapInstanceRef.current?.setZoom(z + 1);
              }}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const z = mapInstanceRef.current?.getZoom();
                if (z !== undefined) mapInstanceRef.current?.setZoom(z - 1);
              }}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                mapInstanceRef.current?.panTo({ lat: center[0], lng: center[1] });
              }}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#FFBF24] flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-[#111113]/90 border border-[#27272A] text-[11px] font-mono text-[#F8FAFC] backdrop-blur-md flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />
            <span>
              {center[0].toFixed(4)}, {center[1].toFixed(4)}
            </span>
            <span className="text-[#FFBF24] pl-1 border-l border-[#27272A]">
              {(radiusMeters / 1000).toFixed(1)} km
            </span>
          </div>
        </>
      )}
    </div>
  );
};
