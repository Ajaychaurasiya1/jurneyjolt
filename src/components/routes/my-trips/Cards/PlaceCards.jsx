import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LogInContext } from "@/Context/LogInContext/Login";
import { fetchPlaceDetails, getOsmSearchUrl } from "@/Service/GlobalApi";
import { handleImageError, PLACEHOLDER_IMAGE } from "@/lib/images";

function PlaceCards({ place }) {
  const { trip } = useContext(LogInContext);
  const city = trip?.tripData?.location;

  const [url, setUrl] = useState(place.image_url || "");
  const [address, setAddress] = useState(place.address || "");
  const [location, setLocation] = useState(place.location || "");

  useEffect(() => {
    if (!trip) return;

    setUrl(place.image_url || "");
    setAddress(place.address || "");
    setLocation(place.location || "");

    if (place.image_url && place.address && place.location) return;

    const enrichFromPlaces = async () => {
      try {
        const details = await fetchPlaceDetails(`${place.name} ${city}`);
        if (!details) return;
        if (!place.image_url && details.photoUrl) setUrl(details.photoUrl);
        if (!place.address && details.address) setAddress(details.address);
        if (!place.location && details.location) setLocation(details.location);
      } catch (err) {
        console.error("Failed to fetch place details:", err);
      }
    };

    enrichFromPlaces();
  }, [trip, place, city]);

  return (
    <Link
      className="w-full"
      target="_blank"
      to={location || getOsmSearchUrl(`${place.name}, ${city}`)}
    >
      <Card className="border-foreground/20 p-1 h-full flex flex-col gap-3 hover:scale-[1.02] duration-300">
        <div className="img rounded-lg overflow-hidden relative">
          <img
            src={url || PLACEHOLDER_IMAGE}
            className="h-48 w-full object-cover"
            alt={place.name}
            onError={handleImageError}
          />
          {place.category && (
            <span className="absolute top-2 left-2 text-xs bg-background/80 backdrop-blur px-2 py-1 rounded-full">
              {place.category}
            </span>
          )}
        </div>
        <CardHeader className="w-full pb-2">
          <CardTitle className="text-base md:text-lg font-bold text-primary/90">
            {place.name}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {place.details}
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full pt-0 space-y-1 text-sm opacity-90">
          {place.duration && <p>⏱️ {place.duration}</p>}
          <p>🕒 {place.timings}</p>
          <p>💵 {place.pricing}</p>
          <p className="line-clamp-1">📍 {address}</p>
          {place.tip && (
            <p className="text-xs text-blue-500/80 pt-1">💡 {place.tip}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default PlaceCards;
