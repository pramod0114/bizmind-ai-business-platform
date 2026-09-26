import React, { useState } from 'react';
import { Navigation, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GeoLocationResult } from '../../types';
import { locationApiService } from '../../services/locationService';

export interface CurrentLocationButtonProps {
  onLocationFound: (location: GeoLocationResult) => void;
  className?: string;
  variant?: 'button' | 'icon';
}

export const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({
  onLocationFound,
  className = '',
  variant = 'button',
}) => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isDenied, setIsDenied] = useState(false);

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    setStatusMessage(null);
    setIsDenied(false);

    // 1. Browser Geolocation API
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        const coords = await new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            (err) => reject(err),
            { timeout: 7000, enableHighAccuracy: true, maximumAge: 30000 }
          );
        });

        // Reverse geocode with Google
        const reverse = await locationApiService.reverseGeocode(coords.latitude, coords.longitude);
        const locationName = reverse?.name || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
        const result: GeoLocationResult = {
          place_id: reverse?.place_id || `gps_${Date.now()}`,
          name: locationName,
          display_name: reverse?.display_name || `Current GPS Location: ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
          latitude: coords.latitude,
          longitude: coords.longitude,
          type: 'current_location',
          address: reverse?.address,
        };

        setStatusMessage(locationName);
        onLocationFound(result);
        setLoading(false);
        setTimeout(() => setStatusMessage(null), 4000);
        return;
      } catch (err: any) {
        if (err?.code === 1 || err?.code === err?.PERMISSION_DENIED) {
          setIsDenied(true);
          setStatusMessage('Location permission was denied. Please search for a location manually.');
          setLoading(false);
          return;
        }
        // If not explicit permission denial, try IP fallback gracefully
      }
    }

    // 2. Network IP Geolocation Fallback
    try {
      const ipResult = await locationApiService.ipLocate();
      const geoResult: GeoLocationResult = {
        place_id: `ip_${Date.now()}`,
        name: ipResult.name,
        display_name: ipResult.display_name,
        latitude: ipResult.latitude,
        longitude: ipResult.longitude,
        type: 'current_location',
        address: {
          city: ipResult.city,
          state: ipResult.state,
          country: ipResult.country,
        },
      };

      setStatusMessage(ipResult.name);
      onLocationFound(geoResult);
    } catch {
      setStatusMessage('Location permission was denied. Please search for a location manually.');
      setIsDenied(true);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (!isDenied) setStatusMessage(null);
      }, 4000);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={loading}
          title="Use My Current Location"
          className={`p-2.5 rounded-lg bg-[#1A1A1D] hover:bg-[#27272A] border border-[#27272A] text-[#A1A1AA] hover:text-[#FFBF24] transition-all disabled:opacity-50 cursor-pointer ${className}`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#FFBF24]" />
          ) : statusMessage && !isDenied ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </button>
      ) : (
        <button
          id="current-location-btn"
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide bg-gradient-to-r from-[#FFBF24] to-[#F59E0B] text-[#0B0B0C] hover:brightness-105 active:scale-95 shadow-md shadow-[#FFBF24]/20 border border-[#FFBF24] transition-all disabled:opacity-50 cursor-pointer ${className}`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0B0B0C]" />
              <span>Locating GPS...</span>
            </>
          ) : statusMessage && !isDenied ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#0B0B0C]" />
              <span className="truncate max-w-[160px] font-extrabold">{statusMessage}</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-[#0B0B0C] fill-current" />
              <span>Use My Current Location</span>
            </>
          )}
        </button>
      )}

      {isDenied && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Location permission was denied. Please search for a location manually.</span>
        </div>
      )}
    </div>
  );
};
