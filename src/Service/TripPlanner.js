import { generateLocalTrip } from "./TripGenerator";

export async function planTrip(tripInput) {
  return {
    trip: generateLocalTrip(tripInput),
    usedAi: false,
  };
}
