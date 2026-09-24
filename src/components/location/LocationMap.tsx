import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Layers,
  Compass,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  MapPin,
  Tag,
  AlertCircle,
  ExternalLink,
  BookmarkPlus,
  Building2,
} from 'lucide-react';
import { DiscoveredBusiness } from '../../types';
import { loadGoogleMaps, BIZMIND_DARK_MAP_STYLES, getGoogleMapsApiKey } from '../../services/googleMapsService';

export interface LocationMapProps {
  center: [number, number];
  zoom?: number;
  businesses?: DiscoveredBusiness[];
  radiusMeters?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  onBusinessSelect?: (business: DiscoveredBusiness) => void;
  onBusinessSave?: (business: DiscoveredBusiness) => void;
  targetLocationName?: string;
  selectedBusinessId?: string | number | null;
  height?: string;
  className?: string;
  currentLocation?: [number, number] | null;
}

type MapTheme = 'dark' | 'standard' | 'satellite' | 'terrain';

export const LocationMap: React.FC<LocationMapProps> = ({
  center,
  zoom = 14,
  businesses = [],
  radiusMeters = 2000,
  onLocationSelect,
  onBusinessSelect,
  onBusinessSave,
  targetLocationName = 'Target Location',
  selectedBusinessId = null,
  height = '480px',
  className = '',
  currentLocation = null,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const targetMarkerRef = useRef<google.maps.Marker | null>(null);
  const currentLocMarkerRef = useRef<google.maps.Marker | null>(null);
  const businessMarkersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [activeTheme, setActiveTheme] = useState<MapTheme>('dark');
  const [showLabels, setShowLabels] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize Google Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        setLoadError(null);
        const google = await loadGoogleMaps();
        if (!isMounted || !mapContainerRef.current) return;

        const mapOptions: google.maps.MapOptions = {
          center: { lat: center[0], lng: center[1] },
          zoom,
          styles: activeTheme === 'dark' ? BIZMIND_DARK_MAP_STYLES : [],
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: 'greedy',
          backgroundColor: '#0B0B0C',
        };

        const map = new google.maps.Map(mapContainerRef.current, mapOptions);
        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();

        // Click on map to pick location
        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng && onLocationSelect) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            onLocationSelect(lat, lng);
          }
        });

        setMapLoaded(true);
      } catch (err: any) {
        if (!isMounted) return;
        setLoadError(
          err?.message ||
            'Failed to load Google Maps. Please ensure VITE_GOOGLE_MAPS_API_KEY is configured in your environment.'
        );
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (circleRef.current) circleRef.current.setMap(null);
      if (targetMarkerRef.current) targetMarkerRef.current.setMap(null);
      if (currentLocMarkerRef.current) currentLocMarkerRef.current.setMap(null);
      businessMarkersRef.current.forEach((m) => m.setMap(null));
      businessMarkersRef.current = [];
      mapInstanceRef.current = null;
    };
  }, []);

  // Update theme / mapTypeId
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeTheme === 'dark') {
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      map.setOptions({ styles: BIZMIND_DARK_MAP_STYLES });
    } else if (activeTheme === 'standard') {
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      map.setOptions({ styles: [] });
    } else if (activeTheme === 'satellite') {
      map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
      map.setOptions({ styles: [] });
    } else if (activeTheme === 'terrain') {
      map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
      map.setOptions({ styles: [] });
    }
  }, [activeTheme]);

  // Update center
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentCenter = map.getCenter();
    if (!currentCenter) {
      map.setCenter({ lat: center[0], lng: center[1] });
      return;
    }

    const latDiff = Math.abs(currentCenter.lat() - center[0]);
    const lngDiff = Math.abs(currentCenter.lng() - center[1]);
    if (latDiff > 0.0001 || lngDiff > 0.0001) {
      map.panTo({ lat: center[0], lng: center[1] });
    }
  }, [center[0], center[1]]);

  // Update Selected Location Marker, Radius Circle, Current Location, and Business Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    const google = window.google;

    // 1. Update Radius Circle
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }
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

    // 2. Selected Target Location Marker (Golden Pin)
    if (targetMarkerRef.current) {
      targetMarkerRef.current.setMap(null);
    }

    const targetMarker = new google.maps.Marker({
      position: { lat: center[0], lng: center[1] },
      map,
      title: targetLocationName,
      zIndex: 1000,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#FFBF24',
        fillOpacity: 1,
        strokeColor: '#0B0B0C',
        strokeWeight: 3,
      },
    });

    targetMarker.addListener('click', () => {
      if (!infoWindowRef.current) return;
      infoWindowRef.current.setContent(`
        <div style="padding: 6px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 200px; border-radius: 8px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #FFBF24; font-weight: 800;">Target Center Point</div>
          <div style="font-weight: 700; font-size: 13px; color: #F8FAFC; margin-top: 2px;">${targetLocationName}</div>
          <div style="font-size: 11px; color: #A1A1AA; margin-top: 2px; font-family: monospace;">
            ${center[0].toFixed(5)}, ${center[1].toFixed(5)}
          </div>
          <div style="font-size: 11px; color: #CBD5E1; margin-top: 4px; padding-top: 4px; border-top: 1px solid #27272A;">
            Scan Radius: <strong style="color: #FFBF24;">${(radiusMeters / 1000).toFixed(1)} km</strong>
          </div>
        </div>
      `);
      infoWindowRef.current.open(map, targetMarker);
    });

    targetMarkerRef.current = targetMarker;

    // 3. User Current Location Marker (Cyan pulsing indicator)
    if (currentLocMarkerRef.current) {
      currentLocMarkerRef.current.setMap(null);
    }
    if (currentLocation) {
      const userMarker = new google.maps.Marker({
        position: { lat: currentLocation[0], lng: currentLocation[1] },
        map,
        title: 'Your Current Location',
        zIndex: 900,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#38BDF8',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });

      userMarker.addListener('click', () => {
        if (!infoWindowRef.current) return;
        infoWindowRef.current.setContent(`
          <div style="padding: 6px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 180px;">
            <div style="font-size: 10px; text-transform: uppercase; color: #38BDF8; font-weight: 800;">GPS Location</div>
            <div style="font-weight: 700; font-size: 13px; color: #F8FAFC;">You are here</div>
            <div style="font-size: 11px; color: #A1A1AA; font-family: monospace;">
              ${currentLocation[0].toFixed(5)}, ${currentLocation[1].toFixed(5)}
            </div>
          </div>
        `);
        infoWindowRef.current.open(map, userMarker);
      });

      currentLocMarkerRef.current = userMarker;
    }

    // 4. Render Google Places Businesses
    businessMarkersRef.current.forEach((m) => m.setMap(null));
    businessMarkersRef.current = [];

    businesses.forEach((b) => {
      const isComp = b.isDirectCompetitor;
      const isSelected = selectedBusinessId === b.osm_id || selectedBusinessId === b.id;

      // Color mapping
      let fillColor = '#3B82F6'; // Default Blue
      if (isComp) {
        fillColor = '#EF4444'; // Red for Competitor
      } else if (b.broadCategory === 'Food & Beverage') {
        fillColor = '#FFBF24'; // Amber
      } else if (b.broadCategory === 'Healthcare') {
        fillColor = '#10B981'; // Emerald
      } else if (b.broadCategory === 'Fitness') {
        fillColor = '#06B6D4'; // Cyan
      } else if (b.broadCategory === 'Services') {
        fillColor = '#8B5CF6'; // Purple
      }

      const marker = new google.maps.Marker({
        position: { lat: b.latitude, lng: b.longitude },
        map,
        title: b.name,
        zIndex: isComp ? 800 : isSelected ? 850 : 500,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 8 : isComp ? 6.5 : 5.5,
          fillColor,
          fillOpacity: 1,
          strokeColor: isSelected ? '#FFFFFF' : '#0B0B0C',
          strokeWeight: isSelected ? 2.5 : 1.5,
        },
        label:
          showLabels && b.name
            ? {
                text: b.name.length > 20 ? `${b.name.substring(0, 18)}…` : b.name,
                color: isSelected ? '#FFBF24' : isComp ? '#FCA5A5' : '#CBD5E1',
                fontSize: '10px',
                fontWeight: '700',
                className: 'google-map-marker-label',
              }
            : undefined,
      });

      marker.addListener('click', () => {
        if (onBusinessSelect) onBusinessSelect(b);

        if (infoWindowRef.current) {
          const googleMapsLink =
            (b as any).googleMapsUri ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name)}&query_place_id=${b.osm_id}`;

          const statusBadge = (b as any).businessStatus
            ? `<span style="font-size: 9px; padding: 2px 5px; border-radius: 4px; background: #27272A; color: #A1A1AA;">${(b as any).businessStatus.replace('_', ' ')}</span>`
            : '';

          infoWindowRef.current.setContent(`
            <div style="padding: 10px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 240px; max-width: 300px; border-radius: 8px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${isComp ? '#EF4444' : '#38BDF8'};">
                  ${isComp ? '⚠️ Direct Competitor' : b.broadCategory}
                </span>
                <span style="font-size: 10px; background: #27272A; padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #F8FAFC;">
                  ${b.distance_formatted}
                </span>
              </div>

              <div style="font-weight: 800; font-size: 14px; color: #F8FAFC; margin-top: 4px; line-height: 1.3;">
                ${b.name}
              </div>

              <div style="font-size: 11px; color: #FFBF24; margin-top: 3px; font-weight: 600;">
                ${b.category}
              </div>

              ${b.address ? `<div style="font-size: 11px; color: #A1A1AA; margin-top: 6px; border-top: 1px solid #27272A; padding-top: 4px;">📍 ${b.address}</div>` : ''}

              <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #27272A; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <a 
                  href="${googleMapsLink}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style="font-size: 11px; color: #38BDF8; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 3px;"
                >
                  View on Google Maps ↗
                </a>
                ${statusBadge}
              </div>
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        }
      });

      businessMarkersRef.current.push(marker);
    });
  }, [center[0], center[1], radiusMeters, businesses, targetLocationName, selectedBusinessId, showLabels, currentLocation]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.panTo({ lat: center[0], lng: center[1] });
    mapInstanceRef.current.setZoom(14);
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current || !window.google?.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: center[0], lng: center[1] });
    businesses.forEach((b) => bounds.extend({ lat: b.latitude, lng: b.longitude }));
    if (currentLocation) {
      bounds.extend({ lat: currentLocation[0], lng: currentLocation[1] });
    }
    mapInstanceRef.current.fitBounds(bounds, 40);
  };

  return (
    <div
      id="bizmind-google-map-wrapper"
      className={`relative w-full rounded-xl overflow-hidden border border-[#27272A] bg-[#0B0B0C] ${className}`}
    >
      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />

      {/* Fallback / Configuration Alert if Key is missing */}
      {loadError && (
        <div className="absolute inset-0 bg-[#0B0B0C]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 text-[#FFBF24]" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">Google Maps Platform Configuration</h4>
          <p className="text-xs text-[#A1A1AA] max-w-md mb-4 leading-relaxed">
            {loadError}
          </p>
          <div className="text-[11px] font-mono bg-[#18181B] border border-[#27272A] px-3 py-2 rounded text-[#CBD5E1]">
            VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY
          </div>
        </div>
      )}

      {/* Floating Controls Overlay */}
      {mapLoaded && (
        <>
          {/* Top-Right: Controls Bar */}
          <div className="absolute top-3 right-3 z-10 flex flex-wrap items-center gap-2">
            {/* Google Places Count Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111113]/90 border border-[#27272A] text-xs font-medium text-[#A1A1AA] backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#FFBF24] animate-pulse"></span>
              <span className="text-[#F8FAFC] font-semibold">{businesses.length}</span>
              <span>Places Found</span>
            </div>

            {/* Toggle Labels */}
            <button
              id="map-toggle-labels-btn"
              onClick={() => setShowLabels((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold backdrop-blur-md shadow-lg transition-all cursor-pointer ${
                showLabels
                  ? 'bg-[#FFBF24] border-[#FFBF24] text-[#0B0B0C]'
                  : 'bg-[#111113]/90 hover:bg-[#1A1A1D] border-[#27272A] text-[#F8FAFC]'
              }`}
              title="Toggle shop name labels"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{showLabels ? 'Labels: ON' : 'Labels: OFF'}</span>
            </button>

            {/* Fit All Discovered Places */}
            {businesses.length > 0 && (
              <button
                id="map-fit-bounds-btn"
                onClick={handleFitAll}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-xs font-semibold text-[#F8FAFC] backdrop-blur-md shadow-lg transition-colors cursor-pointer"
                title="Fit all places in view"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#FFBF24]" />
                <span>Fit All</span>
              </button>
            )}

            {/* Theme / Map View Switcher */}
            <div className="relative group">
              <button
                id="map-toggle-layer-btn"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-xs font-medium text-[#F8FAFC] backdrop-blur-md shadow-lg transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#FFBF24]" />
                <span className="capitalize">{activeTheme}</span>
              </button>

              <div className="absolute right-0 mt-1 w-32 rounded-lg bg-[#111113] border border-[#27272A] shadow-xl p-1 hidden group-hover:block transition-all z-20">
                {(['dark', 'standard', 'satellite', 'terrain'] as MapTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setActiveTheme(theme)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs capitalize transition-colors cursor-pointer ${
                      activeTheme === theme
                        ? 'bg-[#FFBF24]/10 text-[#FFBF24] font-medium'
                        : 'text-[#A1A1AA] hover:bg-[#1A1A1D] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top-Left: Zoom & Recenter */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <button
              id="map-zoom-in-btn"
              onClick={() => {
                const z = mapInstanceRef.current?.getZoom();
                if (z !== undefined) mapInstanceRef.current?.setZoom(z + 1);
              }}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md shadow-md transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="map-zoom-out-btn"
              onClick={() => {
                const z = mapInstanceRef.current?.getZoom();
                if (z !== undefined) mapInstanceRef.current?.setZoom(z - 1);
              }}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md shadow-md transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              id="map-recenter-btn"
              onClick={handleRecenter}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#FFBF24] flex items-center justify-center backdrop-blur-md shadow-md transition-colors cursor-pointer"
              title="Recenter on Target Location"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom-Left: Coordinates & Radius Legend */}
          <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-[#111113]/90 border border-[#27272A] text-[11px] font-mono text-[#F8FAFC] backdrop-blur-md shadow-lg flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />
            <span>
              {center[0].toFixed(4)}, {center[1].toFixed(4)}
            </span>
            {radiusMeters > 0 && (
              <span className="text-[#FFBF24] pl-1 border-l border-[#27272A]">
                {(radiusMeters / 1000).toFixed(1)} km radius
              </span>
            )}
          </div>

          {/* Bottom-Center: Click on Map Hint */}
          <div className="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-[#111113]/85 border border-[#27272A] text-[10px] text-[#A1A1AA] backdrop-blur-md items-center gap-1.5 pointer-events-none">
            <Compass className="w-3 h-3 text-[#FFBF24]" />
            <span>Click anywhere on Google Maps to set analysis location</span>
          </div>
        </>
      )}
    </div>
  );
};
