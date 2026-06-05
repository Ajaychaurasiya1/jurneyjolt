import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogInContext } from "@/Context/LogInContext/Login";
import { fetchPlaceDetails, getOsmSearchUrl } from "@/Service/GlobalApi";
import { handleImageError, PLACEHOLDER_IMAGE } from "@/lib/images";

function HotelCards({ hotel }) {
  const [url, setUrl] = useState(hotel.image_url || "");
  const [address, setAddress] = useState(hotel.address || "");
  const [location, setLocation] = useState(hotel.location || "");

  const { trip } = useContext(LogInContext);
  const city = trip?.tripData?.location;

  useEffect(() => {
    if (!trip) return;

    setUrl(hotel.image_url || "");
    setAddress(hotel.address || "");
    setLocation(hotel.location || "");

    if (hotel.image_url && hotel.address && hotel.location) return;

    const enrichFromPlaces = async () => {
      try {
        const details = await fetchPlaceDetails(`${hotel.name} ${city}`);
        if (!details) return;
        if (!hotel.image_url && details.photoUrl) setUrl(details.photoUrl);
        if (!hotel.address && details.address) setAddress(details.address);
        if (!hotel.location && details.location) setLocation(details.location);
      } catch (err) {
        console.error("Failed to fetch hotel details:", err);
      }
    };

    enrichFromPlaces();
  }, [trip, hotel, city]);

  return (
    <Link
      className="w-full"
      target="_blank"
      to={location || getOsmSearchUrl(`${hotel.name}, ${city}`)}
    >
      <Card className="border-foreground/20 p-1 h-full flex flex-col gap-3 hover:scale-[1.02] duration-300">
        <div className="img rounded-lg overflow-hidden">
          <img
            src={url || PLACEHOLDER_IMAGE}
            className="h-56 w-full object-cover"
            alt={hotel.name}
            onError={handleImageError}
          />
        </div>
        <CardHeader className="w-full pb-2">
          <CardTitle className="text-lg md:text-xl font-black text-primary/90">
            {hotel.name}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm">
            {hotel.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full pt-0 space-y-2 text-sm">
          <p>⭐ {hotel.rating} · 💵 {hotel.price}</p>
          <p className="line-clamp-1 opacity-80">📍 {address}</p>
          {hotel.checkIn && (
            <p className="opacity-70">🕐 Check-in {hotel.checkIn} · Out {hotel.checkOut}</p>
          )}
          {hotel.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {hotel.amenities.map((a) => (
                <span
                  key={a}
                  className="text-xs bg-foreground/10 px-2 py-0.5 rounded-full"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default HotelCards;
