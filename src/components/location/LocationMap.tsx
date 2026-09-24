import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Layers,
  Compass,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  MapPin,
  Tag,
  AlertTriangle,
  ExternalLink,
  BookmarkPlus,
  Building2,
  X,
} from 'lucide-react';
import { DiscoveredBusiness } from '../../types';
import {
  loadGoogleMaps,
  BIZMIND_DARK_MAP_STYLES,
  onGoogleMapsAuthFailure,
  isGoogleMapsAuthFailed,
  resetGoogleMapsAuthFailure,
  getPreferredMapEngine,
  setPreferredMapEngine,
  MapEngine,
} from '../../services/googleMapsService';
import { GoogleMapsGuideModal } from '../common/GoogleMapsGuideModal';
import { CATEGORY_MARKER_COLORS } from './LocationMarker';

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

  // Engine state
  const [engine, setEngine] = useState<MapEngine>(() => getPreferredMapEngine());
  const [authError, setAuthError] = useState<string | null>(null);
  const [dismissBanner, setDismissBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTheme, setActiveTheme] = useState<MapTheme>('dark');
  const [showLabels, setShowLabels] = useState(true);

  // Google Maps references
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const googleCircleRef = useRef<google.maps.Circle | null>(null);
  const googleTargetMarkerRef = useRef<google.maps.Marker | null>(null);
  const googleCurrentLocMarkerRef = useRef<google.maps.Marker | null>(null);
  const googleBusinessMarkersRef = useRef<google.maps.Marker[]>([]);
  const googleInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Leaflet references
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletCircleRef = useRef<L.Circle | null>(null);
  const leafletTargetMarkerRef = useRef<L.Marker | null>(null);
  const leafletCurrentLocMarkerRef = useRef<L.Marker | null>(null);
  const leafletBusinessMarkersRef = useRef<L.Marker[]>([]);

  // Listen for Google Maps auth failure
  useEffect(() => {
    const unsub = onGoogleMapsAuthFailure((msg) => {
      setAuthError(msg);
      setEngine('osm');
      setPreferredMapEngine('osm');
    });

    if (isGoogleMapsAuthFailed()) {
      setAuthError(
        'Google Maps Platform: Maps JavaScript API is not activated on your Google Cloud Project. Switched to OpenStreetMap.'
      );
      setEngine('osm');
    }

    return () => unsub();
  }, []);

  // Teardown Google Maps
  const destroyGoogleMap = useCallback(() => {
    if (googleCircleRef.current) {
      googleCircleRef.current.setMap(null);
      googleCircleRef.current = null;
    }
    if (googleTargetMarkerRef.current) {
      googleTargetMarkerRef.current.setMap(null);
      googleTargetMarkerRef.current = null;
    }
    if (googleCurrentLocMarkerRef.current) {
      googleCurrentLocMarkerRef.current.setMap(null);
      googleCurrentLocMarkerRef.current = null;
    }
    googleBusinessMarkersRef.current.forEach((m) => m.setMap(null));
    googleBusinessMarkersRef.current = [];
    if (googleInfoWindowRef.current) {
      googleInfoWindowRef.current.close();
      googleInfoWindowRef.current = null;
    }
    googleMapRef.current = null;
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = '';
    }
  }, []);

  // Teardown Leaflet
  const destroyLeaflet = useCallback(() => {
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }
    leafletCircleRef.current = null;
    leafletTargetMarkerRef.current = null;
    leafletCurrentLocMarkerRef.current = null;
    leafletBusinessMarkersRef.current = [];
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = '';
    }
  }, []);

  // Initialize Google Maps
  const initGoogleMap = useCallback(async () => {
    if (!mapContainerRef.current) return;
    destroyLeaflet();
    destroyGoogleMap();

    try {
      const google = await loadGoogleMaps();
      if (!mapContainerRef.current) return;

      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: center[0], lng: center[1] },
        zoom,
        styles: activeTheme === 'dark' ? BIZMIND_DARK_MAP_STYLES : [],
        disableDefaultUI: true,
        clickableIcons: false,
        gestureHandling: 'greedy',
        backgroundColor: '#0B0B0C',
      });

      googleMapRef.current = map;
      googleInfoWindowRef.current = new google.maps.InfoWindow();

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng && onLocationSelect) {
          onLocationSelect(e.latLng.lat(), e.latLng.lng());
        }
      });

      renderGoogleLayers(map);
    } catch (err: any) {
      console.warn('Google Maps load error, falling back to OSM:', err);
      setAuthError(err?.message || 'Google Maps failed to load. Switched to OpenStreetMap.');
      setEngine('osm');
      setPreferredMapEngine('osm');
    }
  }, [center[0], center[1], zoom, activeTheme, onLocationSelect, destroyLeaflet, destroyGoogleMap]);

  // Initialize Leaflet Map
  const initLeafletMap = useCallback(() => {
    if (!mapContainerRef.current) return;
    destroyGoogleMap();
    destroyLeaflet();

    const container = mapContainerRef.current;
    container.innerHTML = '';

    const map = L.map(container, {
      center: [center[0], center[1]],
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    });

    leafletMapRef.current = map;
    renderLeafletLayers(map);
  }, [center[0], center[1], zoom, onLocationSelect, destroyGoogleMap, destroyLeaflet]);

  // Google Maps Layer Rendering
  const renderGoogleLayers = (map: google.maps.Map) => {
    // Circle
    if (googleCircleRef.current) googleCircleRef.current.setMap(null);
    if (radiusMeters > 0) {
      googleCircleRef.current = new google.maps.Circle({
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

    // Target marker
    if (googleTargetMarkerRef.current) googleTargetMarkerRef.current.setMap(null);
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
      if (!googleInfoWindowRef.current) return;
      googleInfoWindowRef.current.setContent(`
        <div style="padding: 6px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 180px;">
          <div style="font-size: 10px; color: #FFBF24; font-weight: 800; text-transform: uppercase;">Analyzed Target Location</div>
          <div style="font-weight: 700; font-size: 13px; color: #F8FAFC; margin-top: 2px;">${targetLocationName}</div>
          <div style="font-size: 11px; color: #A1A1AA; font-family: monospace; margin-top: 2px;">
            ${center[0].toFixed(5)}, ${center[1].toFixed(5)}
          </div>
        </div>
      `);
      googleInfoWindowRef.current.open(map, targetMarker);
    });
    googleTargetMarkerRef.current = targetMarker;

    // Discovered Businesses
    googleBusinessMarkersRef.current.forEach((m) => m.setMap(null));
    googleBusinessMarkersRef.current = [];

    businesses.forEach((b) => {
      const isComp = b.isDirectCompetitor || b.is_direct_competitor;
      const isSelected = selectedBusinessId === b.osm_id || selectedBusinessId === (b as any).id;
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
        if (googleInfoWindowRef.current) {
          const googleMapsLink =
            (b as any).googleMapsUri ||
            `https://www.google.com/maps/search/?api=1&query=${b.latitude},${b.longitude}`;
          googleInfoWindowRef.current.setContent(`
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
          googleInfoWindowRef.current.open(map, marker);
        }
      });
      googleBusinessMarkersRef.current.push(marker);
    });
  };

  // Leaflet Layer Rendering
  const renderLeafletLayers = (map: L.Map) => {
    // Circle
    if (leafletCircleRef.current) leafletCircleRef.current.remove();
    if (radiusMeters > 0) {
      leafletCircleRef.current = L.circle([center[0], center[1]], {
        radius: radiusMeters,
        color: '#FFBF24',
        weight: 2,
        opacity: 0.9,
        fillColor: '#FFBF24',
        fillOpacity: 0.08,
      }).addTo(map);
    }

    // Target marker (Pulsing amber beacon)
    if (leafletTargetMarkerRef.current) leafletTargetMarkerRef.current.remove();
    const centerIcon = L.divIcon({
      className: 'custom-target-marker',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <span style="position: absolute; inset: 0; border-radius: 50%; background: #FFBF24; opacity: 0.4; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <span style="position: absolute; width: 26px; height: 26px; border-radius: 50%; background: rgba(255, 191, 36, 0.25); border: 1.5px solid #FFBF24;"></span>
          <div style="position: relative; z-index: 10; width: 20px; height: 20px; border-radius: 50%; background: #FFBF24; color: #0B0B0C; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); border: 2px solid #FFFFFF;">
            ★
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
    const centerMarker = L.marker([center[0], center[1]], { icon: centerIcon, zIndexOffset: 1000 }).addTo(map);
    centerMarker.bindPopup(`
      <div style="padding: 6px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 180px; border-radius: 6px;">
        <div style="font-size: 10px; color: #FFBF24; font-weight: 800; text-transform: uppercase;">Analyzed Target Location</div>
        <div style="font-weight: 700; font-size: 13px; color: #F8FAFC; margin-top: 2px;">${targetLocationName}</div>
        <div style="font-size: 11px; color: #A1A1AA; font-family: monospace; margin-top: 2px;">
          ${center[0].toFixed(5)}, ${center[1].toFixed(5)}
        </div>
      </div>
    `);
    leafletTargetMarkerRef.current = centerMarker;

    // Discovered Businesses
    leafletBusinessMarkersRef.current.forEach((m) => m.remove());
    leafletBusinessMarkersRef.current = [];

    businesses.forEach((b) => {
      const isComp = b.isDirectCompetitor || b.is_direct_competitor;
      const isSelected = selectedBusinessId === b.osm_id || selectedBusinessId === (b as any).id;
      const catKey = (b.category || '').toLowerCase();
      const themeColor = isComp
        ? '#EF4444'
        : CATEGORY_MARKER_COLORS[catKey]?.bg || '#3B82F6';

      const size = isSelected ? 30 : isComp ? 24 : 18;
      const icon = L.divIcon({
        className: 'custom-business-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background-color: ${themeColor};
            border: ${isSelected ? '2.5px solid #FFBF24' : '1.5px solid #0B0B0C'};
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            font-weight: 800;
            font-size: ${size >= 24 ? '11px' : '9px'};
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            ${isComp ? '⚠️' : (b.category || b.name || 'B').charAt(0).toUpperCase()}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([b.latitude, b.longitude], {
        icon,
        zIndexOffset: isSelected ? 900 : isComp ? 800 : 400,
      }).addTo(map);

      const googleMapsLink =
        (b as any).googleMapsUri ||
        `https://www.google.com/maps/search/?api=1&query=${b.latitude},${b.longitude}`;

      marker.bindPopup(`
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

      marker.on('click', () => {
        if (onBusinessSelect) onBusinessSelect(b);
      });

      leafletBusinessMarkersRef.current.push(marker);
    });
  };

  // Mount/Switch engine
  useEffect(() => {
    if (engine === 'google') {
      initGoogleMap();
    } else {
      initLeafletMap();
    }

    return () => {
      destroyGoogleMap();
      destroyLeaflet();
    };
  }, [engine]);

  // Update center & layers when props change
  useEffect(() => {
    if (engine === 'google' && googleMapRef.current) {
      googleMapRef.current.panTo({ lat: center[0], lng: center[1] });
      renderGoogleLayers(googleMapRef.current);
    } else if (engine === 'osm' && leafletMapRef.current) {
      leafletMapRef.current.panTo([center[0], center[1]]);
      renderLeafletLayers(leafletMapRef.current);
    }
  }, [center[0], center[1], radiusMeters, businesses, targetLocationName, selectedBusinessId, showLabels]);

  // Controls
  const handleZoomIn = () => {
    if (engine === 'google' && googleMapRef.current) {
      const z = googleMapRef.current.getZoom();
      if (z !== undefined) googleMapRef.current.setZoom(z + 1);
    } else if (engine === 'osm' && leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (engine === 'google' && googleMapRef.current) {
      const z = googleMapRef.current.getZoom();
      if (z !== undefined) googleMapRef.current.setZoom(z - 1);
    } else if (engine === 'osm' && leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (engine === 'google' && googleMapRef.current) {
      googleMapRef.current.panTo({ lat: center[0], lng: center[1] });
      googleMapRef.current.setZoom(14);
    } else if (engine === 'osm' && leafletMapRef.current) {
      leafletMapRef.current.setView([center[0], center[1]], 14);
    }
  };

  const handleFitAll = () => {
    if (engine === 'google' && googleMapRef.current && window.google?.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: center[0], lng: center[1] });
      businesses.forEach((b) => bounds.extend({ lat: b.latitude, lng: b.longitude }));
      googleMapRef.current.fitBounds(bounds, 40);
    } else if (engine === 'osm' && leafletMapRef.current) {
      const points: [number, number][] = [[center[0], center[1]]];
      businesses.forEach((b) => points.push([b.latitude, b.longitude]));
      if (points.length > 1) {
        leafletMapRef.current.fitBounds(points as any, { padding: [40, 40] });
      }
    }
  };

  const handleSwitchEngine = (newEngine: MapEngine) => {
    if (newEngine === 'google') {
      resetGoogleMapsAuthFailure();
      setAuthError(null);
    }
    setEngine(newEngine);
    setPreferredMapEngine(newEngine);
  };

  return (
    <div
      id="bizmind-map-wrapper"
      className={`relative w-full rounded-xl overflow-hidden border border-[#27272A] bg-[#0B0B0C] ${className}`}
      style={{ height }}
    >
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top-Right: Controls Bar */}
      <div className="absolute top-3 right-3 z-10 flex flex-wrap items-center gap-2">
        {/* Engine Switcher */}
        <div className="flex items-center bg-[#111113]/90 border border-[#27272A] p-0.5 rounded-lg backdrop-blur-md shadow-lg">
          <button
            onClick={() => handleSwitchEngine('google')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              engine === 'google'
                ? 'bg-[#FFBF24] text-[#0B0B0C]'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
            title="Google Maps Platform"
          >
            Google
          </button>
          <button
            onClick={() => handleSwitchEngine('osm')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              engine === 'osm'
                ? 'bg-[#FFBF24] text-[#0B0B0C]'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
            title="OpenStreetMap / Leaflet Engine"
          >
            OSM
          </button>
        </div>

        {/* Places Count Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111113]/90 border border-[#27272A] text-xs font-medium text-[#A1A1AA] backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#FFBF24] animate-pulse"></span>
          <span className="text-[#F8FAFC] font-semibold">{businesses.length}</span>
          <span>Places</span>
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

        {/* Fit All */}
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
      </div>

      {/* Top-Left: Zoom & Recenter */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        <button
          id="map-zoom-in-btn"
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md shadow-md transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="map-zoom-out-btn"
          onClick={handleZoomOut}
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
        <span className="text-[#71717A] text-[10px] pl-1 border-l border-[#27272A]">
          {engine === 'google' ? 'Google Maps' : 'OpenStreetMap'}
        </span>
      </div>

      {/* Bottom-Center: Click on Map Hint */}
      <div className="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-[#111113]/85 border border-[#27272A] text-[10px] text-[#A1A1AA] backdrop-blur-md items-center gap-1.5 pointer-events-none">
        <Compass className="w-3 h-3 text-[#FFBF24]" />
        <span>Click anywhere on map to set analysis target</span>
      </div>

      {/* Guide Modal */}
      <GoogleMapsGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onRetryGoogle={() => {
          setEngine('google');
          setPreferredMapEngine('google');
        }}
      />
    </div>
  );
};
