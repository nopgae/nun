interface NominatimResult {
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

export interface GeocodingResult {
  displayName: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
}

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // Nominatim rate limit: 1 req/sec

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
  // Rate limit
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - (now - lastRequestTime)));
  }
  lastRequestTime = Date.now();

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ko,en`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NunCameraViewer/1.0' },
    });
    if (!res.ok) return null;
    const data = await res.json() as NominatimResult;
    const addr = data.address ?? {};
    return {
      displayName: data.display_name,
      city: addr.city ?? addr.town ?? addr.village ?? addr.county ?? '',
      region: addr.state ?? '',
      country: addr.country ?? '',
      countryCode: (addr.country_code ?? '').toUpperCase(),
    };
  } catch {
    return null;
  }
}
