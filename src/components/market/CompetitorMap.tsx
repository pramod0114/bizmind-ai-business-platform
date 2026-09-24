import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MarketCompetitor } from '../../types';
import { Layers, ZoomIn, ZoomOut, Maximize2, Minimize2, Flame, Building2, MapPin } from 'lucide-react';

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
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOther, setShowOther] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark styled tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        className: 'osm-dark-tiles',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);

      // Attribution
      L.control
        .attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors')
        .addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center, circle, and markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. Draw Analysis Radius Circle
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
    }
    const radiusMeters = radiusKm * 1000;
    circleRef.current = L.circle(center, {
      radius: radiusMeters,
      color: '#FFBF24',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#FFBF24',
      fillOpacity: 0.07,
    }).addTo(map);

    // 2. Draw Center Target Location Marker
    const targetIcon = L.divIcon({
      className: 'target-pin-custom',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(255, 191, 36, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #FFBF24; border: 3px solid #0B0B0C; box-shadow: 0 0 14px rgba(255, 191, 36, 0.8); display: flex; align-items: center; justify-content: center; color: #0B0B0C;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const targetMarker = L.marker(center, { icon: targetIcon, zIndexOffset: 1000 });
    targetMarker.bindPopup(`
      <div style="font-family: inherit; padding: 2px;">
        <span style="font-size: 10px; color: #FFBF24; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Target Trade Center</span>
        <h4 style="margin: 2px 0 4px 0; font-size: 13px; font-weight: 700; color: #F8FAFC;">${locationName}</h4>
        <p style="margin: 0; font-size: 11px; color: #A1A1AA;">Radius: ${radiusKm} km</p>
      </div>
    `);
    markersLayer.addLayer(targetMarker);

    // 3. Draw Direct Competitors
    competitors.forEach((c) => {
      const isSelected = selectedCompetitorId === c.osm_id || selectedCompetitorId === c.id;
      const compIcon = L.divIcon({
        className: 'competitor-pin-custom',
        html: `
          <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="width: 24px; height: 24px; border-radius: 50%; background: ${isSelected ? '#EF4444' : '#F59E0B'}; border: 2px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; color: #0B0B0C; font-weight: bold; transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'}; transition: transform 0.2s;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#0B0B0C" stroke="#0B0B0C" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([c.latitude, c.longitude], { icon: compIcon, zIndexOffset: isSelected ? 900 : 500 });
      marker.on('click', () => {
        onSelectCompetitor?.(c);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; min-width: 180px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span style="font-size: 10px; color: #F59E0B; text-transform: uppercase; font-weight: 700;">Direct Competitor</span>
            <span style="font-size: 10px; color: #A1A1AA; font-family: monospace;">${c.distance_formatted}</span>
          </div>
          <h4 style="margin: 4px 0 2px 0; font-size: 13px; font-weight: 700; color: #F8FAFC;">${c.name}</h4>
          <span style="display: inline-block; font-size: 10px; padding: 2px 6px; border-radius: 4px; background: #27272A; color: #E4E4E7; margin-bottom: 6px;">${c.category}</span>
          ${c.address ? `<p style="margin: 0 0 6px 0; font-size: 11px; color: #A1A1AA; line-height: 1.3;">${c.address}</p>` : ''}
          <div style="border-top: 1px solid #27272A; padding-top: 6px; font-size: 10px; color: #71717A;">
            Click card below for full profile
          </div>
        </div>
      `);

      markersLayer.addLayer(marker);
    });

    // 4. Draw Other Businesses (if toggled)
    if (showOther) {
      otherBusinesses.forEach((b) => {
        const otherIcon = L.divIcon({
          className: 'other-pin-custom',
          html: `
            <div style="width: 14px; height: 14px; border-radius: 50%; background: #38BDF8; border: 2px solid #18181B; box-shadow: 0 2px 5px rgba(0,0,0,0.5); opacity: 0.75; cursor: pointer;"></div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([b.latitude, b.longitude], { icon: otherIcon, zIndexOffset: 100 });
        marker.bindPopup(`
          <div style="font-family: inherit; min-width: 160px; padding: 2px;">
            <span style="font-size: 10px; color: #38BDF8; text-transform: uppercase; font-weight: 700;">Nearby Business</span>
            <h4 style="margin: 2px 0; font-size: 12px; font-weight: 600; color: #F8FAFC;">${b.name}</h4>
            <span style="font-size: 10px; color: #A1A1AA;">${b.category} • ${b.distance_formatted}</span>
          </div>
        `);
        markersLayer.addLayer(marker);
      });
    }

    // Adjust view
    map.setView(center, zoom);
  }, [center, zoom, radiusKm, locationName, competitors, otherBusinesses, selectedCompetitorId, showOther]);

  // Recenter map handler
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, 14);
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-[#27272A] bg-[#111113] ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl h-[calc(100vh-2rem)]' : ''
      } ${className}`}
      style={{ height: isFullscreen ? undefined : height }}
    >
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Controls Overlay */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5 bg-[#18181B]/90 backdrop-blur-md p-1.5 rounded-lg border border-[#27272A]">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2 hover:bg-[#27272A] rounded text-[#F8FAFC] transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2 hover:bg-[#27272A] rounded text-[#F8FAFC] transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          className="p-2 hover:bg-[#27272A] rounded text-[#FFBF24] transition-colors"
          title="Recenter Map"
        >
          <MapPin className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 hover:bg-[#27272A] rounded text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Layer Toggle & Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-[#18181B]/95 backdrop-blur-md p-3 rounded-lg border border-[#27272A] text-xs space-y-2 shadow-lg max-w-[260px]">
        <div className="flex items-center justify-between gap-3 pb-1.5 border-b border-[#27272A]">
          <span className="font-bold text-[#F8FAFC] text-[11px] uppercase tracking-wider">Map Legend</span>
          <button
            type="button"
            onClick={() => setShowOther(!showOther)}
            className="text-[10px] text-[#38BDF8] hover:underline cursor-pointer"
          >
            {showOther ? 'Hide Other' : 'Show Other'}
          </button>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FFBF24] border border-black shrink-0" />
            <span className="text-[#F8FAFC] font-medium">Selected Location</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B] border border-white shrink-0" />
            <span className="text-[#F8FAFC] font-medium">
              Direct Competitors ({competitors.length})
            </span>
          </div>

          {showOther && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shrink-0 opacity-75" />
              <span className="text-[#A1A1AA]">
                Other Commercial POIs ({otherBusinesses.length})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
