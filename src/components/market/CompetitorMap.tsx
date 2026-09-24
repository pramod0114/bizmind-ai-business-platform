import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { MarketCompetitor } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  MapPin,
  Navigation,
  AlertTriangle,
  Layers,
  Settings,
  X,
  ExternalLink,
} from 'lucide-react';
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
import { CATEGORY_MARKER_COLORS } from '../location/LocationMarker';

interface CompetitorMapProps {
  center: [number, number];
  zoom?: number;
  radiusKm: number;
  locationName: string;
  competitors: MarketCompetitor[];
  otherBusinesses: MarketCompetitor[];
  selectedCompetitorId?: string | number | null;
  onSelectCompetitor?: (competitor: MarketCompetitor) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
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
  onLocationSelect,
  className = '',
  height = '480px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Engine state
  const [engine, setEngine] = useState<MapEngine>(() => getPreferredMapEngine());
  const [authError, setAuthError] = useState<string | null>(null);
  const [dismissBanner, setDismissBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showOther, setShowOther] = useState(true);

  // Google Maps references
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const googleCircleRef = useRef<google.maps.Circle | null>(null);
  const googleCenterMarkerRef = useRef<google.maps.Marker | null>(null);
  const googleMarkersRef = useRef<google.maps.Marker[]>([]);
  const googleInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Leaflet references
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletCircleRef = useRef<L.Circle | null>(null);
  const leafletCenterMarkerRef = useRef<L.Marker | null>(null);
  const leafletMarkersRef = useRef<L.Marker[]>([]);

