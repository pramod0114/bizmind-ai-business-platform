/**
 * BizMind – Location Intelligence, Geocoding & OSM Overpass Spatial Engine
 * No fake data. Real OpenStreetMap Nominatim and Overpass API integration with caching and resilience.
 */
import { logger } from '../utils/logger.js';

export interface GeoLocationResult {
  place_id: string | number;
  name: string;
  display_name: string;
  latitude: number;
  longitude: number;
  type: string;
  importance?: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    road?: string;
  };
}

export interface DiscoveredBusiness {
  osm_id: string;
  name: string;
  category: string;
  broadCategory: 'Food & Beverage' | 'Retail' | 'Healthcare' | 'Education' | 'Finance' | 'Automotive' | 'Services' | 'Fitness' | 'Accommodation' | 'Other';
  latitude: number;
  longitude: number;
  distance_meters: number;
  distance_formatted: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  opening_hours: string | null;
  brand: string | null;
  cuisine: string | null;
  operator: string | null;
  email: string | null;
  isDirectCompetitor?: boolean;
  is_direct_competitor?: boolean;
  isRelated?: boolean;
}

export interface LocationAnalysisResult {
  targetLocation: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    city?: string;
    suburb?: string;
  };
  radiusMeters: number;
  radiusKm: number;
  totalBusinesses: number;
  relevantBusinesses: number;
  categoriesFound: number;
  nearestBusiness: DiscoveredBusiness | null;
  mostCommonCategory: string;
  areaKm2: number;
  businesses?: DiscoveredBusiness[];
  businessDensity: number;
  businessDensityPerKm2: number;
  relevantBusinessDensity: number;
  averageRelevantDistance: string;
  averageRelevantDistanceMeters: number;
  concentrationLevel: 'Low concentration' | 'Moderate concentration' | 'High concentration';
  concentrationDescription: string;
  categoryDistribution: { category: string; broadCategory: string; count: number; percentage: number }[];
  broadCategoryDistribution: { broadCategory: string; count: number; percentage: number }[];
  distanceDistribution: { range: string; minM: number; maxM: number; count: number }[];
  insights: string[];
  targetBusinessInfo?: {
    name?: string;
    category?: string;
  };
  competition: {
    directCompetitorCount: number;
    relatedBusinessCount: number;
    directCompetitors: DiscoveredBusiness[];
    relatedBusinesses: DiscoveredBusiness[];
    competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    concentrationLevel: 'Low concentration' | 'Moderate concentration' | 'High concentration';
    marketGapSignal: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  opportunityScore: {
    overallScore: number;
    competitionScore: number;
    categoryGapScore: number;
    densityScore: number;
    explanation: string;
  };
  attribution: string;
  dataSource: string;
  disclaimer: string;
}

// In-memory caches for rate limit compliance & performance
const geocodeCache = new Map<string, { data: GeoLocationResult[]; expiresAt: number }>();
const reverseGeocodeCache = new Map<string, { data: GeoLocationResult; expiresAt: number }>();
const overpassCache = new Map<string, { data: DiscoveredBusiness[]; expiresAt: number }>();

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

const USER_AGENT = 'BizMind-Location-Intelligence/1.0 (contact@bizmind.ai)';

/**
 * Calculate distance in meters between two lat/lng coordinates using Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

/**
 * Map raw OSM tags to human-friendly category and broad category group
 */
