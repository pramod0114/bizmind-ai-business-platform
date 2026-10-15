import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Compass,
  Navigation,
  Radar,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Eye,
  CheckCircle,
  Target,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '../common/Badge';

export interface HotspotPreset {
  id: string;
  name: string;
  city: string;
  category: string;
  coords: [number, number];
  description: string;
}

export interface DemoCompetitor {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
  distanceMeters: number;
  threatLevel: 'Low' | 'Medium' | 'High';
  cuisineOrType: string;
}

const PRESET_HOTSPOTS: HotspotPreset[] = [
  {
    id: 'indiranagar',
    name: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    category: 'Specialty Cafe & Eatery',
    coords: [12.9784, 77.6408],
    description: 'Premier culinary and retail corridor with high tech-worker footfall and high disposable spend.',
  },
  {
    id: 'connaught',
    name: 'Connaught Place Inner Circle',
    city: 'New Delhi',
    category: 'Urban Bistro & Co-working',
    coords: [28.6315, 77.2167],
    description: 'Iconic heritage commercial node with dense pedestrian footfall and transit connectivity.',
  },
  {
    id: 'bandra',
    name: 'Pali Hill & Linking Road',
    city: 'Mumbai',
    category: 'Boutique Fitness & Lifestyle',
    coords: [19.0596, 72.8295],
    description: 'High-income residential and cultural nexus with massive premium consumer demand.',
  },
  {
    id: 'koramangala',
    name: 'Koramangala 4th Block',
    city: 'Bengaluru',
    category: 'Fast-Casual Specialty Dining',
    coords: [12.9352, 77.6245],
    description: 'Dense startup ecosystem hub with robust evening and weekend dining patronage.',
  },
  {
    id: 'rajaramnagar',
    name: 'Rajaramnagar Commercial Area',
    city: 'Islampur',
    category: 'Artisanal Cafe & Bakery',
    coords: [17.0505, 74.2635],
    description: 'Rapidly expanding education and commercial corridor with prime first-mover advantage.',
  },
];

