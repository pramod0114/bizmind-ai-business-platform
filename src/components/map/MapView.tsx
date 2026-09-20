import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MapPin, ZoomIn, ZoomOut, Compass, Navigation, Maximize2, Tag } from 'lucide-react';
import { DiscoveredBusiness } from '../../types';

// Fix default marker icon issues in Vite/Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

export type MapTileLayer = 'esri-dark' | 'osm-dark' | 'osm-standard' | 'satellite';

interface TileLayerOption {
  id: MapTileLayer;
  name: string;
  url: string;
  options: L.TileLayerOptions;
}

const TILE_LAYER_CONFIGS: Record<MapTileLayer, TileLayerOption> = {
  'esri-dark': {
    id: 'esri-dark',
    name: 'Dark Matter',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 19,
      maxNativeZoom: 16,
      attribution: 'Tiles &copy; <a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a> &copy; OpenStreetMap contributors',
    },
  },
  'osm-dark': {
    id: 'osm-dark',
    name: 'Midnight OSM',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      className: 'osm-dark-tiles',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    },
  },
  'osm-standard': {
    id: 'osm-standard',
    name: 'Standard OSM',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    },
  },
  'satellite': {
    id: 'satellite',
    name: 'Satellite Aerial',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 19,
      attribution: 'Tiles &copy; <a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a> &mdash; Earthstar Geographics',
    },
  },
};

