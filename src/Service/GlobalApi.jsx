import axios from "axios";

const PHOTON_URL = "https://photon.komoot.io/api/";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary";
const CACHE_TTL = 30 * 60 * 1000;

const memoryCache = new Map();
const axiosInstance = axios.create({ timeout: 10000 });

let lastNominatimRequest = 0;

function getCacheKey(type, query) {
  return `${type}:${query.toLowerCase().trim()}`;
}

function getFromCache(key) {
  const memoryEntry = memoryCache.get(key);
  if (memoryEntry && Date.now() - memoryEntry.time < CACHE_TTL) {
    return memoryEntry.data;
  }

  try {
    const stored = sessionStorage.getItem(key);
    if (stored) {
      const entry = JSON.parse(stored);
      if (Date.now() - entry.time < CACHE_TTL) {
        memoryCache.set(key, entry);
        return entry.data;
      }
      sessionStorage.removeItem(key);
    }
  } catch {
    // sessionStorage unavailable
  }

  return null;
}

function setCache(key, data) {
  const entry = { data, time: Date.now() };
  memoryCache.set(key, entry);
  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // sessionStorage full
  }
}

function formatPhotonLabel(feature) {
  const p = feature.properties;
  const parts = [p.name, p.city, p.state, p.country].filter(Boolean);
  return [...new Set(parts)].join(", ");
}

export function getOsmMapUrl(lat, lon, name) {
  if (lat && lon) {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`;
  }
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(name || "")}`;
}

export function getOsmSearchUrl(query) {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}

async function waitForNominatimRateLimit() {
  const now = Date.now();
  const wait = Math.max(0, 1100 - (now - lastNominatimRequest));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastNominatimRequest = Date.now();
}

async function nominatimSearch(query, limit = 1) {
  const cacheKey = getCacheKey("nominatim", `${query}:${limit}`);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  await waitForNominatimRateLimit();

  const response = await axiosInstance.get(NOMINATIM_URL, {
    params: { q: query, format: "json", limit, addressdetails: 1 },
    headers: { "User-Agent": "JourneyJolt-TripPlanner/1.0" },
  });

  setCache(cacheKey, response.data);
  return response.data;
}

async function getWikipediaImage(query) {
  const cacheKey = getCacheKey("wiki", query);
  const cached = getFromCache(cacheKey);
  if (cached !== null) return cached;

  const searchTerms = [
    query,
    query.split(",")[0].trim(),
    query.split(" ")[0],
  ];

  for (const term of searchTerms) {
    if (!term) continue;
    try {
      const response = await axiosInstance.get(
        `${WIKI_API}/${encodeURIComponent(term)}`
      );
      const imageUrl = response.data?.thumbnail?.source || "";
      if (imageUrl) {
        setCache(cacheKey, imageUrl);
        return imageUrl;
      }
    } catch {
      // try next term
    }
  }

  setCache(cacheKey, "");
  return "";
}

export async function searchLocations(query) {
  if (!query || query.length < 2) return [];

  const cacheKey = getCacheKey("photon", query);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const response = await axiosInstance.get(PHOTON_URL, {
    params: { q: query, limit: 8, lang: "en" },
  });

  const results = (response.data?.features || []).map((feature) => ({
    label: formatPhotonLabel(feature),
    name: feature.properties.name,
    lat: feature.geometry.coordinates[1],
    lon: feature.geometry.coordinates[0],
    address: formatPhotonLabel(feature),
  }));

  setCache(cacheKey, results);
  return results;
}

export function getPhotoUrl(photo) {
  if (!photo) return "";
  if (typeof photo === "string") return photo;
  return photo.url || "";
}

async function buildPlaceResult(textQuery, place) {
  const cityName = textQuery.split(",")[0].trim();
  const imageUrl = await getWikipediaImage(cityName);

  return {
    address: place.display_name,
    location: getOsmMapUrl(place.lat, place.lon, textQuery),
    photoUrl: imageUrl,
    photos: imageUrl ? [{ name: textQuery, url: imageUrl }] : [],
    lat: place.lat,
    lon: place.lon,
    raw: place,
  };
}

export async function fetchPlaceDetails(textQuery) {
  const cacheKey = getCacheKey("place", textQuery);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const results = await nominatimSearch(textQuery, 1);
  const place = results?.[0];
  if (!place) return null;

  const data = await buildPlaceResult(textQuery, place);
  setCache(cacheKey, data);
  return data;
}

export async function fetchCityDetails(textQuery) {
  const cacheKey = getCacheKey("city", textQuery);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const results = await nominatimSearch(textQuery, 1);
  const place = results?.[0];
  if (!place) return null;

  const cityName = textQuery.split(",")[0].trim();
  const imageUrl = await getWikipediaImage(cityName);

  const data = {
    location: getOsmMapUrl(place.lat, place.lon, textQuery),
    photoUrl: imageUrl,
    photos: imageUrl ? [{ name: textQuery, url: imageUrl }] : [],
    lat: place.lat,
    lon: place.lon,
    raw: place,
  };

  setCache(cacheKey, data);
  return data;
}
