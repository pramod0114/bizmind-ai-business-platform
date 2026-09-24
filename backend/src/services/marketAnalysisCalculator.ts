/**
 * Market & Competition Analysis Calculation Engine (Part 6)
 * Authoritative backend calculations strictly derived from actual retrieved spatial data.
 */
import { DiscoveredBusiness } from './locationService.js';

export interface MarketCalculationInput {
  businessIdea: string;
  businessCategory?: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  locationName: string;
  address?: string;
  businesses: DiscoveredBusiness[];
}

export interface CompetitorItem {
  osm_id: string;
  name: string;
  category: string;
  broadCategory: string;
  latitude: number;
  longitude: number;
  distance_meters: number;
  distance_km: number;
  distance_formatted: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  opening_hours: string | null;
  isDirectCompetitor: boolean;
  relevanceReason: string;
  source: string;
  source_timestamp: string;
}

export interface CategorySummaryItem {
  category: string;
  count: number;
  percentage: number;
  isDirectCategory: boolean;
}

export interface MarketCalculationResult {
  businessIdea: string;
  businessCategory: string;
  location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  radiusKm: number;
  areaKm2: number;
  totalBusinesses: number;
  relevantCompetitorsCount: number;
  otherBusinessesCount: number;
  competitorDensity: number; // competitors / km²
  competitorDensityFormatted: string;
  distanceMetrics: {
    nearestDistanceKm: number | null;
    nearestDistanceFormatted: string;
    farthestDistanceKm: number | null;
    farthestDistanceFormatted: string;
    averageDistanceKm: number | null;
    averageDistanceFormatted: string;
    medianDistanceKm: number | null;
    medianDistanceFormatted: string;
  };
  concentration: {
    level: 'Low Concentration' | 'Moderate Concentration' | 'High Concentration';
    explanation: string;
    benchmarkNote: string;
  };
  competitionRisk: {
    level: 'Low' | 'Moderate' | 'High';
    reason: string;
  };
  marketOpportunity: {
    indicator: 'Potential Opportunity' | 'Moderate Opportunity' | 'Limited Observed Opportunity' | 'Needs Further Investigation';
    explanation: string;
  };
  categoryDistribution: CategorySummaryItem[];
  competitorDistanceBuckets: { range: string; count: number }[];
  marketGapObservations: string[];
  insights: string[];
  competitors: CompetitorItem[];
  otherBusinesses: CompetitorItem[];
  dataSource: {
    name: string;
    attribution: string;
    retrievedAt: string;
    priceInfoAvailable: boolean;
    priceInfoNote: string;
    historicalTrendNote: string;
    limitations: string[];
  };
}

/**
 * Normalizes text for clean keyword matching
 */