export function mapOsmTagsToCategory(tags: Record<string, string>): { category: string; broadCategory: DiscoveredBusiness['broadCategory'] } {
  // Food & Beverage
  if (tags.amenity === 'cafe') return { category: 'Cafe', broadCategory: 'Food & Beverage' };
  if (tags.amenity === 'restaurant') return { category: 'Restaurant', broadCategory: 'Food & Beverage' };
  if (tags.amenity === 'fast_food') return { category: 'Fast Food', broadCategory: 'Food & Beverage' };
  if (tags.amenity === 'bar') return { category: 'Bar', broadCategory: 'Food & Beverage' };
  if (tags.amenity === 'pub') return { category: 'Pub', broadCategory: 'Food & Beverage' };
  if (tags.amenity === 'food_court') return { category: 'Food Court', broadCategory: 'Food & Beverage' };
  if (tags.amenity === 'ice_cream') return { category: 'Ice Cream Parlor', broadCategory: 'Food & Beverage' };
  if (tags.shop === 'bakery') return { category: 'Bakery & Confectionery', broadCategory: 'Food & Beverage' };
  if (tags.shop === 'coffee' || tags.shop === 'tea') return { category: 'Tea / Coffee Shop', broadCategory: 'Food & Beverage' };

  // Retail & Groceries
  if (tags.shop === 'supermarket') return { category: 'Supermarket', broadCategory: 'Retail' };
  if (tags.shop === 'convenience') return { category: 'Grocery / Convenience Store', broadCategory: 'Retail' };
  if (tags.shop === 'general' || tags.shop === 'variety_store') return { category: 'General Store', broadCategory: 'Retail' };
  if (tags.shop === 'clothes' || tags.shop === 'boutique' || tags.shop === 'fashion') return { category: 'Clothing & Apparel', broadCategory: 'Retail' };
  if (tags.shop === 'shoes') return { category: 'Footwear & Shoes', broadCategory: 'Retail' };
  if (tags.shop === 'electronics' || tags.shop === 'electrical') return { category: 'Electronics Store', broadCategory: 'Retail' };
  if (tags.shop === 'mobile_phone') return { category: 'Mobile & Accessories', broadCategory: 'Retail' };
  if (tags.shop === 'furniture') return { category: 'Furniture Store', broadCategory: 'Retail' };
  if (tags.shop === 'hardware' || tags.shop === 'doityourself') return { category: 'Hardware Store', broadCategory: 'Retail' };
  if (tags.shop === 'books' || tags.shop === 'stationery') return { category: 'Book & Stationery Store', broadCategory: 'Retail' };
  if (tags.shop === 'jewelry') return { category: 'Jewelry & Watches', broadCategory: 'Retail' };
  if (tags.shop === 'florist') return { category: 'Florist / Plant Shop', broadCategory: 'Retail' };
  if (tags.shop === 'mall' || tags.shop === 'department_store') return { category: 'Shopping Mall / Department', broadCategory: 'Retail' };
  if (tags.shop) {
    const formatted = tags.shop.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return { category: `${formatted} Store`, broadCategory: 'Retail' };
  }

  // Healthcare
  if (tags.amenity === 'pharmacy') return { category: 'Pharmacy / Chemist', broadCategory: 'Healthcare' };
  if (tags.amenity === 'hospital') return { category: 'Hospital', broadCategory: 'Healthcare' };
  if (tags.amenity === 'clinic') return { category: 'Medical Clinic', broadCategory: 'Healthcare' };
  if (tags.amenity === 'doctors') return { category: 'Doctor Practice', broadCategory: 'Healthcare' };
  if (tags.amenity === 'dentist') return { category: 'Dental Clinic', broadCategory: 'Healthcare' };

  // Education
  if (tags.amenity === 'school') return { category: 'School', broadCategory: 'Education' };
  if (tags.amenity === 'college' || tags.amenity === 'university') return { category: 'College / University', broadCategory: 'Education' };
  if (tags.amenity === 'kindergarten') return { category: 'Kindergarten / Preschool', broadCategory: 'Education' };
  if (tags.amenity === 'library') return { category: 'Library', broadCategory: 'Education' };

  // Finance
  if (tags.amenity === 'bank') return { category: 'Bank Branch', broadCategory: 'Finance' };
  if (tags.amenity === 'atm') return { category: 'ATM Point', broadCategory: 'Finance' };
  if (tags.amenity === 'bureau_de_change') return { category: 'Currency Exchange', broadCategory: 'Finance' };

  // Automotive
  if (tags.amenity === 'fuel') return { category: 'Fuel / Gas Station', broadCategory: 'Automotive' };
  if (tags.amenity === 'car_wash') return { category: 'Car Wash', broadCategory: 'Automotive' };
  if (tags.shop === 'car_repair' || tags.amenity === 'vehicle_inspection' || tags.shop === 'car_parts') return { category: 'Automotive Repair & Services', broadCategory: 'Automotive' };
  if (tags.shop === 'car' || tags.shop === 'motorcycle') return { category: 'Auto Dealership / Showroom', broadCategory: 'Automotive' };

  // Fitness
  if (tags.leisure === 'fitness_centre' || tags.leisure === 'sports_centre' || tags.sport === 'fitness') return { category: 'Gym & Fitness Center', broadCategory: 'Fitness' };
  if (tags.leisure === 'swimming_pool') return { category: 'Swimming Facility', broadCategory: 'Fitness' };

  // Accommodation
  if (tags.tourism === 'hotel') return { category: 'Hotel', broadCategory: 'Accommodation' };
  if (tags.tourism === 'guest_house' || tags.tourism === 'motel' || tags.tourism === 'hostel') return { category: 'Guest House / Hostel', broadCategory: 'Accommodation' };

  // Services
  if (tags.shop === 'hairdresser' || tags.shop === 'beauty' || tags.amenity === 'spa') return { category: 'Salon & Spa Services', broadCategory: 'Services' };
  if (tags.shop === 'laundry' || tags.shop === 'dry_cleaning') return { category: 'Laundry & Dry Cleaning', broadCategory: 'Services' };
  if (tags.shop === 'tailor') return { category: 'Tailor & Alterations', broadCategory: 'Services' };
  if (tags.amenity === 'post_office') return { category: 'Post Office / Courier', broadCategory: 'Services' };
  if (tags.office === 'estate_agent') return { category: 'Real Estate Agency', broadCategory: 'Services' };
  if (tags.office === 'insurance') return { category: 'Insurance Services', broadCategory: 'Services' };
  if (tags.office === 'telecommunication') return { category: 'Telecom & ISP Center', broadCategory: 'Services' };
  if (tags.craft) {
    const formatted = tags.craft.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return { category: `${formatted} Craft / Service`, broadCategory: 'Services' };
  }

  return { category: 'Commercial Facility', broadCategory: 'Other' };
}

/**
 * Build structured address from OSM tags
 */
export function buildAddressFromTags(tags: Record<string, string>): string | null {
  const parts: string[] = [];
  if (tags['addr:housenumber'] && tags['addr:street']) {
    parts.push(`${tags['addr:housenumber']} ${tags['addr:street']}`);
  } else if (tags['addr:street']) {
    parts.push(tags['addr:street']);
  }
  if (tags['addr:suburb']) parts.push(tags['addr:suburb']);
  if (tags['addr:city'] || tags['addr:town'] || tags['addr:village']) {
    parts.push(tags['addr:city'] || tags['addr:town'] || tags['addr:village']!);
  }
  if (tags['addr:state']) parts.push(tags['addr:state']);
  if (tags['addr:postcode']) parts.push(tags['addr:postcode']);

  return parts.length > 0 ? parts.join(', ') : null;
}

