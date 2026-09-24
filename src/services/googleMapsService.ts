/**
 * BizMind – Google Maps JavaScript API Client Loader & Styling
 * Secure singleton loader utilizing @googlemaps/js-api-loader with mandatory solution attribution.
 */
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

// Custom dark styling tailored to BizMind's dark charcoal & amber design aesthetic
export const BIZMIND_DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0F1117' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B0B0C' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#FFBF24' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#CBD5E1' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#13231B' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6EE7B7' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#27272A' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#18181B' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#A1A1AA' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3F3F46' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#27272A' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#F8FAFC' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1F2937' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38BDF8' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0A1526' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38BDF8' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0A1526' }],
  },
];

let isConfigured = false;
let loadPromise: Promise<typeof google> | null = null;

export function getGoogleMapsApiKey(): string {
  const env = (import.meta as any).env;
  return (
    env?.VITE_GOOGLE_MAPS_API_KEY ||
    env?.VITE_GOOGLE_MAPS_KEY ||
    (window as any).__BIZMIND_GOOGLE_MAPS_KEY ||
    'AIzaSyCrvQmobbKFWknOopoueWVcfLVwafIudTo'
  ).trim();
}

/**
 * Loads the Google Maps JavaScript API with required libraries and solution attribution.
 */
export async function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window !== 'undefined' && (window as any).google?.maps) {
    return (window as any).google;
  }

  if (loadPromise) {
    return loadPromise;
  }

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    throw new Error(
      'Google Maps API key is missing in frontend environment. Please configure VITE_GOOGLE_MAPS_API_KEY.'
    );
  }

  if (!isConfigured) {
    setOptions({
      key: apiKey,
      v: 'weekly',
      solutionChannel: 'gmp_git_agentskills_v1',
    });
    isConfigured = true;
  }

  loadPromise = (async () => {
    await Promise.all([
      importLibrary('maps'),
      importLibrary('marker'),
      importLibrary('places'),
      importLibrary('geometry'),
    ]);
    return (window as any).google;
  })();

  return loadPromise;
}