// Seeded competitors per preset
const SEEDED_COMPETITORS: Record<string, DemoCompetitor[]> = {
  indiranagar: [
    { id: 'c1', name: 'Third Wave Coffee', category: 'Specialty Coffee', lat: 12.9792, lng: 77.6418, rating: 4.6, reviewsCount: 1420, distanceMeters: 140, threatLevel: 'High', cuisineOrType: 'Artisanal Pour-over' },
    { id: 'c2', name: 'Blue Tokai Coffee Roasters', category: 'Specialty Coffee', lat: 12.9765, lng: 77.6395, rating: 4.5, reviewsCount: 980, distanceMeters: 280, threatLevel: 'High', cuisineOrType: 'Single Origin' },
    { id: 'c3', name: 'Araku Coffee Flagship', category: 'Specialty Coffee', lat: 12.9812, lng: 77.6432, rating: 4.7, reviewsCount: 2100, distanceMeters: 410, threatLevel: 'Medium', cuisineOrType: 'Organic Specialty' },
    { id: 'c4', name: 'Smoke House Deli', category: 'Bistro & Dining', lat: 12.9772, lng: 77.6439, rating: 4.4, reviewsCount: 3200, distanceMeters: 380, threatLevel: 'Medium', cuisineOrType: 'European Casual' },
    { id: 'c5', name: 'Glen\'s Bakehouse', category: 'Bakery & Desserts', lat: 12.9805, lng: 77.6382, rating: 4.4, reviewsCount: 5600, distanceMeters: 390, threatLevel: 'Medium', cuisineOrType: 'Sourdough & Patisserie' },
    { id: 'c6', name: 'Starbucks Reserve', category: 'Commercial Coffee', lat: 12.9825, lng: 77.6401, rating: 4.3, reviewsCount: 4100, distanceMeters: 460, threatLevel: 'Low', cuisineOrType: 'Corporate Chain' },
    { id: 'c7', name: 'Sly Granny Gastro Club', category: 'Dining & Cocktails', lat: 12.9751, lng: 77.6445, rating: 4.5, reviewsCount: 2800, distanceMeters: 520, threatLevel: 'Low', cuisineOrType: 'Gourmet Bistro' },
    { id: 'c8', name: 'Lavonne Cafe & Academy', category: 'Patisserie & Cafe', lat: 12.9839, lng: 77.6421, rating: 4.8, reviewsCount: 3400, distanceMeters: 640, threatLevel: 'Medium', cuisineOrType: 'French Pastry' },
    { id: 'c9', name: 'Toit Brewpub', category: 'Pub & Eatery', lat: 12.9798, lng: 77.6455, rating: 4.7, reviewsCount: 18400, distanceMeters: 550, threatLevel: 'Low', cuisineOrType: 'Anchor Traffic Magnet' },
  ],
  connaught: [
    { id: 'c10', name: 'The Big Chill Cafe', category: 'Italian Cafe', lat: 28.6322, lng: 77.2182, rating: 4.6, reviewsCount: 7800, distanceMeters: 170, threatLevel: 'High', cuisineOrType: 'Italian & Desserts' },
    { id: 'c11', name: 'United Coffee House', category: 'Classic Dining', lat: 28.6308, lng: 77.2154, rating: 4.4, reviewsCount: 6500, distanceMeters: 190, threatLevel: 'Medium', cuisineOrType: 'Historic European' },
    { id: 'c12', name: 'Cha Bar & Oxford', category: 'Tea & Books', lat: 28.6335, lng: 77.2178, rating: 4.3, reviewsCount: 3400, distanceMeters: 250, threatLevel: 'Low', cuisineOrType: 'Tea Lounge' },
    { id: 'c13', name: 'Wenger\'s Deli', category: 'Bakery', lat: 28.6311, lng: 77.2195, rating: 4.7, reviewsCount: 12500, distanceMeters: 280, threatLevel: 'Medium', cuisineOrType: 'Pastry & Sandwiches' },
    { id: 'c14', name: 'Social CP', category: 'Co-working & Bar', lat: 28.6295, lng: 77.2162, rating: 4.3, reviewsCount: 9200, distanceMeters: 240, threatLevel: 'High', cuisineOrType: 'Workspace Bistro' },
    { id: 'c15', name: 'Cafe Coffee Day The Square', category: 'Coffee', lat: 28.6341, lng: 77.2145, rating: 4.0, reviewsCount: 1800, distanceMeters: 360, threatLevel: 'Low', cuisineOrType: 'Chain Cafe' },
  ],
  bandra: [
    { id: 'c16', name: 'Subko Specialty Coffee', category: 'Specialty Coffee', lat: 19.0608, lng: 72.8310, rating: 4.7, reviewsCount: 3100, distanceMeters: 190, threatLevel: 'High', cuisineOrType: 'Roastery & Bakehouse' },
    { id: 'c17', name: 'Sequel Bistro & Juice Bar', category: 'Organic Dining', lat: 19.0582, lng: 72.8278, rating: 4.5, reviewsCount: 1850, distanceMeters: 220, threatLevel: 'High', cuisineOrType: 'Health & Vegan' },
    { id: 'c18', name: 'Candies Pali Hill', category: 'Iconic Cafe', lat: 19.0620, lng: 72.8282, rating: 4.4, reviewsCount: 11400, distanceMeters: 310, threatLevel: 'Medium', cuisineOrType: 'Heritage Multi-level' },
    { id: 'c19', name: 'Yoga 101 Bandra', category: 'Fitness & Yoga', lat: 19.0571, lng: 72.8315, rating: 4.8, reviewsCount: 650, distanceMeters: 340, threatLevel: 'Medium', cuisineOrType: 'Ashtanga & Vinyasa' },
    { id: 'c20', name: 'Cult.Fit Pali Naka', category: 'Fitness Studio', lat: 19.0628, lng: 72.8322, rating: 4.6, reviewsCount: 1900, distanceMeters: 420, threatLevel: 'High', cuisineOrType: 'Cross-functional HIIT' },
  ],
  koramangala: [
    { id: 'c21', name: 'Third Wave Coffee 4th Block', category: 'Specialty Coffee', lat: 12.9360, lng: 77.6258, rating: 4.6, reviewsCount: 2200, distanceMeters: 160, threatLevel: 'High', cuisineOrType: 'Artisanal Roaster' },
    { id: 'c22', name: 'Digger\'s Bistro & Bar', category: 'Dining', lat: 12.9341, lng: 77.6231, rating: 4.3, reviewsCount: 1800, distanceMeters: 180, threatLevel: 'Medium', cuisineOrType: 'Continental' },
    { id: 'c23', name: 'Truffles Ice & Spice', category: 'Burgers & Cafe', lat: 12.9368, lng: 77.6239, rating: 4.6, reviewsCount: 24000, distanceMeters: 210, threatLevel: 'Low', cuisineOrType: 'High-Volume Anchor' },
    { id: 'c24', name: 'Keventers Milkshakes', category: 'Dessert', lat: 12.9338, lng: 77.6261, rating: 4.2, reviewsCount: 940, distanceMeters: 230, threatLevel: 'Low', cuisineOrType: 'Beverage Kiosk' },
    { id: 'c25', name: 'The Hole in the Wall Cafe', category: 'All-Day Breakfast', lat: 12.9325, lng: 77.6250, rating: 4.5, reviewsCount: 14000, distanceMeters: 310, threatLevel: 'Medium', cuisineOrType: 'Breakfast & Waffles' },
  ],
  rajaramnagar: [
    { id: 'c26', name: 'Green Leaf Cafe & Bakery', category: 'Cafe & Bakes', lat: 17.0518, lng: 74.2642, rating: 4.4, reviewsCount: 380, distanceMeters: 170, threatLevel: 'Medium', cuisineOrType: 'Local Cafe' },
    { id: 'c27', name: 'Sai Refreshments & Snacks', category: 'Fast Food', lat: 17.0492, lng: 74.2621, rating: 4.2, reviewsCount: 520, distanceMeters: 210, threatLevel: 'Low', cuisineOrType: 'Quick Service' },
    { id: 'c28', name: 'Shivaji Bakery & Sweets', category: 'Bakery', lat: 17.0525, lng: 74.2655, rating: 4.5, reviewsCount: 710, distanceMeters: 310, threatLevel: 'Medium', cuisineOrType: 'Bakery Goods' },
    { id: 'c29', name: 'Chai Point Corner', category: 'Tea & Snacks', lat: 17.0485, lng: 74.2648, rating: 4.3, reviewsCount: 290, distanceMeters: 260, threatLevel: 'Low', cuisineOrType: 'Tea Stall' },
  ],
};