const FALLBACK_LOCATIONS_DATABASE: {
  keywords: string[];
  name: string;
  display_name: string;
  latitude: number;
  longitude: number;
  type: string;
  address: { city?: string; suburb?: string; state?: string; country?: string; postcode?: string };
}[] = [
  {
    keywords: ['indiranagar', 'indira nagar', 'indiranagar bangalore', 'indiranagar bengaluru'],
    name: 'Indiranagar, Bengaluru',
    display_name: 'Indiranagar, 100 Feet Road, Bengaluru, Karnataka, 560038, India',
    latitude: 12.9784,
    longitude: 77.6408,
    type: 'suburb',
    address: { city: 'Bengaluru', suburb: 'Indiranagar', state: 'Karnataka', country: 'India', postcode: '560038' },
  },
  {
    keywords: ['koramangala', 'koramangala bangalore'],
    name: 'Koramangala, Bengaluru',
    display_name: 'Koramangala, 5th Block, Bengaluru, Karnataka, 560034, India',
    latitude: 12.9352,
    longitude: 77.6245,
    type: 'suburb',
    address: { city: 'Bengaluru', suburb: 'Koramangala', state: 'Karnataka', country: 'India', postcode: '560034' },
  },
  {
    keywords: ['whitefield', 'whitefield bangalore'],
    name: 'Whitefield, Bengaluru',
    display_name: 'Whitefield, ITPL Main Road, Bengaluru, Karnataka, 560066, India',
    latitude: 12.9698,
    longitude: 77.7500,
    type: 'suburb',
    address: { city: 'Bengaluru', suburb: 'Whitefield', state: 'Karnataka', country: 'India', postcode: '560066' },
  },
  {
    keywords: ['hsr', 'hsr layout', 'hsr layout bangalore'],
    name: 'HSR Layout, Bengaluru',
    display_name: 'HSR Layout, Sector 1, Bengaluru, Karnataka, 560102, India',
    latitude: 12.9121,
    longitude: 77.6446,
    type: 'suburb',
    address: { city: 'Bengaluru', suburb: 'HSR Layout', state: 'Karnataka', country: 'India', postcode: '560102' },
  },
  {
    keywords: ['bangalore', 'bengaluru'],
    name: 'Bengaluru, Karnataka',
    display_name: 'Bengaluru, Bengaluru Urban, Karnataka, 560001, India',
    latitude: 12.9716,
    longitude: 77.5946,
    type: 'city',
    address: { city: 'Bengaluru', state: 'Karnataka', country: 'India', postcode: '560001' },
  },
  {
    keywords: ['connaught place', 'cp delhi', 'connaught place delhi', 'rajiv chowk'],
    name: 'Connaught Place, New Delhi',
    display_name: 'Connaught Place, New Delhi, Delhi, 110001, India',
    latitude: 28.6315,
    longitude: 77.2167,
    type: 'suburb',
    address: { city: 'New Delhi', suburb: 'Connaught Place', state: 'Delhi', country: 'India', postcode: '110001' },
  },
  {
    keywords: ['delhi', 'new delhi'],
    name: 'New Delhi, India',
    display_name: 'New Delhi, Delhi, 110001, India',
    latitude: 28.6139,
    longitude: 77.2090,
    type: 'city',
    address: { city: 'New Delhi', state: 'Delhi', country: 'India', postcode: '110001' },
  },
  {
    keywords: ['bkc', 'bandra kurla complex', 'bkc mumbai'],
    name: 'Bandra Kurla Complex (BKC), Mumbai',
    display_name: 'Bandra Kurla Complex, G Block, Mumbai, Maharashtra, 400051, India',
    latitude: 19.0657,
    longitude: 72.8654,
    type: 'commercial',
    address: { city: 'Mumbai', suburb: 'BKC', state: 'Maharashtra', country: 'India', postcode: '400051' },
  },
  {
    keywords: ['mumbai', 'bombay'],
    name: 'Mumbai, Maharashtra',
    display_name: 'Mumbai, Mumbai Suburban, Maharashtra, 400001, India',
    latitude: 19.0760,
    longitude: 72.8777,
    type: 'city',
    address: { city: 'Mumbai', state: 'Maharashtra', country: 'India', postcode: '400001' },
  },
  {
    keywords: ['bandra', 'bandra west'],
    name: 'Bandra West, Mumbai',
    display_name: 'Bandra West, Linking Road, Mumbai, Maharashtra, 400050, India',
    latitude: 19.0596,
    longitude: 72.8295,
    type: 'suburb',
    address: { city: 'Mumbai', suburb: 'Bandra West', state: 'Maharashtra', country: 'India', postcode: '400050' },
  },
  {
    keywords: ['andheri', 'andheri west', 'andheri east'],
    name: 'Andheri, Mumbai',
    display_name: 'Andheri, Mumbai Suburban, Maharashtra, 400053, India',
    latitude: 19.1136,
    longitude: 72.8697,
    type: 'suburb',
    address: { city: 'Mumbai', suburb: 'Andheri', state: 'Maharashtra', country: 'India', postcode: '400053' },
  },
  {
    keywords: ['t nagar', 't. nagar', 't nagar chennai', 'thyagaraya nagar'],
    name: 'T. Nagar, Chennai',
    display_name: 'T. Nagar, Thyagaraya Road, Chennai, Tamil Nadu, 600017, India',
    latitude: 13.0418,
    longitude: 80.2341,
    type: 'suburb',
    address: { city: 'Chennai', suburb: 'T. Nagar', state: 'Tamil Nadu', country: 'India', postcode: '600017' },
  },
  {
    keywords: ['chennai', 'madras'],
    name: 'Chennai, Tamil Nadu',
    display_name: 'Chennai, Tamil Nadu, 600001, India',
    latitude: 13.0827,
    longitude: 80.2707,
    type: 'city',
    address: { city: 'Chennai', state: 'Tamil Nadu', country: 'India', postcode: '600001' },
  },
  {
    keywords: ['hitec city', 'cyberabad', 'madhapur', 'gachibowli', 'financial district hyderabad'],
    name: 'Hitec City, Hyderabad',
    display_name: 'Hitec City, Madhapur, Hyderabad, Telangana, 500081, India',
    latitude: 17.4474,
    longitude: 78.3762,
    type: 'commercial',
    address: { city: 'Hyderabad', suburb: 'Hitec City', state: 'Telangana', country: 'India', postcode: '500081' },
  },
  {
    keywords: ['hyderabad', 'secunderabad'],
    name: 'Hyderabad, Telangana',
    display_name: 'Hyderabad, Telangana, 500001, India',
    latitude: 17.3850,
    longitude: 78.4867,
    type: 'city',
    address: { city: 'Hyderabad', state: 'Telangana', country: 'India', postcode: '500001' },
  },
  {
    keywords: ['pune', 'kothrud', 'viman nagar', 'hinjewadi'],
    name: 'Pune, Maharashtra',
    display_name: 'Pune, Maharashtra, 411001, India',
    latitude: 18.5204,
    longitude: 73.8567,
    type: 'city',
    address: { city: 'Pune', state: 'Maharashtra', country: 'India', postcode: '411001' },
  },
  {
    keywords: ['kolkata', 'calcutta', 'park street kolkata', 'salt lake kolkata'],
    name: 'Kolkata, West Bengal',
    display_name: 'Kolkata, West Bengal, 700001, India',
    latitude: 22.5726,
    longitude: 88.3639,
    type: 'city',
    address: { city: 'Kolkata', state: 'West Bengal', country: 'India', postcode: '700001' },
  },
  {
    keywords: ['ahmedabad', 'sg highway'],
    name: 'Ahmedabad, Gujarat',
    display_name: 'Ahmedabad, Gujarat, 380001, India',
    latitude: 23.0225,
    longitude: 72.5714,
    type: 'city',
    address: { city: 'Ahmedabad', state: 'Gujarat', country: 'India', postcode: '380001' },
  },
  {
    keywords: ['jaipur', 'pink city'],
    name: 'Jaipur, Rajasthan',
    display_name: 'Jaipur, Rajasthan, 302001, India',
    latitude: 26.9124,
    longitude: 75.7873,
    type: 'city',
    address: { city: 'Jaipur', state: 'Rajasthan', country: 'India', postcode: '302001' },
  },
  {
    keywords: ['gurgaon', 'gurugram', 'cyber hub'],
    name: 'Cyber City, Gurugram',
    display_name: 'DLF Cyber City, Gurugram, Haryana, 122002, India',
    latitude: 28.4952,
    longitude: 77.0892,
    type: 'commercial',
    address: { city: 'Gurugram', suburb: 'Cyber City', state: 'Haryana', country: 'India', postcode: '122002' },
  },
  {
    keywords: ['noida', 'sector 18 noida'],
    name: 'Sector 18, Noida',
    display_name: 'Sector 18 Market, Noida, Uttar Pradesh, 201301, India',
    latitude: 28.5708,
    longitude: 77.3271,
    type: 'commercial',
    address: { city: 'Noida', suburb: 'Sector 18', state: 'Uttar Pradesh', country: 'India', postcode: '201301' },
  },
  {
    keywords: ['rajaramnagar', 'islampur', '415409'],
    name: 'Rajaramnagar, Islampur',
    display_name: 'Rajaramnagar, Islampur, Sangli, Maharashtra, 415409, India',
    latitude: 17.0543,
    longitude: 74.2691,
    type: 'town',
    address: { city: 'Islampur', suburb: 'Rajaramnagar', state: 'Maharashtra', country: 'India', postcode: '415409' },
  },
  {
    keywords: ['sangli', 'sangli maharashtra', 'sangli city'],
    name: 'Sangli, Maharashtra',
    display_name: 'Sangli, Sangli District, Maharashtra, 416416, India',
    latitude: 16.8524,
    longitude: 74.5815,
    type: 'city',
    address: { city: 'Sangli', state: 'Maharashtra', country: 'India', postcode: '416416' },
  },
  {
    keywords: ['vishrambag', 'vishrambag sangli', 'vishram bag', '416416'],
    name: 'Vishrambag, Sangli',
    display_name: 'Vishrambag, Sangli, Maharashtra, 416416, India',
    latitude: 16.8458,
    longitude: 74.6015,
    type: 'suburb',
    address: { city: 'Sangli', suburb: 'Vishrambag', state: 'Maharashtra', country: 'India', postcode: '416416' },
  },
  {
    keywords: ['market yard', 'market yard sangli', 'sangli market yard'],
    name: 'Market Yard, Sangli',
    display_name: 'Market Yard, Sangli, Maharashtra, 416416, India',
    latitude: 16.8580,
    longitude: 74.5920,
    type: 'commercial',
    address: { city: 'Sangli', suburb: 'Market Yard', state: 'Maharashtra', country: 'India', postcode: '416416' },
  },
  {
    keywords: ['miraj', 'miraj sangli', 'miraj junction', '416410'],
    name: 'Miraj, Maharashtra',
    display_name: 'Miraj, Sangli District, Maharashtra, 416410, India',
    latitude: 16.8270,
    longitude: 74.6469,
    type: 'city',
    address: { city: 'Miraj', state: 'Maharashtra', country: 'India', postcode: '416410' },
  },
  {
    keywords: ['new york', 'nyc', 'manhattan'],
    name: 'Manhattan, New York',
    display_name: 'Manhattan, New York, NY, USA',
    latitude: 40.7831,
    longitude: -73.9712,
    type: 'city',
    address: { city: 'New York', state: 'NY', country: 'USA' },
  },
  {
    keywords: ['san francisco', 'sf'],
    name: 'San Francisco, CA',
    display_name: 'San Francisco, California, USA',
    latitude: 37.7749,
    longitude: -122.4194,
    type: 'city',
    address: { city: 'San Francisco', state: 'CA', country: 'USA' },
  },
  {
    keywords: ['london'],
    name: 'London, United Kingdom',
    display_name: 'City of London, Greater London, England, UK',
    latitude: 51.5074,
    longitude: -0.1278,
    type: 'city',
    address: { city: 'London', country: 'UK' },
  },
  {
    keywords: ['singapore'],
    name: 'Singapore',
    display_name: 'Downtown Core, Singapore, 018989',
    latitude: 1.2897,
    longitude: 103.8501,
    type: 'city',
    address: { city: 'Singapore', country: 'Singapore' },
  },
  {
    keywords: ['dubai'],
    name: 'Downtown Dubai, UAE',
    display_name: 'Downtown Dubai, Dubai, United Arab Emirates',
    latitude: 25.1972,
    longitude: 55.2744,
    type: 'city',
    address: { city: 'Dubai', country: 'UAE' },
  },
  {
    keywords: ['tokyo'],
    name: 'Shibuya, Tokyo',
    display_name: 'Shibuya, Tokyo, Japan',
    latitude: 35.6580,
    longitude: 139.7016,
    type: 'city',
    address: { city: 'Tokyo', country: 'Japan' },
  },
  {
    keywords: ['sydney'],
    name: 'Sydney CBD, NSW',
    display_name: 'Sydney, New South Wales, Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    type: 'city',
    address: { city: 'Sydney', country: 'Australia' },
  },
];

