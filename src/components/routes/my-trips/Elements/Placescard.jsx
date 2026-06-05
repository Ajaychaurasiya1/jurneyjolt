import React, { useContext } from "react";
import { LogInContext } from "@/Context/LogInContext/Login";
import PlaceCards from "../Cards/PlaceCards";
import { useRefContext } from "@/Context/RefContext/RefContext";

function Placescard() {
  const { trip } = useContext(LogInContext);
  const itinerary = trip?.tripData?.itinerary;
  const { placesRef } = useRefContext();

  return (
    <>
      {itinerary?.map((day, idx) => (
        <div ref={placesRef} key={idx} className="main-container mt-8 md:mt-12">
          <div className="places-heading text-center my-6">
            <span className="inline-block bg-blue-500/10 text-blue-500 text-sm font-semibold px-3 py-1 rounded-full mb-3">
              Day {day.day}
            </span>
            <h3 className="md:text-4xl font-black bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-center text-transparent">
              {day.title}
            </h3>
            {day.summary && (
              <p className="mt-3 max-w-2xl mx-auto opacity-80 text-sm md:text-base">
                {day.summary}
              </p>
            )}
          </div>
          <div className="cards grid grid-cols-1 md:grid-cols-2 gap-5">
            {day.places.map((place, placeIdx) => (
              <PlaceCards key={placeIdx} place={place} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default Placescard;
