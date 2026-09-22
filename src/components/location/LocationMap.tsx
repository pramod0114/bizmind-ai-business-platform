import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Compass, ZoomIn, ZoomOut, Maximize2, Minimize2, BookmarkPlus } from 'lucide-react';
import { DiscoveredBusiness } from '../../types';
import { createTargetLocationIcon, createBusinessMarkerIcon } from './LocationMarker';

// Fix default marker icon issues in Vite/Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
}

type TileTheme = 'dark' | 'standard' | 'satellite';

interface TileThemeConfig {
  name: string;
  url: string;
  attribution: string;
  subdomains?: string[];
  className?: string;
  maxZoom?: number;
}

const TILE_THEMES: Record<TileTheme, TileThemeConfig> = {
  dark: {
    name: 'Midnight Dark (OSM)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    className: 'osm-dark-tiles',
    maxZoom: 19,
  },
  standard: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
  },
  satellite: {
    name: 'Satellite Aerial',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; <a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a> Earthstar Geographics',
    maxZoom: 19,
  },
};

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
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const targetMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const businessMarkersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeTheme, setActiveTheme] = useState<TileTheme>('dark');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Map instance once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center[0], center[1]],
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      const initialTheme = TILE_THEMES[activeTheme];
      const tiles = L.tileLayer(initialTheme.url, {
        maxZoom: initialTheme.maxZoom || 19,
        attribution: initialTheme.attribution,
        subdomains: initialTheme.subdomains || ['a', 'b', 'c'],
        className: initialTheme.className || '',
      }).addTo(map);

      tileLayerRef.current = tiles;

      // Click to choose coordinates
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onLocationSelect) {
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        }
      });

      businessMarkersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Trigger size invalidation right after mount
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const config = TILE_THEMES[activeTheme];

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom || 19,
      attribution: config.attribution,
      subdomains: config.subdomains || ['a', 'b', 'c', 'd'],
      className: config.className || '',
    }).addTo(mapInstanceRef.current);

    newLayer.bringToBack();
    tileLayerRef.current = newLayer;

    if (radiusCircleRef.current) {
      radiusCircleRef.current.bringToBack();
    }
  }, [activeTheme]);

  // Update Center, Target Marker and Radius Circle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Instantly and reliably set center coordinate on target location
    map.setView([center[0], center[1]], map.getZoom() || zoom);

    // Safely invalidate size on the next animation frame
    requestAnimationFrame(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    // Target marker with star icon
    if (targetMarkerRef.current) {
      targetMarkerRef.current.setLatLng([center[0], center[1]]);
      targetMarkerRef.current.setIcon(createTargetLocationIcon(targetLocationName));
      targetMarkerRef.current.setZIndexOffset(1000);
    } else {
      const marker = L.marker([center[0], center[1]], {
        icon: createTargetLocationIcon(targetLocationName),
        zIndexOffset: 1000,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <div style="font-weight: 700; font-size: 13px; color: #111;">${targetLocationName}</div>
          <div style="font-size: 11px; color: #666; margin-top: 2px;">Target Coordinates: ${center[0].toFixed(4)}, ${center[1].toFixed(4)}</div>
          <div style="font-size: 11px; color: #b45309; margin-top: 4px; font-weight: 600;">Analysis Radius: ${(radiusMeters / 1000).toFixed(1)} km</div>
        </div>
      `);
      targetMarkerRef.current = marker;
    }

    // Radius circle around target
    if (radiusCircleRef.current) {
      radiusCircleRef.current.setLatLng([center[0], center[1]]);
      radiusCircleRef.current.setRadius(radiusMeters);
    } else {
      const circle = L.circle([center[0], center[1]], {
        radius: radiusMeters,
        color: '#FFBF24',
        weight: 2,
        dashArray: '4, 6',
        fillColor: '#FFBF24',
        fillOpacity: 0.12,
      }).addTo(map);
      radiusCircleRef.current = circle;
    }
    radiusCircleRef.current.bringToBack();
  }, [center[0], center[1], radiusMeters, targetLocationName]);

  // Render Business Markers with popups
  useEffect(() => {
    if (!mapInstanceRef.current || !businessMarkersLayerRef.current) return;
    const layer = businessMarkersLayerRef.current;
    layer.clearLayers();

    businesses.forEach((biz) => {
      const isSelected = selectedBusinessId !== null && String(biz.id) === String(selectedBusinessId);
      const icon = createBusinessMarkerIcon(biz, isSelected);

      const marker = L.marker([biz.latitude, biz.longitude], {
        icon,
        title: biz.name,
      });

      // Interactive popup
      const isCompetitor = biz.is_direct_competitor;
      const popupHtml = `
        <div style="font-family: inherit; min-width: 180px; max-width: 240px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: ${
              isCompetitor ? '#fee2e2' : '#f3f4f6'
            }; color: ${isCompetitor ? '#b91c1c' : '#374151'};">
              ${isCompetitor ? 'Direct Competitor' : biz.category || 'Business'}
            </span>
            <span style="font-size: 11px; font-weight: 600; color: #4b5563;">
              ${biz.distance_formatted || `${Math.round(biz.distance_meters || 0)}m`}
            </span>
          </div>
          <div style="font-weight: 700; font-size: 13px; color: #111; margin-top: 6px;">
            ${biz.name}
          </div>
          ${biz.address ? `<div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${biz.address}</div>` : ''}
          ${biz.phone ? `<div style="font-size: 11px; color: #2563eb; margin-top: 4px;">☎ ${biz.phone}</div>` : ''}
          <div style="margin-top: 8px; border-top: 1px solid #e5e7eb; padding-top: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; color: #9ca3af;">OSM ID: ${biz.osm_id}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        if (onBusinessSelect) onBusinessSelect(biz);
      });

      layer.addLayer(marker);
    });
  }, [businesses, selectedBusinessId, onBusinessSelect]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    mapInstanceRef.current?.setView([center[0], center[1]], zoom, { animate: true });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-[#27272A] bg-[#111113] shadow-lg ${
        isFullscreen ? 'fixed inset-4 z-50 !h-auto max-h-none' : ''
      } ${className}`}
      style={{ height: isFullscreen ? 'calc(100vh - 32px)' : height }}
    >
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full cursor-crosshair z-0" />

      {/* Click-to-choose helper overlay tag */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <div className="px-2.5 py-1 rounded-md bg-[#111113]/90 border border-[#27272A] backdrop-blur-md text-[11px] font-medium text-[#A1A1AA] flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#FFBF24] animate-pulse"></span>
          <span>Click anywhere on map to reposition target</span>
        </div>
      </div>

      {/* Floating Map Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        {/* Layer Theme Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="p-2 rounded-lg bg-[#111113]/95 hover:bg-[#1A1A1D] border border-[#27272A] text-[#A1A1AA] hover:text-[#FFBF24] transition-colors shadow-md cursor-pointer"
            title="Switch Map Style"
          >
            <Layers className="w-4 h-4" />
          </button>

          {showThemePicker && (
            <div className="absolute right-0 mt-1 w-36 bg-[#111113] border border-[#27272A] rounded-lg shadow-xl p-1.5 z-20 backdrop-blur-md">
              {(Object.keys(TILE_THEMES) as TileTheme[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveTheme(key);
                    setShowThemePicker(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                    activeTheme === key ? 'bg-[#FFBF24]/15 text-[#FFBF24] font-semibold' : 'text-[#A1A1AA] hover:bg-[#1A1A1D]'
                  }`}
                >
                  {TILE_THEMES[key].name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Re-center */}
        <button
          type="button"
          onClick={handleRecenter}
          className="p-2 rounded-lg bg-[#111113]/95 hover:bg-[#1A1A1D] border border-[#27272A] text-[#A1A1AA] hover:text-[#FFBF24] transition-colors shadow-md cursor-pointer"
          title="Re-center on target location"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2 rounded-lg bg-[#111113]/95 hover:bg-[#1A1A1D] border border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors shadow-md cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2 rounded-lg bg-[#111113]/95 hover:bg-[#1A1A1D] border border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors shadow-md cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Fullscreen */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-[#111113]/95 hover:bg-[#1A1A1D] border border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors shadow-md cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Map Bottom Legend / Attribution */}
      <div className="absolute bottom-2 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none text-[10px] text-[#71717A]">
        <div className="flex items-center gap-2.5 bg-[#111113]/95 px-2.5 py-1 rounded-md border border-[#27272A] backdrop-blur-md pointer-events-auto shadow-md">
          <span className="flex items-center gap-1.5 font-medium text-[#F8FAFC]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBF24] inline-block border border-black/50"></span> Target Location
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#F8FAFC]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] inline-block border border-black/50"></span> Direct Competitor
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#F8FAFC]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] inline-block border border-black/50"></span> Commercial POI
          </span>
        </div>
        <div className="bg-[#111113]/95 px-2.5 py-1 rounded-md border border-[#27272A] backdrop-blur-md pointer-events-auto shadow-md text-[#71717A]">
          &copy; OpenStreetMap contributors
        </div>
      </div>
    </div>
  );
};