export class LocationService {
  /**
   * Search locations by query using OpenStreetMap Nominatim with local dictionary fallback
   */
  public async searchLocations(query: string): Promise<GeoLocationResult[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const cacheKey = trimmed.toLowerCase();
    const cached = geocodeCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    // First check local dictionary for instant matching
    const normalizedQuery = trimmed.toLowerCase();
    const matchedFallback = FALLBACK_LOCATIONS_DATABASE.filter((loc) =>
      loc.keywords.some((k) => normalizedQuery.includes(k) || k.includes(normalizedQuery)) ||
      loc.name.toLowerCase().includes(normalizedQuery) ||
      loc.display_name.toLowerCase().includes(normalizedQuery)
    ).map((loc, idx) => ({
      place_id: `dict-${idx + 1}-${loc.name.replace(/\s+/g, '-').toLowerCase()}`,
      name: loc.name,
      display_name: loc.display_name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      type: loc.type,
      importance: 0.95,
      address: loc.address,
    }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmed
      )}&format=json&addressdetails=1&limit=8`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Nominatim returned status ${response.status}`);
      }

      const results = (await response.json()) as any[];
      const formatted: GeoLocationResult[] = results.map((item) => {
        const addr = item.address || {};
        const primaryName =
          item.name ||
          addr.suburb ||
          addr.city ||
          addr.town ||
          addr.village ||
          trimmed;

        return {
          place_id: item.place_id,
          name: primaryName,
          display_name: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          type: item.type || 'place',
          importance: item.importance,
          address: {
            city: addr.city || addr.town || addr.village,
            suburb: addr.suburb || addr.neighbourhood,
            state: addr.state,
            postcode: addr.postcode,
            country: addr.country,
            road: addr.road,
          },
        };
      });

      // Combine OSM results with local fallback matches (avoid duplicates)
      const combined = [...formatted];
      for (const fb of matchedFallback) {
        const alreadyHas = combined.some(
          (c) => Math.abs(c.latitude - fb.latitude) < 0.05 && Math.abs(c.longitude - fb.longitude) < 0.05
        );
        if (!alreadyHas) {
          combined.push(fb);
        }
      }

      const finalResults = combined.length > 0 ? combined : matchedFallback;

      geocodeCache.set(cacheKey, {
        data: finalResults,
        expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour
      });

      return finalResults;
    } catch (err: any) {
      logger.warn('Nominatim geocode error, using local dictionary:', err.message || err);
      return matchedFallback.length > 0 ? matchedFallback : [];
    }
  }

  /**
   * Reverse geocode coordinates to get address details
   */
  public async reverseGeocode(lat: number, lng: number): Promise<GeoLocationResult | null> {
    const roundedLat = parseFloat(lat.toFixed(4));
    const roundedLng = parseFloat(lng.toFixed(4));
    const cacheKey = `${roundedLat},${roundedLng}`;

    const cached = reverseGeocodeCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${roundedLat}&lon=${roundedLng}&format=json&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Nominatim reverse returned status ${response.status}`);
      }

      const item = (await response.json()) as any;
      if (!item || !item.lat) return null;

      const addr = item.address || {};
      const primaryName =
        item.name ||
        addr.road ||
        addr.suburb ||
        addr.neighbourhood ||
        addr.village ||
        addr.town ||
        addr.city ||
        `Coordinates (${roundedLat}, ${roundedLng})`;

      const result: GeoLocationResult = {
        place_id: item.place_id,
        name: primaryName,
        display_name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        type: item.type || 'place',
        address: {
          city: addr.city || addr.town || addr.village,
          suburb: addr.suburb || addr.neighbourhood,
          state: addr.state,
          postcode: addr.postcode,
          country: addr.country,
          road: addr.road,
        },
      };

      reverseGeocodeCache.set(cacheKey, {
        data: result,
        expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour
      });

      return result;
    } catch (err: any) {
      logger.warn('Nominatim reverse geocode error:', err.message || err);
      return null;
    }
  }

  /**
   * Fetch real POIs & businesses from Overpass API within radius
   */
  public async getNearbyBusinesses(
    lat: number,
    lng: number,
    radiusMeters = 2000,
    _areaName?: string
  ): Promise<DiscoveredBusiness[]> {
    const validRadius = Math.min(Math.max(radiusMeters, 500), 10000);
    const roundedLat = parseFloat(lat.toFixed(4));
    const roundedLng = parseFloat(lng.toFixed(4));
    const cacheKey = `${roundedLat},${roundedLng},${validRadius}`;

    const cached = overpassCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    // High performance Overpass QL Query
    const overpassQuery = `[out:json][timeout:12];(node["amenity"~"restaurant|cafe|fast_food|bar|pub|pharmacy|hospital|clinic|bank|atm|fuel|school|college|kindergarten|spa|dentist"](around:${validRadius},${roundedLat},${roundedLng});node["shop"](around:${validRadius},${roundedLat},${roundedLng});node["tourism"~"hotel|guest_house|motel"](around:${validRadius},${roundedLat},${roundedLng});node["leisure"~"fitness_centre|sports_centre"](around:${validRadius},${roundedLat},${roundedLng});way["amenity"~"restaurant|cafe|fast_food|hospital|clinic|school|college|theatre"](around:${validRadius},${roundedLat},${roundedLng});way["shop"](around:${validRadius},${roundedLat},${roundedLng}););out center 100;`;

    let data: any = null;

    // Fast parallel multi-mirror check with Accept: application/json (timeout 8500ms)
    const mirrorRequests = OVERPASS_ENDPOINTS.map(async (endpoint) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8500);
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: `data=${encodeURIComponent(overpassQuery)}`,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const json = await response.json();
          if (json && Array.isArray(json.elements) && json.elements.length > 0) {
            return json;
          }
        }
        throw new Error(`Mirror ${endpoint} returned non-200 or empty elements`);
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    });

    try {
      data = await Promise.any(mirrorRequests);
    } catch {
      data = null;
    }

    let businesses: DiscoveredBusiness[] = [];

    if (data && Array.isArray(data.elements) && data.elements.length > 0) {
      const seenOsmIds = new Set<string>();

      for (const element of data.elements) {
        const tags = element.tags || {};
        const osmId = `${element.type}/${element.id}`;
        if (seenOsmIds.has(osmId)) continue;
        seenOsmIds.add(osmId);

        const bLat = element.lat !== undefined ? element.lat : element.center?.lat;
        const bLng = element.lon !== undefined ? element.lon : element.center?.lon;
        if (bLat === undefined || bLng === undefined) continue;

        const { category, broadCategory } = mapOsmTagsToCategory(tags);
        const name =
          tags.name ||
          tags['name:en'] ||
          tags.brand ||
          tags.operator ||
          `${category}`;

        const distanceM = calculateHaversineDistance(roundedLat, roundedLng, bLat, bLng);

        businesses.push({
          osm_id: osmId,
          name: name.trim(),
          category,
          broadCategory,
          latitude: bLat,
          longitude: bLng,
          distance_meters: distanceM,
          distance_formatted: formatDistance(distanceM),
          address: buildAddressFromTags(tags),
          phone: tags.phone || tags['contact:phone'] || null,
          website: tags.website || tags['contact:website'] || null,
          opening_hours: tags.opening_hours || null,
          brand: tags.brand || null,
          cuisine: tags.cuisine || null,
          operator: tags.operator || null,
          email: tags.email || tags['contact:email'] || null,
        });
      }

      businesses.sort((a, b) => a.distance_meters - b.distance_meters);
    }

    overpassCache.set(cacheKey, {
      data: businesses,
      expiresAt: Date.now() + 1000 * 60 * 15, // 15 minutes cache
    });

    return businesses;
  }

  /**
   * IP Geolocation resolver to reliably locate the user when browser GPS is blocked in iframe
   */
  public async locateByIp(clientIp?: string): Promise<{
    name: string;
    display_name: string;
    latitude: number;
    longitude: number;
    city: string;
    state?: string;
    country: string;
    source: string;
  }> {
    try {
      const cleanIp = clientIp && clientIp !== '127.0.0.1' && clientIp !== '::1' ? clientIp : '';
      const url = cleanIp ? `https://ipwho.is/${encodeURIComponent(cleanIp)}` : 'https://ipwho.is/';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.latitude && data.longitude) {
          const city = data.city || data.region || 'Current Area';
          const region = data.region || data.country || '';
          const country = data.country || '';
          const name = region ? `${city}, ${region}` : city;
          const display_name = `${city}, ${data.region || ''}, ${country}`;

          return {
            name,
            display_name,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            city,
            state: data.region,
            country,
            source: 'ip',
          };
        }
      }
    } catch (err: any) {
      logger.warn('locateByIp error:', err?.message || err);
    }

    // Default fallback location
    return {
      name: 'Indiranagar, Bengaluru',
      display_name: 'Indiranagar, 100 Feet Road, Bengaluru, Karnataka, 560038, India',
      latitude: 12.9784,
      longitude: 77.6408,
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      source: 'fallback',
    };
  }

  /**
   * Analyze location intelligence, business density, competitor grouping & opportunity score
   */
  public async analyzeLocation(
    lat: number,
    lng: number,
    radiusMeters = 2000,
    targetBusiness?: { name?: string; category?: string }
  ): Promise<LocationAnalysisResult> {
    const validRadius = Math.min(Math.max(radiusMeters, 500), 10000);

    // 1. Get Reverse Geocoded Location Info
    let geo = await this.reverseGeocode(lat, lng);
    const locationName = geo?.name || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    const address = geo?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    // 2. Discover Real Businesses from OSM with area context
    const businesses = await this.getNearbyBusinesses(lat, lng, validRadius, locationName);

    // 3. Compute Spatial Density
    const radiusKm = validRadius / 1000;
    const areaKm2 = parseFloat((Math.PI * radiusKm * radiusKm).toFixed(2));
    const totalBusinesses = businesses.length;
    const businessDensityPerKm2 = areaKm2 > 0 ? parseFloat((totalBusinesses / areaKm2).toFixed(2)) : 0;

    // 4. Category Aggregations
    const catMap: Record<string, { category: string; broadCategory: string; count: number }> = {};
    const broadMap: Record<string, number> = {};

    businesses.forEach((b) => {
      if (!catMap[b.category]) {
        catMap[b.category] = { category: b.category, broadCategory: b.broadCategory, count: 0 };
      }
      catMap[b.category].count += 1;
      broadMap[b.broadCategory] = (broadMap[b.broadCategory] || 0) + 1;
    });

    const categoryDistribution = Object.values(catMap)
      .map((item) => ({
        category: item.category,
        broadCategory: item.broadCategory,
        count: item.count,
        percentage: totalBusinesses > 0 ? Math.round((item.count / totalBusinesses) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const broadCategoryDistribution = Object.entries(broadMap)
      .map(([broadCategory, count]) => ({
        broadCategory,
        count,
        percentage: totalBusinesses > 0 ? Math.round((count / totalBusinesses) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const categoriesFound = categoryDistribution.length;
    const mostCommonCategory = categoryDistribution.length > 0 ? categoryDistribution[0].category : 'None';
    const nearestBusiness = businesses.length > 0 ? businesses[0] : null;

    // 5. Distance Range Buckets
    const distBuckets = [
      { range: '0 - 500 m', minM: 0, maxM: 500, count: 0 },
      { range: '500 m - 1 km', minM: 500, maxM: 1000, count: 0 },
      { range: '1 km - 2 km', minM: 1000, maxM: 2000, count: 0 },
      { range: '2 km - 5 km', minM: 2000, maxM: 5000, count: 0 },
      { range: '5 km+', minM: 5000, maxM: 100000, count: 0 },
    ];

    businesses.forEach((b) => {
      for (const bucket of distBuckets) {
        if (b.distance_meters >= bucket.minM && b.distance_meters < bucket.maxM) {
          bucket.count += 1;
          break;
        }
      }
    });

    // 6. Competitor Grouping based on Target Business Plan (Part 3 integration)
    const normalizeText = (text: string) =>
      (text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const targetCat = normalizeText(targetBusiness?.category || '');
    const targetName = normalizeText(targetBusiness?.name || '');
    const directCompetitors: DiscoveredBusiness[] = [];
    const relatedBusinesses: DiscoveredBusiness[] = [];

    businesses.forEach((b) => {
      const bCat = normalizeText(b.category);
      const bBroad = normalizeText(b.broadCategory);
      const bName = normalizeText(b.name);

      let isDirect = false;
      let isRel = false;

      if (targetCat || targetName) {
        if (
          (targetCat.includes('coffee') || targetCat.includes('cafe')) &&
          (bCat.includes('cafe') || bCat.includes('coffee') || bCat.includes('tea') || bName.includes('cafe') || bName.includes('coffee') || bName.includes('roast') || bName.includes('bake'))
        ) {
          isDirect = true;
        } else if (
          targetCat.includes('restaurant') &&
          (bCat.includes('restaurant') || bCat.includes('fast food') || bCat.includes('bistro') || bCat.includes('diner') || bName.includes('restaurant') || bName.includes('bistro'))
        ) {
          isDirect = true;
        } else if (
          (targetCat.includes('grocery') || targetCat.includes('supermarket') || targetCat.includes('retail')) &&
          (bCat.includes('grocery') || bCat.includes('supermarket') || bCat.includes('convenience') || bCat.includes('general store') || bCat.includes('market') || bName.includes('mart') || bName.includes('market'))
        ) {
          isDirect = true;
        } else if (
          targetCat.includes('bakery') &&
          (bCat.includes('bakery') || bCat.includes('confectionery') || bCat.includes('cafe') || bName.includes('bake') || bName.includes('cake') || bName.includes('bread'))
        ) {
          isDirect = true;
        } else if (
          (targetCat.includes('gym') || targetCat.includes('fitness')) &&
          (bCat.includes('gym') || bCat.includes('fitness') || bCat.includes('sports') || bName.includes('gym') || bName.includes('fit'))
        ) {
          isDirect = true;
        } else if (
          (targetCat.includes('pharmacy') || targetCat.includes('medical') || targetCat.includes('chemist')) &&
          (bCat.includes('pharmacy') || bCat.includes('chemist') || bCat.includes('hospital') || bCat.includes('clinic') || bName.includes('med') || bName.includes('pharma') || bName.includes('clinic'))
        ) {
          isDirect = true;
        } else if (
          targetCat.includes('salon') &&
          (bCat.includes('salon') || bCat.includes('hairdresser') || bCat.includes('beauty') || bCat.includes('spa') || bName.includes('salon') || bName.includes('beauty'))
        ) {
          isDirect = true;
        } else if (
          targetCat.includes('hotel') &&
          (bCat.includes('hotel') || bCat.includes('guest house') || bCat.includes('motel') || bCat.includes('resort') || bName.includes('hotel') || bName.includes('stay'))
        ) {
          isDirect = true;
        } else if (
          (targetCat.includes('school') || targetCat.includes('college') || targetCat.includes('education')) &&
          (bCat.includes('school') || bCat.includes('college') || bCat.includes('academy') || bName.includes('school') || bName.includes('college'))
        ) {
          isDirect = true;
        } else if (targetCat && (bCat.includes(targetCat) || targetCat.includes(bCat) || bName.includes(targetCat))) {
          isDirect = true;
        } else if (
          (targetCat.includes('food') || targetCat.includes('cafe') || targetCat.includes('coffee') || targetCat.includes('restaurant')) &&
          bBroad === 'food & beverage'
        ) {
          isRel = true;
        } else if (
          (targetCat.includes('retail') || targetCat.includes('clothing') || targetCat.includes('electronics')) &&
          bBroad === 'retail'
        ) {
          isRel = true;
        }
      } else {
        // Default generic split if no specific target category
        if (b.broadCategory === 'Food & Beverage' || b.broadCategory === 'Retail') {
          isRel = true;
        }
      }

      b.isDirectCompetitor = isDirect;
      b.is_direct_competitor = isDirect;
      b.isRelated = isRel;

      b.isDirectCompetitor = isDirect;
      b.isRelated = isRel;

      if (isDirect) directCompetitors.push(b);
      else if (isRel) relatedBusinesses.push(b);
    });

    // 7. Transparent Competition Level & Concentration
    const directCount = directCompetitors.length;
    let competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let concentrationLevel: 'Low concentration' | 'Moderate concentration' | 'High concentration' = 'Low concentration';

    if (directCount >= 8) {
      competitionLevel = 'HIGH';
      concentrationLevel = 'High concentration';
    } else if (directCount >= 3) {
      competitionLevel = 'MEDIUM';
      concentrationLevel = 'Moderate concentration';
    } else {
      competitionLevel = 'LOW';
      concentrationLevel = 'Low concentration';
    }

    const formattedRadiusKm = parseFloat((validRadius / 1000).toFixed(1));
    const relevantBusinessDensity = areaKm2 > 0 ? parseFloat((directCount / areaKm2).toFixed(2)) : 0;

    let averageRelevantDistanceMeters = 0;
    let averageRelevantDistance = 'N/A';
    if (directCount > 0) {
      averageRelevantDistanceMeters = Math.round(
        directCompetitors.reduce((acc, c) => acc + (c.distance_meters || 0), 0) / directCount
      );
      averageRelevantDistance =
        averageRelevantDistanceMeters >= 1000
          ? `${(averageRelevantDistanceMeters / 1000).toFixed(1)} km`
          : `${averageRelevantDistanceMeters} m`;
    }

    const concentrationDescription = `${directCount} potentially relevant businesses were found within ${formattedRadiusKm} km.`;

    // Rule-based factual insights strictly derived from actual data
    const insights: string[] = [
      `${directCount} ${targetBusiness?.category || 'potentially relevant'} businesses were found within the selected ${formattedRadiusKm} km radius.`,
      `Commercial density is estimated at ${businessDensityPerKm2} businesses / km² (${totalBusinesses} businesses retrieved across an estimated ${areaKm2} km² area).`,
    ];

    if (directCount > 0) {
      insights.push(`Average distance of relevant nearby businesses is ${averageRelevantDistance}.`);
      if (directCompetitors[0]) {
        insights.push(
          `Nearest relevant business is ${directCompetitors[0].name}, located approximately ${directCompetitors[0].distance_formatted} away.`
        );
      }
    } else {
      insights.push(
        `No direct category competitors were found in the selected ${formattedRadiusKm} km radius. Note that map completeness varies by locality.`
      );
    }
    insights.push('Data source: OpenStreetMap contributors. Coverage and completeness may vary by location.');

    // 8. Market Gap Signal
    let marketGapSignal: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
    if (totalBusinesses >= 10 && directCount <= 2) {
      marketGapSignal = 'HIGH'; // Good footfall anchor, low direct competition
    } else if (directCount >= 8 || totalBusinesses < 3) {
      marketGapSignal = 'LOW'; // Either saturated or isolated
    } else {
      marketGapSignal = 'MEDIUM';
    }

    // 9. Location Opportunity Score (0-100)
    // Formula:
    // - Competition Sub-score: Higher when fewer direct competitors (e.g. 0 comp -> 92, 1-2 comp -> 84, 3-6 -> 68, 7-12 -> 50, >12 -> 35)
    // - Density / Commercial Anchor Sub-score: Sweet spot is 10 to 60 total commercial points in radius (creates hub effect)
    // - Category Gap Sub-score: Based on market gap signal and category diversity
    let competitionScore = 80;
    if (directCount === 0) competitionScore = 92;
    else if (directCount <= 2) competitionScore = 84;
    else if (directCount <= 5) competitionScore = 70;
    else if (directCount <= 9) competitionScore = 54;
    else competitionScore = 38;

    let densityScore = 65;
    if (totalBusinesses >= 15 && totalBusinesses <= 80) densityScore = 85;
    else if (totalBusinesses > 80) densityScore = 72;
    else if (totalBusinesses >= 5) densityScore = 68;
    else densityScore = 48;

    let categoryGapScore = 70;
    if (marketGapSignal === 'HIGH') categoryGapScore = 86;
    else if (marketGapSignal === 'MEDIUM') categoryGapScore = 72;
    else categoryGapScore = 48;

    const overallScore = Math.round(0.35 * competitionScore + 0.35 * categoryGapScore + 0.3 * densityScore);

    return {
      businesses,
      targetLocation: {
        name: locationName,
        address,
        latitude: lat,
        longitude: lng,
      },
      radiusMeters: validRadius,
      radiusKm,
      totalBusinesses,
      relevantBusinesses: directCount,
      categoriesFound,
      nearestBusiness,
      mostCommonCategory,
      areaKm2,
      businessDensity: businessDensityPerKm2,
      businessDensityPerKm2,
      relevantBusinessDensity,
      averageRelevantDistance,
      averageRelevantDistanceMeters,
      concentrationLevel,
      concentrationDescription,
      categoryDistribution,
      broadCategoryDistribution,
      distanceDistribution: distBuckets.filter((b) => b.minM < validRadius),
      insights,
      targetBusinessInfo: targetBusiness,
      competition: {
        directCompetitorCount: directCount,
        relatedBusinessCount: relatedBusinesses.length,
        directCompetitors,
        relatedBusinesses,
        competitionLevel,
        concentrationLevel,
        marketGapSignal,
      },
      opportunityScore: {
        overallScore,
        competitionScore,
        categoryGapScore,
        densityScore,
        explanation:
          'The score is an analytical indicator based on available location and business data. It is not a guarantee of business success.',
      },
      attribution: '© OpenStreetMap contributors',
      dataSource: 'OpenStreetMap Nominatim & Overpass API',
      disclaimer:
        'Business information is sourced from OpenStreetMap and may not include every business in the area. Availability and accuracy depend on the underlying map data.',
    };
  }
}

export const locationService = new LocationService();
