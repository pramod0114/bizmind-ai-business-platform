import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Bookmark, MapPin, Trash2, ExternalLink, Navigation, Store, Plus, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { locationApiService } from '../../services/locationService';
import { SavedLocationAnalysis, SavedBusiness } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

export const SavedPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'locations' | 'businesses'>('locations');
  const [locations, setLocations] = useState<SavedLocationAnalysis[]>([]);
  const [businesses, setBusinesses] = useState<SavedBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [locs, bizs] = await Promise.all([
        locationApiService.listLocationAnalyses(),
        locationApiService.listSavedBusinesses(),
      ]);
      setLocations(locs);
      setBusinesses(bizs);
    } catch (err) {
      console.error('Failed to load saved items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteLocation = async (id: number) => {
    try {
      await locationApiService.deleteLocationAnalysis(id);
      setLocations((prev) => prev.filter((l) => l.id !== id));
      setActionMessage('Location analysis removed from saved.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Failed to delete location analysis:', err);
    }
  };

  const handleDeleteBusiness = async (id: number) => {
    try {
      await locationApiService.deleteSavedBusiness(id);
      setBusinesses((prev) => prev.filter((b) => b.id !== id));
      setActionMessage('Business bookmark removed.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Failed to delete saved business:', err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Opportunities & Bookmarks"
        description="Repository of bookmarked business ventures, candidate locations, and customized analysis dossiers."
        badge={`${locations.length} Locations • ${businesses.length} POIs`}
        actions={
          <Link to="/location-analysis">
            <Button size="sm" leftIcon={<MapPin className="w-3.5 h-3.5" />}>
              Explore Spatial Map
            </Button>
          </Link>
        }
      />

      {actionMessage && (
        <div className="p-3 rounded-lg bg-[#FFBF24]/10 border border-[#FFBF24]/30 text-xs text-[#FFBF24] flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-[#A1A1AA] hover:text-[#F8FAFC]">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#27272A] pb-3">
        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'locations'
              ? 'bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/30'
              : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Locations</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#27272A] text-[#F8FAFC]">
            {locations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('businesses')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'businesses'
              ? 'bg-[#FFBF24]/10 text-[#FFBF24] border border-[#FFBF24]/30'
              : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1A1A1D]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarked Businesses</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#27272A] text-[#F8FAFC]">
            {businesses.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#A1A1AA]">Loading saved opportunities...</div>
      ) : activeTab === 'locations' ? (
        locations.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <EmptyState
                icon={<MapPin className="w-6 h-6 text-[#FFBF24]" />}
                title="No Saved Locations"
                description="Scan any coordinate or address on the interactive map and click 'Save Analysis' to archive candidate locations here."
                actionLabel="Open Location Map"
                onAction={() => navigate('/location-analysis')}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((loc) => (
              <Card key={loc.id} className="p-4 border-[#27272A] flex flex-col justify-between hover:border-[#FFBF24]/40 transition-colors">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#F8FAFC] line-clamp-1">{loc.location_name}</h3>
                      <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1">{loc.address}</p>
                    </div>
                    <span className="shrink-0 px-2 py-1 rounded bg-[#FFBF24]/10 text-[#FFBF24] font-bold text-xs">
                      {loc.opportunity_score}/100
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#27272A] grid grid-cols-2 gap-2 text-[11px] text-[#A1A1AA]">
                    <div>
                      <span className="text-[#71717A] block">Radius</span>
                      <span>{(loc.radius / 1000).toFixed(1)} km</span>
                    </div>
                    <div>
                      <span className="text-[#71717A] block">POIs Found</span>
                      <span>{loc.business_count} Establishments</span>
                    </div>
                    <div>
                      <span className="text-[#71717A] block">Competition</span>
                      <span className="capitalize">{loc.competition_level.toLowerCase()}</span>
                    </div>
                    <div>
                      <span className="text-[#71717A] block">Saved On</span>
                      <span>{formatDate(loc.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between">
                  <Link
                    to={`/location-analysis?lat=${loc.latitude}&lng=${loc.longitude}&radius=${loc.radius}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#FFBF24] hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>View on Map</span>
                  </Link>
                  <button
                    onClick={() => handleDeleteLocation(loc.id)}
                    className="p-1.5 rounded-lg text-[#71717A] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        businesses.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <EmptyState
                icon={<Bookmark className="w-6 h-6 text-[#FFBF24]" />}
                title="No Bookmarked Businesses"
                description="When viewing nearby businesses on the location intelligence map, click 'Bookmark Business' to track competitors and suppliers here."
                actionLabel="Explore Businesses"
                onAction={() => navigate('/location-analysis')}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((biz) => (
              <Card key={biz.id} className="p-4 border-[#27272A] flex flex-col justify-between hover:border-[#FFBF24]/40 transition-colors">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#F8FAFC] line-clamp-1">{biz.business_name}</h3>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] bg-[#18181B] border border-[#27272A] text-[#FFBF24]">
                        {biz.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-2">{biz.address || 'Address recorded on map'}</p>

                  <div className="mt-3 space-y-1 text-[11px] text-[#71717A]">
                    {biz.phone && <p>📞 {biz.phone}</p>}
                    {biz.opening_hours && <p>⏰ {biz.opening_hours}</p>}
                    {biz.distance_meters !== null && biz.distance_meters !== undefined && (
                      <p>📍 {biz.distance_meters > 1000 ? `${(biz.distance_meters / 1000).toFixed(1)} km` : `${biz.distance_meters} m`} away</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between">
                  <Link
                    to={`/location-analysis?lat=${biz.latitude}&lng=${biz.longitude}&radius=1500`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#FFBF24] hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>View Location</span>
                  </Link>
                  <button
                    onClick={() => handleDeleteBusiness(biz.id)}
                    className="p-1.5 rounded-lg text-[#71717A] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};
