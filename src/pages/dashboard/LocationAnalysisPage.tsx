import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { MapView, MapMarker } from '../../components/map/MapView';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { MapPin, Navigation, Eye, Layers, Compass, Info } from 'lucide-react';

export const LocationAnalysisPage: React.FC = () => {
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>([28.6139, 77.2090]); // Default: New Delhi
  const [radius, setRadius] = useState<number>(2500); // 2.5 km

  // Reusable Leaflet POI markers demonstration
  const demoMarkers: MapMarker[] = [
    {
      id: 1,
      latitude: 28.6189,
      longitude: 77.2150,
      title: 'Commercial Hub A (Competitor)',
      description: 'Established retail store • Price Tier: Mid-Range',
      category: 'Competitor Point',
      isCompetitor: true,
    },
    {
      id: 2,
      latitude: 28.6080,
      longitude: 77.2020,
      title: 'Transit Terminal / Metro Station',
      description: 'High daily footfall zone (>15,000 daily commuters)',
      category: 'Transit Point',
      isCompetitor: false,
    },
    {
      id: 3,
      latitude: 28.6210,
      longitude: 77.2010,
      title: 'Retail Outpost B (Competitor)',
      description: 'Chain franchise outlet • Saturation rating: High',
      category: 'Competitor Point',
      isCompetitor: true,
    },
  ];

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedCoords([lat, lng]);
  };

  const predefinedCities = [
    { value: '28.6139,77.2090', label: 'New Delhi (Connaught Place Center)' },
    { value: '19.0760,72.8777', label: 'Mumbai (BKC Financial District)' },
    { value: '12.9716,77.5946', label: 'Bangalore (Indiranagar / Koramangala)' },
    { value: '13.0827,80.2707', label: 'Chennai (Central Commercial Tier)' },
    { value: '22.5726,88.3639', label: 'Kolkata (Park Street / Salt Lake)' },
    { value: '37.7749,-122.4194', label: 'San Francisco (Market St Tech Corridor)' },
  ];

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [lat, lng] = e.target.value.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      setSelectedCoords([lat, lng]);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Location Intelligence & Spatial Analysis"
        description="Interactive GIS geospatial mapping using Leaflet and OpenStreetMap. Zero paid proprietary API dependencies."
        badge="Part 1 Map Foundation"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Control Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#FFBF24]" />
                <span>Location Selector</span>
              </CardTitle>
              <CardDescription>
                Choose target coordinates or click anywhere directly on the map.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Predefined Metro Test Locations"
                options={predefinedCities}
                onChange={handleCityChange}
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Latitude"
                  value={selectedCoords[0].toFixed(5)}
                  readOnly
                  className="font-mono text-xs"
                />
                <Input
                  label="Longitude"
                  value={selectedCoords[1].toFixed(5)}
                  readOnly
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[#F8FAFC] mb-1.5">
                  <span className="font-medium">Analysis Radius</span>
                  <span className="text-[#FFBF24] font-mono font-semibold">
                    {(radius / 1000).toFixed(1)} km
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-[#FFBF24] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#71717A] mt-1 font-mono">
                  <span>0.5 km</span>
                  <span>5.0 km</span>
                  <span>10.0 km</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#FFBF24]/10 border border-[#FFBF24]/30 text-[11px] text-[#FFBF24] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Info className="w-3.5 h-3.5" />
                  <span>Map Architecture Ready</span>
                </div>
                <p className="text-[#A1A1AA]">
                  Clicking the map relocates the primary target point and recalculates the radius zone. Full competitor spatial scraping connects in Part 4.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Marker Legend Card */}
          <Card>
            <CardHeader className="mb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-[#A1A1AA]">
                Spatial Map Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFBF24] border border-[#0B0B0C] shadow-sm" />
                <span className="text-[#F8FAFC]">Selected Target Location</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444] border border-[#0B0B0C] shadow-sm" />
                <span className="text-[#F8FAFC]">Competitor Establishments</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#22C55E] border border-[#0B0B0C] shadow-sm" />
                <span className="text-[#F8FAFC]">High-Footfall POI / Hubs</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map View Canvas Container */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-2 sm:p-3 overflow-hidden">
            <MapView
              center={selectedCoords}
              zoom={13}
              markers={demoMarkers}
              radiusMeters={radius}
              onLocationSelect={handleMapClick}
              height="540px"
            />
          </Card>

          <div className="p-4 rounded-xl bg-[#1A1A1D] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A1A1AA]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FFBF24]" />
              <span>
                Tile Providers: <strong className="text-[#F8FAFC]">CARTO Voyager & OpenStreetMap Standard</strong> (No API Token Required)
              </span>
            </div>
            <Badge variant="outline" size="sm">Leaflet 1.9 Engine</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
