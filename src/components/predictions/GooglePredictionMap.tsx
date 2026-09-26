/**
 * BizMind – Dual-Engine Map Component for Location-Based Prediction
 * 
 * Supports Google Maps Platform (Maps JavaScript API) as primary engine,
 * with seamless automatic OpenStreetMap (Leaflet) fallback when key restrictions
 * or activation issues occur.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
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
import { CompetitorDetail } from '../../services/locationPredictionService';
import { GoogleMapsGuideModal } from '../common/GoogleMapsGuideModal';
import { AlertTriangle, Layers, Info, HelpCircle, RefreshCw } from 'lucide-react';

export interface GooglePredictionMapProps {
  center: { latitude: number; longitude: number };
  radiusMeters: number;
  competitors: CompetitorDetail[];
  locationName: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedCompetitorId?: string | null;
  onSelectCompetitor?: (competitor: CompetitorDetail) => void;
  height?: string;
  className?: string;
}

export const GooglePredictionMap: React.FC<GooglePredictionMapProps> = ({
  center,
  radiusMeters,
  competitors,
  locationName,
  onLocationSelect,
  selectedCompetitorId,
  onSelectCompetitor,
  height = '420px',
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Engine state
  const [engine, setEngine] = useState<MapEngine>(() => getPreferredMapEngine());
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Google Maps references
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const targetMarkerRef = useRef<google.maps.Marker | null>(null);
  const competitorMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Leaflet references
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletCircleRef = useRef<L.Circle | null>(null);
  const leafletTargetMarkerRef = useRef<L.Marker | null>(null);
  const leafletMarkersRef = useRef<L.Marker[]>([]);

  // Monitor Google Maps auth failures
  useEffect(() => {
    const unsub = onGoogleMapsAuthFailure((msg) => {
      setAuthError(msg);
      setEngine('osm');
      setPreferredMapEngine('osm');
      setLoading(false);
    });

    if (isGoogleMapsAuthFailed()) {
      setAuthError(
        'Google Maps Platform API key has referrer or activation restrictions. Switched to OpenStreetMap fallback.'
      );
      setEngine('osm');
      setLoading(false);
    }

    return () => unsub();
  }, []);

  const destroyGoogleMap = useCallback(() => {
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
    if (targetMarkerRef.current) {
      targetMarkerRef.current.setMap(null);
      targetMarkerRef.current = null;
    }
    competitorMarkersRef.current.forEach((m) => m.setMap(null));
    competitorMarkersRef.current.clear();
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }
    mapInstanceRef.current = null;
  }, []);

  const destroyLeafletMap = useCallback(() => {
    if (leafletCircleRef.current) {
      leafletCircleRef.current.remove();
      leafletCircleRef.current = null;
    }
    if (leafletTargetMarkerRef.current) {
      leafletTargetMarkerRef.current.remove();
      leafletTargetMarkerRef.current = null;
    }
    leafletMarkersRef.current.forEach((m) => m.remove());
    leafletMarkersRef.current = [];
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }
  }, []);

  // Initialize Map based on active engine
  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!mapContainerRef.current) return;

      if (engine === 'google' && !isGoogleMapsAuthFailed()) {
        try {
          destroyLeafletMap();
          setLoading(true);
          const g = await loadGoogleMaps();
          if (!isMounted || !mapContainerRef.current) return;

          const mapOptions: google.maps.MapOptions = {
            center: { lat: center.latitude, lng: center.longitude },
            zoom: radiusMeters <= 1000 ? 15 : radiusMeters <= 2000 ? 14 : 13,
            styles: BIZMIND_DARK_MAP_STYLES,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            backgroundColor: '#0B0B0C',
          };

          const map = new g.maps.Map(mapContainerRef.current, mapOptions);
          mapInstanceRef.current = map;
          infoWindowRef.current = new g.maps.InfoWindow({ maxWidth: 320 });

          if (onLocationSelect) {
            map.addListener('click', (e: google.maps.MapMouseEvent) => {
              if (e.latLng) {
                onLocationSelect(e.latLng.lat(), e.latLng.lng());
              }
            });
          }

          setLoading(false);
        } catch (err: any) {
          if (!isMounted) return;
          console.warn('[GooglePredictionMap] Google load error, switching to OSM:', err);
          setAuthError(err?.message || 'Google Maps failed to initialize. Switched to OpenStreetMap.');
          setEngine('osm');
          setPreferredMapEngine('osm');
          setLoading(false);
        }
      } else {
        // Initialize Leaflet
        destroyGoogleMap();
        setLoading(false);
        if (!mapContainerRef.current) return;

        // Clean container inner HTML in case Google Maps left artifacts
        mapContainerRef.current.innerHTML = '';

        const map = L.map(mapContainerRef.current, {
          center: [center.latitude, center.longitude],
          zoom: radiusMeters <= 1000 ? 15 : radiusMeters <= 2000 ? 14 : 13,
          zoomControl: true,
          attributionControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
          className: 'osm-dark-tiles',
        }).addTo(map);

        if (onLocationSelect) {
          map.on('click', (e: L.LeafletMouseEvent) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
          });
        }

        leafletMapRef.current = map;
      }
    }

    init();

    return () => {
      isMounted = false;
      destroyGoogleMap();
      destroyLeafletMap();
    };
  }, [engine, destroyGoogleMap, destroyLeafletMap]);

  // Update Layers for Google Maps
  useEffect(() => {
    if (engine !== 'google' || !mapInstanceRef.current || !(window as any).google?.maps) return;
    const g = (window as any).google as typeof google;
    const map = mapInstanceRef.current;
    const centerLatLng = { lat: center.latitude, lng: center.longitude };

    map.panTo(centerLatLng);

    // Update Circle
    if (circleRef.current) {
      circleRef.current.setCenter(centerLatLng);
      circleRef.current.setRadius(radiusMeters);
    } else {
      circleRef.current = new g.maps.Circle({
        strokeColor: '#FFBF24',
        strokeOpacity: 0.85,
        strokeWeight: 2,
        fillColor: '#FFBF24',
        fillOpacity: 0.07,
        map,
        center: centerLatLng,
        radius: radiusMeters,
        clickable: false,
      });
    }

    // Target Marker
    const targetSvg = {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: '#FFBF24',
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#0B0B0C',
      scale: 1.6,
      anchor: new g.maps.Point(12, 22),
    };

    if (targetMarkerRef.current) {
      targetMarkerRef.current.setPosition(centerLatLng);
      targetMarkerRef.current.setTitle(locationName);
    } else {
      targetMarkerRef.current = new g.maps.Marker({
        position: centerLatLng,
        map,
        title: `Target Site: ${locationName}`,
        icon: targetSvg,
        zIndex: 999,
      });
    }

    // Competitor Markers
    competitorMarkersRef.current.forEach((m) => m.setMap(null));
    competitorMarkersRef.current.clear();

    const competitorSvg = (color: string) => ({
      path: g.maps.SymbolPath.CIRCLE,
      scale: 7,
      fillColor: color,
      fillOpacity: 0.95,
      strokeColor: '#0B0B0C',
      strokeWeight: 2,
    });

    competitors.forEach((c) => {
      const color = c.isDirectCompetitor ? '#EF4444' : '#38BDF8';
      const marker = new g.maps.Marker({
        position: { lat: c.latitude, lng: c.longitude },
        map,
        title: c.name,
        icon: competitorSvg(color),
        zIndex: c.isDirectCompetitor ? 100 : 50,
      });

      marker.addListener('click', () => {
        if (onSelectCompetitor) onSelectCompetitor(c);
        if (infoWindowRef.current) {
          const content = `
            <div style="font-family: inherit; color: #F8FAFC; padding: 6px 2px; max-width: 260px;">
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${color};">
                ${c.isDirectCompetitor ? 'Direct Competitor' : 'Related Venue'}
              </div>
              <div style="font-size: 13px; font-weight: 700; margin-top: 3px; color: #FFFFFF;">${c.name}</div>
              <div style="font-size: 11px; color: #A1A1AA; margin-top: 2px;">${c.category}</div>
              <div style="font-size: 11px; color: #CBD5E1; margin-top: 4px;">
                Distance: <strong style="color: #FFBF24;">${c.distanceFormatted}</strong>
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, marker);
        }
      });

      competitorMarkersRef.current.set(c.id, marker);
    });
  }, [engine, center, radiusMeters, locationName, competitors, onSelectCompetitor]);

  // Update Layers for Leaflet
  useEffect(() => {
    if (engine !== 'osm' || !leafletMapRef.current) return;
    const map = leafletMapRef.current;
    map.panTo([center.latitude, center.longitude]);

    // Circle
    if (leafletCircleRef.current) leafletCircleRef.current.remove();
    leafletCircleRef.current = L.circle([center.latitude, center.longitude], {
      radius: radiusMeters,
      color: '#FFBF24',
      weight: 2,
      opacity: 0.9,
      fillColor: '#FFBF24',
      fillOpacity: 0.08,
    }).addTo(map);

    // Target Marker
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
    leafletTargetMarkerRef.current = L.marker([center.latitude, center.longitude], {
      icon: centerIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    // Competitor Markers
    leafletMarkersRef.current.forEach((m) => m.remove());
    leafletMarkersRef.current = [];

    competitors.forEach((c) => {
      const isDirect = c.isDirectCompetitor;
      const themeColor = isDirect ? '#EF4444' : '#38BDF8';
      const size = isDirect ? 24 : 18;

      const icon = L.divIcon({
        className: 'custom-business-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background-color: ${themeColor};
            border: 2px solid #0B0B0C;
            box-shadow: 0 2px 6px rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 10px;
            font-weight: 800;
          ">
            ${isDirect ? '!' : '•'}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([c.latitude, c.longitude], { icon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; color: #F8FAFC; padding: 4px; min-width: 200px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${themeColor};">
            ${isDirect ? 'Direct Competitor' : 'Related Venue'}
          </div>
          <div style="font-size: 13px; font-weight: 700; margin-top: 2px; color: #FFFFFF;">${c.name}</div>
          <div style="font-size: 11px; color: #A1A1AA; margin-top: 1px;">${c.category}</div>
          <div style="font-size: 11px; color: #CBD5E1; margin-top: 4px;">
            Distance: <strong style="color: #FFBF24;">${c.distanceFormatted}</strong>
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectCompetitor) onSelectCompetitor(c);
      });

      leafletMarkersRef.current.push(marker);
    });
  }, [engine, center, radiusMeters, competitors, onSelectCompetitor]);

  const fitBoundsToAll = useCallback(() => {
    if (engine === 'google' && mapInstanceRef.current && (window as any).google?.maps) {
      const g = (window as any).google as typeof google;
      const bounds = new g.maps.LatLngBounds();
      bounds.extend({ lat: center.latitude, lng: center.longitude });
      competitors.forEach((c) => {
        bounds.extend({ lat: c.latitude, lng: c.longitude });
      });
      mapInstanceRef.current.fitBounds(bounds, 50);
    } else if (engine === 'osm' && leafletMapRef.current) {
      const group = L.featureGroup([
        L.marker([center.latitude, center.longitude]),
        ...competitors.map((c) => L.marker([c.latitude, c.longitude])),
      ]);
      leafletMapRef.current.fitBounds(group.getBounds().pad(0.15));
    }
  }, [engine, center, competitors]);

  const handleRetryGoogle = () => {
    resetGoogleMapsAuthFailure();
    setAuthError(null);
    setEngine('google');
    setPreferredMapEngine('google');
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#27272A] bg-[#0B0B0C] ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0B0C]/80 backdrop-blur-xs z-20">
          <div className="w-8 h-8 rounded-full border-2 border-[#FFBF24] border-t-transparent animate-spin mb-2" />
          <span className="text-xs text-[#A1A1AA] font-mono">Loading Map Engine...</span>
        </div>
      )}

      {/* Auth Error Banner with Quick Help */}
      {authError && (
        <div className="absolute top-3 left-3 right-3 p-3 rounded-lg bg-[#18181B]/95 border border-amber-500/40 text-xs text-[#F8FAFC] z-30 flex items-start gap-2.5 shadow-xl">
          <AlertTriangle className="w-4 h-4 text-[#FFBF24] shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#FFBF24]">Google Maps Notice: Switched to OpenStreetMap Fallback</span>
              <button
                onClick={() => setShowGuideModal(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFBF24] hover:bg-[#F59E0B] text-[#0B0B0C] text-[11px] font-bold cursor-pointer transition-colors"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Fix Google Cloud Key</span>
              </button>
            </div>
            <p className="text-[11px] text-[#A1A1AA] mt-1 leading-relaxed">
              Google Maps was blocked by domain/referrer restrictions. Your interactive map is actively functioning using OpenStreetMap fallback without loss of pins or metrics.
            </p>
          </div>
        </div>
      )}

      {/* Overlay Map Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (engine === 'osm') {
              handleRetryGoogle();
            } else {
              setEngine('osm');
              setPreferredMapEngine('osm');
            }
          }}
          className="px-2.5 py-1 rounded-md bg-[#18181B]/90 hover:bg-[#27272A] border border-[#27272A] text-[#F8FAFC] text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          title="Toggle Map Provider"
        >
          <RefreshCw className="w-3 h-3 text-[#38BDF8]" />
          <span>{engine === 'google' ? 'Engine: Google Maps' : 'Engine: OpenStreetMap'}</span>
        </button>

        <button
          type="button"
          onClick={fitBoundsToAll}
          className="px-2.5 py-1 rounded-md bg-[#18181B]/90 hover:bg-[#27272A] border border-[#27272A] text-[#F8FAFC] text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          title="Fit view to all competitors and radius"
        >
          <Layers className="w-3 h-3 text-[#FFBF24]" />
          <span>Fit View</span>
        </button>
      </div>

      {/* Legend & Instructions Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-[#111113]/90 backdrop-blur-xs border border-[#27272A] text-[11px]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBF24] inline-block shadow-xs" />
            <span className="text-[#F8FAFC] font-medium">Target Site</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block shadow-xs" />
            <span className="text-[#A1A1AA]">
              Direct Competitor ({competitors.filter((c) => c.isDirectCompetitor).length})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] inline-block shadow-xs" />
            <span className="text-[#A1A1AA]">
              Related Venue ({competitors.filter((c) => c.isRelated && !c.isDirectCompetitor).length})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#71717A]">
          <Info className="w-3 h-3 text-[#FFBF24]" />
          <span>Click anywhere on map to reposition target site</span>
        </div>
      </div>

      {/* Guide Modal */}
      <GoogleMapsGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onRetryGoogle={handleRetryGoogle}
      />
    </div>
  );
};
