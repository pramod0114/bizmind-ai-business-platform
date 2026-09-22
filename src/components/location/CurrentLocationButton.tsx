import React, { useState } from 'react';
import { Navigation, Loader2, CheckCircle2 } from 'lucide-react';
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
  const [detectedText, setDetectedText] = useState<string | null>(null);

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    setDetectedText(null);

    // 1. Try Browser Geolocation API
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        const coords = await new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            (err) => reject(err),
            { timeout: 4000, enableHighAccuracy: true, maximumAge: 60000 }
          );
        });

        // Reverse geocode to human-readable address
        const reverse = await locationApiService.reverseGeocode(coords.latitude, coords.longitude);
        if (reverse) {
          setDetectedText(reverse.name || 'Current Location');
          onLocationFound(reverse);
          setLoading(false);
          setTimeout(() => setDetectedText(null), 3000);
          return;
        }
      } catch {
        // Geolocation blocked, timed out, or denied (very common in iframe)
      }
    }

    // 2. Reliable IP Geolocation Fallback
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

      setDetectedText(ipResult.name);
      onLocationFound(geoResult);
    } catch (err) {
      console.error('Failed to locate current position:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setDetectedText(null), 3000);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={loading}
        title="Detect current location"
        className={`p-2.5 rounded-lg bg-[#1A1A1D] hover:bg-[#27272A] border border-[#27272A] text-[#A1A1AA] hover:text-[#FFBF24] transition-all disabled:opacity-50 cursor-pointer ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#FFBF24]" />
        ) : detectedText ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        ) : (
          <Navigation className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      id="current-location-btn"
      type="button"
      onClick={handleGetCurrentLocation}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide bg-[#1A1A1D] hover:bg-[#27272A] text-[#F8FAFC] hover:text-[#FFBF24] border border-[#27272A] hover:border-[#FFBF24]/40 transition-all shadow-sm disabled:opacity-50 cursor-pointer ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFBF24]" />
          <span>Locating...</span>
        </>
      ) : detectedText ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate max-w-[140px]">{detectedText}</span>
        </>
      ) : (
        <>
          <Navigation className="w-3.5 h-3.5 text-[#FFBF24]" />
          <span>Use Current Location</span>
        </>
      )}
    </button>
  );
};
