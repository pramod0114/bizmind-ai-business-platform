/**
 * BizMind – Location Comparison Section
 * Compares up to 3 target locations side-by-side using identical business idea and radius.
 */
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input } from '../common/Input';
import {
  GitCompare,
  MapPin,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  Building,
  CheckCircle2,
  Crosshair,
  TrendingUp,
} from 'lucide-react';
import {
  locationPredictionClient,
  LocationComparisonResponse,
  LocationPredictionFinancialInputs,
} from '../../services/locationPredictionService';
import { useNavigate } from 'react-router-dom';

interface LocationComparisonSectionProps {
  businessIdea: string;
  radiusMeters: number;
  financialInputs?: LocationPredictionFinancialInputs;
  initialLocationA?: { name: string; latitude: number; longitude: number };
}

export const LocationComparisonSection: React.FC<LocationComparisonSectionProps> = ({
  businessIdea,
  radiusMeters,
  financialInputs,
  initialLocationA,
}) => {
  const navigate = useNavigate();

  // Location inputs (up to 3)
  const [locA, setLocA] = useState({
    name: initialLocationA?.name || 'Vishrambag, Sangli',
    latitude: initialLocationA?.latitude || 16.8524,
    longitude: initialLocationA?.longitude || 74.5815,
  });

  const [locB, setLocB] = useState({
    name: 'Madhavnagar, Sangli',
    latitude: 16.8856,
    longitude: 74.6082,
  });

  const [locC, setLocC] = useState({
    name: 'Miraj, Maharashtra',
    latitude: 16.8271,
    longitude: 74.6469,
  });

  const [enableLocC, setEnableLocC] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<LocationComparisonResponse | null>(null);

  const handleCompare = async () => {
    if (!businessIdea) {
      setError('Please specify a business idea first.');
      return;
    }

    try {
      setComparing(true);
      setError(null);

      const locationsToCompare = [
        { label: 'Location A', name: locA.name, latitude: locA.latitude, longitude: locA.longitude },
        { label: 'Location B', name: locB.name, latitude: locB.latitude, longitude: locB.longitude },
      ];

      if (enableLocC && locC.name) {
        locationsToCompare.push({
          label: 'Location C',
          name: locC.name,
          latitude: locC.latitude,
          longitude: locC.longitude,
        });
      }

      const res = await locationPredictionClient.compareLocations({
        businessIdea,
        radiusMeters,
        financialInputs,
        locations: locationsToCompare,
      });

      setComparisonResult(res);
    } catch (err: any) {
      console.error('Comparison error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to compare locations.');
    } finally {
      setComparing(false);
    }
  };

  const handleContinueToPlanner = (loc: any) => {
    // Navigate to Business Planner with prefilled parameters
    navigate(
      `/business-planner?idea=${encodeURIComponent(businessIdea)}&location=${encodeURIComponent(
        loc.locationName
      )}&lat=${loc.coordinates.latitude}&lng=${loc.coordinates.longitude}`
    );
  };

  return (
    <Card className="border-[#27272A] bg-[#111113]">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-[#FFBF24]" />
              <span>Multi-Location Opportunity Comparison</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Compare up to 3 candidate sites for &ldquo;{businessIdea || 'your business idea'}&rdquo; using an identical{' '}
              {(radiusMeters / 1000).toFixed(1)} km radius.
            </CardDescription>
          </div>
          <Badge variant="warning">Controlled Radius Benchmark</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Candidate Sites Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-[#0B0B0C] border border-[#27272A]">
          {/* Location A */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FFBF24] uppercase font-mono">Location A</span>
              <span className="text-[10px] text-[#71717A] font-mono">Primary Site</span>
            </div>
            <Input
              value={locA.name}
              onChange={(e) => setLocA({ ...locA, name: e.target.value })}
              leftIcon={<MapPin className="w-3.5 h-3.5 text-[#FFBF24]" />}
              placeholder="e.g. Vishrambag, Sangli"
              className="text-xs"
            />
            <div className="flex items-center gap-2 text-[10px] text-[#71717A] font-mono">
              <span>Lat: {locA.latitude.toFixed(4)}</span>
              <span>•</span>
              <span>Lng: {locA.longitude.toFixed(4)}</span>
            </div>
          </div>

          {/* Location B */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#38BDF8] uppercase font-mono">Location B</span>
              <span className="text-[10px] text-[#71717A] font-mono">Candidate 2</span>
            </div>
            <Input
              value={locB.name}
              onChange={(e) => setLocB({ ...locB, name: e.target.value })}
              leftIcon={<MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />}
              placeholder="e.g. Madhavnagar, Sangli"
              className="text-xs"
            />
            <div className="flex items-center gap-2 text-[10px] text-[#71717A] font-mono">
              <span>Lat: {locB.latitude.toFixed(4)}</span>
              <span>•</span>
              <span>Lng: {locB.longitude.toFixed(4)}</span>
            </div>
          </div>

          {/* Location C */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  id="enableLocC"
                  checked={enableLocC}
                  onChange={(e) => setEnableLocC(e.target.checked)}
                  className="rounded border-[#27272A] text-[#FFBF24] focus:ring-[#FFBF24] w-3 h-3 cursor-pointer"
                />
                <label htmlFor="enableLocC" className="text-xs font-bold text-purple-400 uppercase font-mono cursor-pointer">
                  Location C
                </label>
              </div>
              <span className="text-[10px] text-[#71717A] font-mono">Optional Candidate</span>
            </div>
            <Input
              value={locC.name}
              onChange={(e) => setLocC({ ...locC, name: e.target.value })}
              disabled={!enableLocC}
              leftIcon={<MapPin className="w-3.5 h-3.5 text-purple-400" />}
              placeholder="e.g. Miraj, Maharashtra"
              className="text-xs"
            />
            <div className="flex items-center gap-2 text-[10px] text-[#71717A] font-mono">
              <span>Lat: {locC.latitude.toFixed(4)}</span>
              <span>•</span>
              <span>Lng: {locC.longitude.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleCompare}
            disabled={comparing}
            leftIcon={comparing ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />}
          >
            {comparing ? 'Evaluating Sites via Google Places...' : 'Run Side-by-Side Comparison'}
          </Button>
        </div>

        {/* Comparison Results Table */}
        {comparisonResult && (
          <div className="space-y-4 pt-4 border-t border-[#27272A]">
            {/* Comparative Summary Pill Bar */}
            <div className="p-3 rounded-xl bg-[#0B0B0C] border border-[#27272A] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#71717A] block font-mono">LOWEST COMPETITOR DENSITY</span>
                <span className="font-bold text-emerald-400">{comparisonResult.comparativeSummary.lowestCompetitionLocation}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#71717A] block font-mono">HIGHEST FOOTFALL SYNERGY</span>
                <span className="font-bold text-[#38BDF8]">
                  {comparisonResult.comparativeSummary.highestComplementaryFootfallLocation}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#71717A] block font-mono">HIGHEST FEASIBILITY SCORE</span>
                <span className="font-bold text-[#FFBF24]">{comparisonResult.comparativeSummary.highestFeasibilityLocation}</span>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-xl border border-[#27272A]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#18181B] text-[#A1A1AA] uppercase font-mono text-[10px] border-b border-[#27272A]">
                  <tr>
                    <th className="p-3.5">Metric / Factor</th>
                    {comparisonResult.locations.map((loc, idx) => (
                      <th key={idx} className="p-3.5 font-bold text-[#F8FAFC]">
                        {loc.label}: {loc.locationName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A] bg-[#111113]">
                  <tr>
                    <td className="p-3.5 font-semibold text-[#A1A1AA]">Total Nearby Businesses</td>
                    {comparisonResult.locations.map((loc, idx) => (
                      <td key={idx} className="p-3.5 font-bold text-[#F8FAFC]">
                        {loc.competitorMetrics.totalBusinessesRetrieved} places
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-[#A1A1AA]">Relevant Competitors</td>
                    {comparisonResult.locations.map((loc, idx) => (
                      <td key={idx} className="p-3.5">
                        <span className="font-bold text-[#FFBF24]">
                          {loc.competitorMetrics.relevantCompetitorCount}
                        </span>{' '}
                        direct rivals
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-[#A1A1AA]">Competitor Density</td>
                    {comparisonResult.locations.map((loc, idx) => (
                      <td key={idx} className="p-3.5 font-mono">
                        {loc.competitorMetrics.competitorDensityPerSqKm}/km²
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-[#A1A1AA]">Immediate 500m Walk Buffer</td>
                    {comparisonResult.locations.map((loc, idx) => (
                      <td key={idx} className="p-3.5">
                        {loc.competitorMetrics.distanceDistribution.within500m === 0 ? (
                          <span className="text-emerald-400 font-semibold">0 competitors (Open walking buffer)</span>
                        ) : (
                          <span className="text-amber-400">
                            {loc.competitorMetrics.distanceDistribution.within500m} competitor(s)
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-[#A1A1AA]">Related Venue Footfall Cluster</td>
                    {comparisonResult.locations.map((loc, idx) => (
                      <td key={idx} className="p-3.5">
                        {loc.competitorMetrics.relatedBusinessesCount} complementary venues
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-[#A1A1AA]">Feasibility Assessment</td>
                    {comparisonResult.locations.map((loc, idx) => (
                      <td key={idx} className="p-3.5">
                        <Badge
                          variant={
                            loc.predictionAssessment.feasibilityAssessment.scoreOutOf100 >= 70 ? 'success' : 'warning'
                          }
                        >
                          Score {loc.predictionAssessment.feasibilityAssessment.scoreOutOf100}/100 •{' '}
                          {loc.predictionAssessment.feasibilityAssessment.feasibilityGrade}
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-[#A1A1AA]">Action / Continue</td>
                    {comparisonResult.locations.map((loc, idx) => (
                      <td key={idx} className="p-3.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContinueToPlanner(loc)}
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Select Site & Plan
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Comparison Disclaimers */}
            <div className="p-3 rounded-lg bg-[#0B0B0C] border border-[#27272A] space-y-1 text-[11px] text-[#71717A]">
              <p className="font-semibold text-[#A1A1AA]">Comparison Methodology & Limitations:</p>
              {comparisonResult.comparativeSummary.notes.map((note, idx) => (
                <p key={idx}>• {note}</p>
              ))}
              <p>
                • Do not treat lower competitor counts as a guarantee of success. Validate neighborhood foot traffic and
                rent affordability before entering lease contracts.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
