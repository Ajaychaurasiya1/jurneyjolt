import { fetchCityDetails } from "@/Service/GlobalApi";
import { handleImageError, PLACEHOLDER_IMAGE } from "@/lib/images";
import React, { useEffect, useState } from "react";

const AlltripsCard = ({ trip }) => {
  const [url, setUrl] = useState(trip?.tripData?.hotels?.[0]?.image_url || "");

  const city = trip?.tripData?.location;
  const days = trip?.userSelection?.noOfDays;
  const places = trip?.tripData?.itinerary?.reduce(
    (sum, d) => sum + (d.places?.length || 0),
    0
  );

  useEffect(() => {
    if (!trip || !city || url) return;

    fetchCityDetails(city)
      .then((details) => {
        if (details?.photoUrl) setUrl(details.photoUrl);
      })
      .catch(() => {});
  }, [trip, city, url]);

  return (
    <div className="card-card border-foreground/20 rounded-xl overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="img relative h-48 overflow-hidden group">
        <img
          src={url || PLACEHOLDER_IMAGE}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={city || "Trip"}
          onError={handleImageError}
        />
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur text-xs font-semibold px-2 py-1 rounded-full">
          {days} {days > 1 ? "Days" : "Day"}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-lg bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent line-clamp-1">
          {trip.userSelection?.location || city}
        </h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-foreground/10 px-2 py-1 rounded-full">
            💵 {trip.userSelection?.Budget}
          </span>
          <span className="bg-foreground/10 px-2 py-1 rounded-full">
            👥 {trip.userSelection?.People}
          </span>
          {places > 0 && (
            <span className="bg-foreground/10 px-2 py-1 rounded-full">
              📍 {places} places
            </span>
          )}
        </div>
        {trip.tripData?.overview && (
          <p className="text-xs opacity-70 line-clamp-2 mt-1">
            {trip.tripData.overview}
          </p>
        )}
      </div>
    </div>
  );
};

export default AlltripsCard;
