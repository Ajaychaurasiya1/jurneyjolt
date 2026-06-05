import axios from "axios";

const PHOTON_URL = "https://photon.komoot.io/api/";
const WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary";
const CACHE_TTL = 30 * 60 * 1000;

const memoryCache = new Map();
const axiosInstance = axios.create({ timeout: 10000 });

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

export function getPhotoUrl(photo) {
  if (!photo) return "";
  if (typeof photo === "string") return photo;
  return photo.url || "";
}

async function photonGeocode(query, limit = 1) {
  const cacheKey = getCacheKey("photon-geo", `${query}:${limit}`);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const response = await axiosInstance.get(PHOTON_URL, {
    params: { q: query, limit, lang: "en" },
  });

  const results = (response.data?.features || []).map((feature) => ({
    lat: feature.geometry.coordinates[1],
    lon: feature.geometry.coordinates[0],
    display_name: formatPhotonLabel(feature),
    name: feature.properties.name,
  }));

  setCache(cacheKey, results);
  return results;
}

export async function fetchCityImage(query) {
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

async function buildPlaceResult(textQuery, place) {
  const cityName = textQuery.split(",")[0].trim();
  const imageUrl = await fetchCityImage(cityName);

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

export async function fetchPlaceDetails(textQuery) {
  const cacheKey = getCacheKey("place", textQuery);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const results = await photonGeocode(textQuery, 1);
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

  const results = await photonGeocode(textQuery, 1);
  const place = results?.[0];
  if (!place) {
    const imageUrl = await fetchCityImage(textQuery);
    if (!imageUrl) return null;

    const data = {
      location: getOsmSearchUrl(textQuery),
      photoUrl: imageUrl,
      photos: [{ name: textQuery, url: imageUrl }],
      lat: null,
      lon: null,
      raw: null,
    };
    setCache(cacheKey, data);
    return data;
  }

  const cityName = textQuery.split(",")[0].trim();
  const imageUrl = await fetchCityImage(cityName);

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