  // Track if Google Maps auth failure occurs
  useEffect(() => {
    const unsub = onGoogleMapsAuthFailure((errMsg) => {
      setAuthError(errMsg);
      // Automatically switch to OpenStreetMap
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
    if (googleCenterMarkerRef.current) {
      googleCenterMarkerRef.current.setMap(null);
      googleCenterMarkerRef.current = null;
    }
    googleMarkersRef.current.forEach((m) => m.setMap(null));
    googleMarkersRef.current = [];
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
    leafletCenterMarkerRef.current = null;
    leafletMarkersRef.current = [];
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = '';
    }
  }, []);

  // Render Google Map
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
        styles: BIZMIND_DARK_MAP_STYLES,
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

      // Render layers
      renderGoogleLayers(map);
    } catch (err: any) {
      console.warn('Failed to initialize Google Maps, falling back to OSM:', err);
      setAuthError(err?.message || 'Google Maps failed to load. Switched to OpenStreetMap.');
      setEngine('osm');
      setPreferredMapEngine('osm');
    }
  }, [center[0], center[1], zoom, onLocationSelect, destroyLeaflet, destroyGoogleMap]);

  // Render Leaflet Map
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

    // Free, official OpenStreetMap tile layer (no watermark)
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
    // 1. Circle
    if (googleCircleRef.current) googleCircleRef.current.setMap(null);
    const radiusMeters = radiusKm * 1000;
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

    // 2. Center Marker
    if (googleCenterMarkerRef.current) googleCenterMarkerRef.current.setMap(null);
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
      if (!googleInfoWindowRef.current) return;
      googleInfoWindowRef.current.setContent(`
        <div style="padding: 6px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 180px;">
          <div style="font-size: 10px; color: #FFBF24; font-weight: 800; text-transform: uppercase;">Analyzed Target Location</div>
          <div style="font-weight: 700; font-size: 13px; color: #F8FAFC; margin-top: 2px;">${locationName}</div>
          <div style="font-size: 11px; color: #A1A1AA; font-family: monospace; margin-top: 2px;">
            ${center[0].toFixed(5)}, ${center[1].toFixed(5)}
          </div>
        </div>
      `);
      googleInfoWindowRef.current.open(map, centerMarker);
    });
    googleCenterMarkerRef.current = centerMarker;

    // 3. Competitors & Other Businesses
    googleMarkersRef.current.forEach((m) => m.setMap(null));
    googleMarkersRef.current = [];

    const addGoogleMarker = (c: MarketCompetitor, isCompetitor: boolean) => {
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
        if (googleInfoWindowRef.current) {
          const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`;
          googleInfoWindowRef.current.setContent(`
            <div style="padding: 8px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 220px; border-radius: 8px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${isCompetitor ? '#EF4444' : '#38BDF8'};">
                  ${isCompetitor ? '⚠️ Direct Competitor' : 'Trade Area Establishment'}
                </span>
                <span style="font-size: 10px; background: #27272A; padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #F8FAFC;">
                  ${c.distance_km < 1 ? `${Math.round(c.distance_km * 1000)} m` : `${c.distance_km.toFixed(1)} km`}
                </span>
              </div>
              <div style="font-weight: 800; font-size: 13px; color: #F8FAFC; margin-top: 4px;">
                ${displayName}
              </div>
              <div style="font-size: 11px; color: #FFBF24; margin-top: 2px; font-weight: 600;">
                ${c.category}
              </div>
              ${c.address ? `<div style="font-size: 11px; color: #A1A1AA; margin-top: 4px; border-top: 1px solid #27272A; padding-top: 4px;">📍 ${c.address}</div>` : ''}
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
      googleMarkersRef.current.push(marker);
    };

    competitors.forEach((c) => addGoogleMarker(c, true));
    if (showOther) {
      otherBusinesses.forEach((c) => addGoogleMarker(c, false));
    }
  };

  // Leaflet Layer Rendering
  const renderLeafletLayers = (map: L.Map) => {
    // 1. Circle
    if (leafletCircleRef.current) leafletCircleRef.current.remove();
    const radiusMeters = radiusKm * 1000;
    leafletCircleRef.current = L.circle([center[0], center[1]], {
      radius: radiusMeters,
      color: '#FFBF24',
      weight: 2,
      opacity: 0.9,
      fillColor: '#FFBF24',
      fillOpacity: 0.08,
    }).addTo(map);

    // 2. Center Marker (Pulsing Amber Star)
    if (leafletCenterMarkerRef.current) leafletCenterMarkerRef.current.remove();
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
        <div style="font-weight: 700; font-size: 13px; color: #F8FAFC; margin-top: 2px;">${locationName}</div>
        <div style="font-size: 11px; color: #A1A1AA; font-family: monospace; margin-top: 2px;">
          ${center[0].toFixed(5)}, ${center[1].toFixed(5)}
        </div>
      </div>
    `);
    leafletCenterMarkerRef.current = centerMarker;

    // 3. Markers
    leafletMarkersRef.current.forEach((m) => m.remove());
    leafletMarkersRef.current = [];

    const addLeafletMarker = (c: MarketCompetitor, isCompetitor: boolean) => {
      const isSelected = selectedCompetitorId === c.id;
      const displayName = c.name || c.business_name || 'Business';
      const catKey = (c.category || '').toLowerCase();
      const themeColor = isCompetitor
        ? '#EF4444'
        : CATEGORY_MARKER_COLORS[catKey]?.bg || '#3B82F6';

      const size = isSelected ? 30 : isCompetitor ? 24 : 18;
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
            ${isCompetitor ? '⚠️' : (c.category || 'B').charAt(0).toUpperCase()}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([c.latitude, c.longitude], {
        icon,
        zIndexOffset: isSelected ? 900 : isCompetitor ? 800 : 400,
      }).addTo(map);

      const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`;
      marker.bindPopup(`
        <div style="padding: 8px; font-family: system-ui, sans-serif; color: #F8FAFC; background: #1A1A1D; min-width: 220px; border-radius: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${isCompetitor ? '#EF4444' : '#38BDF8'};">
              ${isCompetitor ? '⚠️ Direct Competitor' : 'Trade Area Establishment'}
            </span>
            <span style="font-size: 10px; background: #27272A; padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #F8FAFC;">
              ${c.distance_km < 1 ? `${Math.round(c.distance_km * 1000)} m` : `${c.distance_km.toFixed(1)} km`}
            </span>
          </div>
          <div style="font-weight: 800; font-size: 13px; color: #F8FAFC; margin-top: 4px;">
            ${displayName}
          </div>
          <div style="font-size: 11px; color: #FFBF24; margin-top: 2px; font-weight: 600;">
            ${c.category}
          </div>
          ${c.address ? `<div style="font-size: 11px; color: #A1A1AA; margin-top: 4px; border-top: 1px solid #27272A; padding-top: 4px;">📍 ${c.address}</div>` : ''}
          <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #27272A;">
            <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: #38BDF8; font-weight: 700; text-decoration: none;">
              View on Google Maps ↗
            </a>
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectCompetitor) onSelectCompetitor(c);
      });

      leafletMarkersRef.current.push(marker);
    };

    competitors.forEach((c) => addLeafletMarker(c, true));
    if (showOther) {
      otherBusinesses.forEach((c) => addLeafletMarker(c, false));
    }
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

  // Update center when center prop changes
  useEffect(() => {
    if (engine === 'google' && googleMapRef.current) {
      googleMapRef.current.panTo({ lat: center[0], lng: center[1] });
      renderGoogleLayers(googleMapRef.current);
    } else if (engine === 'osm' && leafletMapRef.current) {
      leafletMapRef.current.panTo([center[0], center[1]]);
      renderLeafletLayers(leafletMapRef.current);
    }
  }, [center[0], center[1], radiusKm, competitors, otherBusinesses, selectedCompetitorId, showOther, locationName]);

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
      competitors.forEach((c) => bounds.extend({ lat: c.latitude, lng: c.longitude }));
      if (showOther) {
        otherBusinesses.forEach((c) => bounds.extend({ lat: c.latitude, lng: c.longitude }));
      }
      googleMapRef.current.fitBounds(bounds, 40);
    } else if (engine === 'osm' && leafletMapRef.current) {
      const points: [number, number][] = [[center[0], center[1]]];
      competitors.forEach((c) => points.push([c.latitude, c.longitude]));
      if (showOther) {
        otherBusinesses.forEach((c) => points.push([c.latitude, c.longitude]));
      }
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
      className={`relative w-full rounded-xl overflow-hidden border border-[#27272A] bg-[#0B0B0C] ${className}`}
      style={{ height }}
    >
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top-Right Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
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

        {/* Toggle Other Businesses */}
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

        {/* Fit Bounds */}
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
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
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
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111113]/90 border border-[#27272A] text-xs backdrop-blur-md shadow-lg">
        <span className="flex items-center gap-1 text-red-400 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          {competitors.length} Direct Competitors
        </span>
        <span className="text-[#27272A]">|</span>
        <span className="text-[#FFBF24] font-mono text-[11px]">
          {center[0].toFixed(4)}, {center[1].toFixed(4)}
        </span>
        {onLocationSelect && (
          <span className="hidden sm:inline text-[#A1A1AA] text-[10px] pl-1 border-l border-[#27272A]">
            Click anywhere on map to reposition target
          </span>
        )}
        <span className="text-[#71717A] text-[10px] pl-1 border-l border-[#27272A]">
          {engine === 'google' ? 'Google Maps' : 'OpenStreetMap'}
        </span>
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
