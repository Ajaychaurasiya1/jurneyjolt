import React, { useContext } from "react";
import { LogInContext } from "@/Context/LogInContext/Login";
import Placescard from "./Placescard";

function Places() {
  const { trip } = useContext(LogInContext);
  const days = trip?.tripData?.itinerary?.length || 0;

  return (
    <section className="my-10 md:my-16">
      <h2 className="text-2xl md:text-4xl font-black text-center mb-2 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        Day-by-Day Itinerary
      </h2>
      <p className="text-center opacity-80 mb-8 text-sm md:text-base">
        Your {days}-day adventure plan with themed activities each day
      </p>
      <Placescard />
    </section>
  );
}

export default Places;
