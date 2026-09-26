/**
 * BizMind – Pure Google Maps Platform Component for Location-Based Prediction
 * 
 * Complies strictly with instructions:
 * - Uses ONLY Google Maps Platform (Maps JavaScript API)
 * - Zero OpenStreetMap, Leaflet, or Overpass dependencies
 * - Dark & Amber BizMind theme styling
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  loadGoogleMaps,
  BIZMIND_DARK_MAP_STYLES,
  onGoogleMapsAuthFailure,
  isGoogleMapsAuthFailed,
} from '../../services/googleMapsService';
import { CompetitorDetail } from '../../services/locationPredictionService';
import { MapPin, Navigation, ExternalLink, AlertTriangle, Layers, Info } from 'lucide-react';

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
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const targetMarkerRef = useRef<google.maps.Marker | null>(null);
  const competitorMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Monitor Google Maps auth
  useEffect(() => {
    const unsub = onGoogleMapsAuthFailure((msg) => {
      setAuthError(msg);
      setLoading(false);
    });

    if (isGoogleMapsAuthFailed()) {
      setAuthError(
        'Google Maps Platform API key has referrer or activation restrictions. Please check your Google Cloud Console.'
      );
      setLoading(false);
    }

    return () => unsub();
  }, []);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      try {
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

        // InfoWindow with custom dark template
        infoWindowRef.current = new g.maps.InfoWindow({
          maxWidth: 320,
        });

        // Click to change location listener
        if (onLocationSelect) {
          map.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              onLocationSelect(lat, lng);
            }
          });
        }

        setMapReady(true);
        setLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        setAuthError(err?.message || 'Failed to initialize Google Maps Platform SDK.');
        setLoading(false);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (circleRef.current) circleRef.current.setMap(null);
      if (targetMarkerRef.current) targetMarkerRef.current.setMap(null);
      competitorMarkersRef.current.forEach((m) => m.setMap(null));
      competitorMarkersRef.current.clear();
      if (infoWindowRef.current) infoWindowRef.current.close();
    };
  }, []);

  // Update Center, Circle, Target Marker
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !(window as any).google?.maps) return;
    const g = (window as any).google as typeof google;
    const map = mapInstanceRef.current;
    const centerLatLng = { lat: center.latitude, lng: center.longitude };

    map.panTo(centerLatLng);

    // Update or create Radius Circle
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

    // Target Marker with custom amber pin SVG
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
        animation: g.maps.Animation.DROP,
      });
    }
  }, [center, radiusMeters, locationName, mapReady]);

  // Update Competitor Markers
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !(window as any).google?.maps) return;
    const g = (window as any).google as typeof google;
    const map = mapInstanceRef.current;

    // Clear old markers
    competitorMarkersRef.current.forEach((marker) => marker.setMap(null));
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
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
                <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: ${
                  c.isDirectCompetitor ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)'
                }; color: ${c.isDirectCompetitor ? '#EF4444' : '#38BDF8'};">
                  ${c.isDirectCompetitor ? 'Direct Competitor' : 'Related Venue'}
                </span>
                <span style="font-size: 11px; font-family: monospace; color: #FFBF24; font-weight: bold;">
                  ${c.distanceFormatted}
                </span>
              </div>
              <h4 style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #F8FAFC;">${c.name}</h4>
              <p style="margin: 0 0 6px; font-size: 11px; color: #A1A1AA;">${c.category} • ${c.broadCategory}</p>
              ${c.address ? `<p style="margin: 0 0 8px; font-size: 10px; color: #71717A; line-height: 1.3;">${c.address}</p>` : ''}
              <a href="${c.googleMapsUri}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: #FFBF24; text-decoration: none; font-weight: 600;">
                View on Google Maps &rarr;
              </a>
            </div>
          `;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, marker);
        }
      });

      competitorMarkersRef.current.set(c.id, marker);
    });
  }, [competitors, mapReady, onSelectCompetitor]);

  // Focus selected competitor
  useEffect(() => {
    if (!selectedCompetitorId || !mapInstanceRef.current) return;
    const marker = competitorMarkersRef.current.get(selectedCompetitorId);
    if (marker) {
      mapInstanceRef.current.panTo(marker.getPosition()!);
      const comp = competitors.find((c) => c.id === selectedCompetitorId);
      if (comp && infoWindowRef.current) {
        infoWindowRef.current.setContent(`
          <div style="font-family: inherit; color: #F8FAFC; padding: 6px 2px; max-width: 260px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: ${
                comp.isDirectCompetitor ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)'
              }; color: ${comp.isDirectCompetitor ? '#EF4444' : '#38BDF8'};">
                ${comp.isDirectCompetitor ? 'Direct Competitor' : 'Related Venue'}
              </span>
              <span style="font-size: 11px; font-family: monospace; color: #FFBF24; font-weight: bold;">
                ${comp.distanceFormatted}
              </span>
            </div>
            <h4 style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #F8FAFC;">${comp.name}</h4>
            <p style="margin: 0 0 6px; font-size: 11px; color: #A1A1AA;">${comp.category}</p>
            <a href="${comp.googleMapsUri}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: #FFBF24; text-decoration: none; font-weight: 600;">
              View on Google Maps &rarr;
            </a>
          </div>
        `);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      }
    }
  }, [selectedCompetitorId, competitors]);

  const fitBoundsToAll = useCallback(() => {
    if (!mapInstanceRef.current || !(window as any).google?.maps) return;
    const g = (window as any).google as typeof google;
    const bounds = new g.maps.LatLngBounds();

    bounds.extend({ lat: center.latitude, lng: center.longitude });
    competitors.forEach((c) => {
      bounds.extend({ lat: c.latitude, lng: c.longitude });
    });

    mapInstanceRef.current.fitBounds(bounds, {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40,
    });
  }, [center, competitors]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-[#27272A] bg-[#0B0B0C] ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0B0C]/80 backdrop-blur-xs z-20">
          <div className="w-8 h-8 rounded-full border-2 border-[#FFBF24] border-t-transparent animate-spin mb-2" />
          <span className="text-xs text-[#A1A1AA] font-mono">Loading Google Maps Platform...</span>
        </div>
      )}

      {/* Auth Error Banner */}
      {authError && (
        <div className="absolute top-3 left-3 right-3 p-3 rounded-lg bg-[#18181B]/95 border border-[#EF4444]/40 text-xs text-[#F8FAFC] z-30 flex items-start gap-2.5 shadow-xl">
          <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-[#EF4444] block">Google Maps Platform Notice</span>
            <p className="text-[11px] text-[#A1A1AA] mt-0.5 leading-relaxed">{authError}</p>
          </div>
        </div>
      )}

      {/* Overlay Map Badge & Attribution */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
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
    </div>
  );
};