export const MapView: React.FC<MapViewProps> = ({
  center = [28.6139, 77.2090], // Default: New Delhi or user coordinate
  zoom = 13,
  businesses = [],
  radiusMeters = 2000,
  onLocationSelect,
  onBusinessSelect,
  onBusinessSave,
  height = '460px',
  className = '',
  showControls = true,
  selectedBusinessId = null,
  targetLocationName,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const [selectedTileLayer, setSelectedTileLayer] = useState<MapTileLayer>('esri-dark');
  const [showLabelsOnMap, setShowLabelsOnMap] = useState<boolean>(true);
  const [currentCoords, setCurrentCoords] = useState<[number, number]>(center);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const businessMarkersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Get marker color based on category and competition
  const getMarkerColor = (b: DiscoveredBusiness): { bg: string; border: string } => {
    if (b.isDirectCompetitor) {
      return { bg: '#EF4444', border: '#FCA5A5' }; // Red for Direct Competitor
    }
    switch (b.broadCategory) {
      case 'Food & Beverage':
        return { bg: '#FFBF24', border: '#FDE68A' }; // Amber
      case 'Retail':
        return { bg: '#3B82F6', border: '#93C5FD' }; // Blue
      case 'Healthcare':
        return { bg: '#10B981', border: '#6EE7B7' }; // Emerald
      case 'Finance':
        return { bg: '#8B5CF6', border: '#C4B5FD' }; // Purple
      case 'Education':
        return { bg: '#EC4899', border: '#F472B6' }; // Pink
      case 'Automotive':
        return { bg: '#F97316', border: '#FDBA74' }; // Orange
      case 'Services':
        return { bg: '#06B6D4', border: '#67E8F9' }; // Cyan
      case 'Fitness':
        return { bg: '#14B8A6', border: '#5EEAD4' }; // Teal
      case 'Accommodation':
        return { bg: '#EAB308', border: '#FEF08A' }; // Yellow
      default:
        return { bg: '#94A3B8', border: '#CBD5E1' }; // Slate
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [center[0], center[1]] as L.LatLngTuple,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
    });

    const activeConfig = TILE_LAYER_CONFIGS[selectedTileLayer];
    const tileLayer = L.tileLayer(activeConfig.url, activeConfig.options).addTo(map);

    tileLayerRef.current = tileLayer;

    // Attribution
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Map Click Listener
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setCurrentCoords([lat, lng]);
      if (onLocationSelect) {
        onLocationSelect(lat, lng);
      }
    });

    mapInstanceRef.current = map;

    // ResizeObserver to handle layout container changes smoothly
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.remove();

    const activeConfig = TILE_LAYER_CONFIGS[selectedTileLayer];
    tileLayerRef.current = L.tileLayer(activeConfig.url, activeConfig.options).addTo(mapInstanceRef.current);
  }, [selectedTileLayer]);

  // Update Center & Zoom
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const currentMapCenter = mapInstanceRef.current.getCenter();
    const latDiff = Math.abs(currentMapCenter.lat - center[0]);
    const lngDiff = Math.abs(currentMapCenter.lng - center[1]);
    
    if (latDiff > 0.0001 || lngDiff > 0.0001) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
    setCurrentCoords(center);
  }, [center[0], center[1], zoom]);

  // Auto-focus selected business marker if changed
  useEffect(() => {
    if (!selectedBusinessId || !mapInstanceRef.current) return;
    const marker = businessMarkersMapRef.current.get(selectedBusinessId);
    if (marker) {
      mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true });
      marker.openPopup();
    }
  }, [selectedBusinessId]);

  // Update Target Marker, Radius & Business POIs
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    businessMarkersMapRef.current.clear();

    // 1. Draw Radius Circle
    if (circleLayerRef.current) {
      circleLayerRef.current.remove();
      circleLayerRef.current = null;
    }

    if (radiusMeters && radiusMeters > 0) {
      circleLayerRef.current = L.circle(currentCoords, {
        color: '#FFBF24',
        fillColor: '#FFBF24',
        fillOpacity: 0.08,
        radius: radiusMeters,
        weight: 1.5,
        dashArray: '5, 5',
      }).addTo(mapInstanceRef.current);
    }

    // 2. Primary Target Location Marker (with gold star & pulsing aura)
    const targetIcon = L.divIcon({
      className: 'custom-primary-pin',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(255, 191, 36, 0.3); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #FFBF24; border: 3px solid #0B0B0C; box-shadow: 0 0 16px rgba(255,191,36,0.9); display: flex; align-items: center; justify-content: center; color: #0B0B0C; font-weight: 900; font-size: 13px;">
            ★
          </div>
          <div style="position: absolute; top: 36px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: rgba(11,11,12,0.92); border: 1.5px solid #FFBF24; border-radius: 6px; padding: 2px 7px; font-size: 10px; font-weight: 800; color: #FFBF24; box-shadow: 0 4px 12px rgba(0,0,0,0.6); pointer-events: none; z-index: 1000;">
            TARGET POINT
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const centerMarker = L.marker(currentCoords, { icon: targetIcon, zIndexOffset: 1000 }).addTo(
      markersLayerRef.current
    );

    centerMarker.bindPopup(`
      <div style="padding: 6px; font-family: system-ui, sans-serif; color: #0B0B0C; min-width: 200px;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #D97706; font-weight: 700;">Analyzed Target Location</div>
        <div style="font-weight: 700; font-size: 13px; color: #0B0B0C; margin-top: 2px;">${targetLocationName || 'Selected Location'}</div>
        <div style="font-size: 11px; color: #4B5563; margin-top: 2px; font-family: monospace;">
          ${currentCoords[0].toFixed(5)}, ${currentCoords[1].toFixed(5)}
        </div>
        <div style="font-size: 11px; color: #374151; margin-top: 4px; padding-top: 4px; border-top: 1px solid #E5E7EB;">
          Scan Radius: <strong>${(radiusMeters / 1000).toFixed(1)} km</strong>
        </div>
      </div>
    `);

    // 3. Render Discovered Businesses with Rich Labels & Tooltips
    businesses.forEach((b) => {
      const isSelected = selectedBusinessId === b.osm_id;
      const colors = getMarkerColor(b);
      const isComp = b.isDirectCompetitor;

      // Safe truncate name for on-map tag
      const displayName = b.name.length > 22 ? `${b.name.substring(0, 20)}…` : b.name;

      const icon = L.divIcon({
        className: `custom-poi-marker ${isSelected ? 'selected' : ''}`,
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            ${
              showLabelsOnMap
                ? `
                <div style="
                  margin-bottom: 3px;
                  white-space: nowrap;
                  background: ${isSelected ? '#FFBF24' : isComp ? '#7F1D1D' : 'rgba(17,17,19,0.92)'};
                  border: 1px solid ${isSelected ? '#FFFFFF' : isComp ? '#EF4444' : '#3F3F46'};
                  border-radius: 6px;
                  padding: 2px 6px;
                  font-size: 10px;
                  font-weight: 700;
                  color: ${isSelected ? '#0B0B0C' : isComp ? '#FEE2E2' : '#F8FAFC'};
                  box-shadow: 0 3px 8px rgba(0,0,0,0.6);
                  pointer-events: none;
                  max-width: 130px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  line-height: 1.2;
                ">
                  ${isComp ? '⚠️ ' : ''}${displayName}
                </div>
              `
                : ''
            }
            <div style="
              background-color: ${colors.bg};
              width: ${isSelected ? '24px' : isComp ? '18px' : '14px'};
              height: ${isSelected ? '24px' : isComp ? '18px' : '14px'};
              border-radius: 50%;
              border: 2px solid ${isSelected ? '#FFFFFF' : '#0B0B0C'};
              box-shadow: 0 2px 8px rgba(0,0,0,0.6);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s ease;
            ">
              ${isComp ? '<div style="width: 5px; height: 5px; border-radius: 50%; background: #FFFFFF;"></div>' : ''}
            </div>
          </div>
        `,
        iconSize: [isSelected ? 30 : 20, isSelected ? 30 : 20],
        iconAnchor: [isSelected ? 15 : 10, isSelected ? 15 : 10],
      });

      const markerObj = L.marker([b.latitude, b.longitude], { icon }).addTo(markersLayerRef.current!);
      businessMarkersMapRef.current.set(b.osm_id, markerObj);

      // Instant Tooltip on Hover
      markerObj.bindTooltip(
        `
        <div style="font-family: system-ui, sans-serif; padding: 2px;">
          <div style="font-weight: 700; font-size: 12px; color: #0F172A;">${b.name}</div>
          <div style="font-size: 10px; color: ${isComp ? '#DC2626' : '#2563EB'}; font-weight: 600;">
            ${isComp ? '⚠️ Direct Competitor' : b.category} • ${b.distance_formatted}
          </div>
          ${b.address ? `<div style="font-size: 10px; color: #64748B; margin-top: 2px;">📍 ${b.address.substring(0, 45)}</div>` : ''}
        </div>
      `,
        {
          direction: 'top',
          offset: [0, -8],
          opacity: 0.96,
        }
      );

      // Rich Click Popup with Google Maps link & Actions
      const popupContent = `
        <div style="padding: 8px; font-family: system-ui, sans-serif; color: #0B0B0C; min-width: 230px; max-width: 290px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${isComp ? '#DC2626' : '#2563EB'};">
              ${isComp ? '⚠️ Direct Competitor' : b.broadCategory}
            </span>
            <span style="font-size: 10px; background: #F3F4F6; padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #374151;">
              ${b.distance_formatted}
            </span>
          </div>

          <div style="font-weight: 800; font-size: 14px; color: #111827; margin-top: 4px; line-height: 1.3;">
            ${b.name}
          </div>

          <div style="font-size: 11px; color: #4B5563; margin-top: 3px;">
            <span style="color: #D97706; font-weight: 700;">${b.category}</span>
            ${b.cuisine ? ` • Cuisine: ${b.cuisine}` : ''}
          </div>

          ${b.address ? `<div style="font-size: 11px; color: #6B7280; margin-top: 6px; border-top: 1px solid #E5E7EB; padding-top: 4px;">📍 ${b.address}</div>` : ''}
          ${b.phone ? `<div style="font-size: 11px; color: #4B5563; margin-top: 2px;">📞 ${b.phone}</div>` : ''}

          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=${b.latitude},${b.longitude}" 
              target="_blank" 
              rel="noopener noreferrer" 
              style="font-size: 11px; color: #2563EB; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 3px;"
            >
              Google Maps ↗
            </a>
            <span style="font-size: 10px; color: #9CA3AF;">OSM: ${b.osm_id.split('/')[1] || b.osm_id}</span>
          </div>
        </div>
      `;

      markerObj.bindPopup(popupContent);

      markerObj.on('click', () => {
        if (onBusinessSelect) {
          onBusinessSelect(b);
        }
      });
    });
  }, [businesses, radiusMeters, currentCoords, selectedBusinessId, targetLocationName, showLabelsOnMap]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(currentCoords, 14, { animate: true });
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current || businesses.length === 0) return;
    const markersToFit = [
      L.latLng(currentCoords[0], currentCoords[1]),
      ...businesses.map((b) => L.latLng(b.latitude, b.longitude)),
    ];
    const bounds = L.latLngBounds(markersToFit);
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
  };

  return (
    <div
      id="bizmind-map-wrapper"
      className={`relative w-full rounded-xl overflow-hidden border border-[#27272A] bg-[#0B0B0C] ${className}`}
    >
      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />

      {/* Floating Controls Overlay */}
      {showControls && (
        <>
          {/* Top-Right: Controls Bar */}
          <div className="absolute top-3 right-3 z-10 flex flex-wrap items-center gap-2">
            {/* Business Count Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111113]/90 border border-[#27272A] text-xs font-medium text-[#A1A1AA] backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#FFBF24] animate-pulse"></span>
              <span className="text-[#F8FAFC] font-semibold">{businesses.length}</span>
              <span>Shops & POIs</span>
            </div>

            {/* Toggle Shop Names on Map */}
            <button
              id="map-toggle-labels-btn"
              onClick={() => setShowLabelsOnMap((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold backdrop-blur-md shadow-lg transition-all cursor-pointer ${
                showLabelsOnMap
                  ? 'bg-[#FFBF24] border-[#FFBF24] text-[#0B0B0C]'
                  : 'bg-[#111113]/90 hover:bg-[#1A1A1D] border-[#27272A] text-[#F8FAFC]'
              }`}
              title="Show or hide business names directly on the map"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{showLabelsOnMap ? 'Shop Names: ON' : 'Shop Names: OFF'}</span>
            </button>

            {/* Fit All Discovered Businesses */}
            {businesses.length > 0 && (
              <button
                id="map-fit-bounds-btn"
                onClick={handleFitAll}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-xs font-semibold text-[#F8FAFC] backdrop-blur-md shadow-lg transition-colors cursor-pointer"
                title="Fit all discovered shops in view"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#FFBF24]" />
                <span>Fit All</span>
              </button>
            )}

            {/* Tile Layer Switcher */}
            <div className="relative group">
              <button
                id="map-toggle-layer-btn"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-xs font-medium text-[#F8FAFC] backdrop-blur-md shadow-lg transition-colors cursor-pointer"
                title="Change Map Style"
              >
                <Layers className="w-3.5 h-3.5 text-[#FFBF24]" />
                <span>
                  {TILE_LAYER_CONFIGS[selectedTileLayer]?.name || 'Dark Matter'}
                </span>
              </button>

              <div className="absolute right-0 mt-1 w-36 rounded-lg bg-[#111113] border border-[#27272A] shadow-xl p-1 hidden group-hover:block transition-all z-20">
                {(Object.keys(TILE_LAYER_CONFIGS) as MapTileLayer[]).map((key) => {
                  const layer = TILE_LAYER_CONFIGS[key];
                  return (
                    <button
                      key={layer.id}
                      onClick={() => setSelectedTileLayer(layer.id)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                        selectedTileLayer === layer.id
                          ? 'bg-[#FFBF24]/10 text-[#FFBF24] font-medium'
                          : 'text-[#A1A1AA] hover:bg-[#1A1A1D] hover:text-[#F8FAFC]'
                      }`}
                    >
                      {layer.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top-Left: Zoom & Recenter */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <button
              id="map-zoom-in-btn"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md shadow-md transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="map-zoom-out-btn"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md shadow-md transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              id="map-recenter-btn"
              onClick={handleRecenter}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#FFBF24] flex items-center justify-center backdrop-blur-md shadow-md transition-colors cursor-pointer"
              title="Recenter Map on Target"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom-Left: Coordinates & Radius Legend */}
          <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-[#111113]/90 border border-[#27272A] text-[11px] font-mono text-[#F8FAFC] backdrop-blur-md shadow-lg flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />
            <span>
              {currentCoords[0].toFixed(4)}, {currentCoords[1].toFixed(4)}
            </span>
            {radiusMeters && (
              <span className="text-[#FFBF24] pl-1 border-l border-[#27272A]">
                {(radiusMeters / 1000).toFixed(1)} km radius
              </span>
            )}
          </div>

          {/* Bottom-Center: Click on Map Hint */}
          <div className="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-[#111113]/85 border border-[#27272A] text-[10px] text-[#A1A1AA] backdrop-blur-md items-center gap-1.5 pointer-events-none">
            <Compass className="w-3 h-3 text-[#FFBF24]" />
            <span>Click anywhere on the map to analyze that location</span>
          </div>
        </>
      )}
    </div>
  );
};

