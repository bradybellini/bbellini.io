// Open-Meteo: no key, free for non-commercial use, answers browsers directly
// (CORS *). Two calls: the ZIP to coordinates, then the current temperature.
// The widget calls these from the page; nothing on the server is involved.

export function geocodeUrl(zip: string): string {
  const q = new URLSearchParams({ name: zip, count: '1', countryCode: 'US' });
  return `https://geocoding-api.open-meteo.com/v1/search?${q}`;
}

export function forecastUrl(latitude: number, longitude: number): string {
  const q = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m',
    temperature_unit: 'fahrenheit',
  });
  return `https://api.open-meteo.com/v1/forecast?${q}`;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** The first match of a geocoding answer, or null when there is none. */
export function readCoordinates(json: unknown): Coordinates | null {
  if (typeof json !== 'object' || json === null) return null;
  const results = (json as { results?: unknown }).results;
  if (!Array.isArray(results) || results.length === 0) return null;
  const first = results[0] as { latitude?: unknown; longitude?: unknown };
  if (typeof first.latitude !== 'number' || typeof first.longitude !== 'number') return null;
  return { latitude: first.latitude, longitude: first.longitude };
}

/** The current temperature of a forecast answer, or null when it is missing. */
export function readTemperature(json: unknown): number | null {
  if (typeof json !== 'object' || json === null) return null;
  const current = (json as { current?: unknown }).current;
  if (typeof current !== 'object' || current === null) return null;
  const temperature = (current as { temperature_2m?: unknown }).temperature_2m;
  return typeof temperature === 'number' ? temperature : null;
}
