import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MapPin, ZoomIn, ZoomOut, Compass } from 'lucide-react';

// Fix default marker icon issues in Vite/Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface MapMarker {
  id: string | number;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  category?: string;
  isCompetitor?: boolean;
}

export interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  radiusMeters?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
  showControls?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  center = [28.6139, 77.2090], // Default: New Delhi, or user coordinate
  zoom = 13,
  markers = [],
  radiusMeters,
  onLocationSelect,
  height = '420px',
  className = '',
  showControls = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const [selectedTileLayer, setSelectedTileLayer] = useState<'carto-dark' | 'osm-standard'>('carto-dark');
  const [currentCoords, setCurrentCoords] = useState<[number, number]>(center);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [center[0], center[1]] as L.LatLngTuple,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
    });

    const tileUrl =
      selectedTileLayer === 'carto-dark'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
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

    // ResizeObserver to handle layout changes smoothly
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

    const tileUrl =
      selectedTileLayer === 'carto-dark'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, [selectedTileLayer]);

  // Update Center & Zoom
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(center, zoom);
    setCurrentCoords(center);
  }, [center, zoom]);

  // Update Markers & Radius Circle
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Render Radius Circle if present
    if (circleLayerRef.current) {
      circleLayerRef.current.remove();
      circleLayerRef.current = null;
    }

    if (radiusMeters && radiusMeters > 0) {
      circleLayerRef.current = L.circle(currentCoords, {
        color: '#FFBF24',
        fillColor: '#FFBF24',
        fillOpacity: 0.12,
        radius: radiusMeters,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(mapInstanceRef.current);
    }

    // Add Primary Center Target Marker
    const primaryIcon = L.divIcon({
      className: 'custom-primary-pin',
      html: `
        <div style="background-color: #FFBF24; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #0B0B0C; box-shadow: 0 0 12px rgba(255,191,36,0.6); display: flex; align-items: center; justify-content: center; color: #0B0B0C; font-weight: bold; font-size: 10px;">
          ★
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const centerMarker = L.marker(currentCoords, { icon: primaryIcon }).addTo(markersLayerRef.current);
    centerMarker.bindPopup(`
      <div style="padding: 4px;">
        <strong style="color: #FFBF24;">Selected Target Location</strong><br/>
        <span style="font-size: 11px; color: #A1A1AA;">Lat: ${currentCoords[0].toFixed(4)}, Lng: ${currentCoords[1].toFixed(4)}</span>
      </div>
    `);

    // Render External Markers
    markers.forEach((m) => {
      const isComp = m.isCompetitor;
      const markerColor = isComp ? '#EF4444' : '#22C55E';
      const icon = L.divIcon({
        className: 'custom-poi-pin',
        html: `
          <div style="background-color: ${markerColor}; width: 18px; height: 18px; border-radius: 50%; border: 2px solid #0B0B0C; box-shadow: 0 2px 6px rgba(0,0,0,0.5);"></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const markerObj = L.marker([m.latitude, m.longitude], { icon }).addTo(markersLayerRef.current!);
      markerObj.bindPopup(`
        <div style="padding: 4px;">
          <strong>${m.title}</strong><br/>
          ${m.category ? `<span style="font-size: 11px; color: #FFBF24;">${m.category}</span><br/>` : ''}
          <span style="font-size: 11px; color: #A1A1AA;">${m.description || 'Spatial Intelligence POI'}</span>
        </div>
      `);
    });
  }, [markers, radiusMeters, currentCoords]);

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-[#27272A] bg-[#0B0B0C] ${className}`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />

      {/* Floating Controls Overlay */}
      {showControls && (
        <>
          {/* Top-Right Layer Switcher & Info */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <button
              onClick={() =>
                setSelectedTileLayer((prev) => (prev === 'carto-dark' ? 'osm-standard' : 'carto-dark'))
              }
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-xs font-medium text-[#F8FAFC] backdrop-blur-md shadow-lg transition-colors cursor-pointer"
              title="Toggle Tile Provider"
            >
              <Layers className="w-3.5 h-3.5 text-[#FFBF24]" />
              <span>{selectedTileLayer === 'carto-dark' ? 'Voyager Tiles' : 'OSM Standard'}</span>
            </button>
          </div>

          {/* Bottom-Left Location Coordinates Bar */}
          <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-[#111113]/90 border border-[#27272A] text-[11px] font-mono text-[#F8FAFC] backdrop-blur-md shadow-lg flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />
            <span>
              Lat: {currentCoords[0].toFixed(4)} | Lng: {currentCoords[1].toFixed(4)}
            </span>
            {radiusMeters && (
              <span className="text-[#FFBF24] pl-1 border-l border-[#27272A]">
                Radius: {(radiusMeters / 1000).toFixed(1)} km
              </span>
            )}
          </div>

          {/* Zoom Buttons */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md shadow-md transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-8 h-8 rounded-lg bg-[#111113]/90 hover:bg-[#1A1A1D] border border-[#27272A] text-[#F8FAFC] flex items-center justify-center backdrop-blur-md shadow-md transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
