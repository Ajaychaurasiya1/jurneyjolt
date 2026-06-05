function tripsKey(email) {
  return `Trips_${email}`;
}

function readLocalTrips(email) {
  try {
    const raw = localStorage.getItem(tripsKey(email));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function migrateLegacyTrip(email) {
  try {
    const legacy = localStorage.getItem("Trip");
    if (!legacy) return;

    const parsed = JSON.parse(legacy);
    if (!parsed?.tripId) return;

    const owner = parsed.userEmail?.toLowerCase();
    const current = email?.toLowerCase();
    if (owner && owner !== current) return;

    const trips = readLocalTrips(email);
    if (trips.some((t) => t.tripId === parsed.tripId)) return;

    const tripToSave = owner
      ? parsed
      : { ...parsed, userEmail: email };

    localStorage.setItem(
      tripsKey(email),
      JSON.stringify([tripToSave, ...trips])
    );
  } catch {
    // ignore corrupt legacy data
  }
}

export function getLocalTripById(email, tripId) {
  if (!tripId) return null;

  if (email) {
    const match = getLocalTrips(email).find((t) => t.tripId === tripId);
    if (match) return match;
  }

  try {
    const legacy = localStorage.getItem("Trip");
    if (!legacy) return null;
    const parsed = JSON.parse(legacy);
    return parsed?.tripId === tripId ? parsed : null;
  } catch {
    return null;
  }
}

export function getLocalTrips(email) {
  if (!email) return [];
  migrateLegacyTrip(email);
  return readLocalTrips(email);
}

export function saveLocalTrip(email, tripDoc) {
  if (!email || !tripDoc?.tripId) return;

  migrateLegacyTrip(email);

  const existing = readLocalTrips(email).filter(
    (t) => t.tripId !== tripDoc.tripId
  );
  const updated = [tripDoc, ...existing];
  localStorage.setItem(tripsKey(email), JSON.stringify(updated));
  localStorage.setItem("Trip", JSON.stringify(tripDoc));
}

export function mergeTrips(localTrips, remoteTrips) {
  const map = new Map();

  for (const trip of localTrips) {
    if (trip?.tripId) map.set(trip.tripId, trip);
  }
  for (const trip of remoteTrips) {
    if (trip?.tripId) map.set(trip.tripId, trip);
  }

  return Array.from(map.values()).sort(
    (a, b) => Number(b.tripId) - Number(a.tripId)
  );
}
