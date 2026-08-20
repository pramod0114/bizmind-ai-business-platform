import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MapPin, ZoomIn, ZoomOut, Compass, Navigation } from 'lucide-react';
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
  const [selectedTileLayer, setSelectedTileLayer] = useState<'carto-dark' | 'carto-voyager' | 'osm-standard'>('carto-dark');
  const [currentCoords, setCurrentCoords] = useState<[number, number]>(center);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

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

  const getTileUrl = (type: 'carto-dark' | 'carto-voyager' | 'osm-standard') => {
    if (type === 'carto-dark') {
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
    if (type === 'carto-voyager') {
      return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
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

    const tileLayer = L.tileLayer(getTileUrl(selectedTileLayer), {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Attribution
    L.control.attribution({ position: 'bottomright', prefix: 'Leaflet & OSM' }).addTo(map);

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

    tileLayerRef.current = L.tileLayer(getTileUrl(selectedTileLayer), {
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
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

  // Update Target Marker, Radius & Business POIs
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

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
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(255, 191, 36, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #FFBF24; border: 3px solid #0B0B0C; box-shadow: 0 0 16px rgba(255,191,36,0.8); display: flex; align-items: center; justify-content: center; color: #0B0B0C; font-weight: 900; font-size: 11px;">
            ★
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const centerMarker = L.marker(currentCoords, { icon: targetIcon, zIndexOffset: 1000 }).addTo(
      markersLayerRef.current
    );

    centerMarker.bindPopup(`
      <div style="padding: 6px; font-family: system-ui, sans-serif; color: #0B0B0C; min-width: 180px;">
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

    // 3. Render Discovered Businesses
    businesses.forEach((b) => {
      const isSelected = selectedBusinessId === b.osm_id;
      const colors = getMarkerColor(b);
      const isComp = b.isDirectCompetitor;

      const icon = L.divIcon({
        className: `custom-poi-marker ${isSelected ? 'selected' : ''}`,
        html: `
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
        `,
        iconSize: [isSelected ? 24 : 18, isSelected ? 24 : 18],
        iconAnchor: [isSelected ? 12 : 9, isSelected ? 12 : 9],
      });

      const markerObj = L.marker([b.latitude, b.longitude], { icon }).addTo(markersLayerRef.current!);

      const popupContent = `
        <div style="padding: 6px; font-family: system-ui, sans-serif; color: #0B0B0C; min-width: 220px; max-width: 280px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${isComp ? '#DC2626' : '#2563EB'};">
              ${isComp ? '⚠️ Direct Competitor' : b.broadCategory}
            </span>
            <span style="font-size: 10px; background: #F3F4F6; padding: 1px 6px; border-radius: 4px; font-weight: 600; color: #374151;">
              ${b.distance_formatted}
            </span>
          </div>

          <div style="font-weight: 700; font-size: 13px; color: #111827; margin-top: 4px; line-height: 1.3;">
            ${b.name}
          </div>

          <div style="font-size: 11px; color: #4B5563; margin-top: 2px;">
            <span style="color: #D97706; font-weight: 600;">${b.category}</span>
            ${b.cuisine ? ` • Cuisine: ${b.cuisine}` : ''}
          </div>

          ${b.address ? `<div style="font-size: 11px; color: #6B7280; margin-top: 4px; border-top: 1px solid #E5E7EB; padding-top: 4px;">📍 ${b.address}</div>` : ''}

          <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #E5E7EB; font-size: 10px; color: #9CA3AF; display: flex; justify-content: space-between;">
            <span>OSM ID: ${b.osm_id}</span>
            ${b.opening_hours ? `<span style="color: #059669;">🕒 Open</span>` : ''}
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
  }, [businesses, radiusMeters, currentCoords, selectedBusinessId, targetLocationName]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(currentCoords, 14, { animate: true });
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
          {/* Top-Right: Layer Switcher & Businesses Count */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111113]/90 border border-[#27272A] text-xs font-medium text-[#A1A1AA] backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#FFBF24] animate-pulse"></span>
              <span className="text-[#F8FAFC] font-semibold">{businesses.length}</span>
              <span>POIs in {(radiusMeters / 1000).toFixed(1)}km</span>
            </div>

            <div className="relative group">
              <button
                id="map-toggle-layer-btn"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-xs font-medium text-[#F8FAFC] backdrop-blur-md shadow-lg transition-colors cursor-pointer"
                title="Change Map Style"
              >
                <Layers className="w-3.5 h-3.5 text-[#FFBF24]" />
                <span className="capitalize">
                  {selectedTileLayer === 'carto-dark'
                    ? 'Dark Matter'
                    : selectedTileLayer === 'carto-voyager'
                    ? 'Voyager'
                    : 'Standard'}
                </span>
              </button>

              <div className="absolute right-0 mt-1 w-36 rounded-lg bg-[#111113] border border-[#27272A] shadow-xl p-1 hidden group-hover:block transition-all z-20">
                <button
                  onClick={() => setSelectedTileLayer('carto-dark')}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    selectedTileLayer === 'carto-dark' ? 'bg-[#FFBF24]/10 text-[#FFBF24]' : 'text-[#A1A1AA] hover:bg-[#1A1A1D]'
                  }`}
                >
                  Dark Matter
                </button>
                <button
                  onClick={() => setSelectedTileLayer('carto-voyager')}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    selectedTileLayer === 'carto-voyager' ? 'bg-[#FFBF24]/10 text-[#FFBF24]' : 'text-[#A1A1AA] hover:bg-[#1A1A1D]'
                  }`}
                >
                  Voyager Light
                </button>
                <button
                  onClick={() => setSelectedTileLayer('osm-standard')}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    selectedTileLayer === 'osm-standard' ? 'bg-[#FFBF24]/10 text-[#FFBF24]' : 'text-[#A1A1AA] hover:bg-[#1A1A1D]'
                  }`}
                >
                  OSM Standard
                </button>
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