function normalize(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Evaluates whether a nearby business is a direct/potentially relevant competitor
 * based on transparent, category-specific rules.
 */
export function classifyBusinessRelevance(
  businessIdea: string,
  businessCategory: string,
  business: DiscoveredBusiness
): { isDirect: boolean; reason: string } {
  const query = normalize(`${businessIdea} ${businessCategory}`);
  const cat = normalize(business.category);
  const broad = normalize(business.broadCategory);
  const name = normalize(business.name);

  // 1. Coffee Shop / Cafe
  if (query.includes('coffee') || query.includes('cafe') || query.includes('roastery')) {
    if (cat.includes('cafe') || cat.includes('coffee') || cat.includes('tea') || name.includes('cafe') || name.includes('coffee') || name.includes('roaster') || name.includes('brew')) {
      return { isDirect: true, reason: 'Direct competitor offering coffee, tea, and cafe service.' };
    }
    if (cat.includes('bakery') || name.includes('bake')) {
      return { isDirect: true, reason: 'Related bakery / confectionery providing alternative cafe snacking.' };
    }
  }

  // 2. Restaurant / Food Service
  if (query.includes('restaurant') || query.includes('dining') || query.includes('eatery')) {
    if (cat.includes('restaurant') || cat.includes('diner') || cat.includes('bistro') || name.includes('restaurant') || name.includes('kitchen') || name.includes('dhaba')) {
      return { isDirect: true, reason: 'Direct full-service dining competitor.' };
    }
    if (cat.includes('fast food') || cat.includes('pizzeria') || name.includes('burger') || name.includes('pizza')) {
      return { isDirect: true, reason: 'Related quick-service / fast food establishment.' };
    }
  }

  // 3. Salon / Spa / Beauty
  if (query.includes('salon') || query.includes('hair') || query.includes('beauty') || query.includes('spa') || query.includes('barber')) {
    if (cat.includes('salon') || cat.includes('hairdresser') || cat.includes('beauty') || cat.includes('spa') || name.includes('salon') || name.includes('hair') || name.includes('beauty')) {
      return { isDirect: true, reason: 'Direct personal care & grooming competitor.' };
    }
  }

  // 4. Gym / Fitness Center
  if (query.includes('gym') || query.includes('fitness') || query.includes('workout') || query.includes('crossfit')) {
    if (cat.includes('gym') || cat.includes('fitness') || cat.includes('sports') || name.includes('gym') || name.includes('fitness') || name.includes('club')) {
      return { isDirect: true, reason: 'Direct fitness & exercise facility competitor.' };
    }
  }

  // 5. Clothing Store / Boutique
  if (query.includes('clothing') || query.includes('apparel') || query.includes('boutique') || query.includes('fashion') || query.includes('garment')) {
    if (cat.includes('clothing') || cat.includes('apparel') || cat.includes('fashion') || cat.includes('boutique') || name.includes('clothing') || name.includes('fashion') || name.includes('boutique') || name.includes('garments')) {
      return { isDirect: true, reason: 'Direct apparel & fashion retail competitor.' };
    }
  }

  // 6. Bakery / Pastry
  if (query.includes('bakery') || query.includes('cake') || query.includes('pastry')) {
    if (cat.includes('bakery') || cat.includes('confectionery') || name.includes('bakery') || name.includes('cake') || name.includes('bakes')) {
      return { isDirect: true, reason: 'Direct bakery and confectionery competitor.' };
    }
    if (cat.includes('cafe') || name.includes('cafe')) {
      return { isDirect: true, reason: 'Related cafe serving baked goods and desserts.' };
    }
  }

  // 7. Pharmacy / Chemist / Medical
  if (query.includes('pharmacy') || query.includes('chemist') || query.includes('medical') || query.includes('drug')) {
    if (cat.includes('pharmacy') || cat.includes('chemist') || cat.includes('drugstore') || name.includes('pharmacy') || name.includes('med') || name.includes('chemist')) {
      return { isDirect: true, reason: 'Direct retail pharmacy and medicine dispensary competitor.' };
    }
  }

  // 8. Grocery / Supermarket / Kirana
  if (query.includes('grocery') || query.includes('supermarket') || query.includes('mart') || query.includes('kirana') || query.includes('provision')) {
    if (cat.includes('supermarket') || cat.includes('grocery') || cat.includes('convenience') || name.includes('mart') || name.includes('supermarket') || name.includes('grocery') || name.includes('store') || name.includes('bazaar')) {
      return { isDirect: true, reason: 'Direct daily provisions & grocery competitor.' };
    }
  }

  // 9. Electronics / Mobile Shop
  if (query.includes('electronics') || query.includes('mobile') || query.includes('phone') || query.includes('gadget') || query.includes('computer')) {
    if (cat.includes('electronics') || cat.includes('mobile') || cat.includes('telecommunication') || name.includes('mobile') || name.includes('electronics') || name.includes('phone') || name.includes('telecom')) {
      return { isDirect: true, reason: 'Direct consumer electronics / mobile devices competitor.' };
    }
  }

  // 10. Tuition Center / Coaching / Academy
  if (query.includes('tuition') || query.includes('coaching') || query.includes('academy') || query.includes('classes') || query.includes('education')) {
    if (cat.includes('school') || cat.includes('college') || cat.includes('kindergarten') || name.includes('classes') || name.includes('academy') || name.includes('institute') || name.includes('coaching') || name.includes('tuition')) {
      return { isDirect: true, reason: 'Direct educational classes & tutorial service competitor.' };
    }
  }

  // Generic fallback: check if category or name matches the idea/category keyword directly
  const tokens = query.split(/\s+/).filter((t) => t.length > 2);
  for (const token of tokens) {
    if (cat.includes(token) || name.includes(token)) {
      return { isDirect: true, reason: `Matched keyword "${token}" in business listing.` };
    }
  }

  return { isDirect: false, reason: 'Different commercial vertical.' };
}

/**
 * Executes full market & competition calculations
 */
export function calculateMarketMetrics(input: MarketCalculationInput): MarketCalculationResult {
  const {
    businessIdea,
    businessCategory = 'General Commercial',
    latitude,
    longitude,
    radiusKm,
    locationName,
    address = locationName,
    businesses = [],
  } = input;

  const areaKm2 = parseFloat((Math.PI * radiusKm * radiusKm).toFixed(2));
  const totalBusinesses = businesses.length;

  const competitors: CompetitorItem[] = [];
  const otherBusinesses: CompetitorItem[] = [];

  businesses.forEach((b) => {
    const classification = classifyBusinessRelevance(businessIdea, businessCategory, b);
    const distKm = parseFloat(((b.distance_meters || 0) / 1000).toFixed(2));
    const distFormatted =
      b.distance_meters >= 1000
        ? `${(b.distance_meters / 1000).toFixed(1)} km`
        : `${Math.round(b.distance_meters)} m`;

    const item: CompetitorItem = {
      osm_id: b.osm_id,
      name: b.name,
      category: b.category,
      broadCategory: b.broadCategory,
      latitude: b.latitude,
      longitude: b.longitude,
      distance_meters: b.distance_meters,
      distance_km: distKm,
      distance_formatted: distFormatted,
      address: b.address || null,
      phone: b.phone || null,
      website: b.website || null,
      opening_hours: b.opening_hours || null,
      isDirectCompetitor: classification.isDirect,
      relevanceReason: classification.reason,
      source: 'OpenStreetMap',
      source_timestamp: new Date().toISOString(),
    };

    if (classification.isDirect) {
      competitors.push(item);
    } else {
      otherBusinesses.push(item);
    }
  });

  // Sort competitors by proximity
  competitors.sort((a, b) => a.distance_meters - b.distance_meters);
  otherBusinesses.sort((a, b) => a.distance_meters - b.distance_meters);

  const relevantCompetitorsCount = competitors.length;
  const otherBusinessesCount = otherBusinesses.length;

  // Density formula: Competitor Density = Relevant Competitors / Area
  const competitorDensity = areaKm2 > 0 ? parseFloat((relevantCompetitorsCount / areaKm2).toFixed(4)) : 0;
  const competitorDensityFormatted = `${(competitorDensity).toFixed(2)} competitors / km²`;

  // Distance metrics
  let nearestDistanceKm: number | null = null;
  let nearestDistanceFormatted = 'N/A';
  let farthestDistanceKm: number | null = null;
  let farthestDistanceFormatted = 'N/A';
  let averageDistanceKm: number | null = null;
  let averageDistanceFormatted = 'N/A';
  let medianDistanceKm: number | null = null;
  let medianDistanceFormatted = 'N/A';

  if (relevantCompetitorsCount > 0) {
    const distances = competitors.map((c) => c.distance_meters);
    const minM = Math.min(...distances);
    const maxM = Math.max(...distances);
    const sumM = distances.reduce((acc, d) => acc + d, 0);
    const avgM = Math.round(sumM / relevantCompetitorsCount);

    nearestDistanceKm = parseFloat((minM / 1000).toFixed(2));
    nearestDistanceFormatted = minM >= 1000 ? `${(minM / 1000).toFixed(1)} km` : `${minM} m`;

    farthestDistanceKm = parseFloat((maxM / 1000).toFixed(2));
    farthestDistanceFormatted = maxM >= 1000 ? `${(maxM / 1000).toFixed(1)} km` : `${maxM} m`;

    averageDistanceKm = parseFloat((avgM / 1000).toFixed(2));
    averageDistanceFormatted = avgM >= 1000 ? `${(avgM / 1000).toFixed(1)} km` : `${avgM} m`;

    // Median
    const sortedDists = [...distances].sort((a, b) => a - b);
    const midIndex = Math.floor(sortedDists.length / 2);
    const medianM =
      sortedDists.length % 2 !== 0
        ? sortedDists[midIndex]
        : Math.round((sortedDists[midIndex - 1] + sortedDists[midIndex]) / 2);

    medianDistanceKm = parseFloat((medianM / 1000).toFixed(2));
    medianDistanceFormatted = medianM >= 1000 ? `${(medianM / 1000).toFixed(1)} km` : `${medianM} m`;
  }

  // Market Concentration
  let concentrationLevel: 'Low Concentration' | 'Moderate Concentration' | 'High Concentration' = 'Low Concentration';
  let concentrationExplanation = '';
  if (relevantCompetitorsCount <= 3) {
    concentrationLevel = 'Low Concentration';
    concentrationExplanation = `${relevantCompetitorsCount} potentially relevant businesses were found within the selected ${radiusKm} km radius.`;
  } else if (relevantCompetitorsCount <= 8) {
    concentrationLevel = 'Moderate Concentration';
    concentrationExplanation = `${relevantCompetitorsCount} potentially relevant businesses were found within the selected ${radiusKm} km radius, indicating an established presence without acute clustering.`;
  } else {
    concentrationLevel = 'High Concentration';
    concentrationExplanation = `${relevantCompetitorsCount} potentially relevant businesses were found within the selected ${radiusKm} km radius, indicating elevated category density.`;
  }

  // Competition Risk
  let competitionRiskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
  let competitionRiskReason = '';
  if (relevantCompetitorsCount <= 3 || competitorDensity < 0.5) {
    competitionRiskLevel = 'Low';
    competitionRiskReason = `${relevantCompetitorsCount} direct competitors identified with an estimated density of ${competitorDensity.toFixed(2)}/km².`;
  } else if (relevantCompetitorsCount <= 8 || competitorDensity <= 1.5) {
    competitionRiskLevel = 'Moderate';
    competitionRiskReason = `${relevantCompetitorsCount} direct competitors identified within ${radiusKm} km. Requires clear product positioning.`;
  } else {
    competitionRiskLevel = 'High';
    competitionRiskReason = `${relevantCompetitorsCount} direct competitors identified within ${radiusKm} km. High local incumbent saturation observed.`;
  }

  // Market Opportunity Indicator (Descriptive rule-based, NOT an ML prediction)
  let marketOpportunityIndicator: 'Potential Opportunity' | 'Moderate Opportunity' | 'Limited Observed Opportunity' | 'Needs Further Investigation' = 'Needs Further Investigation';
  let marketOpportunityExplanation = '';

  if (totalBusinesses === 0) {
    marketOpportunityIndicator = 'Needs Further Investigation';
    marketOpportunityExplanation = `0 commercial businesses were returned by the data source for this radius. Map completeness or local commercial registry may be sparse; on-ground reconnaissance is advised.`;
  } else if (totalBusinesses >= 10 && relevantCompetitorsCount <= 2) {
    marketOpportunityIndicator = 'Potential Opportunity';
    marketOpportunityExplanation = `Healthy general commercial activity (${totalBusinesses} total nearby establishments) paired with low direct competitor presence (${relevantCompetitorsCount} relevant businesses) indicates potential footfall synergy.`;
  } else if (relevantCompetitorsCount >= 9 || competitorDensity > 1.8) {
    marketOpportunityIndicator = 'Limited Observed Opportunity';
    marketOpportunityExplanation = `Substantial incumbent concentration (${relevantCompetitorsCount} direct competitors) with high local density. Requires aggressive price or qualitative differentiation.`;
  } else if (relevantCompetitorsCount >= 3 && relevantCompetitorsCount <= 8) {
    marketOpportunityIndicator = 'Moderate Opportunity';
    marketOpportunityExplanation = `Balanced commercial ecosystem with ${relevantCompetitorsCount} existing category operators and ${otherBusinessesCount} supporting trade establishments.`;
  } else {
    marketOpportunityIndicator = 'Moderate Opportunity';
    marketOpportunityExplanation = `Observed competition level is low to moderate with ${totalBusinesses} total local businesses.`;
  }

  // Category Distribution
  const catCountMap: Record<string, { count: number; isDirect: boolean }> = {};
  businesses.forEach((b) => {
    const isDirect = competitors.some((c) => c.osm_id === b.osm_id);
    if (!catCountMap[b.category]) {
      catCountMap[b.category] = { count: 0, isDirect };
    }
    catCountMap[b.category].count += 1;
    if (isDirect) {
      catCountMap[b.category].isDirect = true;
    }
  });

  const categoryDistribution: CategorySummaryItem[] = Object.entries(catCountMap)
    .map(([category, val]) => ({
      category,
      count: val.count,
      percentage: totalBusinesses > 0 ? Math.round((val.count / totalBusinesses) * 100) : 0,
      isDirectCategory: val.isDirect,
    }))
    .sort((a, b) => b.count - a.count);

  // Distance Buckets
  const distBuckets = [
    { range: '0 - 500 m', count: 0 },
    { range: '500 m - 1 km', count: 0 },
    { range: '1 km - 2 km', count: 0 },
    { range: '2 km - 5 km', count: 0 },
  ];

  competitors.forEach((c) => {
    if (c.distance_meters < 500) distBuckets[0].count++;
    else if (c.distance_meters < 1000) distBuckets[1].count++;
    else if (c.distance_meters < 2000) distBuckets[2].count++;
    else if (c.distance_meters < 5000) distBuckets[3].count++;
  });

  // Rule-based Market Gap Observations based only on retrieved geographic data
  const marketGapObservations: string[] = [];
  if (totalBusinesses > 0 && relevantCompetitorsCount === 0) {
    marketGapObservations.push(
      `0 ${businessIdea} establishments were identified within ${radiusKm} km among ${totalBusinesses} total commercial points. Lower observed business concentration may indicate an area worth further investigation.`
    );
  } else if (relevantCompetitorsCount > 0 && relevantCompetitorsCount <= 2 && totalBusinesses >= 15) {
    marketGapObservations.push(
      `Low direct ${businessIdea} concentration (${relevantCompetitorsCount} businesses) relative to high general retail/dining activity (${totalBusinesses} businesses). Lower observed business concentration may indicate an area worth further investigation.`
    );
  } else if (relevantCompetitorsCount >= 6) {
    marketGapObservations.push(
      `High density of ${relevantCompetitorsCount} competitors observed within ${radiusKm} km. Multiple incumbents already occupy core radius quadrants.`
    );
  } else {
    marketGapObservations.push(
      `Moderate distribution of ${relevantCompetitorsCount} competitors observed alongside ${otherBusinessesCount} supporting commercial venues.`
    );
  }

  if (categoryDistribution.length > 0) {
    const topCat = categoryDistribution[0];
    marketGapObservations.push(
      `Dominant local business category is "${topCat.category}" (${topCat.count} locations, ${topCat.percentage}% of retrieved points).`
    );
  }

  // Factual Data-based Insights
  const insights: string[] = [
    `${relevantCompetitorsCount} potentially relevant businesses were identified within ${radiusKm} km of ${locationName}.`,
    `Total commercial establishments retrieved: ${totalBusinesses} across an estimated ${areaKm2} km² area.`,
    `Estimated relevant competitor density is ${competitorDensity.toFixed(2)} competitors / km².`,
  ];

  if (relevantCompetitorsCount > 0) {
    insights.push(`Nearest relevant competitor is ${competitors[0].name} at ${nearestDistanceFormatted}.`);
    insights.push(`Average competitor distance is ${averageDistanceFormatted} (median: ${medianDistanceFormatted}).`);
  } else {
    insights.push(`No direct competitors were returned by the selected data source in the ${radiusKm} km radius.`);
  }

  return {
    businessIdea,
    businessCategory,
    location: {
      name: locationName,
      address,
      latitude,
      longitude,
    },
    radiusKm,
    areaKm2,
    totalBusinesses,
    relevantCompetitorsCount,
    otherBusinessesCount,
    competitorDensity,
    competitorDensityFormatted,
    distanceMetrics: {
      nearestDistanceKm,
      nearestDistanceFormatted,
      farthestDistanceKm,
      farthestDistanceFormatted,
      averageDistanceKm,
      averageDistanceFormatted,
      medianDistanceKm,
      medianDistanceFormatted,
    },
    concentration: {
      level: concentrationLevel,
      explanation: concentrationExplanation,
      benchmarkNote: 'Rule scale: Low (0–3), Moderate (4–8), High (>8). Purely descriptive classification.',
    },
    competitionRisk: {
      level: competitionRiskLevel,
      reason: competitionRiskReason,
    },
    marketOpportunity: {
      indicator: marketOpportunityIndicator,
      explanation: marketOpportunityExplanation,
    },
    categoryDistribution,
    competitorDistanceBuckets: distBuckets.filter((b) => {
      if (radiusKm <= 0.5) return b.range === '0 - 500 m';
      if (radiusKm <= 1.0) return b.range === '0 - 500 m' || b.range === '500 m - 1 km';
      if (radiusKm <= 2.0) return b.range !== '2 km - 5 km';
      return true;
    }),
    marketGapObservations,
    insights,
    competitors,
    otherBusinesses,
    dataSource: {
      name: 'OpenStreetMap / Overpass API',
      attribution: '© OpenStreetMap contributors',
      retrievedAt: new Date().toISOString(),
      priceInfoAvailable: false,
      priceInfoNote: 'Public price information unavailable. Never estimated.',
      historicalTrendNote: 'Historical market trend data is not available from the current data sources.',
      limitations: [
        'Not every real-world business may be present or cataloged in community mapping datasets.',
        'Business information (hours, contact) depends on volunteer contributions and may be incomplete.',
        'Business operational status (openings/closures) may change over time.',
        'Public map records do not include revenue, profit, or transaction volume.',
        'Competition analysis describes observed spatial records; market opportunity does not guarantee business success.',
      ],
    },
  };
}
