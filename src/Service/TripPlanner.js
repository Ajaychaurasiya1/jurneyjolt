import { fetchCityImage } from "./GlobalApi";
import { generateLocalTrip } from "./TripGenerator";
import { placeholderImage } from "@/lib/images";

function applyTripImages(trip, cityImage) {
  const fallback = cityImage || placeholderImage(trip.location);

  const withImage = (item, label) => ({
    ...item,
    image_url: item.image_url || fallback || placeholderImage(label),
  });

  return {
    ...trip,
    coverImage: fallback,
    hotels: trip.hotels.map((hotel) => withImage(hotel, hotel.name)),
    foodRecommendations: trip.foodRecommendations.map((food) =>
      withImage(food, food.name)
    ),
    itinerary: trip.itinerary.map((day) => ({
      ...day,
      places: day.places.map((place) => withImage(place, place.name)),
    })),
  };
}

export async function planTrip(tripInput) {
  const trip = generateLocalTrip(tripInput);
  const cityImage = await fetchCityImage(trip.location);

  return {
    trip: applyTripImages(trip, cityImage),
    usedAi: false,
  };
}