export const LiveLocationIntelligenceDemo: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('indiranagar');
  const [radiusMeters, setRadiusMeters] = useState<number>(1000);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [customCenter, setCustomCenter] = useState<[number, number] | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<DemoCompetitor | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanPulse, setScanPulse] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);

  const activePreset = PRESET_HOTSPOTS.find((p) => p.id === selectedPresetId) || PRESET_HOTSPOTS[0];
  const centerCoords = customCenter || activePreset.coords;

  // Filter competitors within active radius and category
  const activeCompetitors = useMemo(() => {
    const list = SEEDED_COMPETITORS[selectedPresetId] || [];
    return list.filter((comp) => {
      const withinRadius = comp.distanceMeters <= radiusMeters;
      const matchesCategory =
        categoryFilter === 'all' ||
        comp.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        comp.cuisineOrType.toLowerCase().includes(categoryFilter.toLowerCase());
      return withinRadius && matchesCategory;
    });
  }, [selectedPresetId, radiusMeters, categoryFilter]);

  // Derived location metrics
  const metrics = useMemo(() => {
    const count = activeCompetitors.length;
    const areaSqKm = Math.PI * Math.pow(radiusMeters / 1000, 2);
    const density = count > 0 ? (count / areaSqKm).toFixed(1) : '0.0';
    const nearest =
      activeCompetitors.length > 0
        ? Math.min(...activeCompetitors.map((c) => c.distanceMeters))
        : null;
    const average =
      activeCompetitors.length > 0
        ? Math.round(
            activeCompetitors.reduce((acc, c) => acc + c.distanceMeters, 0) /
              activeCompetitors.length
          )
        : null;

    // Opportunity score algorithm (0 - 100)
    // Higher when moderate competition (healthy demand) without extreme saturation
    let oppScore = 85;
    if (count === 0) oppScore = 92; // Pure white space
    else if (count <= 3) oppScore = 88;
    else if (count <= 6) oppScore = 78;
    else if (count <= 10) oppScore = 68;
    else oppScore = 54;

    const saturationLevel: 'Low' | 'Moderate' | 'High' =
      count <= 3 ? 'Low' : count <= 7 ? 'Moderate' : 'High';

    return {
      count,
      density,
      nearest: nearest ? `${nearest}m` : 'None in radius',
      average: average ? `${average}m` : 'None in radius',
      oppScore,
      saturationLevel,
    };
  }, [activeCompetitors, radiusMeters]);

  // Trigger radar scan animation
  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanPulse(true);
    setTimeout(() => {
      setIsScanning(false);
      setTimeout(() => setScanPulse(false), 1200);
    }, 800);
  };

  // Initialize or update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: centerCoords,
        zoom: radiusMeters <= 500 ? 16 : radiusMeters <= 1000 ? 15 : 14,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        className: 'osm-dark-tiles',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      // On-map click to place target location
      map.on('click', (e: L.LeafletMouseEvent) => {
        setCustomCenter([e.latlng.lat, e.latlng.lng]);
      });

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      const map = mapInstanceRef.current;
      map.setView(centerCoords, radiusMeters <= 500 ? 16 : radiusMeters <= 1000 ? 15 : 14);
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Draw central target pin
    if (centerMarkerRef.current) {
      centerMarkerRef.current.remove();
    }

    const targetIcon = L.divIcon({
      className: 'custom-target-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-[#FFBF24]/30 animate-ping"></div>
          <div class="w-8 h-8 rounded-full bg-[#FFBF24] border-2 border-white shadow-xl flex items-center justify-center text-[#0B0B0C] font-black text-xs z-10">
            ★
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    centerMarkerRef.current = L.marker(centerCoords, { icon: targetIcon }).addTo(map);
    centerMarkerRef.current.bindTooltip(
      `<strong>Proposed Business Site</strong><br/>${activePreset.name}`,
      { direction: 'top', offset: [0, -18] }
    );

    // Draw radius boundary circle
    if (circleLayerRef.current) {
      circleLayerRef.current.remove();
    }

    circleLayerRef.current = L.circle(centerCoords, {
      radius: radiusMeters,
      color: '#FFBF24',
      weight: 2,
      opacity: 0.85,
      fillColor: '#FFBF24',
      fillOpacity: 0.12,
      dashArray: '6, 6',
    }).addTo(map);

    // Draw competitor markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();

      activeCompetitors.forEach((comp) => {
        const markerColor =
          comp.threatLevel === 'High'
            ? '#F43F5E'
            : comp.threatLevel === 'Medium'
            ? '#F59E0B'
            : '#38BDF8';

        const compIcon = L.divIcon({
          className: 'custom-competitor-marker',
          html: `
            <div class="flex items-center justify-center cursor-pointer transform hover:scale-125 transition-transform">
              <div style="background-color: ${markerColor};" class="w-6 h-6 rounded-full border border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
                ●
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([comp.lat, comp.lng], { icon: compIcon });
        marker.bindTooltip(
          `<strong>${comp.name}</strong><br/>${comp.category} • ${comp.distanceMeters}m away`,
          { direction: 'top', offset: [0, -12] }
        );

        marker.on('click', () => {
          setSelectedCompetitor(comp);
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // Adjust size after mount
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      // Keep map alive or clean up on unmount
    };
  }, [centerCoords, radiusMeters, activeCompetitors, activePreset]);

  // Clean destruction
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-3">
      {/* Top Interactive Hotspot Selector & Quick Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-[#121722] p-2.5 rounded-xl border border-[#1E2433] items-center">
        {/* Preset Selector */}
        <div className="sm:col-span-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#FFBF24] shrink-0" />
          <select
            value={selectedPresetId}
            onChange={(e) => {
              setSelectedPresetId(e.target.value);
              setCustomCenter(null);
              setSelectedCompetitor(null);
            }}
            className="w-full bg-[#0A0D14] border border-[#27272A] text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-[#FFBF24] focus:outline-none"
          >
            {PRESET_HOTSPOTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.city})
              </option>
            ))}
          </select>
        </div>

        {/* Radius Selector */}
        <div className="sm:col-span-4 flex items-center justify-center gap-1">
          <span className="text-[10px] text-[#94A3B8] font-bold uppercase mr-1">Radius:</span>
          {[500, 1000, 2000, 3000].map((r) => (
            <button
              key={r}
              onClick={() => setRadiusMeters(r)}
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                radiusMeters === r
                  ? 'bg-[#FFBF24] text-[#0B0B0C] shadow-sm font-bold'
                  : 'bg-[#1E2433] text-[#94A3B8] hover:text-white'
              }`}
            >
              {r >= 1000 ? `${r / 1000}km` : `${r}m`}
            </button>
          ))}
        </div>

        {/* Scan & Trigger Button */}
        <div className="sm:col-span-4 flex items-center justify-end gap-2">
          <button
            onClick={handleTriggerScan}
            disabled={isScanning}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#FFBF24]/15 text-[#FFBF24] border border-[#FFBF24]/40 hover:bg-[#FFBF24]/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Radar className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Radius...' : 'Run Spatial Scan'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Map (Left) + Real-Time Scorecard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[360px]">
        {/* Interactive Map View */}
        <div className="lg:col-span-8 rounded-xl overflow-hidden border border-[#1E2433] relative bg-[#0B0B0C] flex flex-col">
          <div
            ref={mapContainerRef}
            className="w-full flex-1 min-h-[300px] z-0"
            style={{ minHeight: '320px' }}
          />

          {/* Radar Sweep Effect Overlay */}
          {scanPulse && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center bg-[#FFBF24]/5">
              <div className="w-64 h-64 rounded-full border-2 border-[#FFBF24] animate-ping opacity-60"></div>
            </div>
          )}

          {/* Map Overlay Badge */}
          <div className="absolute bottom-2 left-2 z-10 bg-[#0A0D14]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#1E2433] text-[10px] text-[#94A3B8] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>Live Leaflet / OSM Engine • Click map to set custom site</span>
          </div>

          {/* Legend */}
          <div className="absolute top-2 left-2 z-10 bg-[#0A0D14]/90 backdrop-blur-md px-2 py-1 rounded-md border border-[#1E2433] text-[10px] text-white flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FFBF24]"></span> Proposed Site
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> High Threat
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Med Threat
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span> Low Threat
            </span>
          </div>
        </div>

        {/* Real-Time Live Spatial Scorecard & Competitor List */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-2.5">
          {/* Opportunity Score Gauge */}
          <div className="p-3.5 rounded-xl bg-[#121722] border border-[#1E2433] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#FFBF24] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Live Opportunity Index
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {metrics.saturationLevel} Saturation
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{metrics.oppScore}</span>
              <span className="text-xs text-[#94A3B8]">/ 100 Viability Rating</span>
            </div>

            <div className="w-full bg-[#1E2433] h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-500 via-[#FFBF24] to-emerald-400"
                style={{ width: `${metrics.oppScore}%` }}
              />
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-tight">
              {metrics.oppScore >= 80
                ? 'High market opportunity: Favorable density with unmet consumer demand in corridor.'
                : metrics.oppScore >= 65
                ? 'Moderate competition: Viable site requiring distinct brand and product differentiation.'
                : 'Dense market cluster: Significant rival concentration; focus on specialized niche offerings.'}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] text-[#94A3B8]">Rivals in Radius</div>
              <div className="text-lg font-bold text-white mt-0.5">{metrics.count} Businesses</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] text-[#94A3B8]">Cluster Density</div>
              <div className="text-lg font-bold text-sky-400 mt-0.5">{metrics.density} / km²</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] text-[#94A3B8]">Nearest Rival</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">{metrics.nearest}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#121722] border border-[#1E2433]">
              <div className="text-[10px] text-[#94A3B8]">Avg Proximity</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">{metrics.average}</div>
            </div>
          </div>

          {/* Selected Competitor or Top Cluster List */}
          <div className="p-3 rounded-xl bg-[#121722] border border-[#1E2433] flex-1 flex flex-col justify-between">
            <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>{selectedCompetitor ? 'Inspected Competitor' : 'Nearby Competitors'}</span>
              <span className="text-[#64748B] text-[9px]">Click pins to inspect</span>
            </div>

            {selectedCompetitor ? (
              <div className="p-2.5 rounded-lg bg-[#0A0D14] border border-[#27272A] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{selectedCompetitor.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                    {selectedCompetitor.threatLevel} Threat
                  </span>
                </div>
                <div className="text-[11px] text-[#94A3B8]">
                  {selectedCompetitor.category} • {selectedCompetitor.cuisineOrType}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1 border-t border-[#1E2433]">
                  <span>★ {selectedCompetitor.rating} ({selectedCompetitor.reviewsCount} reviews)</span>
                  <span className="text-[#FFBF24] font-semibold">{selectedCompetitor.distanceMeters}m from site</span>
                </div>
                <button
                  onClick={() => setSelectedCompetitor(null)}
                  className="text-[10px] text-[#38BDF8] hover:underline cursor-pointer block mt-1"
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto max-h-[110px] pr-1">
                {activeCompetitors.slice(0, 3).map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedCompetitor(comp)}
                    className="p-1.5 rounded-lg bg-[#0A0D14] border border-[#1E2433] hover:border-[#FFBF24]/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="truncate pr-2">
                      <div className="text-white font-medium truncate text-[11px]">{comp.name}</div>
                      <div className="text-[9px] text-[#94A3B8]">{comp.category}</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#FFBF24] shrink-0">
                      {comp.distanceMeters}m
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
